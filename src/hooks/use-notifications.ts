'use client';

import { useState, useEffect, useCallback } from 'react';
import logger from '@/lib/logger';
import { useLocalStorage } from './use-local-storage';
import { 
  mockNotifications, 
  defaultNotificationSettings,
  type Notification, 
  type NotificationSettings,
  getNotificationsByUser,
  getUnreadNotifications,
  getNotificationsByCategory,
  markNotificationAsRead as markAsRead,
  markAllAsRead as markAllRead,
  deleteNotification as deleteNotif,
  addNotification as addNotif,
  getNotificationStats
} from '@/lib/mock-data/notifications';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  settings: NotificationSettings;
  
  // Actions
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  
  // Filters
  getByCategory: (category: string) => Notification[];
  getUnread: () => Notification[];
  
  // Settings
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  resetSettings: () => void;
  
  // Stats
  stats: {
    unreadCount: number;
    totalCount: number;
    byCategory: Record<string, number>;
    byPriority: Record<string, number>;
  };
  
  // Utility
  refresh: () => void;
}

export function useNotifications(userId: string = '1'): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useLocalStorage<NotificationSettings>(
    `notification-settings-${userId}`,
    defaultNotificationSettings
  );

  // Load notifications
  const loadNotifications = useCallback(() => {
    setIsLoading(true);
    try {
      const userNotifications = getNotificationsByUser(userId);
      setNotifications(userNotifications);
    } catch (error) {
      logger.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Initial load
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Calculate stats
  const stats = getNotificationStats(userId);

  // Mark notification as read
  const markAsReadAction = useCallback((id: string) => {
    markAsRead(id);
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true, updatedAt: new Date().toISOString() }
          : notification
      )
    );
  }, []);

  // Mark all as read
  const markAllAsReadAction = useCallback(() => {
    markAllRead(userId);
    const now = new Date().toISOString();
    setNotifications(prev => 
      prev.map(notification => ({ 
        ...notification, 
        isRead: true, 
        updatedAt: now 
      }))
    );
  }, [userId]);

  // Delete notification
  const deleteNotificationAction = useCallback((id: string) => {
    deleteNotif(id);
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Add notification
  const addNotificationAction = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification = addNotif({ ...notification, userId });
    setNotifications(prev => [newNotification, ...prev]);
  }, [userId]);

  // Get notifications by category
  const getByCategory = useCallback((category: string) => {
    return getNotificationsByCategory(userId, category);
  }, [userId]);

  // Get unread notifications
  const getUnread = useCallback(() => {
    return getUnreadNotifications(userId);
  }, [userId]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, [setSettings]);

  // Reset settings
  const resetSettings = useCallback(() => {
    setSettings(defaultNotificationSettings);
  }, [setSettings]);

  // Refresh notifications
  const refresh = useCallback(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    settings,
    markAsRead: markAsReadAction,
    markAllAsRead: markAllAsReadAction,
    deleteNotification: deleteNotificationAction,
    addNotification: addNotificationAction,
    getByCategory,
    getUnread,
    updateSettings,
    resetSettings,
    stats,
    refresh
  };
}