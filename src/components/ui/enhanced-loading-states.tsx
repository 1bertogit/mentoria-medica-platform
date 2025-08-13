'use client';

import { motion } from 'motion/react';
import { Loader2, Play, Download, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { courseAnimations } from '@/lib/animations/course-animations';

interface ShimmerSkeletonProps {
  className?: string;
  lines?: number;
  showAvatar?: boolean;
  showImage?: boolean;
}

export function ShimmerSkeleton({ 
  className, 
  lines = 3, 
  showAvatar = false, 
  showImage = false 
}: ShimmerSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {showImage && (
        <div className="relative h-48 bg-slate-800/50 rounded-lg overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            {...courseAnimations.shimmer}
          />
        </div>
      )}
      
      {showAvatar && (
        <div className="flex items-center space-x-4">
          <div className="relative w-12 h-12 bg-slate-800/50 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              {...courseAnimations.shimmer}
            />
          </div>
          <div className="space-y-2 flex-1">
            <div className="relative h-4 bg-slate-800/50 rounded w-1/3 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                {...courseAnimations.shimmer}
              />
            </div>
            <div className="relative h-3 bg-slate-800/50 rounded w-1/4 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                {...courseAnimations.shimmer}
              />
            </div>
          </div>
        </div>
      )}
      
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'relative h-4 bg-slate-800/50 rounded overflow-hidden',
            i === lines - 1 ? 'w-2/3' : 'w-full'
          )}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            {...courseAnimations.shimmer}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        </div>
      ))}
    </div>
  );
}

interface SpinnerWithProgressProps {
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export function SpinnerWithProgress({ 
  progress, 
  size = 'md', 
  label, 
  className 
}: SpinnerWithProgressProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const strokeWidth = size === 'sm' ? 2 : size === 'md' ? 3 : 4;
  const radius = size === 'sm' ? 10 : size === 'md' ? 12 : 16;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative">
        <svg
          className={cn('transform -rotate-90', sizeClasses[size])}
          viewBox="0 0 32 32"
        >
          {/* Background circle */}
          <circle
            cx="16"
            cy="16"
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Progress circle */}
          {progress !== undefined && (
            <motion.circle
              cx="16"
              cy="16"
              r={radius}
              stroke="url(#progressGradient)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
              animate={{ 
                strokeDashoffset: circumference - (progress / 100) * circumference 
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          )}
          
          {/* Spinner */}
          {progress === undefined && (
            <motion.circle
              cx="16"
              cy="16"
              r={radius}
              stroke="url(#spinnerGradient)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${circumference * 0.25} ${circumference * 0.75}`}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
          
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center icon or progress text */}
        <div className="absolute inset-0 flex items-center justify-center">
          {progress !== undefined ? (
            <span className="text-xs font-medium text-white">
              {Math.round(progress)}%
            </span>
          ) : (
            <Loader2 className={cn('animate-spin text-blue-400', 
              size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6'
            )} />
          )}
        </div>
      </div>
      
      {label && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-slate-400 text-center"
        >
          {label}
        </motion.p>
      )}
    </div>
  );
}

interface PulseLoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

export function PulseLoader({ className, size = 'md', color = 'blue' }: PulseLoaderProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn('rounded-full', sizeClasses[size], colorClasses[color])}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
}

interface VideoBufferingProps {
  className?: string;
  isBuffering: boolean;
  progress?: number;
}

export function VideoBuffering({ className, isBuffering, progress }: VideoBufferingProps) {
  if (!isBuffering) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center',
        className
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <SpinnerWithProgress 
          progress={progress} 
          size="lg" 
          label={progress ? "Carregando..." : "Buffering..."}
        />
        
        <motion.div
          className="flex items-center gap-2 text-white/80"
          {...courseAnimations.pulse}
        >
          <Play className="w-4 h-4" />
          <span className="text-sm">Preparando vídeo...</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

interface DataSyncProps {
  isSync: boolean;
  lastSyncTime?: Date;
  className?: string;
}

export function DataSync({ isSync, lastSyncTime, className }: DataSyncProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-center gap-2 text-xs text-slate-400', className)}
    >
      {isSync ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-3 h-3" />
          </motion.div>
          <span>Sincronizando...</span>
        </>
      ) : (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <Wifi className="w-3 h-3 text-green-400" />
          </motion.div>
          <span>
            {lastSyncTime 
              ? `Sincronizado ${formatTimeAgo(lastSyncTime)}`
              : 'Sincronizado'
            }
          </span>
        </>
      )}
    </motion.div>
  );
}

interface ConnectionStatusProps {
  isOnline: boolean;
  className?: string;
}

export function ConnectionStatus({ isOnline, className }: ConnectionStatusProps) {
  return (
    <motion.div
      layout
      className={cn(
        'flex items-center gap-2 px-3 py-1 rounded-full text-xs',
        isOnline 
          ? 'bg-green-500/20 text-green-400 border border-green-400/30'
          : 'bg-red-500/20 text-red-400 border border-red-400/30',
        className
      )}
    >
      <motion.div
        animate={{ scale: isOnline ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {isOnline ? (
          <Wifi className="w-3 h-3" />
        ) : (
          <WifiOff className="w-3 h-3" />
        )}
      </motion.div>
      <span>{isOnline ? 'Online' : 'Offline'}</span>
    </motion.div>
  );
}

interface DownloadProgressProps {
  progress: number;
  filename: string;
  size?: string;
  className?: string;
}

export function DownloadProgress({ 
  progress, 
  filename, 
  size, 
  className 
}: DownloadProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-lg p-4',
        className
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <motion.div
          animate={{ rotate: progress < 100 ? 360 : 0 }}
          transition={{ duration: 1, repeat: progress < 100 ? Infinity : 0, ease: "linear" }}
        >
          <Download className="w-5 h-5 text-blue-400" />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{filename}</p>
          {size && (
            <p className="text-xs text-slate-400">{size}</p>
          )}
        </div>
        
        <span className="text-sm font-medium text-white">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

// Utility function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'agora';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min atrás`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
  return `${Math.floor(diffInSeconds / 86400)}d atrás`;
}