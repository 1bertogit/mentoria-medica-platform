'use client';

import { AcademyCourse, Lesson, CurriculumModule } from '@/lib/mock-data/academy';

export interface ProgressMetrics {
  completion: number; // 0-100
  timeSpent: number; // minutes
  averageWatchSpeed: number; // 1x, 1.5x, etc.
  chaptersCompleted: number;
  lessonsCompleted: number;
  streak: number; // days
  lastActivity: Date;
  dailyGoal: number; // minutes
  weeklyProgress: number; // 0-100
  totalMinutesThisWeek: number;
  perfectDays: number; // Days where daily goal was met
}

export interface DailyProgress {
  date: Date;
  minutesWatched: number;
  lessonsCompleted: number;
  goalMet: boolean;
  studyStreak: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or icon name
  category: 'progress' | 'engagement' | 'social' | 'special' | 'time' | 'quality';
  unlockedAt?: Date;
  progress?: number; // 0-100 for achievements in progress
  requirement: {
    type: 'lessons_completed' | 'streak_days' | 'notes_taken' | 'quiz_score' | 
          'continuous_study' | 'late_study' | 'early_study' | 'perfect_week' |
          'speed_learning' | 'thorough_study' | 'module_complete' | 'course_complete';
    target: number;
    current: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number; // XP points awarded
}

export interface UserProgress {
  userId: string;
  courseId: string;
  lessonsCompleted: string[];
  modulesCompleted: string[];
  timeSpent: number; // total minutes
  streak: number;
  longestStreak: number;
  lastActivity: Date;
  dailyGoal: number;
  achievements: string[]; // achievement IDs
  totalXP: number;
  level: number;
  dailyProgressHistory: DailyProgress[];
  notesCount: number;
  bookmarksCount: number;
  averageSessionDuration: number;
  preferredSpeed: number;
  startDate: Date;
}

export interface ExtendedLesson extends Lesson {
  estimatedDuration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  practicalWeight: number; // 0-1 for time estimation
  xpReward: number; // XP points for completion
}

// Medical-themed achievements
export const MEDICAL_ACHIEVEMENTS: Achievement[] = [
  // Progress Achievements
  {
    id: 'primeiro-corte',
    title: 'Primeiro Corte',
    description: 'Completou sua primeira aula prática',
    icon: '🔪',
    category: 'progress',
    requirement: { type: 'lessons_completed', target: 1, current: 0 },
    rarity: 'common',
    points: 50
  },
  {
    id: 'anatomista',
    title: 'Anatomista',
    description: 'Dominou os fundamentos anatômicos',
    icon: '🦴',
    category: 'progress',
    requirement: { type: 'lessons_completed', target: 5, current: 0 },
    rarity: 'common',
    points: 150
  },
  {
    id: 'cirurgiao-junior',
    title: 'Cirurgião Júnior',
    description: 'Completou 10 aulas práticas',
    icon: '👨‍⚕️',
    category: 'progress',
    requirement: { type: 'lessons_completed', target: 10, current: 0 },
    rarity: 'rare',
    points: 300
  },
  {
    id: 'especialista',
    title: 'Especialista',
    description: 'Completou um módulo inteiro',
    icon: '🏆',
    category: 'progress',
    requirement: { type: 'module_complete', target: 1, current: 0 },
    rarity: 'epic',
    points: 500
  },
  {
    id: 'mestre-cirurgiao',
    title: 'Mestre Cirurgião',
    description: 'Completou o curso completo',
    icon: '👑',
    category: 'progress',
    requirement: { type: 'course_complete', target: 1, current: 0 },
    rarity: 'legendary',
    points: 2000
  },

  // Engagement Achievements
  {
    id: 'dedicado',
    title: 'Dedicado',
    description: '3 dias de estudo seguidos',
    icon: '🔥',
    category: 'engagement',
    requirement: { type: 'streak_days', target: 3, current: 0 },
    rarity: 'common',
    points: 100
  },
  {
    id: 'persistente',
    title: 'Persistente',
    description: '7 dias de estudo seguidos',
    icon: '💪',
    category: 'engagement',
    requirement: { type: 'streak_days', target: 7, current: 0 },
    rarity: 'rare',
    points: 250
  },
  {
    id: 'incansavel',
    title: 'Incansável',
    description: '30 dias de estudo seguidos',
    icon: '🌟',
    category: 'engagement',
    requirement: { type: 'streak_days', target: 30, current: 0 },
    rarity: 'legendary',
    points: 1000
  },
  {
    id: 'maratonista',
    title: 'Maratonista',
    description: '4 horas de estudo contínuo',
    icon: '🏃‍♂️',
    category: 'time',
    requirement: { type: 'continuous_study', target: 240, current: 0 },
    rarity: 'rare',
    points: 400
  },

  // Special Time Achievements
  {
    id: 'noturno',
    title: 'Cirurgião Noturno',
    description: 'Estudou após 22h',
    icon: '🌙',
    category: 'special',
    requirement: { type: 'late_study', target: 1, current: 0 },
    rarity: 'rare',
    points: 200
  },
  {
    id: 'matutino',
    title: 'Cirurgião Matutino',
    description: 'Estudou antes das 7h',
    icon: '🌅',
    category: 'special',
    requirement: { type: 'early_study', target: 1, current: 0 },
    rarity: 'rare',
    points: 200
  },
  {
    id: 'velocista',
    title: 'Velocista',
    description: 'Aprendeu em velocidade 2x',
    icon: '⚡',
    category: 'quality',
    requirement: { type: 'speed_learning', target: 1, current: 0 },
    rarity: 'common',
    points: 100
  },
  {
    id: 'detalhista',
    title: 'Detalhista',
    description: 'Fez anotações em 10 aulas',
    icon: '📝',
    category: 'quality',
    requirement: { type: 'notes_taken', target: 10, current: 0 },
    rarity: 'rare',
    points: 300
  },
  {
    id: 'semana-perfeita',
    title: 'Semana Perfeita',
    description: 'Cumpriu meta diária por 7 dias',
    icon: '💎',
    category: 'engagement',
    requirement: { type: 'perfect_week', target: 1, current: 0 },
    rarity: 'epic',
    points: 750
  }
];

class GamificationService {
  private static instance: GamificationService;
  private userProgressKey = 'user_progress';
  private achievementsKey = 'user_achievements';

