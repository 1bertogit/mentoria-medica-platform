'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { 
  Gauge, 
  PictureInPicture2, 
  Settings, 
  X,
  Zap,
  Volume2,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBreakpoint, useSafeArea } from '@/hooks/use-media-query';
import { useLocalStorage } from '@/hooks/use-local-storage';

type FloatingPosition = 'bottom-right' | 'bottom-left' | 'center-right' | 'top-right';

interface FloatingControlsProps {
  position?: FloatingPosition;
  isVisible?: boolean;
  currentSpeed: number;
  currentVolume: number;
  onSpeedChange: (speed: number) => void;
  onVolumeChange: (volume: number) => void;
  onPiPToggle: () => void;
  onSettingsOpen: () => void;
  onBrightnessChange?: (brightness: number) => void;
  className?: string;
}

interface SpeedPreset {
  value: number;
  label: string;
  color: string;
}

const SPEED_PRESETS: SpeedPreset[] = [
  { value: 0.5, label: '0.5x', color: 'text-blue-400' },
  { value: 0.75, label: '0.75x', color: 'text-green-400' },
  { value: 1, label: '1x', color: 'text-white' },
  { value: 1.25, label: '1.25x', color: 'text-yellow-400' },
  { value: 1.5, label: '1.5x', color: 'text-orange-400' },
  { value: 2, label: '2x', color: 'text-red-400' },
  { value: 3, label: '3x', color: 'text-purple-400' },
];

