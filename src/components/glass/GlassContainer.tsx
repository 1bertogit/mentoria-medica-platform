'use client';

import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassContainerProps {
  children: ReactNode;
  intensity?: 1 | 2 | 3 | 4 | 5;
  variant?: 'light' | 'dark' | 'premium';
  gradient?: boolean;
  pattern?: 'dots' | 'grid' | 'none';
  animated?: boolean;
  className?: string;
}

export function GlassContainer({
  children,
  className,
  intensity = 3,
  variant = 'dark',
  gradient = false,
  pattern = 'none',
  animated = false,
}: GlassContainerProps) {
  // Blur intensity levels
  const blurIntensity = {
    1: 'backdrop-blur-sm',
    2: 'backdrop-blur',
    3: 'backdrop-blur-md',
    4: 'backdrop-blur-lg',
    5: 'backdrop-blur-xl',
  };

  // Background variants
  const backgrounds = {
    light: 'bg-white/10',
    dark: 'bg-black/20',
    premium: 'bg-gradient-to-br from-amber-900/10 via-black/30 to-amber-900/10',
  };

  // Pattern overlays
  const patterns = {
    dots: 'bg-dot-pattern',
    grid: 'bg-grid-pattern',
    none: '',
  };

  if (animated) {
    return (
      <motion.div
        className={cn(
          'relative overflow-hidden',
          blurIntensity[intensity],
          backgrounds[variant],
          'shadow-2xl',
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Gradient overlay */}
        {gradient && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        )}

        {/* Pattern overlay */}
        {pattern !== 'none' && (
          <div className={cn('absolute inset-0 opacity-10 pointer-events-none', patterns[pattern])} />
        )}

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        blurIntensity[intensity],
        backgrounds[variant],
        'shadow-2xl',
        className
      )}
    >
      {/* Gradient overlay */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      )}

      {/* Pattern overlay */}
      {pattern !== 'none' && (
        <div
          className={cn(
            'absolute inset-0 opacity-5 pointer-events-none',
            pattern === 'dots' && 'bg-dot-white/10',
            pattern === 'grid' && 'bg-grid-white/10'
          )}
          style={{
            backgroundImage:
              pattern === 'dots'
                ? 'radial-gradient(circle, white 1px, transparent 1px)'
                : pattern === 'grid'
                ? 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)'
                : undefined,
            backgroundSize: pattern === 'dots' ? '20px 20px' : '50px 50px',
          }}
        />
      )}

      {/* Premium shimmer effect */}
      {variant === 'premium' && (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-shimmer-slow" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Bottom reflection */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}