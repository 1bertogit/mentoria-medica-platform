import type { User } from '@/types';
'use client';

import { useState, useEffect, useCallback } from 'react';
import logger from '@/lib/logger';
import { getCurrentUserAction, updateProfileAction, uploadAvatarAction, updateNotificationPreferencesAction, updateAppearancePreferencesAction, changePasswordAction, logoutAction } from '@/app/actions/data-actions';
import type { UserProfile } from '@/lib/aws/users';
import { toastHelpers } from '@/hooks/use-toast';

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user profile
  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const userProfile = await getCurrentUserAction();
      setUser(userProfile);
      setError(null);
    } catch (err) {
      logger.error('Error loading user:', err);
      setError('Erro ao carregar perfil do usuário');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const updatedUser = await updateProfileAction(data);
      setUser(updatedUser);
      toastHelpers.success('Perfil atualizado', 'Suas alterações foram salvas com sucesso.');
    } catch (err) {
      logger.error('Error updating profile:', err);
      toastHelpers.error('Erro ao atualizar perfil', 'Tente novamente mais tarde.');
      throw err;
    }
  }, [user]);

  // Upload avatar
  const uploadAvatar = useCallback(async (file: File) => {
    try {
      toastHelpers.loading('Uploading avatar...', 'Por favor aguarde...');
      const avatarUrl = await uploadAvatarAction(file);
      setUser(prev => prev ? { ...prev, avatarUrl } : null);
      toastHelpers.success('Avatar atualizado', 'Sua foto foi atualizada com sucesso.');
      return avatarUrl;
    } catch (err) {
      logger.error('Error uploading avatar:', err);
      toastHelpers.error('Erro no upload', 'Não foi possível enviar a imagem.');
      throw err;
    }
  }, []);

  // Update notification preferences
  const updateNotifications = useCallback(async (notifications: UserProfile['preferences']['notifications']) => {
    if (!user) return;

    try {
      await updateNotificationPreferencesAction(notifications);
      setUser(prev => prev ? {
        ...prev,
        preferences: {
          ...prev.preferences,
          notifications
        }
      } : null);
      toastHelpers.success('Notificações atualizadas', 'Suas preferências foram salvas.');
    } catch (err) {
      logger.error('Error updating notifications:', err);
      toastHelpers.error('Erro ao salvar', 'Não foi possível atualizar as notificações.');
      throw err;
    }
  }, [user]);

  // Update appearance preferences
  const updateAppearance = useCallback(async (appearance: UserProfile['preferences']['appearance']) => {
    if (!user) return;

    try {
      await updateAppearancePreferencesAction(appearance);
      setUser(prev => prev ? {
        ...prev,
        preferences: {
          ...prev.preferences,
          appearance
        }
      } : null);
      toastHelpers.success('Aparência atualizada', 'Suas preferências foram salvas.');
    } catch (err) {
      logger.error('Error updating appearance:', err);
      toastHelpers.error('Erro ao salvar', 'Não foi possível atualizar a aparência.');
      throw err;
    }
  }, [user]);

  // Change password
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      await changePasswordAction(currentPassword, newPassword);
      toastHelpers.success('Senha alterada', 'Sua senha foi atualizada com sucesso.');
    } catch (err: unknown) {
      logger.error('Error changing password:', err);
      toastHelpers.error('Erro ao alterar senha', err.message || 'Tente novamente mais tarde.');
      throw err;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await logoutAction();
    } catch (err) {
      logger.error('Error during logout:', err);
      // Even if logout fails, redirect to login page (root)
      window.location.href = '/';
    }
  }, []);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return {
    user,
    isLoading,
    error,
    updateProfile,
    uploadAvatar,
    updateNotifications,
    updateAppearance,
    changePassword,
    logout,
    reload: loadUser
  };
}