export function FloatingControls({
  position = 'bottom-right',
  isVisible = true,
  currentSpeed,
  currentVolume,
  onSpeedChange,
  onVolumeChange,
  onPiPToggle,
  onSettingsOpen,
  onBrightnessChange,
  className = ''
}: FloatingControlsProps) {
  const { isMobile, isTouchDevice } = useBreakpoint();
  const safeArea = useSafeArea();
  const dragControls = useDragControls();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [currentPosition, setCurrentPosition] = useLocalStorage<FloatingPosition>('floating-controls-position', position);
  const [isDragging, setIsDragging] = useState(false);
  const [customPosition, setCustomPosition] = useLocalStorage('floating-controls-custom-position', { x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-hide controls when not in use
  useEffect(() => {
    let hideTimer: NodeJS.Timeout;

    if (isExpanded || showSpeedMenu) {
      hideTimer = setTimeout(() => {
        setIsExpanded(false);
        setShowSpeedMenu(false);
      }, 5000);
    }

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [isExpanded, showSpeedMenu]);

  // Don't render on desktop unless touch device
  if (!isMobile && !isTouchDevice) {
    return null;
  }

  // Get position styles
  const getPositionStyles = () => {
    const base = 'fixed z-40';
    const offset = 16;
    
    switch (currentPosition) {
      case 'bottom-left':
        return `${base} bottom-[${offset + safeArea.bottom}px] left-[${offset + safeArea.left}px]`;
      case 'center-right':
        return `${base} top-1/2 -translate-y-1/2 right-[${offset + safeArea.right}px]`;
      case 'top-right':
        return `${base} top-[${offset + safeArea.top}px] right-[${offset + safeArea.right}px]`;
      default:
        return `${base} bottom-[${offset + safeArea.bottom}px] right-[${offset + safeArea.right}px]`;
    }
  };

  // Handle speed preset selection
  const handleSpeedSelect = (speed: number) => {
    onSpeedChange(speed);
    setShowSpeedMenu(false);
    setIsExpanded(false);
  };

  // Toggle speed menu
  const toggleSpeedMenu = () => {
    setShowSpeedMenu(!showSpeedMenu);
    if (!showSpeedMenu) {
      setIsExpanded(true);
    }
  };

  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (showSpeedMenu && !isExpanded) {
      setShowSpeedMenu(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={containerRef}
          drag
          dragControls={dragControls}
          dragMomentum={false}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_, info) => {
            setIsDragging(false);
            setCustomPosition({ x: info.point.x, y: info.point.y });
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className={`${getPositionStyles()} ${className}`}
          style={{
            x: customPosition.x,
            y: customPosition.y,
          }}
        >
          {/* Main Control Button */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            className={`
              bg-black/80 backdrop-blur-sm rounded-full 
              ${isExpanded ? 'rounded-2xl' : 'rounded-full'}
              border border-white/10 shadow-2xl
              transition-all duration-300
              ${isDragging ? 'shadow-xl scale-110' : ''}
            `}
          >
            {!isExpanded ? (
              // Collapsed State - Speed Button
              <Button
                variant="ghost"
                size="lg"
                onClick={toggleExpanded}
                className="w-14 h-14 rounded-full p-0 text-white hover:bg-white/10 active:bg-white/20"
              >
                <div className="flex flex-col items-center">
                  <Gauge className="h-5 w-5" />
                  <span className="text-xs font-bold">
                    {SPEED_PRESETS.find(p => p.value === currentSpeed)?.label || '1x'}
                  </span>
                </div>
              </Button>
            ) : (
              // Expanded State - Full Controls
              <div className="p-3 space-y-3">
                {/* Close Button */}
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    className="w-8 h-8 p-0 text-slate-400 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Speed Control */}
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    onClick={toggleSpeedMenu}
                    className="w-full justify-between text-white hover:bg-white/10 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      <span>Velocidade</span>
                    </div>
                    <span className={`font-bold ${SPEED_PRESETS.find(p => p.value === currentSpeed)?.color || 'text-white'}`}>
                      {SPEED_PRESETS.find(p => p.value === currentSpeed)?.label || '1x'}
                    </span>
                  </Button>

                  {/* Speed Menu */}
                  <AnimatePresence>
                    {showSpeedMenu && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1 bg-slate-900/90 rounded-xl p-2"
                      >
                        {SPEED_PRESETS.map((preset) => (
                          <Button
                            key={preset.value}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSpeedSelect(preset.value)}
                            className={`
                              w-full justify-center text-sm font-medium
                              ${currentSpeed === preset.value 
                                ? `${preset.color} bg-white/10` 
                                : 'text-slate-300 hover:text-white hover:bg-white/5'
                              }
                            `}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Volume Control */}
                <Button
                  variant="ghost"
                  onClick={() => onVolumeChange(currentVolume === 0 ? 1 : 0)}
                  className="w-full justify-between text-white hover:bg-white/10 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <span>Volume</span>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(currentVolume * 100)}%
                  </span>
                </Button>

                {/* Brightness Control */}
                {onBrightnessChange && (
                  <Button
                    variant="ghost"
                    onClick={() => onBrightnessChange(1)}
                    className="w-full justify-between text-white hover:bg-white/10 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      <span>Brilho</span>
                    </div>
                    <span className="text-sm font-medium">100%</span>
                  </Button>
                )}

                {/* Divider */}
                <div className="border-t border-white/10" />

                {/* Picture-in-Picture */}
                <Button
                  variant="ghost"
                  onClick={onPiPToggle}
                  className="w-full justify-start text-white hover:bg-white/10 px-3 py-2"
                >
                  <PictureInPicture2 className="h-4 w-4 mr-2" />
                  <span>Modo PiP</span>
                </Button>

                {/* Settings */}
                <Button
                  variant="ghost"
                  onClick={onSettingsOpen}
                  className="w-full justify-start text-white hover:bg-white/10 px-3 py-2"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Configurações</span>
                </Button>
              </div>
            )}
          </motion.div>

          {/* Quick Speed Toggle (appears on collapsed state hover/press) */}
          {!isExpanded && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: -60 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none"
              >
                <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/10">
                  <div className="flex gap-2">
                    {SPEED_PRESETS.slice(2, 5).map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => handleSpeedSelect(preset.value)}
                        className={`
                          text-xs font-medium px-2 py-1 rounded pointer-events-auto
                          ${currentSpeed === preset.value 
                            ? `${preset.color} bg-white/20` 
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                          }
                        `}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Drag Handle Indicator */}
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}