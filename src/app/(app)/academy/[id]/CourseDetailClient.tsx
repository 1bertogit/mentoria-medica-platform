'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AcademyCourse, Lesson } from '@/lib/mock-data/academy';
import { CourseHeader } from '@/components/academy/course-header';
import { ModuleNavigation } from '@/components/academy/module-navigation';
import { EnhancedVideoPlayer } from '@/components/academy/enhanced-video-player';
import { MobileVideoPlayer } from '@/components/academy/mobile-video-player';
import { MobileLayout } from './mobile-layout';
import { LessonDetails } from '@/components/academy/lesson-details';
import { LessonSidebar } from '@/components/academy/lesson-sidebar';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useBreakpoint } from '@/hooks/use-media-query';
import { useGamification } from '@/hooks/use-gamification';
import { useCelebrations } from '@/components/academy/completion-celebrations';
import { useAnimationControls } from '@/hooks/use-animation-controls';
import { SmartToastProvider } from '@/components/ui/smart-toast-system';
import { ShimmerSkeleton } from '@/components/ui/enhanced-loading-states';
import { courseAnimations } from '@/lib/animations/course-animations';
import { gamificationService } from '@/lib/services/gamification-service';
import { DownloadManagerUI } from '@/components/academy/download-manager-ui';
import { OfflineIndicator } from '@/components/academy/offline-indicator';
import { useOffline } from '@/hooks/use-offline';

interface CourseDetailClientProps {
  courseData: unknown;
}

