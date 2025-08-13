'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { animationPerformance } from '@/lib/animations/course-animations';

export type CompletionType = 'lesson' | 'module' | 'course' | 'chapter' | 'achievement';
export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'achievement';

interface CompletionAnimation {
  id: string;
  type: CompletionType;
  isPlaying: boolean;
  startTime: number;
}

interface UseAnimationControlsReturn {
  playCompletionAnimation: (type: CompletionType, title?: string) => void;
  triggerHoverEffect: (element: string) => void;
  showToast: (message: string, type: ToastType, options?: ToastOptions) => void;
  isAnimating: boolean;
  reducedMotion: boolean;
  pauseAnimations: () => void;
  resumeAnimations: () => void;
  cleanupAnimations: () => void;
  getActiveAnimationCount: () => number;
}

interface ToastOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: string;
  persistent?: boolean;
}

export function useAnimationControls(): UseAnimationControlsReturn {
  const [isAnimating, setIsAnimating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [animationsPaused, setAnimationsPaused] = useState(false);
  
  const activeAnimations = useRef<Map<string, CompletionAnimation>>(new Map());
  const cleanupTimer = useRef<NodeJS.Timeout>();

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handler);
      
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  // Setup animation cleanup interval
  useEffect(() => {
    cleanupTimer.current = setInterval(() => {
      const now = Date.now();
      const cutoff = now - 30000; // 30 seconds
      
      activeAnimations.current.forEach((animation, id) => {
        if (animation.startTime < cutoff && !animation.isPlaying) {
          activeAnimations.current.delete(id);
          animationPerformance.endAnimation(id);
        }
      });
    }, 10000); // Check every 10 seconds

    return () => {
      if (cleanupTimer.current) {
        clearInterval(cleanupTimer.current);
      }
    };
  }, []);

  // Update overall animation state
  useEffect(() => {
    const hasActiveAnimations = activeAnimations.current.size > 0 || 
                                animationPerformance.getActiveCount() > 0;
    setIsAnimating(hasActiveAnimations);
  }, []);

  const playCompletionAnimation = useCallback((type: CompletionType, title?: string) => {
    if (animationsPaused || reducedMotion) return;

    const animationId = `${type}-${Date.now()}`;
    const animation: CompletionAnimation = {
      id: animationId,
      type,
      isPlaying: true,
      startTime: Date.now()
    };

    activeAnimations.current.set(animationId, animation);
    animationPerformance.startAnimation(animationId);

    // Play completion sound (if available)
    if ('audio' in window) {
      try {
        const audio = new Audio('/sounds/completion.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Silently fail if audio can't be played
        });
      } catch (error) {
        // Silently fail if audio creation fails
      }
    }

    // Show celebration toast
    const celebrationMessages = {
      lesson: '🎉 Aula concluída!',
      module: '🏆 Módulo dominado!',
      course: '👑 Curso completo!',
      chapter: '📚 Capítulo finalizado!',
      achievement: '🌟 Conquista desbloqueada!'
    };

    showToast(
      title || celebrationMessages[type],
      'achievement',
      {
        duration: type === 'course' ? 8000 : 5000,
        description: type === 'course' ? 'Parabéns pela dedicação!' : undefined,
        icon: type === 'course' ? '👑' : '🎉'
      }
    );

    // Mark animation as complete after duration
    setTimeout(() => {
      animation.isPlaying = false;
      
      // Remove from active animations after additional delay
      setTimeout(() => {
        activeAnimations.current.delete(animationId);
        animationPerformance.endAnimation(animationId);
      }, 2000);
    }, type === 'course' ? 3000 : 1500);
  }, [animationsPaused, reducedMotion]);

  const triggerHoverEffect = useCallback((element: string) => {
    if (animationsPaused || reducedMotion) return;

    const animationId = `hover-${element}-${Date.now()}`;
    animationPerformance.startAnimation(animationId);

    // Cleanup hover animation quickly
    setTimeout(() => {
      animationPerformance.endAnimation(animationId);
    }, 300);
  }, [animationsPaused, reducedMotion]);

  const showToast = useCallback((
    message: string, 
    type: ToastType, 
    options: ToastOptions = {}
  ) => {
    const {
      duration = 4000,
      description,
      action,
      icon,
      persistent = false
    } = options;

    const toastOptions: any = {
      duration: persistent ? Infinity : duration,
      description,
      action: action ? {
        label: action.label,
        onClick: action.onClick
      } : undefined
    };

    // Add contextual styling and icons
    switch (type) {
      case 'success':
        toast.success(message, {
          ...toastOptions,
          icon: icon || '✅'
        });
        break;
      case 'error':
        toast.error(message, {
          ...toastOptions,
          icon: icon || '❌'
        });
        break;
      case 'warning':
        toast.warning(message, {
          ...toastOptions,
          icon: icon || '⚠️'
        });
        break;
      case 'info':
        toast.info(message, {
          ...toastOptions,
          icon: icon || 'ℹ️'
        });
        break;
      case 'achievement':
        toast(message, {
          ...toastOptions,
          icon: icon || '🏆',
          className: 'achievement-toast',
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            color: 'white'
          }
        });
        break;
      default:
        toast(message, toastOptions);
    }
  }, []);

  const pauseAnimations = useCallback(() => {
    setAnimationsPaused(true);
    
    // Pause all active CSS animations
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--animation-play-state', 'paused');
    }
  }, []);

  const resumeAnimations = useCallback(() => {
    setAnimationsPaused(false);
    
    // Resume all CSS animations
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--animation-play-state', 'running');
    }
  }, []);

  const cleanupAnimations = useCallback(() => {
    activeAnimations.current.clear();
    
    // Force cleanup of performance monitor
    animationPerformance.activeAnimations.clear();
    
    setIsAnimating(false);
  }, []);

  const getActiveAnimationCount = useCallback(() => {
    return activeAnimations.current.size + animationPerformance.getActiveCount();
  }, []);

  return {
    playCompletionAnimation,
    triggerHoverEffect,
    showToast,
    isAnimating,
    reducedMotion,
    pauseAnimations,
    resumeAnimations,
    cleanupAnimations,
    getActiveAnimationCount
  };
}