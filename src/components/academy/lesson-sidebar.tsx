'use client';

import { CheckCircle, PlayCircle, Clock, Trophy, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Lesson } from '@/lib/mock-data/academy';
import { ProgressMetrics } from '@/lib/services/gamification-service';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LessonSidebarProps {
  lessons: Lesson[];
  currentLessonId?: string;
  moduleTitle: string;
  onLessonClick?: (lessonId: string) => void;
  completedLessons?: string[];
  progress?: ProgressMetrics;
}

export function LessonSidebar({
  lessons,
  currentLessonId,
  moduleTitle,
  onLessonClick,
  completedLessons = [],
  progress,
}: LessonSidebarProps) {
  const getLessonStatus = (lesson: Lesson) => {
    if (completedLessons.includes(lesson.id || '') || lesson.completed) return 'completed';
    if (lesson.current || lesson.id === currentLessonId) return 'current';
    if (lesson.locked) return 'locked';
    return 'available';
  };

  const completedCount = lessons.filter(lesson => 
    completedLessons.includes(lesson.id || '') || lesson.completed
  ).length;

  const moduleProgress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  const getLessonNumber = (index: number) => {
    return `AULA ${index + 1}`;
  };

  return (
    <aside className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 md:p-6 h-fit sticky top-36 space-y-4">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs md:text-sm font-medium text-slate-400 uppercase tracking-wide">
            Aulas do Módulo
          </h3>
          <Badge variant="secondary" className="bg-white/10 text-slate-400 border-white/20">
            {completedCount}/{lessons.length}
          </Badge>
        </div>

        {/* Module Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Progresso do Módulo</span>
            <span className="text-xs text-white font-medium">
              {Math.round(moduleProgress)}%
            </span>
          </div>
          
          <div className="relative">
            <Progress value={moduleProgress} className="h-2 bg-white/10" />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${moduleProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
            />
          </div>
          
          {moduleProgress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-1 text-green-400 text-xs mt-2"
            >
              <Trophy className="h-3 w-3" />
              <span>Módulo Concluído!</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 pr-2">
        {lessons.map((lesson, index) => {
          const status = getLessonStatus(lesson);
          const isCurrent = status === 'current';
          const isCompleted = status === 'completed';
          const isLocked = status === 'locked';

          return (
            <motion.div
              key={lesson.id}
              onClick={() => {
                if (!isLocked && onLessonClick) {
                  onLessonClick(lesson.id!);
                }
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: isLocked ? 1 : 1.02 }}
              whileTap={{ scale: isLocked ? 1 : 0.98 }}
              className={cn(
                'p-3 md:p-4 rounded-lg border transition-all duration-200 cursor-pointer group relative overflow-hidden',
                {
                  // Current lesson
                  'bg-blue-500/20 border-blue-400/50 shadow-lg shadow-blue-500/25': isCurrent,
                  
                  // Completed lesson
                  'bg-green-500/10 border-green-400/30 hover:bg-green-500/20': isCompleted,
                  
                  // Available lesson
                  'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20': !isCurrent && !isCompleted && !isLocked,
                  
                  // Locked lesson
                  'bg-slate-800/30 border-slate-700/50 opacity-50 cursor-not-allowed': isLocked,
                }
              )}
            >
              {/* Lesson Header */}
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  'text-xs font-medium',
                  {
                    'text-blue-400': isCurrent,
                    'text-slate-500': !isCurrent,
                  }
                )}>
                  {getLessonNumber(index)}
                </span>

                {/* Status Icon with Animation */}
                <motion.div 
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                    {
                      'bg-green-500 border-green-500': isCompleted,
                      'bg-blue-500 border-blue-500': isCurrent,
                      'border-white/20': !isCompleted && !isCurrent,
                    }
                  )}
                  initial={false}
                  animate={{ 
                    scale: isCompleted ? [1, 1.2, 1] : 1,
                    backgroundColor: isCompleted ? ['#10b981', '#22c55e', '#10b981'] : undefined
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                  {isCurrent && !isCompleted && (
                    <PlayCircle className="h-3 w-3 text-white" />
                  )}
                  {isLocked && (
                    <Clock className="h-3 w-3 text-slate-400" />
                  )}
                </motion.div>
              </div>

              {/* Lesson Title */}
              <h4 className={cn(
                'text-xs md:text-sm font-medium mb-1 line-clamp-2',
                {
                  'text-white': isCurrent,
                  'text-slate-300': !isCurrent && !isLocked,
                  'text-slate-500': isLocked,
                }
              )}>
                {lesson.title}
              </h4>

              {/* Lesson Duration & Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {lesson.duration}
                  {isCurrent && ' • Assistindo'}
                </span>

                {/* Status Text */}
                <div className="flex items-center gap-1">
                  {isCompleted ? (
                    <span className="text-green-400 font-medium">Concluída</span>
                  ) : isCurrent ? (
                    <>
                      <PlayCircle className="h-3 w-3 text-blue-400" />
                      <span className="text-blue-400 font-medium">Em andamento</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span className="text-slate-500">Não iniciada</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </aside>
  );
}