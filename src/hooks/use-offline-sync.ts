'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import VideoProgressService from '@/lib/services/video-progress-service';
import logger from '@/lib/logger';

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingOperations: number;
  lastSyncTime: Date | null;
  syncErrors: string[];
  retryCount: number;
}

export interface UseOfflineSyncReturn {
  syncStatus: SyncStatus;
  forcSync: () => Promise<void>;
  clearErrors: () => void;
  pauseSync: () => void;
  resumeSync: () => void;
}

interface UseOfflineSyncOptions {
  autoSyncInterval?: number; // in milliseconds, default 30000 (30s)
  maxRetries?: number; // default 3
  retryDelay?: number; // in milliseconds, default 5000 (5s)
  onSyncSuccess?: () => void;
  onSyncError?: (error: string) => void;
  onConnectionChange?: (isOnline: boolean) => void;
}

export function useOfflineSync(options: UseOfflineSyncOptions = {}): UseOfflineSyncReturn {
  const {
    autoSyncInterval = 30000,
    maxRetries = 3,
    retryDelay = 5000,
    onSyncSuccess,
    onSyncError,
    onConnectionChange
  } = options;

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
    isSyncing: false,
    pendingOperations: 0,
    lastSyncTime: null,
    syncErrors: [],
    retryCount: 0
  });

  const progressService = VideoProgressService.getInstance();
  const syncIntervalRef = useRef<NodeJS.Timeout>();
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const syncPausedRef = useRef(false);
  const lastSyncAttemptRef = useRef<Date | null>(null);

  // Update sync status from service
  const updateSyncStatus = useCallback(() => {
    const serviceStatus = progressService.getSyncStatus();
    
    setSyncStatus(prev => ({
      ...prev,
      isOnline: serviceStatus.isOnline,
      isSyncing: serviceStatus.isSyncing,
      pendingOperations: serviceStatus.pendingOperations
    }));

    return serviceStatus;
  }, [progressService]);

  // Handle online/offline events
  const handleOnline = useCallback(() => {
    logger.info('Device came online');
    
    setSyncStatus(prev => ({
      ...prev,
      isOnline: true,
      syncErrors: []
    }));

    onConnectionChange?.(true);
    
    // Trigger immediate sync when coming online
    if (!syncPausedRef.current) {
      setTimeout(() => forcSync(), 1000); // Small delay to ensure connection is stable
    }
  }, [onConnectionChange]);

  const handleOffline = useCallback(() => {
    logger.info('Device went offline');
    
    setSyncStatus(prev => ({
      ...prev,
      isOnline: false,
      isSyncing: false
    }));

    onConnectionChange?.(false);
    
    // Clear any pending retry attempts
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, [onConnectionChange]);

  // Force sync operation
  const forcSync = useCallback(async (): Promise<void> => {
    if (syncPausedRef.current) {
      logger.debug('Sync is paused, skipping force sync');
      return;
    }

    if (!syncStatus.isOnline) {
      logger.debug('Device is offline, cannot sync');
      return;
    }

    const currentStatus = updateSyncStatus();
    
    if (currentStatus.pendingOperations === 0) {
      logger.debug('No pending operations to sync');
      return;
    }

    if (currentStatus.isSyncing) {
      logger.debug('Sync already in progress');
      return;
    }

    try {
      setSyncStatus(prev => ({ ...prev, isSyncing: true, syncErrors: [] }));
      lastSyncAttemptRef.current = new Date();
      
      await progressService.forcSync();
      
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        retryCount: 0,
        syncErrors: []
      }));

      logger.info('Force sync completed successfully');
      onSyncSuccess?.();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      logger.error('Force sync failed:', error);
      
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        syncErrors: [...prev.syncErrors, errorMessage],
        retryCount: prev.retryCount + 1
      }));

      onSyncError?.(errorMessage);
      
      // Schedule retry if under max retries
      if (syncStatus.retryCount < maxRetries) {
        scheduleRetry();
      }
    }
  }, [syncStatus.isOnline, syncStatus.retryCount, maxRetries, onSyncSuccess, onSyncError, progressService, updateSyncStatus]);

  // Schedule retry with exponential backoff
  const scheduleRetry = useCallback(() => {
    if (syncPausedRef.current || !syncStatus.isOnline) {
      return;
    }

    const delay = retryDelay * Math.pow(2, syncStatus.retryCount); // Exponential backoff
    
    logger.info(`Scheduling sync retry in ${delay}ms (attempt ${syncStatus.retryCount + 1}/${maxRetries})`);
    
    retryTimeoutRef.current = setTimeout(() => {
      forcSync();
    }, delay);
  }, [retryDelay, syncStatus.retryCount, syncStatus.isOnline, maxRetries, forcSync]);

  // Auto-sync interval
  const startAutoSync = useCallback(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    syncIntervalRef.current = setInterval(() => {
      if (!syncPausedRef.current && syncStatus.isOnline && syncStatus.pendingOperations > 0) {
        const timeSinceLastAttempt = lastSyncAttemptRef.current 
          ? Date.now() - lastSyncAttemptRef.current.getTime()
          : Infinity;
        
        // Only sync if enough time has passed since last attempt
        if (timeSinceLastAttempt >= autoSyncInterval) {
          forcSync();
        }
      }
    }, autoSyncInterval);
  }, [autoSyncInterval, syncStatus.isOnline, syncStatus.pendingOperations, forcSync]);

  // Clear sync errors
  const clearErrors = useCallback(() => {
    setSyncStatus(prev => ({
      ...prev,
      syncErrors: [],
      retryCount: 0
    }));
  }, []);

  // Pause sync operations
  const pauseSync = useCallback(() => {
    syncPausedRef.current = true;
    
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    
    logger.info('Sync operations paused');
  }, []);

  // Resume sync operations
  const resumeSync = useCallback(() => {
    syncPausedRef.current = false;
    startAutoSync();
    
    // Trigger immediate sync if there are pending operations
    if (syncStatus.isOnline && syncStatus.pendingOperations > 0) {
      setTimeout(() => forcSync(), 1000);
    }
    
    logger.info('Sync operations resumed');
  }, [startAutoSync, syncStatus.isOnline, syncStatus.pendingOperations, forcSync]);

  // Set up event listeners and intervals
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Add online/offline event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Start auto-sync interval
    startAutoSync();

    // Update status periodically
    const statusInterval = setInterval(updateSyncStatus, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      
      clearInterval(statusInterval);
    };
  }, [handleOnline, handleOffline, startAutoSync, updateSyncStatus]);

  // Initialize sync status on mount
  useEffect(() => {
    updateSyncStatus();
  }, [updateSyncStatus]);

  // Sync when coming back from being hidden (tab focus)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = () => {
      if (!document.hidden && syncStatus.isOnline && syncStatus.pendingOperations > 0) {
        // Small delay to ensure tab is fully active
        setTimeout(() => forcSync(), 2000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [syncStatus.isOnline, syncStatus.pendingOperations, forcSync]);

  return {
    syncStatus,
    forcSync,
    clearErrors,
    pauseSync,
    resumeSync
  };
}