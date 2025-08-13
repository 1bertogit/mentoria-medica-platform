'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  intensity?: 1 | 2 | 3 | 4 | 5;
  hover?: boolean;
  borderBeam?: boolean;
  variant?: 'default' | 'premium' | 'dark';
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  intensity = 3,
  hover = false,
  borderBeam = false,
  variant = 'default',
  onClick,
}: GlassCardProps) {
  // Blur intensity levels
  const blurIntensity = {
    1: 'backdrop-blur-sm',
    2: 'backdrop-blur',
    3: 'backdrop-blur-md',
    4: 'backdrop-blur-lg',
    5: 'backdrop-blur-xl',
  };

  // Background opacity based on variant
  const backgrounds = {
    default: 'bg-white/5',
    premium: 'bg-gradient-to-br from-white/10 via-white/5 to-transparent',
    dark: 'bg-black/20',
  };

  // Border styles based on variant
  const borders = {
    default: 'border border-white/10',
    premium: 'border border-amber-500/20',
    dark: 'border border-white/5',
  };

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        blurIntensity[intensity],
        backgrounds[variant],
        borders[variant],
        'shadow-xl',
        hover && 'transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer',
        hover && variant === 'premium' && 'hover:border-amber-500/30',
        className
      )}
      onClick={onClick}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {/* Premium glow effect */}
      {variant === 'premium' && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 opacity-50" />
      )}

      {/* Border beam effect */}
      {borderBeam && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0 animate-shimmer" />
          <div className="absolute inset-[1px] rounded-2xl bg-black" />
        </>
      )}

      {/* Content */}
      <div className={cn('relative z-10', borderBeam && 'p-[1px]')}>
        <div className={cn(borderBeam && 'rounded-2xl bg-black')}>
          {children}
        </div>
      </div>

      {/* Subtle reflection */}
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </motion.div>
  );
}