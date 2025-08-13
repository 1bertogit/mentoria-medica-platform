/**
 * useOffline Hook - Comprehensive offline state management and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { offlineService, VideoQuality, StorageStats, SyncStatusInfo, DownloadTask } from '@/lib/services/offline-service';
import { downloadManager } from '@/lib/services/download-manager';

export interface UseOfflineReturn {
  // Connection state
  isOnline: boolean;
  isDownloading: boolean;
  downloadProgress: number;
  downloadedLessons: string[];
  storageUsage: StorageStats;
  
  // Download actions
  downloadLesson: (lessonId: string, quality?: VideoQuality) => Promise<void>;
  downloadModule: (moduleId: string, quality?: VideoQuality) => Promise<void>;
  deleteDownload: (lessonId: string) => Promise<void>;
  
  // Storage management
  clearAllDownloads: () => Promise<void>;
  optimizeStorage: () => Promise<void>;
  
  // Sync status
  syncStatus: SyncStatusInfo;
  forcSync: () => Promise<void>;
  
  // Download queue management
  downloadQueue: DownloadTask[];
  pauseDownload: (downloadId: string) => Promise<void>;
  resumeDownload: (downloadId: string) => Promise<void>;
  cancelDownload: (downloadId: string) => Promise<void>;
}

export function useOffline(): UseOfflineReturn {
  // State
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedLessons, setDownloadedLessons] = useState<string[]>([]);
  const [storageUsage, setStorageUsage] = useState<StorageStats>({
    used: 0,
    available: 0,
    total: 0,
    usage: 0
  });
  const [syncStatus, setSyncStatus] = useState<SyncStatusInfo>({
    status: 'synced',
    pendingItems: 0
  });
  const [downloadQueue, setDownloadQueue] = useState<DownloadTask[]>([]);

  // Initialize offline service
  useEffect(() => {
    const initializeOfflineService = async () => {
      try {
        await offlineService.initialize();
        await updateStorageStats();
        await updateSyncStatus();
        await updateDownloadedLessons();
      } catch (error) {
        console.error('[useOffline] Failed to initialize offline service:', error);
      }
    };

    initializeOfflineService();
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      handleConnectionChange(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      handleConnectionChange(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Download progress listener
  useEffect(() => {
    const handleDownloadProgress = (event: CustomEvent) => {
      const { lessonId, progress, downloaded, total } = event.detail;
      setDownloadProgress(progress);
      setIsDownloading(progress < 100);
      
      // Update download queue with progress
      setDownloadQueue(prev => prev.map(task => 
        task.lessonId === lessonId 
          ? { ...task, progress, downloadedSize: downloaded, size: total }
          : task
      ));
    };

    window.addEventListener('downloadProgress', handleDownloadProgress as EventListener);
    
    return () => {
      window.removeEventListener('downloadProgress', handleDownloadProgress as EventListener);
    };
  }, []);

  // Periodic updates
  useEffect(() => {
    const interval = setInterval(async () => {
      await updateStorageStats();
      await updateSyncStatus();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Helper functions
  const handleConnectionChange = useCallback(async (online: boolean) => {
    if (online) {
      try {
        await offlineService.syncWhenOnline();
        await updateSyncStatus();
      } catch (error) {
        console.error('[useOffline] Sync failed after coming online:', error);
      }
    }
  }, []);

  const updateStorageStats = useCallback(async () => {
    try {
      const stats = await offlineService.getStorageUsage();
      setStorageUsage(stats);
    } catch (error) {
      console.error('[useOffline] Failed to update storage stats:', error);
    }
  }, []);

  const updateSyncStatus = useCallback(async () => {
    try {
      const status = await offlineService.getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error('[useOffline] Failed to update sync status:', error);
    }
  }, []);

  const updateDownloadedLessons = useCallback(async () => {
    try {
      // This would query IndexedDB for downloaded lessons
      // For now, using mock data
      setDownloadedLessons(['1', '2', '3']);
    } catch (error) {
      console.error('[useOffline] Failed to update downloaded lessons:', error);
    }
  }, []);

  // Download actions
  const downloadLesson = useCallback(async (lessonId: string, quality: VideoQuality = 'sd') => {
    try {
      setIsDownloading(true);
      const task = await offlineService.downloadLesson(lessonId, quality);
      
      setDownloadQueue(prev => [...prev.filter(t => t.lessonId !== lessonId), task]);
      
      // Monitor download completion
      const checkCompletion = setInterval(async () => {
        if (task.status === 'completed') {
          clearInterval(checkCompletion);
          setIsDownloading(false);
          await updateDownloadedLessons();
          await updateStorageStats();
        } else if (task.status === 'failed') {
          clearInterval(checkCompletion);
          setIsDownloading(false);
          throw new Error(task.error || 'Download failed');
        }
      }, 1000);
      
    } catch (error) {
      setIsDownloading(false);
      console.error('[useOffline] Download lesson failed:', error);
      throw error;
    }
  }, []);

  const downloadModule = useCallback(async (moduleId: string, quality: VideoQuality = 'sd') => {
    try {
      setIsDownloading(true);
      const tasks = await offlineService.downloadModule(moduleId, quality);
      
      setDownloadQueue(prev => {
        const filtered = prev.filter(t => !tasks.some(task => task.lessonId === t.lessonId));
        return [...filtered, ...tasks];
      });
      
    } catch (error) {
      setIsDownloading(false);
      console.error('[useOffline] Download module failed:', error);
      throw error;
    }
  }, []);

  const deleteDownload = useCallback(async (lessonId: string) => {
    try {
      // Find and cancel download task
      const task = downloadQueue.find(t => t.lessonId === lessonId);
      if (task) {
        await offlineService.cancelDownload(task.id);
        setDownloadQueue(prev => prev.filter(t => t.lessonId !== lessonId));
      }
      
      // Remove from downloaded lessons
      setDownloadedLessons(prev => prev.filter(id => id !== lessonId));
      await updateStorageStats();
      
    } catch (error) {
      console.error('[useOffline] Delete download failed:', error);
      throw error;
    }
  }, [downloadQueue]);

  // Storage management
  const clearAllDownloads = useCallback(async () => {
    try {
      // Cancel all active downloads
      for (const task of downloadQueue) {
        if (task.status === 'downloading') {
          await offlineService.cancelDownload(task.id);
        }
      }
      
      // Clear download cache
      await downloadManager.clearDownloadCache();
      
      // Reset state
      setDownloadQueue([]);
      setDownloadedLessons([]);
      setIsDownloading(false);
      setDownloadProgress(0);
      
      await updateStorageStats();
      
    } catch (error) {
      console.error('[useOffline] Clear all downloads failed:', error);
      throw error;
    }
  }, [downloadQueue]);

  const optimizeStorage = useCallback(async () => {
    try {
      await offlineService.cleanupOldDownloads();
      await updateStorageStats();
      await updateDownloadedLessons();
    } catch (error) {
      console.error('[useOffline] Optimize storage failed:', error);
      throw error;
    }
  }, []);

  // Sync management
  const forcSync = useCallback(async () => {
    try {
      setSyncStatus(prev => ({ ...prev, status: 'syncing' }));
      await offlineService.syncWhenOnline();
      await updateSyncStatus();
    } catch (error) {
      setSyncStatus(prev => ({ 
        ...prev, 
        status: 'failed', 
        error: error instanceof Error ? error.message : 'Sync failed' 
      }));
      throw error;
    }
  }, []);

  // Download queue management
  const pauseDownload = useCallback(async (downloadId: string) => {
    try {
      await offlineService.pauseDownload(downloadId);
      setDownloadQueue(prev => prev.map(task => 
        task.id === downloadId 
          ? { ...task, status: 'paused' as const }
          : task
      ));
    } catch (error) {
      console.error('[useOffline] Pause download failed:', error);
      throw error;
    }
  }, []);

  const resumeDownload = useCallback(async (downloadId: string) => {
    try {
      await offlineService.resumeDownload(downloadId);
      setDownloadQueue(prev => prev.map(task => 
        task.id === downloadId 
          ? { ...task, status: 'downloading' as const }
          : task
      ));
    } catch (error) {
      console.error('[useOffline] Resume download failed:', error);
      throw error;
    }
  }, []);

  const cancelDownload = useCallback(async (downloadId: string) => {
    try {
      await offlineService.cancelDownload(downloadId);
      setDownloadQueue(prev => prev.filter(task => task.id !== downloadId));
    } catch (error) {
      console.error('[useOffline] Cancel download failed:', error);
      throw error;
    }
  }, []);

  return {
    // Connection state
    isOnline,
    isDownloading,
    downloadProgress,
    downloadedLessons,
    storageUsage,
    
    // Download actions
    downloadLesson,
    downloadModule,
    deleteDownload,
    
    // Storage management
    clearAllDownloads,
    optimizeStorage,
    
    // Sync status
    syncStatus,
    forcSync,
    
    // Download queue management
    downloadQueue,
    pauseDownload,
    resumeDownload,
    cancelDownload
  };
}