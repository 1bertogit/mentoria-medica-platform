'use client';

import { CheckCircle, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { CurriculumModule } from '@/lib/mock-data/academy';
import { courseAnimations } from '@/lib/animations/course-animations';
import { cn } from '@/lib/utils';

interface ModuleNavigationProps {
  modules: CurriculumModule[];
  currentModuleId?: string;
  onModuleClick?: (moduleId: string) => void;
  completedLessons?: string[];
}

export function ModuleNavigation({ 
  modules, 
  currentModuleId,
  onModuleClick,
  completedLessons = []
}: ModuleNavigationProps) {
  const isModuleCompleted = (module: CurriculumModule) => {
    if (!module.lessons || module.lessons.length === 0) return false;
    return module.lessons.every(lesson => 
      completedLessons.includes(lesson.id || '')
    );
  };

  const getModuleProgress = (module: CurriculumModule) => {
    if (!module.lessons || module.lessons.length === 0) return 0;
    const completed = module.lessons.filter(lesson => 
      completedLessons.includes(lesson.id || '')
    ).length;
    return (completed / module.lessons.length) * 100;
  };

  return (
    <nav className="bg-slate-900/50 border-b border-white/10 px-4 md:px-8 py-0 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
      <motion.div 
        className="flex items-center gap-2 md:gap-4 min-w-max"
        variants={courseAnimations.staggeredList.container}
        initial="initial"
        animate="animate"
      >
        {modules.map((module, index) => {
          const isCompleted = isModuleCompleted(module);
          const progress = getModuleProgress(module);
          const isActive = module.id === currentModuleId;
          const isLocked = module.status === 'locked';
          
          return (
            <motion.div
              key={module.id}
              variants={courseAnimations.staggeredList.item}
              whileHover={isLocked ? {} : courseAnimations.navigationPill.hover}
              whileTap={isLocked ? {} : { scale: 0.95 }}
              onClick={() => {
                if (!isLocked && onModuleClick) {
                  onModuleClick(module.id!);
                }
              }}
              className={cn(
                'relative flex items-center gap-2 md:gap-3 px-3 md:px-6 py-3 md:py-4 border border-transparent rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap flex-shrink-0',
                {
                  // Completed module
                  'border-green-400/30 hover:bg-green-500/10': isCompleted,
                  
                  // Current/active module
                  'bg-blue-500/15 border-blue-400/50': isActive,
                  
                  // Available module
                  'hover:bg-white/5': !isCompleted && !isActive && !isLocked,
                  
                  // Locked module
                  'opacity-40 cursor-not-allowed': isLocked,
                }
              )}
            >
              {/* Module Number/Status with Animation */}
              <motion.div 
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold relative overflow-hidden',
                  {
                    'bg-green-500/20 text-green-400': isCompleted,
                    'bg-blue-500/30 text-blue-400': isActive,
                    'bg-white/10 text-slate-300': !isCompleted && !isActive && !isLocked,
                    'bg-white/5 text-slate-500': isLocked,
                  }
                )}
                animate={isCompleted ? {
                  scale: [1, 1.1, 1],
                  backgroundColor: ['rgba(34, 197, 94, 0.2)', 'rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0.2)']
                } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {/* Progress ring for partial completion */}
                {progress > 0 && progress < 100 && (
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={`${progress} 100`}
                      className="text-blue-400"
                    />
                  </svg>
                )}
                
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </motion.div>
                ) : isLocked ? (
                  <Lock className="h-3 w-3" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>

              {/* Module Info */}
              <div className="flex flex-col min-w-0">
                <motion.span 
                  className={cn(
                    'text-xs md:text-sm font-medium truncate',
                    {
                      'text-white': isActive,
                      'text-slate-300': isCompleted || (!isActive && !isLocked),
                      'text-slate-500': isLocked,
                    }
                  )}
                  animate={isActive ? {
                    color: ['rgb(255, 255, 255)', 'rgb(96, 165, 250)', 'rgb(255, 255, 255)']
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {module.title}
                </motion.span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 hidden md:block">
                    {module.duration}
                  </span>
                  {progress > 0 && progress < 100 && (
                    <span className="text-xs text-blue-400 hidden md:block">
                      {Math.round(progress)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full opacity-0"
                whileHover={{ opacity: isLocked ? 0 : 0.5 }}
                style={{
                  background: isCompleted 
                    ? 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)'
                    : isActive
                    ? 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)'
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </nav>
  );
}