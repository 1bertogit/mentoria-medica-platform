import type { User } from '@/types';
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator' | 'student' | 'mentor';
  avatarUrl?: string;
  lastLogin?: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: boolean;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface AuthError {
  type: 'validation' | 'authentication' | 'network' | 'session';
  message: string;
  field?: string;
  retryable: boolean;
}

// Demo credentials for testing
export const DEMO_CREDENTIALS = {
  admin: {
    email: 'admin@mentoria.com',
    password: 'admin123',
    name: 'Dr. Admin Silva',
    role: 'admin' as const,
    id: 'admin-001',
  },
  mentor: {
    email: 'mentor@mentoria.com',
    password: 'mentor123',
    name: 'Dr. João Mentor',
    role: 'mentor' as const,
    id: 'mentor-001',
  },
  student: {
    email: 'student@mentoria.com',
    password: 'student123',
    name: 'Ana Estudante',
    role: 'student' as const,
    id: 'student-001',
  },
  // Legacy credentials for backward compatibility
  legacy: [
    {
      email: 'admin@plataforma.med.br',
      password: 'admin123',
      name: 'Dr. Admin',
      role: 'admin' as const,
      id: 'legacy-admin',
    },
    {
      email: 'medico@plataforma.med.br',
      password: 'admin123',
      name: 'Dr. João Silva',
      role: 'user' as const,
      id: 'legacy-user',
    },
    {
      email: 'demo@mentoriamedica.com',
      password: 'demo123',
      name: 'Dr. Ana Silva',
      role: 'admin' as const,
      id: 'legacy-demo',
    },
    {
      email: 'admin@example.com',
      password: 'password',
      name: 'Admin User',
      role: 'admin' as const,
      id: 'legacy-example',
    },
  ],
};

// Import AWS Cognito adapter if available
let cognitoAdapter: unknown = null;
if (typeof window !== 'undefined') {
  // Dynamic import for client-side only
  (async () => {
    try {
      const module = await import('./cognito-adapter');
      cognitoAdapter = module.cognitoAuthAdapter;
    } catch (error) {
      }
  })();
}

class AuthService {
  private user: AuthUser | null = null;
  private token: string | null = null;
  private refreshTokenValue: string | null = null;

  private validateCredentials(
    email: string,
    password: string
  ): AuthError | null {
    // Basic validation
    if (!email || !password) {
      return {
        type: 'validation',
        message: 'Email e senha são obrigatórios',
        retryable: true,
      };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        type: 'validation',
        message: 'Formato de email inválido',
        field: 'email',
        retryable: true,
      };
    }

    // Password length validation
    if (password.length < 6) {
      return {
        type: 'validation',
        message: 'Senha deve ter pelo menos 6 caracteres',
        field: 'password',
        retryable: true,
      };
    }