export default function CourseDetailClient({
  courseData,
}: CourseDetailClientProps) {
  const [course, setCourse] = useState<AcademyCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentModuleId, setCurrentModuleId] = useState<string>('');
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'portrait'
  );
  const [, setLastAccessedCourse] = useLocalStorage<any>('lastAccessedCourse', null);

  // Mobile detection
  const { isMobile, isTouchDevice } = useBreakpoint();

  // Gamification integration
  const userId = 'user123'; // TODO: Get from auth context
  const gamification = useGamification(userId, course);
  const { showCelebration, CelebrationComponent } = useCelebrations();

  // Animation controls integration
  const animationControls = useAnimationControls();

  // Offline functionality
  const { isOnline, downloadedLessons } = useOffline();

  useEffect(() => {
    if (courseData) {
      const courseObj = courseData as AcademyCourse;
      setCourse(courseObj);

      // Set current lesson based on course progress or default to first lesson
      if (courseObj.currentLesson) {
        setCurrentModuleId(courseObj.currentLesson.moduleId);
        setCurrentLessonId(courseObj.currentLesson.lessonId);
      } else if (courseObj.curriculum.length > 0) {
        const firstModule = courseObj.curriculum[0];
        const firstLesson = firstModule.lessons[0];
        setCurrentModuleId(firstModule.id!);
        setCurrentLessonId(firstLesson.id!);
      }

      setLoading(false);
    }
  }, [courseData]);

  // Update current lesson when module/lesson changes
  useEffect(() => {
    if (course && currentModuleId && currentLessonId) {
      const module = course.curriculum.find(m => m.id === currentModuleId);
      if (module) {
        const lesson = module.lessons.find(l => l.id === currentLessonId);
        setCurrentLesson(lesson || null);
      }
    }
  }, [course, currentModuleId, currentLessonId]);

  // Save course to localStorage
  useEffect(() => {
    if (course && !loading) {
      const courseToSave = {
        id: course.id,
        title: course.title,
        category: course.category,
        level: course.level,
        duration: course.duration,
        modules: course.modules,
        description: course.description,
        rating: course.rating,
        instructor: course.instructor,
        students: course.students,
        price: course.price,
        imageUrl: course.imageUrl,
        imageHint: course.imageHint,
      };
      setLastAccessedCourse(courseToSave);
    }
  }, [course, course?.id, loading, setLastAccessedCourse]);

  // Handler functions
  const handleModuleClick = (moduleId: string) => {
    const module = course?.curriculum.find(m => m.id === moduleId);
    if (module && module.lessons.length > 0) {
      setCurrentModuleId(moduleId);
      setCurrentLessonId(module.lessons[0].id!);
    }
  };

  const handleLessonClick = (lessonId: string) => {
    setCurrentLessonId(lessonId);

    // Track lesson start
    if (course) {
      const lesson = course.curriculum
        .flatMap(module => module.lessons)
        .find(l => l.id === lessonId);

      if (lesson) {
        // Check for time-based achievements
        const hour = new Date().getHours();
        if (hour >= 22 || hour <= 6) {
          gamification.triggerTimeBasedAchievement('late_study');
        } else if (hour <= 7) {
          gamification.triggerTimeBasedAchievement('early_study');
        }
      }
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePreviousLesson = () => {
    if (!course || !currentModuleId || !currentLessonId) return;

    const currentModule = course.curriculum.find(m => m.id === currentModuleId);
    if (!currentModule) return;

    const currentLessonIndex = currentModule.lessons.findIndex(
      l => l.id === currentLessonId
    );

    if (currentLessonIndex > 0) {
      // Previous lesson in same module
      setCurrentLessonId(currentModule.lessons[currentLessonIndex - 1].id!);
    } else {
      // Go to previous module's last lesson
      const currentModuleIndex = course.curriculum.findIndex(
        m => m.id === currentModuleId
      );
      if (currentModuleIndex > 0) {
        const previousModule = course.curriculum[currentModuleIndex - 1];
        setCurrentModuleId(previousModule.id!);
        setCurrentLessonId(
          previousModule.lessons[previousModule.lessons.length - 1].id!
        );
      }
    }
  };

  const handleNextLesson = () => {
    if (!course || !currentModuleId || !currentLessonId) return;

    // Mark current lesson as completed before moving to next
    handleLessonComplete(currentLessonId);

    const currentModule = course.curriculum.find(m => m.id === currentModuleId);
    if (!currentModule) return;

    const currentLessonIndex = currentModule.lessons.findIndex(
      l => l.id === currentLessonId
    );

    if (currentLessonIndex < currentModule.lessons.length - 1) {
      // Next lesson in same module
      setCurrentLessonId(currentModule.lessons[currentLessonIndex + 1].id!);
    } else {
      // Check if module is completed
      const allLessonsCompleted = currentModule.lessons.every(lesson =>
        gamification.userProgress.lessonsCompleted.includes(lesson.id || '')
      );

      if (allLessonsCompleted) {
        showCelebration('module', currentModule.title, {
          subtitle: `Parabéns! Você dominou o módulo "${currentModule.title}"`,
        });
      }

      // Go to next module's first lesson
      const currentModuleIndex = course.curriculum.findIndex(
        m => m.id === currentModuleId
      );
      if (currentModuleIndex < course.curriculum.length - 1) {
        const nextModule = course.curriculum[currentModuleIndex + 1];
        setCurrentModuleId(nextModule.id!);
        setCurrentLessonId(nextModule.lessons[0].id!);
      } else {
        // Course completed!
        const totalLessons = course.curriculum.reduce(
          (total, module) => total + module.lessons.length,
          0
        );
        if (gamification.userProgress.lessonsCompleted.length >= totalLessons) {
          showCelebration('course', course.title, {
            subtitle: `Parabéns, Dr(a)! Você concluiu "${course.title}" com sucesso!`,
            icon: '👑',
          });
        }
      }
    }
  };

  // New handler for lesson completion
  const handleLessonComplete = (lessonId: string) => {
    if (!gamification.userProgress.lessonsCompleted.includes(lessonId)) {
      gamification.markLessonCompleted(lessonId);

      const lesson = course?.curriculum
        .flatMap(module => module.lessons)
        .find(l => l.id === lessonId);

      if (lesson) {
        // Trigger completion animation
        animationControls.playCompletionAnimation('lesson', lesson.title);

        // Show celebration
        showCelebration('lesson', lesson.title, {
          subtitle: 'Mais um passo em sua jornada médica!',
          icon: '✅',
        });

        // Show smart toast
        animationControls.showToast(
          `🎉 Aula "${lesson.title}" concluída!`,
          'achievement',
          {
            description: 'Continue assim, você está evoluindo!',
            duration: 5000,
          }
        );
      }
    }
  };

  // Handler for watch time tracking
  const handleWatchTimeUpdate = (minutes: number) => {
    gamification.updateWatchTime(minutes);
  };

  // Handler for playback speed changes
  const handleSpeedChange = (speed: number) => {
    gamification.triggerSpeedAchievement(speed);
  };

  // Handler for note taking
  const handleNoteTaken = () => {
    gamification.addNote();
  };

  // Handler for bookmark creation
  const handleBookmarkCreated = () => {
    gamification.addBookmark();
  };

  // Mobile-specific handlers
  const handleOrientationChange = (
    newOrientation: 'portrait' | 'landscape'
  ) => {
    setOrientation(newOrientation);
  };

  const handleSeek = (seconds: number) => {
    // Video seek logic - this will be handled by the video player
    console.log('Seeking:', seconds);
  };

  const handleVolumeChange = (volume: number) => {
    // Volume change logic
    console.log('Volume changed:', volume);
  };

  const handleLessonSelect = (lessonId: string) => {
    setCurrentLessonId(lessonId);
  };

  const getCurrentModule = () => {
    return course?.curriculum.find(m => m.id === currentModuleId);
  };

  const hasNextLesson = () => {
    if (!course || !currentModuleId || !currentLessonId) return false;

    const currentModule = getCurrentModule();
    if (!currentModule) return false;

    const currentLessonIndex = currentModule.lessons.findIndex(
      l => l.id === currentLessonId
    );
    const currentModuleIndex = course.curriculum.findIndex(
      m => m.id === currentModuleId
    );

    // Check if there's a next lesson in current module or next module
    return (
      currentLessonIndex < currentModule.lessons.length - 1 ||
      currentModuleIndex < course.curriculum.length - 1
    );
  };

  const hasPreviousLesson = () => {
    if (!course || !currentModuleId || !currentLessonId) return false;

    const currentModule = getCurrentModule();
    if (!currentModule) return false;

    const currentLessonIndex = currentModule.lessons.findIndex(
      l => l.id === currentLessonId
    );
    const currentModuleIndex = course.curriculum.findIndex(
      m => m.id === currentModuleId
    );

    // Check if there's a previous lesson in current module or previous module
    return currentLessonIndex > 0 || currentModuleIndex > 0;
  };

  if (loading) {
    return (
      <motion.div
        className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mx-4 max-w-md space-y-8 text-center">
          {/* Enhanced loading with skeleton */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ShimmerSkeleton
              className="space-y-6"
              lines={4}
              showImage={true}
              showAvatar={true}
            />
          </motion.div>

          <motion.p
            className="text-lg text-slate-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Preparando sua experiência de aprendizado...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-white">
            Curso não encontrado
          </h2>
          <p className="mb-4 text-slate-400">
            O curso solicitado não foi encontrado.
          </p>
        </div>
      </div>
    );
  }

  const currentModule = getCurrentModule();
  const currentLessonIndex =
    currentModule?.lessons.findIndex(l => l.id === currentLessonId) ?? -1;
  const lessonNumber =
    currentLessonIndex >= 0 ? `AULA ${currentLessonIndex + 1}` : '';

  // Render mobile layout for mobile devices
  if (isMobile || isTouchDevice) {
    return (
      <SmartToastProvider position="top-right">
        <MobileLayout
          currentLesson={currentLesson!}
          course={course}
          onLessonChange={direction =>
            direction === 'next' ? handleNextLesson() : handlePreviousLesson()
          }
          onLessonSelect={handleLessonSelect}
          onPlayPause={handlePlayPause}
          isVideoPlaying={isPlaying}
          hasNextLesson={hasNextLesson()}
          hasPreviousLesson={hasPreviousLesson()}
          completedLessons={gamification.userProgress.lessonsCompleted}
          progress={gamification.progress.completion}
        >
          {/* Mobile Video Player */}
          <div className="px-4 pb-4 pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLessonId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <MobileVideoPlayer
                  videoUrl={
                    currentLesson?.videoUrl || '/videos/Live-Roberio.mp4'
                  }
                  title={currentLesson?.title || course.title}
                  chapters={currentLesson?.chapters || []}
                  onOrientationChange={handleOrientationChange}
                  onSeek={handleSeek}
                  onVolumeChange={handleVolumeChange}
                  onSpeedChange={handleSpeedChange}
                  onPlayPause={handlePlayPause}
                  onLessonChange={direction =>
                    direction === 'next'
                      ? handleNextLesson()
                      : handlePreviousLesson()
                  }
                  gesturesEnabled={true}
                  autoRotate={true}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile Lesson Details */}
          <div className="px-4 pb-6">
            <AnimatePresence mode="wait">
              {currentLesson && currentModule && (
                <motion.div
                  key={`${currentModuleId}-${currentLessonId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <LessonDetails
                    lesson={currentLesson}
                    moduleTitle={currentModule.title}
                    lessonNumber={lessonNumber}
                    onPreviousLesson={handlePreviousLesson}
                    onNextLesson={handleNextLesson}
                    hasNextLesson={hasNextLesson()}
                    hasPreviousLesson={hasPreviousLesson()}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Celebration Component */}
          {CelebrationComponent}
        </MobileLayout>
      </SmartToastProvider>
    );
  }

  // Desktop layout
  return (
    <SmartToastProvider position="top-right">
      <motion.div
        className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
        {...courseAnimations.pageTransition}
      >
        {/* Fixed Course Header */}
        <CourseHeader
          course={course}
          progress={gamification.progress}
          streak={gamification.streak}
          level={gamification.userProgress.level}
          xp={gamification.userProgress.totalXP}
        />

        {/* Module Navigation */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <ModuleNavigation
            modules={course.curriculum}
            currentModuleId={currentModuleId}
            onModuleClick={handleModuleClick}
            completedLessons={gamification.userProgress.lessonsCompleted}
          />
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-4">
            {/* Left Column - Video & Lesson Details (75% width) */}
            <div className="space-y-6 md:space-y-8 lg:col-span-3">
              {/* Enhanced Video Player */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLessonId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <EnhancedVideoPlayer
                    videoUrl={
                      currentLesson?.videoUrl || '/videos/Live-Roberio.mp4'
                    }
                    title={currentLesson?.title || course.title}
                    chapters={currentLesson?.chapters || []}
                    onPlayPause={handlePlayPause}
                    onNextLesson={
                      hasNextLesson() ? handleNextLesson : undefined
                    }
                    onPreviousLesson={
                      hasPreviousLesson() ? handlePreviousLesson : undefined
                    }
                    userId={userId}
                    courseId={course.id.toString()}
                    lessonId={currentLessonId}
                    courseName={course.title}
                    lessonName={currentLesson?.title}
                    onWatchTimeUpdate={handleWatchTimeUpdate}
                    onSpeedChange={handleSpeedChange}
                    onNoteTaken={handleNoteTaken}
                    onBookmarkCreated={handleBookmarkCreated}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Lesson Details */}
              <AnimatePresence mode="wait">
                {currentLesson && currentModule && (
                  <motion.div
                    key={`${currentModuleId}-${currentLessonId}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <LessonDetails
                      lesson={currentLesson}
                      moduleTitle={currentModule.title}
                      lessonNumber={lessonNumber}
                      onPreviousLesson={handlePreviousLesson}
                      onNextLesson={handleNextLesson}
                      hasNextLesson={hasNextLesson()}
                      hasPreviousLesson={hasPreviousLesson()}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column - Lesson Sidebar (25% width) */}
            <motion.div
              className="space-y-6 lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {/* Lesson Sidebar */}
              {currentModule && (
                <LessonSidebar
                  lessons={currentModule.lessons}
                  currentLessonId={currentLessonId}
                  moduleTitle={currentModule.title}
                  onLessonClick={handleLessonClick}
                  completedLessons={gamification.userProgress.lessonsCompleted}
                  progress={gamification.progress}
                />
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Celebration Component */}
        {CelebrationComponent}
      </motion.div>
    </SmartToastProvider>
  );
}
