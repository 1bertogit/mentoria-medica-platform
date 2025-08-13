/**
 * Offline Service - Comprehensive PWA offline functionality
 * Handles download management, storage, and sync operations
 */

import { openDB, IDBPDatabase, IDBPTransaction } from 'idb';

// Types
export type VideoQuality = 'audio' | 'sd' | 'hd';
export type DownloadStatus = 'pending' | 'downloading' | 'completed' | 'failed' | 'paused';
export type SyncStatus = 'synced' | 'syncing' | 'failed' | 'pending';

export interface DownloadTask {
  id: string;
  lessonId: string;
  quality: VideoQuality;
  status: DownloadStatus;
  progress: number; // 0-100
  estimatedTimeRemaining: number; // seconds
  size: number; // bytes
  downloadedSize: number; // bytes
  url: string;
  title: string;
  moduleTitle: string;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface StorageStats {
  used: number;        // bytes used
  available: number;   // bytes available
  total: number;       // total quota
  usage: number;       // percentage 0-100
}

export interface ProgressUpdate {
  id: string;
  userId: string;
  lessonId: string;
  progress: number;
  timestamp: Date;
  syncStatus: 'pending' | 'synced' | 'failed';
}

export interface SyncStatusInfo {
  status: SyncStatus;
  pendingItems: number;
  lastSync?: Date;
  error?: string;
}

export interface LessonData {
  id: string;
  title: string;
  moduleTitle: string;
  duration: number;
  videoBlob?: Blob;
  metadata: {
    chapters: any[];
    transcript?: string;
    thumbnails: string[];
  };
  downloadDate: Date;
  quality: VideoQuality;
  size: number;
}

// Database schema
const DB_NAME = 'MedEduOfflineDB';
const DB_VERSION = 1;

const DB_STORES = {
  videos: 'videos',
  lessons: 'lessons', 
  progress: 'progress',
  downloads: 'downloads',
  achievements: 'achievements',
  settings: 'settings'
} as const;

class OfflineService {
  private db: IDBPDatabase | null = null;
  private downloadQueue: Map<string, DownloadTask> = new Map();
  private activeDownloads: Map<string, AbortController> = new Map();
  private syncWorker: Worker | null = null;

