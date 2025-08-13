/**
 * Framer Motion animation presets for Academy components
 * Optimized for 60fps performance with GPU acceleration
 */

import { MotionProps } from 'framer-motion';

export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.2, // Quick feedback
    normal: 0.3, // Standard interactions
    slow: 0.6, // Page transitions
    celebration: 1.2, // Completion animations
  },
  easing: {
    standard: 'easeOut',
    bounce: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
    smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
    spring: { type: 'spring', damping: 15, stiffness: 300 },
  },
  performance: {
    useGPU: true,
    respectReducedMotion: true,
    maxConcurrentAnimations: 5,
    cleanupInterval: 30000, // 30 seconds
  },
} as const;

export const courseAnimations = {
  // Card hover effects with elevation and glow
  lessonCard: {
    rest: {
      scale: 1,
      y: 0,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      filter: 'brightness(1)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    hover: {
      scale: 1.02,
      y: -4,
      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)',
      filter: 'brightness(1.05)',
      borderColor: 'rgba(102, 126, 234, 0.3)',
      transition: {
        duration: ANIMATION_CONFIG.duration.normal,
        ease: ANIMATION_CONFIG.easing.standard,
      },
    },
    tap: {
      scale: 0.98,
      transition: { duration: ANIMATION_CONFIG.duration.fast },
    },
  },

  // Enhanced button interactions
  button: {
    rest: {
      scale: 1,
      filter: 'brightness(1)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    hover: {
      scale: 1.05,
      filter: 'brightness(1.1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      transition: { duration: ANIMATION_CONFIG.duration.fast },
    },
    tap: {
      scale: 0.95,
      transition: { duration: ANIMATION_CONFIG.duration.fast },
    },
  },

  // Navigation pill effects
  navigationPill: {
    rest: {
      scale: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 0 0 rgba(59, 130, 246, 0)',
    },
    hover: {
      scale: 1.1,
      borderColor: 'rgba(59, 130, 246, 0.5)',
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
      transition: { duration: ANIMATION_CONFIG.duration.normal },
    },
    active: {
      scale: 1.05,
      borderColor: 'rgba(59, 130, 246, 0.8)',
      boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)',
    },
  },

  // Video control hover effects
  videoControl: {
    rest: {
      scale: 1,
      opacity: 0.8,
      filter: 'brightness(1)',
    },
    hover: {
      scale: 1.15,
      opacity: 1,
      filter: 'brightness(1.2)',
      transition: { duration: ANIMATION_CONFIG.duration.fast },
    },
  },

  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_CONFIG.duration.slow,
        ease: ANIMATION_CONFIG.easing.smooth,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: ANIMATION_CONFIG.duration.normal,
      },
    },
  },

  // Content fade in animations
  contentFadeIn: {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_CONFIG.duration.slow,
        ease: ANIMATION_CONFIG.easing.smooth,
      },
    },
  },

  // Staggered list animations
  staggeredList: {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    item: {
      initial: { opacity: 0, x: -20 },
      animate: {
        opacity: 1,
        x: 0,
        transition: {
          duration: ANIMATION_CONFIG.duration.normal,
        },
      },
    },
  },

  // Progress animations
  progressFill: {
    initial: { scaleX: 0, originX: 0 },
    animate: (progress: number) => ({
      scaleX: progress / 100,
      transition: {
        duration: ANIMATION_CONFIG.duration.celebration,
        ease: ANIMATION_CONFIG.easing.standard,
      },
    }),
  },

  // Animated progress ring
  progressRing: {
    initial: {
      pathLength: 0,
      opacity: 0,
    },
    animate: (progress: number) => ({
      pathLength: progress / 100,
      opacity: 1,
      transition: {
        pathLength: {
          duration: ANIMATION_CONFIG.duration.celebration,
          ease: ANIMATION_CONFIG.easing.standard,
        },
        opacity: { duration: 0.3 },
      },
    }),
  },

  // Achievement animations
  achievementPop: {
    initial: {
      scale: 0,
      rotate: -180,
      opacity: 0,
    },
    animate: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: ANIMATION_CONFIG.easing.spring,
    },
  },

  // Celebration confetti
  confettiParticle: {
    initial: {
      y: 0,
      x: 0,
      rotate: 0,
      opacity: 1,
      scale: 1,
    },
    animate: {
      y: [0, -200, 200],
      x: [0, Math.random() * 100 - 50],
      rotate: [0, Math.random() * 360],
      opacity: [1, 0.8, 0],
      scale: [1, 0.8, 0.5],
      transition: {
        duration: 2,
        ease: 'easeOut',
      },
    },
  },

  // Toast slide animations
  toastSlide: {
    initial: {
      x: 400,
      opacity: 0,
      scale: 0.9,
    },
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      x: 400,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: ANIMATION_CONFIG.duration.normal,
      },
    },
  },

  // Modal/Dialog animations
  modalOverlay: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: ANIMATION_CONFIG.duration.normal },
    },
    exit: {
      opacity: 0,
      transition: { duration: ANIMATION_CONFIG.duration.normal },
    },
  },

  modalContent: {
    initial: {
      scale: 0.9,
      opacity: 0,
      y: 20,
    },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      y: 20,
      transition: { duration: ANIMATION_CONFIG.duration.fast },
    },
  },

  // Loading shimmer effect
  shimmer: {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear',
      },
    },
  },

  // Completion checkmark draw
  checkmarkDraw: {
    initial: { pathLength: 0 },
    animate: {
      pathLength: 1,
      transition: {
        duration: 0.6,
        ease: ANIMATION_CONFIG.easing.standard,
      },
    },
  },

  // Pulsing effect for important elements
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: 'easeInOut',
      },
    },
  },

  // Floating effect
  float: {
    animate: {
      y: [0, -10, 0],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: 'easeInOut',
      },
    },
  },
};

// Hover effect variations for different elements
export const hoverEffects = {
  lessonCard: courseAnimations.lessonCard.hover,
  button: courseAnimations.button.hover,
  navigationPill: courseAnimations.navigationPill.hover,
  videoControl: courseAnimations.videoControl.hover,
};

// Utility function to respect reduced motion preferences
export const getMotionProps = (
  animation: MotionProps,
  respectReducedMotion = true
) => {
  if (respectReducedMotion && typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) {
      return {
        initial: false,
        animate: false,
        transition: { duration: 0 },
      };
    }
  }
  return animation;
};

// Performance monitoring for animations
export const animationPerformance = {
  activeAnimations: new Set<string>(),

  startAnimation: (id: string) => {
    animationPerformance.activeAnimations.add(id);
    if (
      animationPerformance.activeAnimations.size >
      ANIMATION_CONFIG.performance.maxConcurrentAnimations
    ) {
      console.warn(
        'Too many concurrent animations, consider reducing for performance'
      );
    }
  },

  endAnimation: (id: string) => {
    animationPerformance.activeAnimations.delete(id);
  },

  getActiveCount: () => animationPerformance.activeAnimations.size,
};