  static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
    }
    return GamificationService.instance;
  }

  // Get user progress from localStorage
  getUserProgress(userId: string, courseId: string): UserProgress {
    if (typeof window === 'undefined') {
      return this.getDefaultProgress(userId, courseId);
    }

    try {
      const key = `${this.userProgressKey}_${userId}_${courseId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const progress = JSON.parse(stored);
        // Convert date strings back to Date objects
        progress.lastActivity = new Date(progress.lastActivity);
        progress.startDate = new Date(progress.startDate);
        progress.dailyProgressHistory = progress.dailyProgressHistory.map((day: any) => ({
          ...day,
          date: new Date(day.date)
        }));
        return progress;
      }
    } catch (error) {
      console.warn('Error loading user progress:', error);
    }

    return this.getDefaultProgress(userId, courseId);
  }

  // Save user progress to localStorage
  saveUserProgress(progress: UserProgress): void {
    if (typeof window === 'undefined') return;

    try {
      const key = `${this.userProgressKey}_${progress.userId}_${progress.courseId}`;
      localStorage.setItem(key, JSON.stringify(progress));
    } catch (error) {
      console.warn('Error saving user progress:', error);
    }
  }

  // Calculate streak based on daily progress history
  calculateStreak(dailyHistory: DailyProgress[]): number {
    if (dailyHistory.length === 0) return 0;

    // Sort by date descending
    const sortedHistory = [...dailyHistory].sort((a, b) => b.date.getTime() - a.date.getTime());
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedHistory.length; i++) {
      const progressDate = new Date(sortedHistory[i].date);
      progressDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (progressDate.getTime() === expectedDate.getTime() && sortedHistory[i].studyStreak) {
        streak++;
      } else if (i === 0 && progressDate.getTime() < expectedDate.getTime()) {
        // Today hasn't been studied yet, but yesterday was
        continue;
      } else {
        break;
      }
    }

    return streak;
  }

  // Check and unlock achievements
  checkAchievements(progress: UserProgress, courseData?: AcademyCourse): Achievement[] {
    const unlockedAchievements: Achievement[] = [];

    MEDICAL_ACHIEVEMENTS.forEach(achievement => {
      if (progress.achievements.includes(achievement.id)) {
        return; // Already unlocked
      }

      let currentProgress = 0;
      let shouldUnlock = false;

      switch (achievement.requirement.type) {
        case 'lessons_completed':
          currentProgress = progress.lessonsCompleted.length;
          shouldUnlock = currentProgress >= achievement.requirement.target;
          break;

        case 'streak_days':
          currentProgress = progress.streak;
          shouldUnlock = currentProgress >= achievement.requirement.target;
          break;

        case 'notes_taken':
          currentProgress = progress.notesCount;
          shouldUnlock = currentProgress >= achievement.requirement.target;
          break;

        case 'continuous_study':
          currentProgress = progress.averageSessionDuration;
          shouldUnlock = currentProgress >= achievement.requirement.target;
          break;

        case 'module_complete':
          currentProgress = progress.modulesCompleted.length;
          shouldUnlock = currentProgress >= achievement.requirement.target;
          break;

        case 'course_complete':
          if (courseData) {
            const totalLessons = courseData.curriculum.reduce((total, module) => total + module.lessons.length, 0);
            shouldUnlock = progress.lessonsCompleted.length >= totalLessons;
          }
          break;

        case 'late_study':
        case 'early_study':
        case 'speed_learning':
        case 'perfect_week':
          // These are tracked separately and set when the condition is met
          break;
      }

      // Update achievement progress
      achievement.requirement.current = currentProgress;

      if (shouldUnlock) {
        const unlockedAchievement = {
          ...achievement,
          unlockedAt: new Date(),
        };
        unlockedAchievements.push(unlockedAchievement);
        progress.achievements.push(achievement.id);
        progress.totalXP += achievement.points;
      }
    });

    return unlockedAchievements;
  }

  // Estimate time remaining based on user pace and content
  estimateTimeRemaining(course: AcademyCourse, userProgress: UserProgress): string {
    if (!course.curriculum || course.curriculum.length === 0) {
      return 'Não disponível';
    }

    // Calculate total remaining content in minutes
    let totalRemainingMinutes = 0;
    
    course.curriculum.forEach(module => {
      module.lessons.forEach(lesson => {
        if (!userProgress.lessonsCompleted.includes(lesson.id || '')) {
          // Parse duration string (e.g., "1h 30min" or "45min")
          const duration = lesson.duration || '30min';
          const minutes = this.parseDurationToMinutes(duration);
          totalRemainingMinutes += minutes;
        }
      });
    });

    if (totalRemainingMinutes === 0) {
      return 'Curso concluído!';
    }

    // Adjust for user's typical speed
    const userSpeedMultiplier = userProgress.preferredSpeed || 1;
    const adjustedMinutes = totalRemainingMinutes / userSpeedMultiplier;

    // Consider user's average session duration for estimation
    const avgSessionMinutes = userProgress.averageSessionDuration || 30;
    const estimatedSessions = Math.ceil(adjustedMinutes / avgSessionMinutes);

    return this.formatDuration(adjustedMinutes, estimatedSessions);
  }

  // Calculate detailed course progress
  calculateCourseProgress(course: AcademyCourse, userProgress: UserProgress): ProgressMetrics {
    const totalLessons = course.curriculum.reduce((total, module) => total + module.lessons.length, 0);
    const completedLessons = userProgress.lessonsCompleted.length;
    const completion = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // Calculate weekly progress
    const weeklyMinutes = this.getWeeklyMinutes(userProgress.dailyProgressHistory);
    const weeklyGoal = userProgress.dailyGoal * 7; // 7 days
    const weeklyProgress = weeklyGoal > 0 ? Math.min((weeklyMinutes / weeklyGoal) * 100, 100) : 0;

    const perfectDays = userProgress.dailyProgressHistory.filter(day => day.goalMet).length;

    return {
      completion,
      timeSpent: userProgress.timeSpent,
      averageWatchSpeed: userProgress.preferredSpeed || 1,
      chaptersCompleted: this.calculateChaptersCompleted(course, userProgress),
      lessonsCompleted: completedLessons,
      streak: userProgress.streak,
      lastActivity: userProgress.lastActivity,
      dailyGoal: userProgress.dailyGoal,
      weeklyProgress,
      totalMinutesThisWeek: weeklyMinutes,
      perfectDays
    };
  }

  // Update daily progress and maintain streak
  updateDailyProgress(userProgress: UserProgress, minutesWatched: number, lessonsCompleted: number = 0): UserProgress {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create today's progress
    let todayProgressIndex = userProgress.dailyProgressHistory.findIndex(day => {
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);
      return dayDate.getTime() === today.getTime();
    });

    const goalMet = minutesWatched >= userProgress.dailyGoal;
    const studyStreak = minutesWatched > 0; // Any study counts for streak

    if (todayProgressIndex >= 0) {
      // Update existing day
      userProgress.dailyProgressHistory[todayProgressIndex] = {
        date: today,
        minutesWatched,
        lessonsCompleted,
        goalMet,
        studyStreak
      };
    } else {
      // Add new day
      userProgress.dailyProgressHistory.push({
        date: today,
        minutesWatched,
        lessonsCompleted,
        goalMet,
        studyStreak
      });
    }

    // Keep only last 90 days
    userProgress.dailyProgressHistory = userProgress.dailyProgressHistory
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(-90);

    // Recalculate streak
    userProgress.streak = this.calculateStreak(userProgress.dailyProgressHistory);
    userProgress.longestStreak = Math.max(userProgress.longestStreak, userProgress.streak);
    userProgress.lastActivity = new Date();

    return userProgress;
  }

  // Mark lesson as completed
  markLessonCompleted(userProgress: UserProgress, lessonId: string, courseData: AcademyCourse): UserProgress {
    if (!userProgress.lessonsCompleted.includes(lessonId)) {
      userProgress.lessonsCompleted.push(lessonId);
      
      // Check if module is completed
      courseData.curriculum.forEach(module => {
        const allLessonsCompleted = module.lessons.every(lesson => 
          userProgress.lessonsCompleted.includes(lesson.id || '')
        );
        
        if (allLessonsCompleted && !userProgress.modulesCompleted.includes(module.id || '')) {
          userProgress.modulesCompleted.push(module.id || '');
        }
      });

      // Update XP and level
      const lesson = this.findLesson(courseData, lessonId);
      if (lesson) {
        const xpGain = this.calculateLessonXP(lesson);
        userProgress.totalXP += xpGain;
        userProgress.level = this.calculateLevel(userProgress.totalXP);
      }
    }
    
    return userProgress;
  }

  // Special achievement triggers
  triggerTimeBasedAchievement(userProgress: UserProgress, type: 'late_study' | 'early_study'): UserProgress {
    const achievementId = type === 'late_study' ? 'noturno' : 'matutino';
    
    if (!userProgress.achievements.includes(achievementId)) {
      userProgress.achievements.push(achievementId);
      const achievement = MEDICAL_ACHIEVEMENTS.find(a => a.id === achievementId);
      if (achievement) {
        userProgress.totalXP += achievement.points;
        userProgress.level = this.calculateLevel(userProgress.totalXP);
      }
    }
    
    return userProgress;
  }

  triggerSpeedAchievement(userProgress: UserProgress, speed: number): UserProgress {
    if (speed >= 2 && !userProgress.achievements.includes('velocista')) {
      userProgress.achievements.push('velocista');
      const achievement = MEDICAL_ACHIEVEMENTS.find(a => a.id === 'velocista');
      if (achievement) {
        userProgress.totalXP += achievement.points;
        userProgress.level = this.calculateLevel(userProgress.totalXP);
      }
    }
    
    return userProgress;
  }

  triggerPerfectWeekAchievement(userProgress: UserProgress): UserProgress {
    const lastWeek = userProgress.dailyProgressHistory.slice(-7);
    const perfectWeek = lastWeek.length === 7 && lastWeek.every(day => day.goalMet);
    
    if (perfectWeek && !userProgress.achievements.includes('semana-perfeita')) {
      userProgress.achievements.push('semana-perfeita');
      const achievement = MEDICAL_ACHIEVEMENTS.find(a => a.id === 'semana-perfeita');
      if (achievement) {
        userProgress.totalXP += achievement.points;
        userProgress.level = this.calculateLevel(userProgress.totalXP);
      }
    }
    
    return userProgress;
  }

  // Private helper methods
  private getDefaultProgress(userId: string, courseId: string): UserProgress {
    return {
      userId,
      courseId,
      lessonsCompleted: [],
      modulesCompleted: [],
      timeSpent: 0,
      streak: 0,
      longestStreak: 0,
      lastActivity: new Date(),
      dailyGoal: 30, // 30 minutes default
      achievements: [],
      totalXP: 0,
      level: 1,
      dailyProgressHistory: [],
      notesCount: 0,
      bookmarksCount: 0,
      averageSessionDuration: 30,
      preferredSpeed: 1,
      startDate: new Date()
    };
  }

  private parseDurationToMinutes(duration: string): number {
    const hourMatch = duration.match(/(\d+)h/);
    const minuteMatch = duration.match(/(\d+)min/);
    
    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
    
    return hours * 60 + minutes;
  }

  private formatDuration(minutes: number, sessions?: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    let result = '';
    if (hours > 0) {
      result += `${hours}h`;
    }
    if (mins > 0) {
      result += `${result ? ' ' : ''}${mins}min`;
    }
    
    if (sessions && sessions > 1) {
      result += ` (≈${sessions} sessões)`;
    }
    
    return result || '0min';
  }

  private getWeeklyMinutes(dailyHistory: DailyProgress[]): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    return dailyHistory
      .filter(day => day.date >= oneWeekAgo)
      .reduce((total, day) => total + day.minutesWatched, 0);
  }

  private calculateChaptersCompleted(course: AcademyCourse, userProgress: UserProgress): number {
    let chaptersCompleted = 0;
    
    course.curriculum.forEach(module => {
      module.lessons.forEach(lesson => {
        if (userProgress.lessonsCompleted.includes(lesson.id || '') && lesson.chapters) {
          chaptersCompleted += lesson.chapters.length;
        }
      });
    });
    
    return chaptersCompleted;
  }

  private findLesson(course: AcademyCourse, lessonId: string): Lesson | undefined {
    for (const module of course.curriculum) {
      const lesson = module.lessons.find(l => l.id === lessonId);
      if (lesson) return lesson;
    }
    return undefined;
  }

  private calculateLessonXP(lesson: Lesson): number {
    const baseDuration = this.parseDurationToMinutes(lesson.duration || '30min');
    let multiplier = 1;
    
    // Bonus XP for different lesson types
    switch (lesson.type) {
      case 'cirurgia':
        multiplier = 1.5; // Surgery lessons are worth more
        break;
      case 'video':
        multiplier = 1.0;
        break;
      case 'ebook':
        multiplier = 0.8;
        break;
    }
    
    return Math.round(baseDuration * multiplier * 2); // 2 XP per minute base
  }

  private calculateLevel(totalXP: number): number {
    // Level formula: Level = floor(sqrt(totalXP / 100)) + 1
    // This creates progressively harder levels
    return Math.floor(Math.sqrt(totalXP / 100)) + 1;
  }
}

export const gamificationService = GamificationService.getInstance();