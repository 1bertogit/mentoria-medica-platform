'use client';

import { RefObject, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon,
  Gauge,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import { useGestures, GestureData, GestureType } from '@/hooks/use-gestures';
import { useBreakpoint } from '@/hooks/use-media-query';

interface GestureControlsProps {
  videoRef: RefObject<HTMLVideoElement>;
  onSeek: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onLessonChange: (direction: 'prev' | 'next') => void;
  onSpeedChange: (speed: number) => void;
  onPlayPause: () => void;
  isPlaying: boolean;
  currentVolume: number;
  currentSpeed: number;
  gesturesEnabled?: boolean;
  className?: string;
}

interface GestureIndicator {
  type: 'seek' | 'volume' | 'brightness' | 'speed' | 'lesson' | 'play';
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const SPEED_PRESETS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3];

export function GestureControls({
  videoRef,
  onSeek,
  onVolumeChange,
  onLessonChange,
  onSpeedChange,
  onPlayPause,
  isPlaying,
  currentVolume,
  currentSpeed,
  gesturesEnabled = true,
  className = ''
}: GestureControlsProps) {
  const { isMobile, isTouchDevice } = useBreakpoint();
  const [showIndicator, setShowIndicator] = useState(false);
  const [indicator, setIndicator] = useState<GestureIndicator | null>(null);
  const [brightness, setBrightness] = useState(1);

  // Show gesture indicator
  const showGestureIndicator = useCallback((gestureIndicator: GestureIndicator) => {
    setIndicator(gestureIndicator);
    setShowIndicator(true);
    
    // Auto-hide after delay
    setTimeout(() => {
      setShowIndicator(false);
    }, 1000);
  }, []);

  // Handle double tap gestures
  const handleDoubleTap = useCallback((data: GestureData) => {
    if (!gesturesEnabled) return;

    const seekAmount = data.zone === 'left' ? -10 : 10;
    onSeek(seekAmount);

    showGestureIndicator({
      type: 'seek',
      value: `${seekAmount > 0 ? '+' : ''}${seekAmount}s`,
      icon: seekAmount > 0 ? <RotateCw className="h-8 w-8" /> : <RotateCcw className="h-8 w-8" />,
      color: seekAmount > 0 ? 'text-green-400' : 'text-blue-400'
    });
  }, [gesturesEnabled, onSeek, showGestureIndicator]);

  // Handle swipe gestures
  const handleSwipe = useCallback((data: GestureData) => {
    if (!gesturesEnabled) return;

    const { direction, deltaY, deltaX } = data;

    if (direction === 'up' || direction === 'down') {
      // Vertical swipes for volume control
      const volumeChange = deltaY > 0 ? -0.1 : 0.1;
      const newVolume = Math.max(0, Math.min(1, currentVolume + volumeChange));
      onVolumeChange(newVolume);

      showGestureIndicator({
        type: 'volume',
        value: `${Math.round(newVolume * 100)}%`,
        icon: newVolume === 0 ? <VolumeX className="h-8 w-8" /> : <Volume2 className="h-8 w-8" />,
        color: 'text-purple-400'
      });
    } else if (direction === 'left' || direction === 'right') {
      // Horizontal swipes for lesson navigation
      const lessonDirection = direction === 'left' ? 'next' : 'prev';
      onLessonChange(lessonDirection);

      showGestureIndicator({
        type: 'lesson',
        value: lessonDirection === 'next' ? 'Próxima Aula' : 'Aula Anterior',
        icon: lessonDirection === 'next' ? <ChevronRight className="h-8 w-8" /> : <ChevronLeft className="h-8 w-8" />,
        color: 'text-orange-400'
      });
    }
  }, [gesturesEnabled, currentVolume, onVolumeChange, onLessonChange, showGestureIndicator]);

  // Handle pinch gestures
  const handlePinch = useCallback((data: GestureData) => {
    if (!gesturesEnabled) return;

    // Pinch to zoom timeline or chapters overview
    // This could be implemented later for chapter navigation
    console.log('Pinch gesture:', data.scale);
  }, [gesturesEnabled]);

  // Handle long press gestures
  const handleLongPress = useCallback((data: GestureData) => {
    if (!gesturesEnabled) return;

    // Long press for speed menu
    const currentIndex = SPEED_PRESETS.indexOf(currentSpeed);
    const nextIndex = (currentIndex + 1) % SPEED_PRESETS.length;
    const newSpeed = SPEED_PRESETS[nextIndex];
    
    onSpeedChange(newSpeed);

    showGestureIndicator({
      type: 'speed',
      value: `${newSpeed}x`,
      icon: <Gauge className="h-8 w-8" />,
      color: 'text-yellow-400'
    });
  }, [gesturesEnabled, currentSpeed, onSpeedChange, showGestureIndicator]);

  // Handle tap gestures
  const handleTap = useCallback((data: GestureData) => {
    if (!gesturesEnabled) return;

    // Single tap to play/pause
    if (data.zone === 'center') {
      onPlayPause();

      showGestureIndicator({
        type: 'play',
        value: isPlaying ? 'Pausado' : 'Reproduzindo',
        icon: isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />,
        color: 'text-white'
      });
    }
  }, [gesturesEnabled, isPlaying, onPlayPause, showGestureIndicator]);

  // Set up gesture recognition
  const gestures = useGestures({
    onDoubleTap: handleDoubleTap,
    onSwipe: handleSwipe,
    onPinch: handlePinch,
    onLongPress: handleLongPress,
    onTap: handleTap,
    enabled: gesturesEnabled && isMobile && isTouchDevice,
    config: {
      doubleTapDelay: 300,
      swipeMinDistance: 30,
      longPressDelay: 400,
      sensitivity: 1.2,
    }
  });

  // Apply brightness control to video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.style.filter = `brightness(${brightness})`;
    }
  }, [brightness, videoRef]);

  // Don't render on non-touch devices
  if (!isTouchDevice || !gesturesEnabled) {
    return null;
  }

  return (
    <>
      {/* Gesture Overlay */}
      <div
        className={`absolute inset-0 z-10 ${className}`}
        onTouchStart={gestures.onTouchStart}
        onTouchMove={gestures.onTouchMove}
        onTouchEnd={gestures.onTouchEnd}
        style={{ touchAction: 'none' }}
      >
        {/* Gesture Zones Visual Feedback */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left zone - seek backward */}
          <div className="absolute left-0 top-0 bottom-0 w-1/3 flex items-center justify-center opacity-0 hover:opacity-20 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
              <RotateCcw className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Right zone - seek forward */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center opacity-0 hover:opacity-20 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
              <RotateCw className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Center zone - play/pause */}
          <div className="absolute left-1/3 right-1/3 top-0 bottom-0 flex items-center justify-center opacity-0 hover:opacity-20 transition-opacity">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              {isPlaying ? (
                <Pause className="h-10 w-10 text-white" />
              ) : (
                <Play className="h-10 w-10 text-white ml-1" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gesture Indicator */}
      <AnimatePresence>
        {showIndicator && indicator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center gap-3">
              <div className={indicator.color}>
                {indicator.icon}
              </div>
              <span className="text-white font-semibold text-lg">
                {indicator.value}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture Help Overlay (shown on first use) */}
      <AnimatePresence>
        {/* This could be implemented to show gesture hints on first video load */}
      </AnimatePresence>
    </>
  );
}