import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  style?: React.CSSProperties;
  variant?: 'default' | 'dark';
  onClick?: () => void;
}

export const GlassCard = ({
  children,
  className,
  interactive = false,
  style,
  variant = 'default',
  onClick,
}: GlassCardProps) => {
  const isDark = variant === 'dark';

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-3xl p-6 shadow-2xl transition-all duration-500 ease-out',
        // Default variant (adaptive)
        !isDark && [
          // Light theme
          'border border-gray-200/50 bg-white/80 shadow-gray-200/20',
          // Dark theme
          'dark:border-white/10 dark:bg-white/[.04] dark:shadow-black/20',
          interactive &&
            'cursor-pointer hover:scale-[1.02] hover:bg-white/90 dark:hover:bg-white/[.08]',
        ],
        // Dark variant (always dark)
        isDark && [
          'border border-gray-800/50 bg-black/80 shadow-black/40',
          interactive && 'cursor-pointer hover:scale-[1.02] hover:bg-black/90',
        ],
        className
      )}
      style={style}
    >
      {/* Rim light effect */}
      <div
        className={cn(
          'pointer-events-none absolute left-0 top-0 h-full w-full rounded-3xl border',
          isDark
            ? 'border-gray-700/30'
            : 'border-gray-200/30 dark:border-white/10'
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute left-0 top-0 h-full w-full rounded-3xl',
          isDark
            ? 'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]'
            : 'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'
        )}
      />

      {/* Gradient overlay for depth */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent',
          isDark
            ? 'from-white/[0.05]'
            : 'from-white/[0.1] dark:from-white/[0.02]'
        )}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
};
