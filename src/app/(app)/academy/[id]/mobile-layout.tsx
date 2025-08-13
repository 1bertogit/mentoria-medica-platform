'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AcademyCourse, Lesson } from '@/lib/mock-data/academy';
import { MobileBottomNav } from '@/components/academy/mobile-bottom-nav';
import { MobileBottomSheet, useBottomSheet } from '@/components/academy/mobile-bottom-sheet';
import { useBreakpoint, useSafeArea, useOrientation } from '@/hooks/use-media-query';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { 
  BookOpen, 
  TrendingUp, 
  Settings, 
  PlayCircle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MobileLayoutProps {
  children: React.ReactNode;
  currentLesson: Lesson;
  course: AcademyCourse;
  onLessonChange: (direction: 'prev' | 'next') => void;
  onLessonSelect: (lessonId: string) => void;
  onPlayPause: () => void;
  isVideoPlaying: boolean;
  hasNextLesson: boolean;
  hasPreviousLesson: boolean;
  completedLessons: string[];
  progress: number;
  className?: string;
}

interface LessonListItemProps {
  lesson: Lesson;
  isActive: boolean;
  isCompleted: boolean;
  moduleTitle: string;
  onSelect: () => void;
}

function LessonListItem({ lesson, isActive, isCompleted, moduleTitle, onSelect }: LessonListItemProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`
        p-4 border rounded-xl cursor-pointer transition-all duration-200
        ${isActive 
          ? 'bg-blue-600/20 border-blue-500/50 shadow-lg' 
          : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70'
        }
      `}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
          ${isCompleted 
            ? 'bg-green-600 text-white' 
            : isActive 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-700 text-slate-300'
          }
        `}>
          {isCompleted ? (
            <CheckCircle className="h-4 w-4" />
          ) : isActive ? (
            <PlayCircle className="h-4 w-4" />
          ) : (
            <Clock className="h-4 w-4" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
              {moduleTitle}
            </p>
            {lesson.duration && (
              <Badge variant="secondary" className="text-xs">
                {lesson.duration}
              </Badge>
            )}
          </div>
          
          <h3 className={`
            font-semibold leading-tight mb-1
            ${isActive ? 'text-blue-400' : 'text-white'}
          `}>
            {lesson.title}
          </h3>
          
          {lesson.description && (
            <p className="text-sm text-slate-400 line-clamp-2">
              {lesson.description}
            </p>
          )}

          {/* Progress - removed as lesson.progress doesn't exist in type */}
        </div>

        {/* Rating - removed as lesson.rating doesn't exist in type */}
      </div>
    </motion.div>
  );
}

export function MobileLayout({
  children,
  currentLesson,
  course,
  onLessonChange,
  onLessonSelect,
  onPlayPause,
  isVideoPlaying,
  hasNextLesson,
  hasPreviousLesson,
  completedLessons,
  progress,
  className = ''
}: MobileLayoutProps) {
  const { isMobile, isTouchDevice } = useBreakpoint();
  const safeArea = useSafeArea();
  const orientation = useOrientation();
  
  const [activeSheet, setActiveSheet] = useState<'progress' | 'notes' | 'settings' | 'lessons' | null>(null);
  const [isNavigationVisible, setIsNavigationVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Bottom sheet hooks
  const progressSheet = useBottomSheet();
  const notesSheet = useBottomSheet();
  const settingsSheet = useBottomSheet();
  const lessonsSheet = useBottomSheet();

  // Auto-hide navigation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavigationVisible(false);
      } else {
        setIsNavigationVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle sheet toggles
  const handleProgressToggle = useCallback(() => {
    if (activeSheet === 'progress') {
      progressSheet.close();
      setActiveSheet(null);
    } else {
      // Close other sheets
      notesSheet.close();
      settingsSheet.close();
      lessonsSheet.close();
      
      progressSheet.open();
      setActiveSheet('progress');
    }
  }, [activeSheet, progressSheet, notesSheet, settingsSheet, lessonsSheet]);

  const handleNotesToggle = useCallback(() => {
    if (activeSheet === 'notes') {
      notesSheet.close();
      setActiveSheet(null);
    } else {
      progressSheet.close();
      settingsSheet.close();
      lessonsSheet.close();
      
      notesSheet.open();
      setActiveSheet('notes');
    }
  }, [activeSheet, notesSheet, progressSheet, settingsSheet, lessonsSheet]);

  const handleSettingsToggle = useCallback(() => {
    if (activeSheet === 'settings') {
      settingsSheet.close();
      setActiveSheet(null);
    } else {
      progressSheet.close();
      notesSheet.close();
      lessonsSheet.close();
      
      settingsSheet.open();
      setActiveSheet('settings');
    }
  }, [activeSheet, settingsSheet, progressSheet, notesSheet, lessonsSheet]);

  const handleLessonsToggle = useCallback(() => {
    if (activeSheet === 'lessons') {
      lessonsSheet.close();
      setActiveSheet(null);
    } else {
      progressSheet.close();
      notesSheet.close();
      settingsSheet.close();
      
      lessonsSheet.open();
      setActiveSheet('lessons');
    }
  }, [activeSheet, lessonsSheet, progressSheet, notesSheet, settingsSheet]);

  // Close all sheets
  const closeAllSheets = useCallback(() => {
    progressSheet.close();
    notesSheet.close();
    settingsSheet.close();
    lessonsSheet.close();
    setActiveSheet(null);
  }, [progressSheet, notesSheet, settingsSheet, lessonsSheet]);

  // Handle lesson selection
  const handleLessonSelect = useCallback((lessonId: string) => {
    onLessonSelect(lessonId);
    closeAllSheets();
  }, [onLessonSelect, closeAllSheets]);

  // Don't apply mobile layout on desktop
  if (!isMobile && !isTouchDevice) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div 
      className={`min-h-screen bg-slate-950 ${className}`}
      style={{ paddingBottom: `${safeArea.bottom + 80}px` }}
    >
      {/* Main Content */}
      <div className="relative">
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentLesson={currentLesson}
        onLessonChange={onLessonChange}
        onProgressToggle={handleProgressToggle}
        onNotesToggle={handleNotesToggle}
        onSettingsToggle={handleSettingsToggle}
        onPlayPause={onPlayPause}
        isVideoPlaying={isVideoPlaying}
        hasNextLesson={hasNextLesson}
        hasPreviousLesson={hasPreviousLesson}
      />

      {/* Progress Bottom Sheet */}
      <MobileBottomSheet
        isOpen={progressSheet.isOpen}
        onClose={() => {
          progressSheet.close();
          setActiveSheet(null);
        }}
        title="Progresso do Curso"
        snapPoints={[40, 70, 90]}
      >
        <div className="p-6 space-y-6">
          {/* Overall Progress */}
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Progresso Geral</h3>
              <span className="text-blue-400 font-bold text-lg">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-slate-400 mt-2">
              <span>{completedLessons.length} aulas concluídas</span>
              <span>{course.curriculum.reduce((total, module) => total + module.lessons.length, 0)} total</span>
            </div>
          </div>

          {/* Module Progress */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Progresso por Módulo</h3>
            {course.curriculum.map((module) => {
              const moduleCompletedLessons = module.lessons.filter(lesson => 
                completedLessons.includes(lesson.id || '')
              ).length;
              const moduleProgress = (moduleCompletedLessons / module.lessons.length) * 100;
              
              return (
                <div key={module.id} className="bg-slate-800/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{module.title}</span>
                    <span className="text-sm text-slate-400">{moduleCompletedLessons}/{module.lessons.length}</span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${moduleProgress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleLessonsToggle}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Ver Todas as Aulas
            </Button>
          </div>
        </div>
      </MobileBottomSheet>

      {/* Notes Bottom Sheet */}
      <MobileBottomSheet
        isOpen={notesSheet.isOpen}
        onClose={() => {
          notesSheet.close();
          setActiveSheet(null);
        }}
        title="Notas da Aula"
        snapPoints={[50, 75, 95]}
      >
        <div className="p-6">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Notas não implementadas</h3>
            <p className="text-slate-400">
              A funcionalidade de notas será implementada em uma versão futura.
            </p>
          </div>
        </div>
      </MobileBottomSheet>

      {/* Settings Bottom Sheet */}
      <MobileBottomSheet
        isOpen={settingsSheet.isOpen}
        onClose={() => {
          settingsSheet.close();
          setActiveSheet(null);
        }}
        title="Configurações de Vídeo"
        snapPoints={[60, 85]}
      >
        <div className="p-6">
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Configurações</h3>
            <p className="text-slate-400">
              Configurações de vídeo serão implementadas em breve.
            </p>
          </div>
        </div>
      </MobileBottomSheet>

      {/* Lessons Bottom Sheet */}
      <MobileBottomSheet
        isOpen={lessonsSheet.isOpen}
        onClose={() => {
          lessonsSheet.close();
          setActiveSheet(null);
        }}
        title="Lista de Aulas"
        snapPoints={[70, 90]}
        initialSnap={1}
      >
        <div className="p-4 space-y-4">
          {course.curriculum.map((module) => (
            <div key={module.id} className="space-y-3">
              <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm py-2 px-2 rounded-lg">
                <h3 className="text-white font-semibold text-lg">{module.title}</h3>
                <p className="text-slate-400 text-sm">{module.lessons.length} aulas</p>
              </div>
              
              <div className="space-y-2">
                {module.lessons.map((lesson) => (
                  <LessonListItem
                    key={lesson.id}
                    lesson={lesson}
                    isActive={lesson.id === currentLesson.id}
                    isCompleted={completedLessons.includes(lesson.id || '')}
                    moduleTitle={module.title}
                    onSelect={() => handleLessonSelect(lesson.id || '')}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </MobileBottomSheet>
    </div>
  );
}