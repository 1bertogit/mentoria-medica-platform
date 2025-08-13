'use client';

import { useState, useEffect, useCallback } from 'react';
import logger from '@/lib/logger';
import { authService, type AuthUser } from '@/lib/auth/auth-service';
import { useRouter } from 'next/navigation';
import { toastHelpers } from '@/hooks/use-toast';

export const useAuth = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const currentUser = authService.getCurrentUser();
                    setUser(currentUser);
                }
            } catch (error) {
                logger.error('Error loading user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    // Login function
    const login = useCallback(async (email: string, password: string) => {
        try {
            const { user: authUser } = await authService.login(email, password);
            setUser(authUser);
            toastHelpers.success('Login bem-sucedido', 'Bem-vindo(a) de volta!');
            router.push('/dashboard');
            return authUser;
        } catch (error: unknown) {
            toastHelpers.error('Falha no Login', error.message || 'E-mail ou senha inválidos.');
            throw error;
        }
    }, [router]);

    // Logout function
    const logout = useCallback(async () => {
        try {
            await authService.logout();
            setUser(null);
            // authService.logout() already handles redirect
        } catch (error) {
            logger.error('Error during logout:', error);
            // Force redirect even on error
            window.location.href = '/';
        }
    }, []);

    // Check if user has a specific role
    const hasRole = useCallback((role: string) => {
        return user?.role === role;
    }, [user]);

    // Check if user is admin
    const isAdmin = useCallback(() => {
        return user?.role === 'admin';
    }, [user]);

    return { 
        user, 
        isLoading, 
        isAuthenticated: !!user,
        login, 
        logout,
        hasRole,
        isAdmin: isAdmin()
    };
};