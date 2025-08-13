'use client';

import { useRef, useCallback, useState, useEffect } from 'react';

export enum GestureType {
  DoubleTap = 'double-tap',
  Swipe = 'swipe',
  Pinch = 'pinch',
  LongPress = 'long-press',
  Pan = 'pan',
  Tap = 'tap'
}

export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
  id: number;
}

export interface GestureData {
  type: GestureType | null;
  startPoint: TouchPoint | null;
  endPoint: TouchPoint | null;
  deltaX: number;
  deltaY: number;
  distance: number;
  velocity: number;
  direction: 'up' | 'down' | 'left' | 'right' | null;
  scale: number;
  duration: number;
  zone: 'left' | 'right' | 'center' | 'top' | 'bottom';
}

export interface GestureConfig {
  doubleTapDelay: number;
  swipeMinDistance: number;
  swipeMaxTime: number;
  longPressDelay: number;
  pinchMinScale: number;
  tapMaxDistance: number;
  sensitivity: number;
}

export interface UseGesturesProps {
  onDoubleTap?: (data: GestureData) => void;
  onSwipe?: (data: GestureData) => void;
  onPinch?: (data: GestureData) => void;
  onLongPress?: (data: GestureData) => void;
  onPan?: (data: GestureData) => void;
  onTap?: (data: GestureData) => void;
  config?: Partial<GestureConfig>;
  enabled?: boolean;
  element?: HTMLElement | null;
}

export interface UseGesturesReturn {
  // Touch event handlers
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: (e: TouchEvent) => void;
  
  // Gesture state
  currentGesture: GestureType | null;
  gestureData: GestureData;
  
  // Configuration
  enableGestures: (enabled: boolean) => void;
  configureSensitivity: (sensitivity: number) => void;
}

const DEFAULT_CONFIG: GestureConfig = {
  doubleTapDelay: 300,
  swipeMinDistance: 50,
  swipeMaxTime: 300,
  longPressDelay: 500,
  pinchMinScale: 0.1,
  tapMaxDistance: 10,
  sensitivity: 1.0,
};

class GestureRecognizer {
  private config: GestureConfig;
  private touchHistory: TouchPoint[] = [];
  private startTime: number = 0;
  private lastTapTime: number = 0;
  private longPressTimer: NodeJS.Timeout | null = null;
  private initialDistance: number = 0;
  private currentDistance: number = 0;
  private isLongPressTriggered: boolean = false;

  constructor(config: Partial<GestureConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  updateConfig(config: Partial<GestureConfig>) {
    this.config = { ...this.config, ...config };
  }

  private getDistance(p1: TouchPoint, p2: TouchPoint): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private getVelocity(startTime: number, endTime: number, distance: number): number {
    const duration = endTime - startTime;
    return duration > 0 ? distance / duration : 0;
  }

  private getDirection(deltaX: number, deltaY: number): 'up' | 'down' | 'left' | 'right' | null {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    if (absX < 10 && absY < 10) return null;
    
    if (absX > absY) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  private getZone(x: number, y: number, element: HTMLElement): 'left' | 'right' | 'center' | 'top' | 'bottom' {
    const rect = element.getBoundingClientRect();
    const relativeX = (x - rect.left) / rect.width;
    const relativeY = (y - rect.top) / rect.height;
    
    // Top and bottom zones (first 20% and last 20% vertically)
    if (relativeY < 0.2) return 'top';
    if (relativeY > 0.8) return 'bottom';
    
    // Left and right zones (first 30% and last 30% horizontally)
    if (relativeX < 0.3) return 'left';
    if (relativeX > 0.7) return 'right';
    
    return 'center';
  }

  private getTouchPoints(touches: TouchList): TouchPoint[] {
    const points: TouchPoint[] = [];
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      points.push({
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),
        id: touch.identifier,
      });
    }
    return points;
  }

  private createGestureData(
    type: GestureType | null,
    startPoint: TouchPoint | null,
    endPoint: TouchPoint | null,
    element?: HTMLElement
  ): GestureData {
    const deltaX = startPoint && endPoint ? endPoint.x - startPoint.x : 0;
    const deltaY = startPoint && endPoint ? endPoint.y - startPoint.y : 0;
    const distance = startPoint && endPoint ? this.getDistance(startPoint, endPoint) : 0;
    const duration = startPoint && endPoint ? endPoint.timestamp - startPoint.timestamp : 0;
    const velocity = this.getVelocity(startPoint?.timestamp || 0, endPoint?.timestamp || 0, distance);
    const direction = this.getDirection(deltaX, deltaY);
    const zone = element && startPoint ? this.getZone(startPoint.x, startPoint.y, element) : 'center';

    return {
      type,
      startPoint,
      endPoint,
      deltaX,
      deltaY,
      distance,
      velocity,
      direction,
      scale: this.currentDistance > 0 ? this.currentDistance / this.initialDistance : 1,
      duration,
      zone,
    };
  }

  onTouchStart(touches: TouchList, element?: HTMLElement): GestureData | null {
    const points = this.getTouchPoints(touches);
    this.touchHistory = points;
    this.startTime = Date.now();
    this.isLongPressTriggered = false;

    // Handle multi-touch (pinch)
    if (points.length === 2) {
      this.initialDistance = this.getDistance(points[0], points[1]);
      this.currentDistance = this.initialDistance;
    }

    // Set long press timer
    if (points.length === 1) {
      this.longPressTimer = setTimeout(() => {
        this.isLongPressTriggered = true;
      }, this.config.longPressDelay);
    }

    return this.createGestureData(null, points[0] || null, null, element);
  }

