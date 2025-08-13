'use client';

import { useState, useEffect, useCallback } from 'react';
import { AcademyCourse } from '@/lib/mock-data/academy';
import { 
  gamificationService, 
  ProgressMetrics, 
  Achievement, 
  UserProgress,
  DailyProgress,
  MEDICAL_ACHIEVEMENTS
} from '@/lib/services/gamification-service';
import { toast } from 'sonner';

export interface UseGamificationReturn {
  progress: ProgressMetrics;
  userProgress: UserProgress;
  streak: number;
  achievements: Achievement[];
  dailyGoal: number;
  todayProgress: number;
  recentlyUnlocked: Achievement[];
  isLoading: boolean;
  
  // Actions
  updateProgress: (data: Partial<ProgressMetrics>) => void;
  updateWatchTime: (minutes: number) => void;
  markLessonCompleted: (lessonId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  setDailyGoal: (minutes: number) => void;
  celebrateCompletion: (type: 'lesson' | 'module' | 'course', name?: string) => void;
  triggerTimeBasedAchievement: (type: 'late_study' | 'early_study') => void;
  triggerSpeedAchievement: (speed: number) => void;
  addNote: () => void;
  addBookmark: () => void;
  
  // Data getters
  getWeeklyData: () => DailyProgress[];
  getAvailableAchievements: () => Achievement[];
  getXPToNextLevel: () => number;
  getTodayData: () => DailyProgress | null;
}

export function useGamification(
  userId: string,
  courseData: AcademyCourse | null
): UseGamificationReturn {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [progress, setProgress] = useState<ProgressMetrics | null>(null);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize gamification data
  useEffect(() => {
    if (!courseData || !userId) {
      setIsLoading(false);
      return;
    }

    const initializeData = () => {
      const loadedProgress = gamificationService.getUserProgress(userId, courseData.id.toString());
      const calculatedProgress = gamificationService.calculateCourseProgress(courseData, loadedProgress);
      
      setUserProgress(loadedProgress);
      setProgress(calculatedProgress);
      setIsLoading(false);
    };

    // Small delay to prevent hydration issues
    const timer = setTimeout(initializeData, 100);
    return () => clearTimeout(timer);
  }, [userId, courseData]);

  // Save progress whenever it changes
  useEffect(() => {
    if (userProgress && courseData) {
      gamificationService.saveUserProgress(userProgress);
      
      // Recalculate progress metrics
      const updatedProgress = gamificationService.calculateCourseProgress(courseData, userProgress);
      setProgress(updatedProgress);
    }
  }, [userProgress, courseData]);

  // Check for new achievements whenever progress changes
  useEffect(() => {
    if (userProgress && courseData) {
      const newAchievements = gamificationService.checkAchievements(userProgress, courseData);
      
      if (newAchievements.length > 0) {
        setRecentlyUnlocked(newAchievements);
        
        // Show toast for each new achievement
        newAchievements.forEach(achievement => {
          toast.success(`🏆 Conquista Desbloqueada!`, {
            description: `${achievement.icon} ${achievement.title}: ${achievement.description}`,
            duration: 5000,
          });
        });

        // Update user progress with new achievements
        setUserProgress(prev => {
          if (!prev) return prev;
          
          return {
            ...prev,
            achievements: [...prev.achievements, ...newAchievements.map(a => a.id)],
            totalXP: prev.totalXP + newAchievements.reduce((sum, a) => sum + a.points, 0),
            level: gamificationService['calculateLevel'](
              prev.totalXP + newAchievements.reduce((sum, a) => sum + a.points, 0)
            )
          };
        });

        // Clear recently unlocked after animation
        setTimeout(() => setRecentlyUnlocked([]), 8000);
      }
    }
  }, [userProgress?.lessonsCompleted?.length, userProgress?.streak, userProgress?.notesCount]);

  // Update watch time and daily progress
  const updateWatchTime = useCallback((minutes: number) => {
    if (!userProgress || !courseData) return;

    const updatedProgress = gamificationService.updateDailyProgress(
      { ...userProgress },
      userProgress.timeSpent + minutes,
      userProgress.lessonsCompleted.length
    );

    updatedProgress.timeSpent += minutes;
    updatedProgress.averageSessionDuration = Math.round(
      (updatedProgress.averageSessionDuration + minutes) / 2
    );

    setUserProgress(updatedProgress);
  }, [userProgress, courseData]);

  // Mark lesson as completed
  const markLessonCompleted = useCallback((lessonId: string) => {
    if (!userProgress || !courseData) return;

    const updatedProgress = gamificationService.markLessonCompleted(
      { ...userProgress },
      lessonId,
      courseData
    );

    setUserProgress(updatedProgress);

    // Celebrate lesson completion
    celebrateCompletion('lesson');
  }, [userProgress, courseData]);

  // Set daily goal
  const setDailyGoal = useCallback((minutes: number) => {
    if (!userProgress) return;

    setUserProgress(prev => prev ? { ...prev, dailyGoal: minutes } : null);
  }, [userProgress]);

  // Celebrate completion with appropriate animation and sound
  const celebrateCompletion = useCallback((
    type: 'lesson' | 'module' | 'course', 
    name?: string
  ) => {
    const celebrations = {
      lesson: {
        emoji: '✅',
        title: 'Aula Concluída!',
        description: name ? `Parabéns! Você completou: ${name}` : 'Mais um passo em sua jornada médica!'
      },
      module: {
        emoji: '🎯',
        title: 'Módulo Concluído!',
        description: name ? `Excelente! Módulo completado: ${name}` : 'Você dominou mais uma área do conhecimento!'
      },
      course: {
        emoji: '🏆',
        title: 'Curso Concluído!',
        description: name ? `Parabéns, Dr(a)! Curso finalizado: ${name}` : 'Você concluiu sua especialização!'
      }
    };

    const celebration = celebrations[type];
    
    toast.success(celebration.title, {
      description: `${celebration.emoji} ${celebration.description}`,
      duration: type === 'course' ? 10000 : 5000,
    });
  }, []);

  // Trigger time-based achievements
  const triggerTimeBasedAchievement = useCallback((type: 'late_study' | 'early_study') => {
    if (!userProgress) return;

    const updatedProgress = gamificationService.triggerTimeBasedAchievement(
      { ...userProgress },
      type
    );

    setUserProgress(updatedProgress);
  }, [userProgress]);

  // Trigger speed-based achievements
  const triggerSpeedAchievement = useCallback((speed: number) => {
    if (!userProgress) return;

    const updatedProgress = gamificationService.triggerSpeedAchievement(
      { ...userProgress },
      speed
    );

    setUserProgress(updatedProgress);
  }, [userProgress]);

  // Add note count
  const addNote = useCallback(() => {
    if (!userProgress) return;

    setUserProgress(prev => prev ? { ...prev, notesCount: prev.notesCount + 1 } : null);
  }, [userProgress]);

  // Add bookmark count
  const addBookmark = useCallback(() => {
    if (!userProgress) return;

    setUserProgress(prev => prev ? { ...prev, bookmarksCount: prev.bookmarksCount + 1 } : null);
  }, [userProgress]);

  // Get weekly data for charts
  const getWeeklyData = useCallback((): DailyProgress[] => {
    if (!userProgress) return [];

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    return userProgress.dailyProgressHistory
      .filter(day => day.date >= oneWeekAgo)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [userProgress]);

  // Get available achievements with current progress
  const getAvailableAchievements = useCallback((): Achievement[] => {
    if (!userProgress) return MEDICAL_ACHIEVEMENTS;

    return MEDICAL_ACHIEVEMENTS.map(achievement => {
      const isUnlocked = userProgress.achievements.includes(achievement.id);
      let currentProgress = 0;

      if (!isUnlocked) {
        switch (achievement.requirement.type) {
          case 'lessons_completed':
            currentProgress = userProgress.lessonsCompleted.length;
            break;
          case 'streak_days':
            currentProgress = userProgress.streak;
            break;
          case 'notes_taken':
            currentProgress = userProgress.notesCount;
            break;
          case 'module_complete':
            currentProgress = userProgress.modulesCompleted.length;
            break;
          // Add other types as needed
        }
      }

      return {
        ...achievement,
        requirement: {
          ...achievement.requirement,
          current: currentProgress
        },
        progress: isUnlocked ? 100 : Math.min((currentProgress / achievement.requirement.target) * 100, 100),
        unlockedAt: isUnlocked ? new Date() : undefined
      };
    });
  }, [userProgress]);

  // Get XP needed for next level
  const getXPToNextLevel = useCallback((): number => {
    if (!userProgress) return 0;

    const currentLevel = userProgress.level;
    const nextLevelXP = Math.pow(currentLevel, 2) * 100; // XP needed for next level
    return Math.max(0, nextLevelXP - userProgress.totalXP);
  }, [userProgress]);

  // Get today's progress data
  const getTodayData = useCallback((): DailyProgress | null => {
    if (!userProgress) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return userProgress.dailyProgressHistory.find(day => {
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);
      return dayDate.getTime() === today.getTime();
    }) || null;
  }, [userProgress]);

  // Dummy update progress function for compatibility
  const updateProgress = useCallback((data: Partial<ProgressMetrics>) => {
    // This is handled internally by other functions
    console.log('Progress update:', data);
  }, []);

  // Dummy unlock achievement function for manual unlocking
  const unlockAchievement = useCallback((achievementId: string) => {
    if (!userProgress) return;

    if (!userProgress.achievements.includes(achievementId)) {
      const achievement = MEDICAL_ACHIEVEMENTS.find(a => a.id === achievementId);
      if (achievement) {
        setUserProgress(prev => prev ? {
          ...prev,
          achievements: [...prev.achievements, achievementId],
          totalXP: prev.totalXP + achievement.points
        } : null);
      }
    }
  }, [userProgress]);

  // Return loading state if still initializing
  if (isLoading || !userProgress || !progress) {
    return {
      progress: {
        completion: 0,
        timeSpent: 0,
        averageWatchSpeed: 1,
        chaptersCompleted: 0,
        lessonsCompleted: 0,
        streak: 0,
        lastActivity: new Date(),
        dailyGoal: 30,
        weeklyProgress: 0,
        totalMinutesThisWeek: 0,
        perfectDays: 0
      },
      userProgress: {
        userId,
        courseId: courseData?.id.toString() || '',
        lessonsCompleted: [],
        modulesCompleted: [],
        timeSpent: 0,
        streak: 0,
        longestStreak: 0,
        lastActivity: new Date(),
        dailyGoal: 30,
        achievements: [],
        totalXP: 0,
        level: 1,
        dailyProgressHistory: [],
        notesCount: 0,
        bookmarksCount: 0,
        averageSessionDuration: 30,
        preferredSpeed: 1,
        startDate: new Date()
      },
      streak: 0,
      achievements: [],
      dailyGoal: 30,
      todayProgress: 0,
      recentlyUnlocked: [],
      isLoading: true,
      updateProgress,
      updateWatchTime: () => {},
      markLessonCompleted: () => {},
      unlockAchievement: () => {},
      setDailyGoal: () => {},
      celebrateCompletion: () => {},
      triggerTimeBasedAchievement: () => {},
      triggerSpeedAchievement: () => {},
      addNote: () => {},
      addBookmark: () => {},
      getWeeklyData: () => [],
      getAvailableAchievements: () => [],
      getXPToNextLevel: () => 0,
      getTodayData: () => null
    };
  }

  const todayData = getTodayData();

  return {
    progress,
    userProgress,
    streak: userProgress.streak,
    achievements: getAvailableAchievements(),
    dailyGoal: userProgress.dailyGoal,
    todayProgress: todayData?.minutesWatched || 0,
    recentlyUnlocked,
    isLoading: false,
    
    updateProgress,
    updateWatchTime,
    markLessonCompleted,
    unlockAchievement,
    setDailyGoal,
    celebrateCompletion,
    triggerTimeBasedAchievement,
    triggerSpeedAchievement,
    addNote,
    addBookmark,
    
    getWeeklyData,
    getAvailableAchievements,
    getXPToNextLevel,
    getTodayData
  };
}