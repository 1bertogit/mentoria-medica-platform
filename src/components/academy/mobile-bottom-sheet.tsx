'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls, useMotionValue, useTransform } from 'motion/react';
import { X, GripHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBreakpoint, useSafeArea } from '@/hooks/use-media-query';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  snapPoints?: number[]; // [25%, 50%, 90%]
  title?: string;
  children: React.ReactNode;
  className?: string;
  initialSnap?: number;
  showHandle?: boolean;
  backdropBlur?: boolean;
  preventClose?: boolean;
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  snapPoints = [25, 50, 90],
  title,
  children,
  className = '',
  initialSnap = 1,
  showHandle = true,
  backdropBlur = true,
  preventClose = false
}: MobileBottomSheetProps) {
  const { isMobile, isTouchDevice } = useBreakpoint();
  const safeArea = useSafeArea();
  const dragControls = useDragControls();
  
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  
  const sheetRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  
  // Calculate snap positions based on viewport height
  const getSnapPosition = useCallback((snapIndex: number) => {
    if (typeof window === 'undefined') return 0;
    
    const viewportHeight = window.innerHeight;
    const snapPercentage = snapPoints[snapIndex] || 50;
    return viewportHeight * (1 - snapPercentage / 100);
  }, [snapPoints]);

  // Transform for backdrop opacity
  const backdropOpacity = useTransform(
    y,
    [0, window?.innerHeight || 800],
    [0.6, 0]
  );

  // Handle drag start
  const handleDragStart = useCallback((event: PointerEvent | MouseEvent) => {
    setIsDragging(true);
    setStartY(y.get());
  }, [y]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    
    const currentY = y.get();
    const viewportHeight = window.innerHeight;
    
    // Determine closest snap point
    let closestSnapIndex = 0;
    let closestDistance = Infinity;
    
    snapPoints.forEach((_, index) => {
      const snapPosition = getSnapPosition(index);
      const distance = Math.abs(currentY - snapPosition);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestSnapIndex = index;
      }
    });
    
    // Check if should close (dragged below lowest snap point)
    const lowestSnapPosition = getSnapPosition(snapPoints.length - 1);
    if (currentY > lowestSnapPosition + 100) {
      if (!preventClose) {
        onClose();
        return;
      }
    }
    
    // Snap to closest point
    setCurrentSnap(closestSnapIndex);
    y.set(getSnapPosition(closestSnapIndex));
  }, [y, snapPoints, getSnapPosition, onClose, preventClose]);

  // Initialize position when opened
  useEffect(() => {
    if (isOpen) {
      const initialPosition = getSnapPosition(initialSnap);
      y.set(initialPosition);
      setCurrentSnap(initialSnap);
    }
  }, [isOpen, initialSnap, getSnapPosition, y]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(() => {
    if (!preventClose) {
      onClose();
    }
  }, [onClose, preventClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !preventClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, preventClose]);

  // Programmatic snap to position
  const snapTo = useCallback((snapIndex: number) => {
    if (snapIndex >= 0 && snapIndex < snapPoints.length) {
      const position = getSnapPosition(snapIndex);
      y.set(position);
      setCurrentSnap(snapIndex);
    }
  }, [snapPoints, getSnapPosition, y]);

  // Don't render on desktop unless specifically mobile
  if (!isMobile && !isTouchDevice) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            onClick={handleBackdropClick}
          >
            <motion.div
              className={`
                absolute inset-0 bg-black
                ${backdropBlur ? 'backdrop-blur-sm' : ''}
              `}
              style={{ opacity: backdropOpacity }}
            />
          </motion.div>

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: window?.innerHeight || 800 }}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{ y }}
            initial={{ y: window?.innerHeight || 800 }}
            animate={{ y: getSnapPosition(initialSnap) }}
            exit={{ y: window?.innerHeight || 800 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: isDragging ? 0 : 0.3
            }}
            className={`
              fixed left-0 right-0 z-50
              bg-slate-900/95 backdrop-blur-xl
              border-t border-slate-700/50
              rounded-t-3xl shadow-2xl
              ${className}
            `}
            style={{
              height: `${100 - snapPoints[0]}%`,
              paddingBottom: `${safeArea.bottom}px`,
            }}
          >
            {/* Drag Handle */}
            {showHandle && (
              <div 
                className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="w-12 h-1.5 bg-slate-600 rounded-full" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/30">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                {!preventClose && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="w-8 h-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>

            {/* Snap Point Indicators */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
              {snapPoints.map((_, index) => (
                <button
                  key={index}
                  onClick={() => snapTo(index)}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-200
                    ${currentSnap === index 
                      ? 'bg-blue-400 scale-125' 
                      : 'bg-slate-600 hover:bg-slate-500'
                    }
                  `}
                />
              ))}
            </div>

            {/* Quick Actions Bar */}
            <div className="absolute top-4 right-4 flex gap-2">
              {snapPoints.map((percentage, index) => (
                <button
                  key={index}
                  onClick={() => snapTo(index)}
                  className={`
                    px-2 py-1 text-xs rounded-md transition-all duration-200
                    ${currentSnap === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }
                  `}
                >
                  {percentage}%
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for managing bottom sheet state
export function useBottomSheet(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [currentSnap, setCurrentSnap] = useState(1);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  const snapTo = useCallback((snapIndex: number) => {
    setCurrentSnap(snapIndex);
  }, []);

  return {
    isOpen,
    currentSnap,
    open,
    close,
    toggle,
    snapTo,
  };
}