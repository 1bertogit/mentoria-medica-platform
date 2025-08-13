'use client';

import { VideoChapter } from '@/lib/video/chapter-data';
import { docClient, TABLES } from '@/lib/aws/dynamodb-client';
import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import logger from '@/lib/logger';

export interface VideoProgress {
  userId: string;
  courseId: string;
  lessonId: string;
  currentTime: number;
  duration: number;
  completionPercentage: number;
  watchedTime: number;
  lastUpdated: Date;
  completed: boolean;
  chaptersWatched: string[];
  playbackSpeed: number;
  sessionId: string;
  deviceType: string;
  userAgent: string;
}

interface VideoProgressRecord {
  PK: string; // USER#userId
  SK: string; // COURSE#courseId#LESSON#lessonId
  currentTime: number;
  duration: number;
  completionPercentage: number;
  watchedTime: number;
  lastUpdated: string; // ISO date
  completed: boolean;
  chaptersWatched: string[];
  metadata: {
    playbackSpeed: number;
    sessionId: string;
    deviceType: string;
    userAgent: string;
  };
  TTL?: number; // Optional expiration (1 year from last update)
}

interface OfflineOperation {
  id: string;
  type: 'save_progress' | 'mark_completed';
  data: Partial<VideoProgress>;
  timestamp: Date;
  retryCount: number;
}

