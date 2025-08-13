'use client';

import { motion, useMotionValue, useTransform } from 'motion/react';
import { useState } from 'react';
import { Play, CheckCircle, Clock, Lock, Star, BookOpen } from 'lucide-react';
import { courseAnimations, ANIMATION_CONFIG } from '@/lib/animations/course-animations';
import { CheckmarkDraw, ProgressRing } from './completion-animations';
import { ShimmerSkeleton } from '@/components/ui/enhanced-loading-states';
import { cn } from '@/lib/utils';
import { Lesson } from '@/lib/mock-data/academy';

interface AnimatedLessonCardProps {
  lesson: Lesson;
  isActive?: boolean;
  isCompleted?: boolean;
  isLocked?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  className?: string;
  showProgress?: boolean;
  progress?: number;
  lessonNumber?: string;
}

export function AnimatedLessonCard({
  lesson,
  isActive = false,
  isCompleted = false,
  isLocked = false,
  isLoading = false,
  onClick,
  onHover,
  className,
  showProgress = false,
  progress = 0,
  lessonNumber
}: AnimatedLessonCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);

  // Motion values for advanced hover effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleClick = () => {
    if (isLocked || isLoading) return;
    
    // Trigger completion animation if completing lesson
    if (!isCompleted && onClick) {
      setShowCompletionAnimation(true);
      setTimeout(() => setShowCompletionAnimation(false), 2000);
    }
    
    onClick?.();
  };

  const getStatusIcon = () => {
    if (isCompleted) {
      return <CheckmarkDraw isVisible={true} size="sm" className="w-5 h-5" />;
    }
    if (isActive) {
      return <Play className="w-4 h-4 text-blue-400" />;
    }
    if (isLocked) {
      return <Lock className="w-4 h-4 text-slate-500" />;
    }
    return <Clock className="w-4 h-4 text-slate-400" />;
  };

  const getStatusText = () => {
    if (isCompleted) return 'Concluída';
    if (isActive) return 'Em andamento';
    if (isLocked) return 'Bloqueada';
    return 'Não iniciada';
  };

  const getStatusColor = () => {
    if (isCompleted) return 'text-green-400';
    if (isActive) return 'text-blue-400';
    if (isLocked) return 'text-slate-500';
    return 'text-slate-400';
  };

  if (isLoading) {
    return (
      <div className={cn('p-4 rounded-lg border border-white/10 bg-slate-900/50', className)}>
        <ShimmerSkeleton lines={3} showAvatar={false} />
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        'group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer',
        'bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm',
        {
          // Active lesson
          'border-blue-400/50 bg-blue-500/10': isActive,
          // Completed lesson
          'border-green-400/30 bg-green-500/5': isCompleted && !isActive,
          // Locked lesson
          'border-slate-700/50 opacity-50 cursor-not-allowed': isLocked,
          // Default lesson
          'border-white/10 hover:border-white/20': !isActive && !isCompleted && !isLocked,
        },
        className
      )}
      variants={courseAnimations.lessonCard}
      initial="rest"
      whileHover={isLocked ? "rest" : "hover"}
      whileTap={isLocked ? "rest" : "tap"}
      onClick={handleClick}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover?.();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        rotateX: isHovered && !isLocked ? rotateX : 0,
        rotateY: isHovered && !isLocked ? rotateY : 0,
        transformStyle: "preserve-3d"
      }}
    >
      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300"
        style={{
          background: isActive 
            ? 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.15), transparent 40%)'
            : isCompleted
            ? 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(34, 197, 94, 0.15), transparent 40%)'
            : 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.1), transparent 40%)'
        }}
        animate={{ opacity: isHovered && !isLocked ? 1 : 0 }}
      />

      {/* Main Content */}
      <div className="relative p-4 space-y-3">
        {/* Header with Lesson Number and Status */}
        <div className="flex items-center justify-between">
          {lessonNumber && (
            <motion.span
              className={cn(
                'text-xs font-medium uppercase tracking-wide',
                isActive ? 'text-blue-400' : 'text-slate-500'
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {lessonNumber}
            </motion.span>
          )}

          {/* Status Icon with Animation */}
          <motion.div
            className="flex items-center justify-center"
            whileHover={{ scale: isLocked ? 1 : 1.1 }}
            whileTap={{ scale: isLocked ? 1 : 0.9 }}
          >
            {getStatusIcon()}
          </motion.div>
        </div>

        {/* Lesson Title */}
        <motion.h3
          className={cn(
            'font-semibold line-clamp-2 transition-colors',
            isActive ? 'text-white' : isLocked ? 'text-slate-500' : 'text-slate-200'
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {lesson.title}
        </motion.h3>

        {/* Lesson Meta Info */}
        <motion.div
          className="flex items-center justify-between text-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3" />
            <span>{lesson.duration}</span>
          </div>

          <div className={cn('flex items-center gap-1 font-medium', getStatusColor())}>
            <span>{getStatusText()}</span>
          </div>
        </motion.div>

        {/* Progress Bar (if applicable) */}
        {showProgress && progress > 0 && (
          <motion.div
            className="space-y-1"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Progresso</span>
              <span className="text-white font-medium">{Math.round(progress)}%</span>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}

        {/* Special Elements for Active Lesson */}
        {isActive && (
          <motion.div
            className="flex items-center gap-2 text-xs text-blue-400"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Play className="w-3 h-3" />
            </motion.div>
            <span>Assistindo agora</span>
          </motion.div>
        )}

        {/* Special Elements for Completed Lesson */}
        {isCompleted && (
          <motion.div
            className="flex items-center gap-2 text-xs text-green-400"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Star className="w-3 h-3" />
            <span>Completada com sucesso</span>
          </motion.div>
        )}
      </div>

      {/* Corner Accent for Completed Lessons */}
      {isCompleted && (
        <motion.div
          className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-green-500"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.6, type: "spring" }}
        >
          <CheckCircle className="absolute -top-[16px] -right-[2px] w-3 h-3 text-white" />
        </motion.div>
      )}

      {/* Touch Ripple Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 0, opacity: 0.5 }}
        whileTap={!isLocked ? { scale: 1, opacity: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
        }}
      />

      {/* Completion Animation Overlay */}
      {showCompletionAnimation && (
        <motion.div
          className="absolute inset-0 bg-green-500/20 rounded-xl flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6 }}
          >
            <CheckCircle className="w-12 h-12 text-green-400" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}