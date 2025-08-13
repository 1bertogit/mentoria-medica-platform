'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { VideoProgress } from '@/lib/services/video-progress-service';
import VideoProgressService from '@/lib/services/video-progress-service';
import { VideoChapter } from '@/lib/video/chapter-data';
import logger from '@/lib/logger';

export interface UseVideoProgressReturn {
  progress: VideoProgress | null;
  saveProgress: (data: Partial<VideoProgress>) => Promise<void>;
  loadProgress: () => Promise<VideoProgress | null>;
  markCompleted: () => Promise<void>;
  resumePosition: number | null;
  showResumePrompt: boolean;
  acceptResume: () => void;
  dismissResume: () => void;
  analytics: {
    totalWatchTime: number;
    averagePlaybackSpeed: number;
    completionRate: number;
    lastWatched: Date | null;
  };
  syncStatus: {
    isOnline: boolean;
    pendingOperations: number;
    isSyncing: boolean;
  };
  isLoading: boolean;
  error: string | null;
}

interface UseVideoProgressOptions {
  userId: string;
  courseId: string;
  lessonId: string;
  chapters?: VideoChapter[];
  autoSaveInterval?: number; // in milliseconds, default 30000 (30s)
  resumeThreshold?: number; // minimum seconds to show resume prompt, default 30
  completionThreshold?: number; // percentage to mark as completed, default 90
}