  // Initialization
  async initialize(): Promise<void> {
    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Videos store - stores video blobs
          if (!db.objectStoreNames.contains(DB_STORES.videos)) {
            const videoStore = db.createObjectStore(DB_STORES.videos, { keyPath: 'lessonId' });
            videoStore.createIndex('quality', 'quality');
            videoStore.createIndex('downloadDate', 'downloadDate');
            videoStore.createIndex('size', 'size');
          }

          // Lessons store - stores lesson metadata
          if (!db.objectStoreNames.contains(DB_STORES.lessons)) {
            const lessonStore = db.createObjectStore(DB_STORES.lessons, { keyPath: 'id' });
            lessonStore.createIndex('moduleId', 'moduleId');
            lessonStore.createIndex('downloadStatus', 'downloadStatus');
          }

          // Progress store - stores user progress updates
          if (!db.objectStoreNames.contains(DB_STORES.progress)) {
            const progressStore = db.createObjectStore(DB_STORES.progress, { keyPath: 'id' });
            progressStore.createIndex('syncStatus', 'syncStatus');
            progressStore.createIndex('lessonId', 'lessonId');
            progressStore.createIndex('timestamp', 'timestamp');
          }

          // Downloads store - stores download tasks
          if (!db.objectStoreNames.contains(DB_STORES.downloads)) {
            const downloadStore = db.createObjectStore(DB_STORES.downloads, { keyPath: 'id' });
            downloadStore.createIndex('status', 'status');
            downloadStore.createIndex('priority', 'priority');
            downloadStore.createIndex('createdAt', 'createdAt');
          }

          // Achievements store - stores offline achievements
          if (!db.objectStoreNames.contains(DB_STORES.achievements)) {
            const achievementStore = db.createObjectStore(DB_STORES.achievements, { keyPath: 'id' });
            achievementStore.createIndex('syncStatus', 'syncStatus');
            achievementStore.createIndex('timestamp', 'timestamp');
          }

          // Settings store - stores user settings
          if (!db.objectStoreNames.contains(DB_STORES.settings)) {
            db.createObjectStore(DB_STORES.settings, { keyPath: 'key' });
          }
        }
      });

      // Initialize sync worker if supported
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        await this.initializeSyncWorker();
      }

      console.log('[OfflineService] Initialized successfully');
    } catch (error) {
      console.error('[OfflineService] Initialization failed:', error);
      throw error;
    }
  }

  private async initializeSyncWorker(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Register background sync
      await registration.sync.register('progress-sync');
      await registration.sync.register('download-queue');
      await registration.sync.register('achievement-sync');
      await registration.sync.register('settings-sync');
      
      console.log('[OfflineService] Background sync registered');
    } catch (error) {
      console.error('[OfflineService] Background sync registration failed:', error);
    }
  }

  // Download Management
  async downloadLesson(lessonId: string, quality: VideoQuality = 'sd'): Promise<DownloadTask> {
    if (!this.db) {
      throw new Error('OfflineService not initialized');
    }

    // Check if already downloading or downloaded
    const existingTask = await this.getDownloadTask(lessonId);
    if (existingTask && ['downloading', 'completed'].includes(existingTask.status)) {
      return existingTask;
    }

    // Create download task
    const task: DownloadTask = {
      id: `download_${lessonId}_${Date.now()}`,
      lessonId,
      quality,
      status: 'pending',
      progress: 0,
      estimatedTimeRemaining: 0,
      size: 0,
      downloadedSize: 0,
      url: await this.getLessonVideoUrl(lessonId, quality),
      title: await this.getLessonTitle(lessonId),
      moduleTitle: await this.getModuleTitle(lessonId),
      createdAt: new Date()
    };

    // Store download task
    await this.db.put(DB_STORES.downloads, task);
    this.downloadQueue.set(task.id, task);

    // Start download
    this.startDownload(task);

    return task;
  }

  async downloadModule(moduleId: string, quality: VideoQuality = 'sd'): Promise<DownloadTask[]> {
    const lessonIds = await this.getModuleLessonIds(moduleId);
    const tasks: DownloadTask[] = [];

    for (const lessonId of lessonIds) {
      try {
        const task = await this.downloadLesson(lessonId, quality);
        tasks.push(task);
      } catch (error) {
        console.error(`[OfflineService] Failed to start download for lesson ${lessonId}:`, error);
      }
    }

    return tasks;
  }

  private async startDownload(task: DownloadTask): Promise<void> {
    try {
      const controller = new AbortController();
      this.activeDownloads.set(task.id, controller);

      // Update status to downloading
      task.status = 'downloading';
      await this.updateDownloadTask(task);

      // Get video size first
      const headResponse = await fetch(task.url, { 
        method: 'HEAD',
        signal: controller.signal 
      });
      
      const contentLength = headResponse.headers.get('content-length');
      if (contentLength) {
        task.size = parseInt(contentLength, 10);
        await this.updateDownloadTask(task);
      }

      // Download with progress tracking
      const response = await fetch(task.url, { signal: controller.signal });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const chunks: Uint8Array[] = [];
      let downloadedBytes = 0;
      const startTime = Date.now();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        downloadedBytes += value.length;
        
        // Update progress
        if (task.size > 0) {
          task.progress = (downloadedBytes / task.size) * 100;
          task.downloadedSize = downloadedBytes;
          
          // Calculate ETA
          const elapsed = Date.now() - startTime;
          const bytesPerMs = downloadedBytes / elapsed;
          const remainingBytes = task.size - downloadedBytes;
          task.estimatedTimeRemaining = Math.round(remainingBytes / bytesPerMs / 1000);
          
          await this.updateDownloadTask(task);
        }
      }

      // Create blob and store
      const videoBlob = new Blob(chunks, { type: 'video/mp4' });
      await this.storeVideoBlob(task.lessonId, videoBlob, task);

      // Mark as completed
      task.status = 'completed';
      task.progress = 100;
      task.completedAt = new Date();
      await this.updateDownloadTask(task);

      this.activeDownloads.delete(task.id);
      
      console.log(`[OfflineService] Download completed: ${task.lessonId}`);
    } catch (error) {
      console.error(`[OfflineService] Download failed: ${task.lessonId}`, error);
      
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      await this.updateDownloadTask(task);
      
      this.activeDownloads.delete(task.id);
    }
  }

  async pauseDownload(downloadId: string): Promise<void> {
    const controller = this.activeDownloads.get(downloadId);
    if (controller) {
      controller.abort();
      this.activeDownloads.delete(downloadId);
      
      const task = this.downloadQueue.get(downloadId);
      if (task) {
        task.status = 'paused';
        await this.updateDownloadTask(task);
      }
    }
  }

  async resumeDownload(downloadId: string): Promise<void> {
    const task = this.downloadQueue.get(downloadId) || await this.getDownloadTask(downloadId);
    if (task && task.status === 'paused') {
      task.status = 'pending';
      await this.updateDownloadTask(task);
      this.startDownload(task);
    }
  }

  async cancelDownload(downloadId: string): Promise<void> {
    const controller = this.activeDownloads.get(downloadId);
    if (controller) {
      controller.abort();
      this.activeDownloads.delete(downloadId);
    }

    if (this.db) {
      await this.db.delete(DB_STORES.downloads, downloadId);
    }
    
    this.downloadQueue.delete(downloadId);
  }

  // Storage Management
  async getStorageUsage(): Promise<StorageStats> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const quota = estimate.quota || 0;
        const usage = estimate.usage || 0;
        
        return {
          used: usage,
          available: quota - usage,
          total: quota,
          usage: quota > 0 ? (usage / quota) * 100 : 0
        };
      } else {
        // Fallback for browsers without storage API
        return {
          used: 0,
          available: 1024 * 1024 * 1024, // 1GB fallback
          total: 1024 * 1024 * 1024,
          usage: 0
        };
      }
    } catch (error) {
      console.error('[OfflineService] Failed to get storage usage:', error);
      return { used: 0, available: 0, total: 0, usage: 0 };
    }
  }

  async cleanupOldDownloads(): Promise<void> {
    if (!this.db) return;

    try {
      const tx = this.db.transaction([DB_STORES.videos, DB_STORES.lessons], 'readwrite');
      const videoStore = tx.objectStore(DB_STORES.videos);
      
      // Get all videos sorted by download date
      const videos = await videoStore.index('downloadDate').getAll();
      
      // Keep only the 20 most recent downloads
      if (videos.length > 20) {
        const toDelete = videos.slice(0, videos.length - 20);
        
        for (const video of toDelete) {
          await videoStore.delete(video.lessonId);
          await tx.objectStore(DB_STORES.lessons).delete(video.lessonId);
        }
      }
      
      await tx.done;
      console.log(`[OfflineService] Cleaned up ${Math.max(0, videos.length - 20)} old downloads`);
    } catch (error) {
      console.error('[OfflineService] Cleanup failed:', error);
    }
  }

  async getAvailableSpace(): Promise<number> {
    const stats = await this.getStorageUsage();
    return stats.available;
  }

  // Sync Management
  async queueProgressUpdate(update: Omit<ProgressUpdate, 'id' | 'syncStatus'>): Promise<void> {
    if (!this.db) return;

    const progressUpdate: ProgressUpdate = {
      ...update,
      id: `progress_${update.lessonId}_${Date.now()}`,
      syncStatus: 'pending'
    };

    await this.db.put(DB_STORES.progress, progressUpdate);
    
    // Trigger background sync if available
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if ('sync' in registration) {
        await registration.sync.register('progress-sync');
      }
    }
  }

  async syncWhenOnline(): Promise<void> {
    if (!navigator.onLine) {
      console.log('[OfflineService] Device is offline, sync will happen when online');
      return;
    }

    await Promise.all([
      this.syncProgressUpdates(),
      this.syncAchievements(),
      this.syncSettings()
    ]);
  }

  async getSyncStatus(): Promise<SyncStatusInfo> {
    if (!this.db) {
      return { status: 'failed', pendingItems: 0, error: 'Database not initialized' };
    }

    try {
      const tx = this.db.transaction([DB_STORES.progress, DB_STORES.achievements], 'readonly');
      
      const pendingProgress = await tx.objectStore(DB_STORES.progress)
        .index('syncStatus').count('pending');
      
      const pendingAchievements = await tx.objectStore(DB_STORES.achievements)
        .index('syncStatus').count('pending');
      
      const totalPending = pendingProgress + pendingAchievements;
      
      if (totalPending === 0) {
        return {
          status: 'synced',
          pendingItems: 0,
          lastSync: new Date()
        };
      } else {
        return {
          status: 'pending',
          pendingItems: totalPending
        };
      }
    } catch (error) {
      return {
        status: 'failed',
        pendingItems: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Helper methods
  private async updateDownloadTask(task: DownloadTask): Promise<void> {
    if (!this.db) return;
    
    await this.db.put(DB_STORES.downloads, task);
    this.downloadQueue.set(task.id, task);
  }

  private async getDownloadTask(lessonId: string): Promise<DownloadTask | null> {
    if (!this.db) return null;
    
    const tasks = await this.db.getAllFromIndex(DB_STORES.downloads, 'lessonId', lessonId);
    return tasks.find(task => task.status !== 'failed') || null;
  }

  private async storeVideoBlob(lessonId: string, videoBlob: Blob, task: DownloadTask): Promise<void> {
    if (!this.db) return;

    const lessonData: LessonData = {
      id: lessonId,
      title: task.title,
      moduleTitle: task.moduleTitle,
      duration: 0, // Would be fetched from lesson metadata
      videoBlob,
      metadata: {
        chapters: [],
        thumbnails: []
      },
      downloadDate: new Date(),
      quality: task.quality,
      size: videoBlob.size
    };

    await this.db.put(DB_STORES.videos, lessonData);
  }

  private async syncProgressUpdates(): Promise<void> {
    // Implementation would sync progress with server
    console.log('[OfflineService] Syncing progress updates...');
  }

  private async syncAchievements(): Promise<void> {
    // Implementation would sync achievements with server
    console.log('[OfflineService] Syncing achievements...');
  }

  private async syncSettings(): Promise<void> {
    // Implementation would sync settings with server
    console.log('[OfflineService] Syncing settings...');
  }

  // Mock helper methods (would fetch from actual API)
  private async getLessonVideoUrl(lessonId: string, quality: VideoQuality): Promise<string> {
    return `/api/lessons/${lessonId}/video?quality=${quality}`;
  }

  private async getLessonTitle(lessonId: string): Promise<string> {
    return `Lesson ${lessonId}`;
  }

  private async getModuleTitle(lessonId: string): Promise<string> {
    return 'Sample Module';
  }

  private async getModuleLessonIds(moduleId: string): Promise<string[]> {
    return ['1', '2', '3']; // Mock data
  }
}

// Singleton instance
export const offlineService = new OfflineService();