class VideoProgressService {
  private static instance: VideoProgressService;
  private offlineQueue: OfflineOperation[] = [];
  private isOnline = typeof window !== 'undefined' ? navigator.onLine : true;
  private sessionId: string;
  private maxRetries = 3;
  private syncInProgress = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    
    if (typeof window !== 'undefined') {
      // Listen for online/offline status
      window.addEventListener('online', this.handleOnline.bind(this));
      window.addEventListener('offline', this.handleOffline.bind(this));
      
      // Load offline queue from localStorage
      this.loadOfflineQueue();
    }
  }

  static getInstance(): VideoProgressService {
    if (!VideoProgressService.instance) {
      VideoProgressService.instance = new VideoProgressService();
    }
    return VideoProgressService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceType(): string {
    if (typeof window === 'undefined') return 'server';
    
    const userAgent = navigator.userAgent;
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      return 'mobile';
    } else if (/iPad|Android|Tablet/i.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  }

  private getUserAgent(): string {
    if (typeof window === 'undefined') return 'server';
    return navigator.userAgent;
  }

  private generateProgressKey(userId: string, courseId: string, lessonId: string): { PK: string; SK: string } {
    return {
      PK: `USER#${userId}`,
      SK: `COURSE#${courseId}#LESSON#${lessonId}`
    };
  }

  private loadOfflineQueue(): void {
    try {
      const stored = localStorage.getItem('video_progress_offline_queue');
      if (stored) {
        this.offlineQueue = JSON.parse(stored).map((op: any) => ({
          ...op,
          timestamp: new Date(op.timestamp)
        }));
      }
    } catch (error) {
      logger.warn('Failed to load offline queue:', error);
      this.offlineQueue = [];
    }
  }

  private saveOfflineQueue(): void {
    try {
      localStorage.setItem('video_progress_offline_queue', JSON.stringify(this.offlineQueue));
    } catch (error) {
      logger.warn('Failed to save offline queue:', error);
    }
  }

  private handleOnline(): void {
    this.isOnline = true;
    logger.info('Device came online, syncing progress...');
    this.syncOfflineOperations();
  }

  private handleOffline(): void {
    this.isOnline = false;
    logger.info('Device went offline, queuing operations...');
  }

  private async syncOfflineOperations(): Promise<void> {
    if (this.syncInProgress || this.offlineQueue.length === 0) return;
    
    this.syncInProgress = true;
    logger.info(`Syncing ${this.offlineQueue.length} offline operations...`);
    
    const operationsToSync = [...this.offlineQueue];
    const syncedOperations: string[] = [];
    
    for (const operation of operationsToSync) {
      try {
        if (operation.type === 'save_progress') {
          await this.saveProgressToDynamoDB(operation.data as VideoProgress);
          syncedOperations.push(operation.id);
        } else if (operation.type === 'mark_completed') {
          await this.markCompletedInDynamoDB(operation.data as VideoProgress);
          syncedOperations.push(operation.id);
        }
        
        logger.info(`Synced operation ${operation.id}`);
      } catch (error) {
        logger.error(`Failed to sync operation ${operation.id}:`, error);
        
        // Increment retry count
        operation.retryCount = (operation.retryCount || 0) + 1;
        
        // Remove operation if it exceeded max retries
        if (operation.retryCount >= this.maxRetries) {
          logger.warn(`Operation ${operation.id} exceeded max retries, removing...`);
          syncedOperations.push(operation.id);
        }
      }
    }
    
    // Remove synced operations from queue
    this.offlineQueue = this.offlineQueue.filter(op => !syncedOperations.includes(op.id));
    this.saveOfflineQueue();
    
    this.syncInProgress = false;
    logger.info(`Sync completed. ${syncedOperations.length} operations synced.`);
  }

  private queueOfflineOperation(type: OfflineOperation['type'], data: Partial<VideoProgress>): void {
    const operation: OfflineOperation = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: new Date(),
      retryCount: 0
    };
    
    this.offlineQueue.push(operation);
    this.saveOfflineQueue();
    
    logger.info(`Queued offline operation: ${operation.id}`);
  }

  async loadProgress(userId: string, courseId: string, lessonId: string): Promise<VideoProgress | null> {
    // First try to get from DynamoDB if online
    if (this.isOnline) {
      try {
        const progress = await this.loadProgressFromDynamoDB(userId, courseId, lessonId);
        if (progress) {
          // Also cache in localStorage for offline access
          this.saveProgressToLocalStorage(progress);
          return progress;
        }
      } catch (error) {
        logger.warn('Failed to load progress from DynamoDB, falling back to localStorage:', error);
      }
    }
    
    // Fallback to localStorage
    return this.loadProgressFromLocalStorage(userId, courseId, lessonId);
  }

  private async loadProgressFromDynamoDB(userId: string, courseId: string, lessonId: string): Promise<VideoProgress | null> {
    try {
      const { PK, SK } = this.generateProgressKey(userId, courseId, lessonId);
      
      const command = new GetCommand({
        TableName: TABLES.VIDEO_PROGRESS,
        Key: { PK, SK }
      });
      
      const response = await docClient.send(command);
      
      if (!response.Item) {
        return null;
      }
      
      const record = response.Item as VideoProgressRecord;
      
      return {
        userId,
        courseId,
        lessonId,
        currentTime: record.currentTime,
        duration: record.duration,
        completionPercentage: record.completionPercentage,
        watchedTime: record.watchedTime,
        lastUpdated: new Date(record.lastUpdated),
        completed: record.completed,
        chaptersWatched: record.chaptersWatched || [],
        playbackSpeed: record.metadata?.playbackSpeed || 1,
        sessionId: record.metadata?.sessionId || '',
        deviceType: record.metadata?.deviceType || 'unknown',
        userAgent: record.metadata?.userAgent || ''
      };
    } catch (error) {
      logger.error('Error loading progress from DynamoDB:', error);
      throw error;
    }
  }

  private loadProgressFromLocalStorage(userId: string, courseId: string, lessonId: string): VideoProgress | null {
    try {
      const key = `video_progress_${userId}_${courseId}_${lessonId}`;
      const stored = localStorage.getItem(key);
      
      if (!stored) {
        return null;
      }
      
      const data = JSON.parse(stored);
      return {
        ...data,
        lastUpdated: new Date(data.lastUpdated)
      };
    } catch (error) {
      logger.warn('Failed to load progress from localStorage:', error);
      return null;
    }
  }

  async saveProgress(progressData: Partial<VideoProgress>): Promise<void> {
    if (!progressData.userId || !progressData.courseId || !progressData.lessonId) {
      throw new Error('Missing required progress data: userId, courseId, lessonId');
    }

    const progress: VideoProgress = {
      userId: progressData.userId,
      courseId: progressData.courseId,
      lessonId: progressData.lessonId,
      currentTime: progressData.currentTime || 0,
      duration: progressData.duration || 0,
      completionPercentage: progressData.completionPercentage || 0,
      watchedTime: progressData.watchedTime || 0,
      lastUpdated: new Date(),
      completed: progressData.completed || false,
      chaptersWatched: progressData.chaptersWatched || [],
      playbackSpeed: progressData.playbackSpeed || 1,
      sessionId: this.sessionId,
      deviceType: this.getDeviceType(),
      userAgent: this.getUserAgent()
    };

    // Always save to localStorage immediately for responsiveness
    this.saveProgressToLocalStorage(progress);

    // Try to save to DynamoDB if online, otherwise queue for later
    if (this.isOnline) {
      try {
        await this.saveProgressToDynamoDB(progress);
      } catch (error) {
        logger.warn('Failed to save progress to DynamoDB, queuing for sync:', error);
        this.queueOfflineOperation('save_progress', progress);
      }
    } else {
      this.queueOfflineOperation('save_progress', progress);
    }
  }

  private saveProgressToLocalStorage(progress: VideoProgress): void {
    try {
      const key = `video_progress_${progress.userId}_${progress.courseId}_${progress.lessonId}`;
      localStorage.setItem(key, JSON.stringify(progress));
    } catch (error) {
      logger.warn('Failed to save progress to localStorage:', error);
    }
  }

  private async saveProgressToDynamoDB(progress: VideoProgress): Promise<void> {
    try {
      const { PK, SK } = this.generateProgressKey(progress.userId, progress.courseId, progress.lessonId);
      
      const record: VideoProgressRecord = {
        PK,
        SK,
        currentTime: progress.currentTime,
        duration: progress.duration,
        completionPercentage: progress.completionPercentage,
        watchedTime: progress.watchedTime,
        lastUpdated: progress.lastUpdated.toISOString(),
        completed: progress.completed,
        chaptersWatched: progress.chaptersWatched,
        metadata: {
          playbackSpeed: progress.playbackSpeed,
          sessionId: progress.sessionId,
          deviceType: progress.deviceType,
          userAgent: progress.userAgent
        },
        TTL: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year
      };
      
      const command = new PutCommand({
        TableName: TABLES.VIDEO_PROGRESS,
        Item: record
      });
      
      await docClient.send(command);
    } catch (error) {
      logger.error('Error saving progress to DynamoDB:', error);
      throw error;
    }
  }

  async markCompleted(userId: string, courseId: string, lessonId: string): Promise<void> {
    const currentProgress = await this.loadProgress(userId, courseId, lessonId);
    
    const progress: VideoProgress = {
      ...currentProgress,
      userId,
      courseId,
      lessonId,
      completed: true,
      completionPercentage: 100,
      lastUpdated: new Date(),
      sessionId: this.sessionId,
      deviceType: this.getDeviceType(),
      userAgent: this.getUserAgent()
    } as VideoProgress;

    // Save to localStorage immediately
    this.saveProgressToLocalStorage(progress);

    // Try to save to DynamoDB if online, otherwise queue for later
    if (this.isOnline) {
      try {
        await this.markCompletedInDynamoDB(progress);
      } catch (error) {
        logger.warn('Failed to mark completed in DynamoDB, queuing for sync:', error);
        this.queueOfflineOperation('mark_completed', progress);
      }
    } else {
      this.queueOfflineOperation('mark_completed', progress);
    }
  }

  private async markCompletedInDynamoDB(progress: VideoProgress): Promise<void> {
    try {
      const { PK, SK } = this.generateProgressKey(progress.userId, progress.courseId, progress.lessonId);
      
      const command = new UpdateCommand({
        TableName: TABLES.VIDEO_PROGRESS,
        Key: { PK, SK },
        UpdateExpression: 'SET completed = :completed, completionPercentage = :percentage, lastUpdated = :updated, metadata = :metadata',
        ExpressionAttributeValues: {
          ':completed': true,
          ':percentage': 100,
          ':updated': progress.lastUpdated.toISOString(),
          ':metadata': {
            playbackSpeed: progress.playbackSpeed,
            sessionId: progress.sessionId,
            deviceType: progress.deviceType,
            userAgent: progress.userAgent
          }
        }
      });
      
      await docClient.send(command);
    } catch (error) {
      logger.error('Error marking completed in DynamoDB:', error);
      throw error;
    }
  }

  calculateResumePosition(lastPosition: number, chapters?: VideoChapter[]): number {
    if (!chapters || chapters.length === 0) {
      return lastPosition;
    }

    // Find if we're within 10 seconds of a chapter boundary
    const nearbyChapter = chapters.find(chapter => 
      Math.abs(chapter.startTime - lastPosition) <= 10
    );
    
    // If near a chapter start, resume from chapter start for better UX
    return nearbyChapter ? nearbyChapter.startTime : lastPosition;
  }

  getAnalytics(userId: string, courseId: string, lessonId: string): Promise<{
    totalWatchTime: number;
    averagePlaybackSpeed: number;
    completionRate: number;
    lastWatched: Date | null;
  }> {
    // This would typically aggregate data from DynamoDB
    // For now, return basic data from current progress
    return this.loadProgress(userId, courseId, lessonId).then(progress => ({
      totalWatchTime: progress?.watchedTime || 0,
      averagePlaybackSpeed: progress?.playbackSpeed || 1,
      completionRate: progress?.completionPercentage || 0,
      lastWatched: progress?.lastUpdated || null
    }));
  }

  // Get sync status for UI feedback
  getSyncStatus(): {
    isOnline: boolean;
    pendingOperations: number;
    isSyncing: boolean;
  } {
    return {
      isOnline: this.isOnline,
      pendingOperations: this.offlineQueue.length,
      isSyncing: this.syncInProgress
    };
  }

  // Force sync for manual trigger
  async forcSync(): Promise<void> {
    if (this.isOnline) {
      await this.syncOfflineOperations();
    }
  }
}

export default VideoProgressService;