export function useVideoProgress(options: UseVideoProgressOptions): UseVideoProgressReturn {
  const {
    userId,
    courseId,
    lessonId,
    chapters = [],
    autoSaveInterval = 30000,
    resumeThreshold = 30,
    completionThreshold = 90
  } = options;

  const [progress, setProgress] = useState<VideoProgress | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [resumePosition, setResumePosition] = useState<number | null>(null);
  const [analytics, setAnalytics] = useState({
    totalWatchTime: 0,
    averagePlaybackSpeed: 1,
    completionRate: 0,
    lastWatched: null as Date | null
  });
  const [syncStatus, setSyncStatus] = useState({
    isOnline: true,
    pendingOperations: 0,
    isSyncing: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const progressService = VideoProgressService.getInstance();
  const autoSaveRef = useRef<NodeJS.Timeout>();
  const lastSaveTimeRef = useRef<number>(0);
  const watchStartTimeRef = useRef<number>(0);
  const totalWatchTimeRef = useRef<number>(0);

  // Load initial progress
  const loadProgress = useCallback(async (): Promise<VideoProgress | null> => {
    if (!userId || !courseId || !lessonId) {
      return null;
    }

    try {
      setError(null);
      const loadedProgress = await progressService.loadProgress(userId, courseId, lessonId);
      
      if (loadedProgress) {
        setProgress(loadedProgress);
        
        // Calculate resume position using chapter-aware logic
        const resumePos = progressService.calculateResumePosition(
          loadedProgress.currentTime, 
          chapters
        );
        
        // Show resume prompt if progress is significant and not completed
        if (resumePos >= resumeThreshold && !loadedProgress.completed) {
          setResumePosition(resumePos);
          setShowResumePrompt(true);
        }
        
        // Initialize watch time tracking
        totalWatchTimeRef.current = loadedProgress.watchedTime;
      }
      
      return loadedProgress;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load progress';
      setError(errorMessage);
      logger.error('Error loading video progress:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId, courseId, lessonId, chapters, resumeThreshold]);

  // Save progress with debouncing and analytics
  const saveProgress = useCallback(async (data: Partial<VideoProgress>): Promise<void> => {
    if (!userId || !courseId || !lessonId) {
      return;
    }

    try {
      setError(null);
      
      // Calculate additional analytics
      const now = Date.now();
      let additionalWatchedTime = 0;
      
      if (watchStartTimeRef.current > 0) {
        additionalWatchedTime = (now - watchStartTimeRef.current) / 1000;
        totalWatchTimeRef.current += additionalWatchedTime;
      }
      
      const enhancedData: Partial<VideoProgress> = {
        ...data,
        userId,
        courseId,
        lessonId,
        watchedTime: totalWatchTimeRef.current,
        lastUpdated: new Date(),
        // Auto-complete if reached threshold
        completed: data.completed || (data.completionPercentage || 0) >= completionThreshold
      };

      await progressService.saveProgress(enhancedData);
      
      // Update local state
      setProgress(prev => prev ? { ...prev, ...enhancedData } as VideoProgress : null);
      
      // Reset watch start time for next interval
      watchStartTimeRef.current = now;
      
      logger.debug('Progress saved successfully', enhancedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save progress';
      setError(errorMessage);
      logger.error('Error saving video progress:', err);
      throw err;
    }
  }, [userId, courseId, lessonId, completionThreshold]);

  // Mark lesson as completed
  const markCompleted = useCallback(async (): Promise<void> => {
    if (!userId || !courseId || !lessonId) {
      return;
    }

    try {
      setError(null);
      await progressService.markCompleted(userId, courseId, lessonId);
      
      setProgress(prev => prev ? { ...prev, completed: true, completionPercentage: 100 } : null);
      setShowResumePrompt(false);
      
      logger.info('Lesson marked as completed');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark as completed';
      setError(errorMessage);
      logger.error('Error marking lesson as completed:', err);
      throw err;
    }
  }, [userId, courseId, lessonId]);

  // Resume prompt handlers
  const acceptResume = useCallback(() => {
    setShowResumePrompt(false);
    // Resume position will be used by the video player
  }, []);

  const dismissResume = useCallback(() => {
    setShowResumePrompt(false);
    setResumePosition(null);
  }, []);

  // Start watch time tracking
  const startWatchTimeTracking = useCallback(() => {
    watchStartTimeRef.current = Date.now();
  }, []);

  // Stop watch time tracking
  const stopWatchTimeTracking = useCallback(() => {
    if (watchStartTimeRef.current > 0) {
      const additionalTime = (Date.now() - watchStartTimeRef.current) / 1000;
      totalWatchTimeRef.current += additionalTime;
      watchStartTimeRef.current = 0;
    }
  }, []);

  // Set up auto-save interval
  useEffect(() => {
    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
    };
  }, []);

  // Setup auto-save when progress is available
  useEffect(() => {
    if (!progress) return;

    // Clear existing interval
    if (autoSaveRef.current) {
      clearInterval(autoSaveRef.current);
    }

    // Set up new interval
    autoSaveRef.current = setInterval(() => {
      // Only save if we have meaningful progress and are currently watching
      if (watchStartTimeRef.current > 0) {
        const now = Date.now();
        
        // Avoid saving too frequently
        if (now - lastSaveTimeRef.current >= autoSaveInterval) {
          lastSaveTimeRef.current = now;
          
          // This would typically be called with current video player state
          // The video player component should call saveProgress with current time
          logger.debug('Auto-save interval triggered');
        }
      }
    }, autoSaveInterval);

    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
    };
  }, [progress, autoSaveInterval]);

  // Load analytics
  useEffect(() => {
    if (!userId || !courseId || !lessonId) return;

    progressService.getAnalytics(userId, courseId, lessonId)
      .then(setAnalytics)
      .catch(err => logger.warn('Failed to load analytics:', err));
  }, [userId, courseId, lessonId]);

  // Update sync status periodically
  useEffect(() => {
    const updateSyncStatus = () => {
      setSyncStatus(progressService.getSyncStatus());
    };

    updateSyncStatus();
    const interval = setInterval(updateSyncStatus, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Load initial progress on mount or when identifiers change
  useEffect(() => {
    setIsLoading(true);
    loadProgress();
  }, [loadProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWatchTimeTracking();
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
    };
  }, [stopWatchTimeTracking]);

  return {
    progress,
    saveProgress,
    loadProgress,
    markCompleted,
    resumePosition,
    showResumePrompt,
    acceptResume,
    dismissResume,
    analytics,
    syncStatus,
    isLoading,
    error
  };
}