    return null;
  }

  private findDemoUser(email: string, password: string) {
    // Check main demo credentials
    const mainCredentials = Object.values(DEMO_CREDENTIALS).filter(
      cred => typeof cred === 'object' && !Array.isArray(cred)
    ) as Array<{ email: string; password: string; name: string; role: string; id: string }>;
    for (const cred of mainCredentials) {
      if (cred.email === email && cred.password === password) {
        return cred;
      }
    }

    // Check legacy credentials
    for (const cred of DEMO_CREDENTIALS.legacy) {
      if (cred.email === email && cred.password === password) {
        return cred;
      }
    }

    return null;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    // Validate input
    const validationError = this.validateCredentials(email, password);
    if (validationError) {
      throw new Error(validationError.message);
    }

    // Determine authentication mode based on environment
    const isMockMode = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === 'true';
    const hasCognitoConfig = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID && process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    const isProduction = process.env.NODE_ENV === 'production';

    // SECURITY: Never allow mock auth in production
    if (isProduction && isMockMode) {
      throw new Error('Mock authentication is not allowed in production environment');
    }

    // Priority: Cognito (if configured) > Mock (if enabled) > Error
    if (!isMockMode && cognitoAdapter && hasCognitoConfig) {
      try {
        const cognitoResponse = await cognitoAdapter.signIn(email, password);
        if (cognitoResponse) {
          // Map Cognito groups to application roles
          let userRole: AuthUser['role'] = 'student';
          if (cognitoResponse.groups?.includes('Admins')) {
            userRole = 'admin';
          } else if (cognitoResponse.groups?.includes('Medicos')) {
            userRole = 'user'; // medicos are regular users in the app
          } else if (cognitoResponse.groups?.includes('Alunos')) {
            userRole = 'student';
          }
          
          const user: AuthUser = {
            id: cognitoResponse.userId,
            email: email,
            name: cognitoResponse.attributes?.name || email.split('@')[0],
            role: userRole,
            avatarUrl: '/images/doctors/Dr-Roberio.png',
            lastLogin: new Date(),
            preferences: {
              theme: 'system',
              language: 'pt-BR',
              notifications: true,
            },
          };

          this.user = user;
          this.token = cognitoResponse.idToken;
          this.refreshTokenValue = cognitoResponse.refreshToken;

          // Store in localStorage for persistence
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_user', JSON.stringify(user));
            localStorage.setItem('auth_token', cognitoResponse.idToken);
            localStorage.setItem('auth_refresh_token', cognitoResponse.refreshToken);
            localStorage.setItem(
              'auth_expires_at',
              (Date.now() + 3600 * 1000).toString()
            );

            // Set secure cookies for SSR
            document.cookie = `cognito-id-token=${cognitoResponse.idToken}; path=/; max-age=3600; secure; samesite=strict`;
            document.cookie = `cognito-access-token=${cognitoResponse.accessToken}; path=/; max-age=3600; secure; samesite=strict`;
            document.cookie = `auth-token=${cognitoResponse.idToken}; path=/; max-age=3600; secure; samesite=strict`;
          }

          return {
            user,
            token: cognitoResponse.idToken,
            refreshToken: cognitoResponse.refreshToken,
            expiresIn: 3600,
          };
        }
      } catch (error) {
        logger.error('Cognito authentication failed:', error);
        // Only fall through to mock if explicitly enabled
        if (!isMockMode) {
          throw new Error('Authentication failed: Cognito error and mock mode disabled');
        }
      }
    }

    // Mock implementation - only if explicitly enabled AND not in production
    if (!isMockMode || isProduction) {
      throw new Error('Authentication failed: No valid authentication method available');
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const demoUser = this.findDemoUser(email, password);

          if (demoUser) {
            const user: AuthUser = {
              id: demoUser.id,
              email: demoUser.email,
              name: demoUser.name,
              role: demoUser.role as 'admin' | 'user' | 'moderator' | 'mentor' | 'student',
              avatarUrl: '/images/doctors/Dr-Roberio.png',
              lastLogin: new Date(),
              preferences: {
                theme: 'system',
                language: 'pt-BR',
                notifications: true,
              },
            };

            const token = `mock-jwt-token-${Date.now()}`;
            const refreshToken = `mock-refresh-token-${Date.now()}`;
            const expiresIn = 3600; // 1 hour

            this.user = user;
            this.token = token;
            this.refreshTokenValue = refreshToken;

            // Store in localStorage for persistence
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth_user', JSON.stringify(user));
              localStorage.setItem('auth_token', token);
              localStorage.setItem('auth_refresh_token', refreshToken);
              localStorage.setItem(
                'auth_expires_at',
                (Date.now() + expiresIn * 1000).toString()
              );
            }

            resolve({
              user,
              token,
              refreshToken,
              expiresIn,
            });
          } else {
            const authError: AuthError = {
              type: 'authentication',
              message: 'Email ou senha inválidos',
              retryable: true,
            };
            reject(new Error(authError.message));
          }
        } catch (error) {
          const networkError: AuthError = {
            type: 'network',
            message: 'Erro de conexão. Tente novamente.',
            retryable: true,
          };
          reject(new Error(networkError.message));
        }
      }, 1000);
    });
  }

  async logout(): Promise<void> {
    this.user = null;
    this.token = null;
    this.refreshTokenValue = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_expires_at');

      // Clear cookies
      document.cookie = 'cognito-id-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'cognito-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      window.location.href = '/';
    }
  }

  isAuthenticated(): boolean {
    if (this.user) return true;

    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('auth_user');
      const storedToken = localStorage.getItem('auth_token');

      if (storedUser && storedToken) {
        this.user = JSON.parse(storedUser);
        this.token = storedToken;
        return true;
      }
    }

    return false;
  }

  getCurrentUser(): AuthUser | null {
    if (this.user) return this.user;

    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
        return this.user;
      }
    }

    return null;
  }

  getToken(): string | null {
    if (this.token) return this.token;

    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
      return this.token;
    }

    return null;
  }

  getRefreshToken(): string | null {
    if (this.refreshTokenValue) return this.refreshTokenValue;

    if (typeof window !== 'undefined') {
      this.refreshTokenValue = localStorage.getItem('auth_refresh_token');
      return this.refreshTokenValue;
    }

    return null;
  }

  async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Try Cognito refresh first if available
    if (cognitoAdapter && process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID) {
      try {
        const newTokens = await cognitoAdapter.refreshSession(refreshToken);
        if (newTokens) {
          this.token = newTokens.idToken;
          this.refreshTokenValue = newTokens.refreshToken;

          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', newTokens.idToken);
            localStorage.setItem('auth_refresh_token', newTokens.refreshToken);
            localStorage.setItem(
              'auth_expires_at',
              (Date.now() + 3600 * 1000).toString()
            );

            // Update cookies
            document.cookie = `cognito-id-token=${newTokens.idToken}; path=/; max-age=3600`;
            document.cookie = `cognito-access-token=${newTokens.accessToken}; path=/; max-age=3600`;
          }

          return newTokens.idToken;
        }
      } catch (error) {
        logger.error('Cognito token refresh failed:', error);
        // Fall through to mock refresh
      }
    }

    // Mock implementation as fallback
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const newToken = `mock-jwt-token-${Date.now()}`;
          const newRefreshToken = `mock-refresh-token-${Date.now()}`;
          const expiresIn = 3600; // 1 hour

          this.token = newToken;
          this.refreshTokenValue = newRefreshToken;

          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', newToken);
            localStorage.setItem('auth_refresh_token', newRefreshToken);
            localStorage.setItem(
              'auth_expires_at',
              (Date.now() + expiresIn * 1000).toString()
            );
          }

          resolve(newToken);
        } catch (error) {
          reject(new Error('Failed to refresh token'));
        }
      }, 500);
    });
  }

  isTokenExpired(): boolean {
    if (typeof window === 'undefined') return false;

    const expiresAt = localStorage.getItem('auth_expires_at');
    if (!expiresAt) return false;

    return Date.now() > parseInt(expiresAt);
  }

  async ensureValidToken(): Promise<string | null> {
    if (!this.isAuthenticated()) return null;

    if (this.isTokenExpired()) {
      try {
        return await this.refreshToken();
      } catch (error) {
        // If refresh fails, logout user
        await this.logout();
        return null;
      }
    }

    return this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isMentor(): boolean {
    return this.hasRole('mentor');
  }

  isStudent(): boolean {
    return this.hasRole('student');
  }
}

export const authService = new AuthService();
