'use client';

import { motion, useAnimation } from 'motion/react';
import { useEffect, useState } from 'react';
import { CheckCircle, Trophy, Crown, Star, Zap, BookOpen } from 'lucide-react';
import { courseAnimations, ANIMATION_CONFIG } from '@/lib/animations/course-animations';
import { cn } from '@/lib/utils';

interface CompletionAnimationsProps {
  type: 'lesson' | 'module' | 'course' | 'chapter' | 'achievement';
  isVisible: boolean;
  title?: string;
  subtitle?: string;
  onComplete?: () => void;
  className?: string;
}

export function CompletionAnimations({
  type,
  isVisible,
  title,
  subtitle,
  onComplete,
  className
}: CompletionAnimationsProps) {
  const controls = useAnimation();
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowParticles(true);
      controls.start('animate');
      
      // Auto hide after duration
      const duration = type === 'course' ? 4000 : 2500;
      const timer = setTimeout(() => {
        controls.start('exit');
        setShowParticles(false);
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, type, controls, onComplete]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'lesson':
        return <CheckCircle className="w-12 h-12 text-green-400" />;
      case 'module':
        return <BookOpen className="w-12 h-12 text-blue-400" />;
      case 'course':
        return <Crown className="w-12 h-12 text-yellow-400" />;
      case 'chapter':
        return <Star className="w-12 h-12 text-purple-400" />;
      case 'achievement':
        return <Trophy className="w-12 h-12 text-orange-400" />;
      default:
        return <CheckCircle className="w-12 h-12 text-green-400" />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    
    switch (type) {
      case 'lesson':
        return 'Aula Concluída!';
      case 'module':
        return 'Módulo Dominado!';
      case 'course':
        return 'Curso Completo!';
      case 'chapter':
        return 'Capítulo Finalizado!';
      case 'achievement':
        return 'Conquista Desbloqueada!';
      default:
        return 'Parabéns!';
    }
  };

  const getSubtitle = () => {
    if (subtitle) return subtitle;
    
    switch (type) {
      case 'lesson':
        return 'Continue sua jornada de aprendizado!';
      case 'module':
        return 'Você está evoluindo rapidamente!';
      case 'course':
        return 'Parabéns pela dedicação e persistência!';
      case 'chapter':
        return 'Mais conhecimento adquirido!';
      case 'achievement':
        return 'Você desbloqueou uma nova conquista!';
      default:
        return 'Continue assim!';
    }
  };

  return (
    <motion.div
      initial="initial"
      animate={controls}
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      }}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-black/50 backdrop-blur-sm',
        className
      )}
    >
      {/* Particle Effects */}
      {showParticles && <ParticleEffect type={type} />}
      
      {/* Main Animation Container */}
      <motion.div
        variants={{
          initial: { scale: 0, rotate: -180 },
          animate: { scale: 1, rotate: 0 },
          exit: { scale: 0, rotate: 180 }
        }}
        transition={ANIMATION_CONFIG.easing.spring}
        className="relative"
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 0 rgba(59, 130, 246, 0)',
              '0 0 40px rgba(59, 130, 246, 0.4)',
              '0 0 0 rgba(59, 130, 246, 0)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Content Card */}
        <motion.div
          className="bg-slate-900/90 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center max-w-md mx-4"
          variants={{
            initial: { y: 50, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            exit: { y: -50, opacity: 0 }
          }}
          transition={{ delay: 0.2 }}
        >
          {/* Icon with Animation */}
          <motion.div
            className="flex items-center justify-center mb-6"
            variants={courseAnimations.achievementPop}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {getIcon()}
            </motion.div>
          </motion.div>
          
          {/* Title */}
          <motion.h2
            className="text-2xl font-bold text-white mb-2"
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 }
            }}
            transition={{ delay: 0.6 }}
          >
            {getTitle()}
          </motion.h2>
          
          {/* Subtitle */}
          <motion.p
            className="text-slate-300 text-sm"
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 }
            }}
            transition={{ delay: 0.8 }}
          >
            {getSubtitle()}
          </motion.p>
          
          {/* Special effects for course completion */}
          {type === 'course' && (
            <motion.div
              className="mt-6 flex items-center justify-center gap-2"
              variants={{
                initial: { opacity: 0, scale: 0 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0 }
              }}
              transition={{ delay: 1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-5 h-5 text-yellow-400" />
              </motion.div>
              <span className="text-yellow-400 font-medium">Certificado Disponível</span>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-5 h-5 text-yellow-400" />
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

interface ParticleEffectProps {
  type: 'lesson' | 'module' | 'course' | 'chapter' | 'achievement';
}

function ParticleEffect({ type }: ParticleEffectProps) {
  const particleCount = type === 'course' ? 20 : type === 'module' ? 15 : 10;
  const colors = {
    lesson: ['#10b981', '#34d399', '#6ee7b7'],
    module: ['#3b82f6', '#60a5fa', '#93c5fd'],
    course: ['#f59e0b', '#fbbf24', '#fcd34d'],
    chapter: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
    achievement: ['#f97316', '#fb923c', '#fdba74']
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: colors[type][i % colors[type].length],
            left: `${20 + Math.random() * 60}%`,
            top: `${30 + Math.random() * 40}%`,
          }}
          variants={courseAnimations.confettiParticle}
          initial="initial"
          animate="animate"
          transition={{ delay: Math.random() * 0.5 }}
        />
      ))}
    </div>
  );
}

interface CheckmarkDrawProps {
  isVisible: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function CheckmarkDraw({ 
  isVisible, 
  size = 'md', 
  color = '#10b981',
  className 
}: CheckmarkDrawProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const strokeWidth = size === 'sm' ? 2 : size === 'md' ? 3 : 4;

  return (
    <motion.div
      className={cn('flex items-center justify-center', className)}
      initial={{ scale: 0 }}
      animate={{ scale: isVisible ? 1 : 0 }}
      transition={{ type: "spring", damping: 15, stiffness: 300 }}
    >
      <svg
        className={sizeClasses[size]}
        viewBox="0 0 24 24"
        fill="none"
      >
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d="M8 12l3 3 5-5"
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isVisible ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
      </svg>
    </motion.div>
  );
}

interface ProgressRingProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  thickness?: number;
  color?: string;
  backgroundColor?: string;
  showText?: boolean;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 'md',
  thickness = 4,
  color = '#3b82f6',
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  showText = true,
  className
}: ProgressRingProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const radius = size === 'sm' ? 16 : size === 'md' ? 24 : 36;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 72 72">
        {/* Background circle */}
        <circle
          cx="36"
          cy="36"
          r={radius}
          stroke={backgroundColor}
          strokeWidth={thickness}
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="36"
          cy="36"
          r={radius}
          stroke={color}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ 
            strokeDashoffset: circumference - (progress / 100) * circumference 
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      
      {showText && (
        <motion.div
          className={cn(
            'absolute inset-0 flex items-center justify-center font-semibold text-white',
            textSizeClasses[size]
          )}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {Math.round(progress)}%
        </motion.div>
      )}
    </div>
  );
}