  onTouchMove(touches: TouchList, element?: HTMLElement): GestureData | null {
    const points = this.getTouchPoints(touches);
    
    if (this.touchHistory.length === 0) return null;

    // Handle pinch gesture
    if (points.length === 2 && this.touchHistory.length === 2) {
      this.currentDistance = this.getDistance(points[0], points[1]);
      const scale = this.currentDistance / this.initialDistance;
      
      if (Math.abs(scale - 1) > this.config.pinchMinScale) {
        return this.createGestureData(GestureType.Pinch, this.touchHistory[0], points[0], element);
      }
    }

    // Handle pan gesture
    if (points.length === 1 && this.touchHistory.length === 1) {
      const distance = this.getDistance(this.touchHistory[0], points[0]);
      
      // Cancel long press if moving too much
      if (distance > this.config.tapMaxDistance && this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }

      if (distance > 10) { // Minimum distance for pan
        return this.createGestureData(GestureType.Pan, this.touchHistory[0], points[0], element);
      }
    }

    return null;
  }

  onTouchEnd(touches: TouchList, element?: HTMLElement): GestureData | null {
    if (this.touchHistory.length === 0) return null;

    const endTime = Date.now();
    const points = this.getTouchPoints(touches);
    const startPoint = this.touchHistory[0];
    const endPoint = points[0] || startPoint;

    // Clear long press timer
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    // Long press detected
    if (this.isLongPressTriggered) {
      return this.createGestureData(GestureType.LongPress, startPoint, endPoint, element);
    }

    const distance = this.getDistance(startPoint, endPoint);
    const duration = endTime - this.startTime;

    // Tap or double tap
    if (distance < this.config.tapMaxDistance && duration < this.config.longPressDelay) {
      const timeSinceLastTap = endTime - this.lastTapTime;
      
      if (timeSinceLastTap < this.config.doubleTapDelay) {
        // Double tap
        this.lastTapTime = 0; // Reset to prevent triple tap
        return this.createGestureData(GestureType.DoubleTap, startPoint, endPoint, element);
      } else {
        // Single tap
        this.lastTapTime = endTime;
        // Return tap after delay to check for double tap
        setTimeout(() => {
          if (Date.now() - this.lastTapTime >= this.config.doubleTapDelay) {
            // Single tap confirmed
          }
        }, this.config.doubleTapDelay);
        return this.createGestureData(GestureType.Tap, startPoint, endPoint, element);
      }
    }

    // Swipe gesture
    if (distance >= this.config.swipeMinDistance && duration <= this.config.swipeMaxTime) {
      return this.createGestureData(GestureType.Swipe, startPoint, endPoint, element);
    }

    // Reset
    this.touchHistory = [];
    return null;
  }
}

export function useGestures({
  onDoubleTap,
  onSwipe,
  onPinch,
  onLongPress,
  onPan,
  onTap,
  config = {},
  enabled = true,
  element = null,
}: UseGesturesProps = {}): UseGesturesReturn {
  const recognizerRef = useRef<GestureRecognizer>(new GestureRecognizer(config));
  const [currentGesture, setCurrentGesture] = useState<GestureType | null>(null);
  const [gestureData, setGestureData] = useState<GestureData>({
    type: null,
    startPoint: null,
    endPoint: null,
    deltaX: 0,
    deltaY: 0,
    distance: 0,
    velocity: 0,
    direction: null,
    scale: 1,
    duration: 0,
    zone: 'center',
  });
  const [isEnabled, setIsEnabled] = useState(enabled);

  // Update config when it changes
  useEffect(() => {
    recognizerRef.current.updateConfig(config);
  }, [config]);

  const handleGesture = useCallback((data: GestureData | null) => {
    if (!data || !isEnabled) return;

    setCurrentGesture(data.type);
    setGestureData(data);

    // Call appropriate callback
    switch (data.type) {
      case GestureType.DoubleTap:
        onDoubleTap?.(data);
        break;
      case GestureType.Swipe:
        onSwipe?.(data);
        break;
      case GestureType.Pinch:
        onPinch?.(data);
        break;
      case GestureType.LongPress:
        onLongPress?.(data);
        break;
      case GestureType.Pan:
        onPan?.(data);
        break;
      case GestureType.Tap:
        onTap?.(data);
        break;
    }
  }, [isEnabled, onDoubleTap, onSwipe, onPinch, onLongPress, onPan, onTap]);

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (!isEnabled) return;
    
    e.preventDefault();
    const data = recognizerRef.current.onTouchStart(e.touches, element || e.currentTarget as HTMLElement);
    if (data) {
      setGestureData(data);
    }
  }, [isEnabled, element]);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isEnabled) return;
    
    e.preventDefault();
    const data = recognizerRef.current.onTouchMove(e.touches, element || e.currentTarget as HTMLElement);
    handleGesture(data);
  }, [isEnabled, element, handleGesture]);

  const onTouchEnd = useCallback((e: TouchEvent) => {
    if (!isEnabled) return;
    
    e.preventDefault();
    const data = recognizerRef.current.onTouchEnd(e.touches, element || e.currentTarget as HTMLElement);
    handleGesture(data);
    
    // Clear current gesture after a short delay
    setTimeout(() => {
      setCurrentGesture(null);
    }, 100);
  }, [isEnabled, element, handleGesture]);

  const enableGestures = useCallback((enabled: boolean) => {
    setIsEnabled(enabled);
  }, []);

  const configureSensitivity = useCallback((sensitivity: number) => {
    recognizerRef.current.updateConfig({ sensitivity });
  }, []);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    currentGesture,
    gestureData,
    enableGestures,
    configureSensitivity,
  };
}