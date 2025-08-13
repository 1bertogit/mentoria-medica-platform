'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  TrendingUp, 
  BookOpen, 
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Lesson } from '@/lib/mock-data/academy';
import { useBreakpoint, useSafeArea } from '@/hooks/use-media-query';

interface MobileBottomNavProps {
  currentLesson: Lesson;
  onLessonChange: (direction: 'prev' | 'next') => void;
  onProgressToggle: () => void;
  onNotesToggle: () => void;
  onSettingsToggle: () => void;
  onPlayPause: () => void;
  isVideoPlaying: boolean;
  hasNextLesson: boolean;
  hasPreviousLesson: boolean;
  className?: string;
}

interface TabItem {
  id: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  label: string;
  action: () => void;
  disabled?: boolean;
  badge?: string | number;
}

export function MobileBottomNav({
  currentLesson,
  onLessonChange,
  onProgressToggle,
  onNotesToggle,
  onSettingsToggle,
  onPlayPause,
  isVideoPlaying,
  hasNextLesson,
  hasPreviousLesson,
  className = ''
}: MobileBottomNavProps) {
  const { isMobile, isTouchDevice } = useBreakpoint();
  const safeArea = useSafeArea();
  const [isVisible, setIsVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide navigation during video playback
  useEffect(() => {
    let hideTimer: NodeJS.Timeout;

    if (isVideoPlaying) {
      hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } else {
      setIsVisible(true);
    }

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [isVideoPlaying]);

  // Handle scroll to show/hide navigation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Show navigation on touch
  const handleTouch = useCallback(() => {
    setIsVisible(true);
  }, []);

  // Tab definitions
  const tabs: TabItem[] = [
    {
      id: 'previous',
      icon: <ChevronLeft className="h-5 w-5" />,
      activeIcon: <ChevronLeft className="h-5 w-5" />,
      label: 'Anterior',
      action: () => onLessonChange('prev'),
      disabled: !hasPreviousLesson,
    },
    {
      id: 'progress',
      icon: <TrendingUp className="h-5 w-5" />,
      activeIcon: <TrendingUp className="h-5 w-5" />,
      label: 'Progresso',
      action: () => {
        setActiveTab(activeTab === 'progress' ? null : 'progress');
        onProgressToggle();
      },
    },
    {
      id: 'play',
      icon: isVideoPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />,
      activeIcon: isVideoPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />,
      label: isVideoPlaying ? 'Pausar' : 'Reproduzir',
      action: onPlayPause,
    },
    {
      id: 'notes',
      icon: <BookOpen className="h-5 w-5" />,
      activeIcon: <BookOpen className="h-5 w-5" />,
      label: 'Notas',
      action: () => {
        setActiveTab(activeTab === 'notes' ? null : 'notes');
        onNotesToggle();
      },
    },
    {
      id: 'next',
      icon: <ChevronRight className="h-5 w-5" />,
      activeIcon: <ChevronRight className="h-5 w-5" />,
      label: 'Próxima',
      action: () => onLessonChange('next'),
      disabled: !hasNextLesson,
    },
  ];

  // Don't render on desktop
  if (!isMobile || !isTouchDevice) {
    return null;
  }

  return (
    <>
      {/* Touch overlay to show navigation */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-20 z-40 pointer-events-auto"
        onTouchStart={handleTouch}
        style={{ paddingBottom: `${safeArea.bottom}px` }}
      />

      {/* Bottom Navigation */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.3 
            }}
            className={`
              fixed bottom-0 left-0 right-0 z-50
              bg-slate-950/95 backdrop-blur-xl
              border-t border-slate-800/50
              ${className}
            `}
            style={{ paddingBottom: `${safeArea.bottom + 8}px` }}
          >
            {/* Current Lesson Info */}
            <div className="px-4 py-2 border-b border-slate-800/30">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide truncate">
                    Aula Atual
                  </p>
                  <p className="text-sm text-white font-semibold truncate">
                    {currentLesson.title}
                  </p>
                </div>
                <div className="ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                    onClick={onSettingsToggle}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-2 py-3">
              <div className="flex items-center justify-around">
                {tabs.map((tab) => (
                  <motion.div
                    key={tab.id}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex justify-center"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={tab.disabled}
                      onClick={tab.action}
                      className={`
                        flex flex-col items-center gap-1 p-2 h-auto min-h-[44px] min-w-[44px]
                        hover:bg-slate-800/50 active:bg-slate-700/50
                        transition-all duration-200
                        ${activeTab === tab.id ? 'bg-slate-800/50 text-blue-400' : 'text-slate-300'}
                        ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:text-white'}
                        ${tab.id === 'play' ? 'bg-blue-600/20 hover:bg-blue-600/30' : ''}
                      `}
                    >
                      <div className={`
                        flex items-center justify-center
                        ${tab.id === 'play' ? 'text-blue-400' : ''}
                      `}>
                        {activeTab === tab.id ? tab.activeIcon : tab.icon}
                      </div>
                      <span className="text-[10px] font-medium leading-none">
                        {tab.label}
                      </span>
                      {tab.badge && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {tab.badge}
                        </div>
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ 
                  width: currentLesson.progress ? `${currentLesson.progress}%` : '0%' 
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Gesture Indicators */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-20 left-4 right-4 z-40 pointer-events-none"
            style={{ bottom: `${safeArea.bottom + 80}px` }}
          >
            <div className="flex justify-between items-center">
              {/* Left swipe indicator */}
              {hasPreviousLesson && (
                <div className="bg-black/40 backdrop-blur-sm rounded-full p-2 flex items-center gap-2">
                  <ChevronLeft className="h-3 w-3 text-white/60" />
                  <span className="text-[10px] text-white/60 font-medium">Deslize</span>
                </div>
              )}

              {/* Right swipe indicator */}
              {hasNextLesson && (
                <div className="bg-black/40 backdrop-blur-sm rounded-full p-2 flex items-center gap-2">
                  <span className="text-[10px] text-white/60 font-medium">Deslize</span>
                  <ChevronRight className="h-3 w-3 text-white/60" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}