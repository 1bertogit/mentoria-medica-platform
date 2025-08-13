'use client';

import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface GlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function GlassButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  ...props
}: GlassButtonProps) {
  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Variant styles with glassmorphism
  const variants = {
    primary: cn(
      'bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-amber-500/20',
      'border border-amber-500/30',
      'text-amber-400',
      'hover:from-amber-500/30 hover:via-amber-400/25 hover:to-amber-500/30',
      'hover:border-amber-400/50',
      'hover:text-amber-300',
      'hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]',
      'active:scale-[0.98]',
      'backdrop-blur-md',
    ),
    secondary: cn(
      'bg-white/5',
      'border border-white/20',
      'text-white/80',
      'hover:bg-white/10',
      'hover:border-white/30',
      'hover:text-white',
      'active:scale-[0.98]',
      'backdrop-blur-md',
    ),
    ghost: cn(
      'bg-transparent',
      'border border-transparent',
      'text-white/60',
      'hover:bg-white/5',
      'hover:border-white/10',
      'hover:text-white/80',
      'active:scale-[0.98]',
    ),
    danger: cn(
      'bg-red-500/10',
      'border border-red-500/30',
      'text-red-400',
      'hover:bg-red-500/20',
      'hover:border-red-500/50',
      'hover:text-red-300',
      'active:scale-[0.98]',
      'backdrop-blur-md',
    ),
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden rounded-lg font-medium',
        'transition-all duration-200',
        'flex items-center justify-center gap-2',
        sizes[size],
        variants[variant],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {/* Shimmer effect for primary variant */}
      {variant === 'primary' && !isDisabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent"
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          icon
        )}
        {children}
      </span>

      {/* Glow effect on hover for primary */}
      {variant === 'primary' && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent" />
        </div>
      )}
    </motion.button>
  );
}