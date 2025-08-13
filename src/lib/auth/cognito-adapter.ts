import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
  SignUpCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GetUserCommand,
  AdminGetUserCommand,
  AdminListGroupsForUserCommand,
  RespondToAuthChallengeCommand,
  ChallengeNameType,
} from '@aws-sdk/client-cognito-identity-provider';

interface CognitoConfig {
  userPoolId: string;
  clientId: string;
  region: string;
}

interface CognitoUser {
  userId: string;
  attributes: Record<string, string>;
  groups: string[];
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

class CognitoAuthAdapter {
  private client: CognitoIdentityProviderClient;
  private config: CognitoConfig;

  constructor() {
    this.config = {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
      clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
      region: process.env.NEXT_PUBLIC_COGNITO_REGION || 'us-east-1',
    };

    this.client = new CognitoIdentityProviderClient({
      region: this.config.region,
    });
  }

  async signIn(email: string, password: string): Promise<CognitoUser | null> {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: this.config.clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      });

      const response = await this.client.send(command);

      if (response.ChallengeName) {
        // Handle challenges (e.g., NEW_PASSWORD_REQUIRED)
        throw new Error(`Authentication challenge: ${response.ChallengeName}`);
      }

      if (response.AuthenticationResult) {
        // Parse ID token to get user info directly
        const idToken = response.AuthenticationResult.IdToken!;
        const idTokenPayload = this.parseJwt(idToken);
        
        const attributes: Record<string, string> = {
          sub: idTokenPayload.sub,
          email: idTokenPayload.email || email,
          name: idTokenPayload.name || idTokenPayload['cognito:username'] || email.split('@')[0],
        };

        // Get groups from token
        const groups = idTokenPayload['cognito:groups'] || [];

        return {
          userId: idTokenPayload.sub || email,
          attributes,
          groups,
          idToken: response.AuthenticationResult.IdToken!,
          accessToken: response.AuthenticationResult.AccessToken!,
          refreshToken: response.AuthenticationResult.RefreshToken!,
        };
      }

      return null;
    } catch (error) {
      logger.error('Cognito sign in error:', error);
      throw error;
    }
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      logger.error('Error parsing JWT:', error);
      return {};
    }
  }

  async signUp(
    email: string,
    password: string,
    attributes?: Record<string, string>
  ): Promise<{ userId: string; userConfirmed: boolean }> {
    try {
      const userAttributes = Object.entries(attributes || {}).map(([Name, Value]) => ({
        Name,
        Value,
      }));

      const command = new SignUpCommand({
        ClientId: this.config.clientId,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'email', Value: email },
          ...userAttributes,
        ],
      });

      const response = await this.client.send(command);

      return {
        userId: response.UserSub!,
        userConfirmed: response.UserConfirmed || false,
      };
    } catch (error) {
      logger.error('Cognito sign up error:', error);
      throw error;
    }
  }

  async confirmSignUp(email: string, code: string): Promise<boolean> {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: this.config.clientId,
        Username: email,
        ConfirmationCode: code,
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      logger.error('Cognito confirm sign up error:', error);
      return false;
    }
  }

  async forgotPassword(email: string): Promise<boolean> {
    try {
      const command = new ForgotPasswordCommand({
        ClientId: this.config.clientId,
        Username: email,
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      logger.error('Cognito forgot password error:', error);
      return false;
    }
  }

  async confirmForgotPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: this.config.clientId,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword,
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      logger.error('Cognito confirm forgot password error:', error);
      return false;
    }
  }

  async refreshSession(refreshToken: string): Promise<{
    idToken: string;
    accessToken: string;
    refreshToken: string;
  } | null> {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
        ClientId: this.config.clientId,
        AuthParameters: {
          REFRESH_TOKEN: refreshToken,
        },
      });

      const response = await this.client.send(command);

      if (response.AuthenticationResult) {
        return {
          idToken: response.AuthenticationResult.IdToken!,
          accessToken: response.AuthenticationResult.AccessToken!,
          refreshToken: refreshToken, // Refresh token remains the same
        };
      }

      return null;
    } catch (error) {
      logger.error('Cognito refresh session error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    // Clear local storage and cookies
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_expires_at');

      // Clear cookies
      document.cookie = 'cognito-id-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      document.cookie = 'cognito-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    }
  }

  async validateToken(accessToken: string): Promise<boolean> {
    try {
      const command = new GetUserCommand({
        AccessToken: accessToken,
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      logger.error('Token validation error:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    return !!(
      this.config.userPoolId &&
      this.config.clientId &&
      this.config.region
    );
  }
}

// Export singleton instance
export const cognitoAuthAdapter = new CognitoAuthAdapter();