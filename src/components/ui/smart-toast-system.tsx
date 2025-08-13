'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { X, Check, AlertCircle, Info, AlertTriangle, Trophy, Flame, Star, Crown } from 'lucide-react';
import { courseAnimations } from '@/lib/animations/course-animations';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'achievement' | 'streak' | 'level-up';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp: number;
}

interface SmartToastProps {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  achievement?: Achievement;
  progress?: number;
  persistant?: boolean;
  onDismiss?: () => void;
}

interface ToastContextValue {
  addToast: (toast: Omit<SmartToastProps, 'id' | 'onDismiss'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useSmartToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useSmartToast must be used within a SmartToastProvider');
  }
  return context;
}

interface SmartToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function SmartToastProvider({ 
  children, 
  maxToasts = 5,
  position = 'top-right' 
}: SmartToastProviderProps) {
  const [toasts, setToasts] = useState<SmartToastProps[]>([]);

  const addToast = (toastData: Omit<SmartToastProps, 'id' | 'onDismiss'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: SmartToastProps = {
      ...toastData,
      id,
      onDismiss: () => removeToast(id)
    };

    setToasts(prev => {
      const newToasts = [toast, ...prev];
      return newToasts.slice(0, maxToasts);
    });

    // Auto-dismiss if not persistent
    if (!toast.persistant && toast.duration !== Infinity) {
      const duration = toast.duration || getDefaultDuration(toast.type);
      setTimeout(() => removeToast(id), duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  const getDefaultDuration = (type: ToastType): number => {
    switch (type) {
      case 'achievement':
      case 'level-up':
        return 8000;
      case 'streak':
        return 6000;
      case 'error':
        return 7000;
      default:
        return 4000;
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearToasts }}>
      {children}
      
      {/* Toast Container */}
      <div className={cn('fixed z-50 flex flex-col gap-2', getPositionClasses())}>
        <AnimatePresence mode="popLayout">
          {toasts.map((toast, index) => (
            <SmartToast
              key={toast.id}
              {...toast}
              style={{ zIndex: toasts.length - index }}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function SmartToast({
  id,
  title,
  description,
  type,
  action,
  achievement,
  progress,
  onDismiss,
  style
}: SmartToastProps & { style?: React.CSSProperties }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      onDismiss?.();
    }, 150);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'achievement':
        return <Trophy className="w-5 h-5" />;
      case 'streak':
        return <Flame className="w-5 h-5" />;
      case 'level-up':
        return <Star className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-500/20 border-green-400/30 text-green-100',
          icon: 'text-green-400',
          accent: 'bg-green-500'
        };
      case 'error':
        return {
          container: 'bg-red-500/20 border-red-400/30 text-red-100',
          icon: 'text-red-400',
          accent: 'bg-red-500'
        };
      case 'warning':
        return {
          container: 'bg-yellow-500/20 border-yellow-400/30 text-yellow-100',
          icon: 'text-yellow-400',
          accent: 'bg-yellow-500'
        };
      case 'info':
        return {
          container: 'bg-blue-500/20 border-blue-400/30 text-blue-100',
          icon: 'text-blue-400',
          accent: 'bg-blue-500'
        };
      case 'achievement':
        return {
          container: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 text-purple-100',
          icon: 'text-purple-400',
          accent: 'bg-gradient-to-r from-purple-500 to-pink-500'
        };
      case 'streak':
        return {
          container: 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/30 text-orange-100',
          icon: 'text-orange-400',
          accent: 'bg-gradient-to-r from-orange-500 to-red-500'
        };
      case 'level-up':
        return {
          container: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30 text-yellow-100',
          icon: 'text-yellow-400',
          accent: 'bg-gradient-to-r from-yellow-500 to-orange-500'
        };
      default:
        return {
          container: 'bg-slate-500/20 border-slate-400/30 text-slate-100',
          icon: 'text-slate-400',
          accent: 'bg-slate-500'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <motion.div
      layout
      variants={courseAnimations.toastSlide}
      initial="initial"
      animate="animate"
      exit="exit"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative overflow-hidden rounded-xl backdrop-blur-lg border shadow-2xl',
        'min-w-[320px] max-w-[400px] p-4',
        styles.container
      )}
      style={style}
      drag="x"
      dragConstraints={{ left: 0, right: 300 }}
      dragElastic={0.1}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) {
          handleDismiss();
        }
      }}
    >
      {/* Accent Bar */}
      <div className={cn('absolute top-0 left-0 w-full h-1', styles.accent)} />
      
      {/* Glow Effect for Special Toasts */}
      {(type === 'achievement' || type === 'level-up') && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-20"
          animate={{
            boxShadow: [
              '0 0 0 rgba(168, 85, 247, 0)',
              '0 0 20px rgba(168, 85, 247, 0.5)',
              '0 0 0 rgba(168, 85, 247, 0)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <motion.div
          className={cn('flex-shrink-0 mt-0.5', styles.icon)}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", damping: 15 }}
        >
          {achievement?.icon ? (
            <span className="text-lg">{achievement.icon}</span>
          ) : (
            getIcon()
          )}
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <motion.h4
            className="font-semibold text-sm mb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {title}
          </motion.h4>

          {/* Description */}
          {description && (
            <motion.p
              className="text-xs opacity-90 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {description}
            </motion.p>
          )}

          {/* Achievement Details */}
          {achievement && (
            <motion.div
              className="space-y-2 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">+{achievement.xp} XP</span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  {
                    'bg-gray-500/20 text-gray-300': achievement.rarity === 'common',
                    'bg-blue-500/20 text-blue-300': achievement.rarity === 'rare',
                    'bg-purple-500/20 text-purple-300': achievement.rarity === 'epic',
                    'bg-yellow-500/20 text-yellow-300': achievement.rarity === 'legendary'
                  }
                )}>
                  {achievement.rarity}
                </span>
              </div>
            </motion.div>
          )}

          {/* Progress Bar */}
          {progress !== undefined && (
            <motion.div
              className="mb-2"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className={cn('h-full', styles.accent)}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}

          {/* Action Button */}
          {action && (
            <motion.button
              className="text-xs font-medium px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors mt-2"
              onClick={action.onClick}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {action.label}
            </motion.button>
          )}
        </div>

        {/* Close Button */}
        <motion.button
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
          onClick={handleDismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Swipe Indicator */}
      <motion.div
        className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white/20 rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
    </motion.div>
  );
}