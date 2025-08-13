'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCcw, 
  RotateCw, 
  Maximize, 
  Minimize,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Loader2
} from 'lucide-react';
import { EnhancedVideoPlayer } from './enhanced-video-player';
import { GestureControls } from './gesture-controls';
import { FloatingControls } from './floating-controls';
import { VideoChapter } from '@/lib/video/chapter-data';
import { useBreakpoint, useOrientation } from '@/hooks/use-media-query';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface MobileVideoPlayerProps {
  videoUrl: string;
  title: string;
  chapters: VideoChapter[];
  onOrientationChange: (orientation: 'portrait' | 'landscape') => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onSpeedChange: (speed: number) => void;
  onPlayPause: () => void;
  onLessonChange: (direction: 'prev' | 'next') => void;
  gesturesEnabled?: boolean;
  autoRotate?: boolean;
  className?: string;
}

interface VideoState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isFullscreen: boolean;
  isLoading: boolean;
  isMuted: boolean;
}

export function MobileVideoPlayer({
  videoUrl,
  title,
  chapters = [],
  onOrientationChange,
  onSeek,
  onVolumeChange,
  onSpeedChange,
  onPlayPause,
  onLessonChange,
  gesturesEnabled = true,
  autoRotate = true,
  className = ''
}: MobileVideoPlayerProps) {
  const { isMobile, isTouchDevice, isMobileLandscape } = useBreakpoint();
  const orientation = useOrientation();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [videoState, setVideoState] = useState<VideoState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    isFullscreen: false,
    isLoading: true,
    isMuted: false,
  });

  const [showMobileControls, setShowMobileControls] = useState(true);
  const [isVerticalVideo, setIsVerticalVideo] = useState(false);
  const [brightness, setBrightness] = useState(1);
  const [rotationLocked, setRotationLocked] = useLocalStorage('video-rotation-locked', false);
  const [preferredOrientation, setPreferredOrientation] = useLocalStorage<'portrait' | 'landscape'>('video-preferred-orientation', 'landscape');

  // Handle orientation changes
  useEffect(() => {
    onOrientationChange(orientation);
    
    // Auto-rotate video for landscape on mobile
    if (isMobile && autoRotate && !rotationLocked) {
      if (orientation === 'landscape') {
        requestFullscreen();
      } else if (videoState.isFullscreen) {
        exitFullscreen();
      }
    }
  }, [orientation, isMobile, autoRotate, rotationLocked, onOrientationChange, videoState.isFullscreen]);

  // Video event handlers
  const handleVideoLoad = useCallback(() => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    const aspectRatio = video.videoWidth / video.videoHeight;
    
    // Detect vertical video (aspect ratio < 1)
    setIsVerticalVideo(aspectRatio < 1);
    
    setVideoState(prev => ({
      ...prev,
      duration: video.duration,
      isLoading: false,
    }));
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    
    setVideoState(prev => ({
      ...prev,
      currentTime: videoRef.current!.currentTime,
    }));
  }, []);

  const handleVolumeChange = useCallback(() => {
    if (!videoRef.current) return;
    
    setVideoState(prev => ({
      ...prev,
      volume: videoRef.current!.volume,
      isMuted: videoRef.current!.muted,
    }));
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    
    if (videoState.isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setVideoState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
    
    onPlayPause();
  }, [videoState.isPlaying, onPlayPause]);

  const handleSeek = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    
    const newTime = Math.max(0, Math.min(videoState.duration, videoState.currentTime + seconds));
    videoRef.current.currentTime = newTime;
    onSeek(seconds);
  }, [videoState.currentTime, videoState.duration, onSeek]);

  const handleVolumeUpdate = useCallback((volume: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.volume = volume;
    videoRef.current.muted = volume === 0;
    onVolumeChange(volume);
  }, [onVolumeChange]);

  const handleSpeedUpdate = useCallback((speed: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.playbackRate = speed;
    setVideoState(prev => ({ ...prev, playbackRate: speed }));
    onSpeedChange(speed);
  }, [onSpeedChange]);

  // Fullscreen handlers
  const requestFullscreen = useCallback(async () => {
    if (!videoRef.current?.parentElement) return;
    
    try {
      if (document.fullscreenElement) return;
      
      await videoRef.current.parentElement.requestFullscreen();
      setVideoState(prev => ({ ...prev, isFullscreen: true }));
      
      // Lock to landscape in fullscreen
      if (screen.orientation && 'lock' in screen.orientation) {
        try {
          await (screen.orientation as any).lock('landscape');
        } catch (error) {
          console.warn('Screen orientation lock failed:', error);
        }
      }
    } catch (error) {
      console.error('Fullscreen request failed:', error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setVideoState(prev => ({ ...prev, isFullscreen: false }));
      
      // Unlock orientation
      if (screen.orientation && 'unlock' in screen.orientation) {
        (screen.orientation as any).unlock();
      }
    } catch (error) {
      console.error('Exit fullscreen failed:', error);
    }
  }, []);

  // Picture-in-Picture
  const togglePictureInPicture = useCallback(async () => {
    if (!videoRef.current) return;
    
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Picture-in-Picture failed:', error);
    }
  }, []);

  // Brightness control
  const handleBrightnessChange = useCallback((brightness: number) => {
    setBrightness(brightness);
    if (videoRef.current) {
      videoRef.current.style.filter = `brightness(${brightness})`;
    }
  }, []);

  // Auto-hide controls
  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    
    if (videoState.isPlaying && showMobileControls) {
      hideTimer = setTimeout(() => {
        setShowMobileControls(false);
      }, 3000);
    }
    
    return () => {
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [videoState.isPlaying, showMobileControls]);

  // Show controls on touch
  const handleTouch = useCallback(() => {
    setShowMobileControls(true);
  }, []);

  // Don't render mobile player on desktop
  if (!isMobile && !isTouchDevice) {
    return (
      <EnhancedVideoPlayer
        videoUrl={videoUrl}
        title={title}
        chapters={chapters}
        className={className}
      />
    );
  }

  return (
    <div 
      className={`
        relative bg-black rounded-xl overflow-hidden
        ${videoState.isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}
        ${isMobileLandscape && !isVerticalVideo ? 'w-full h-screen' : 'aspect-video'}
        ${className}
      `}
      onTouchStart={handleTouch}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className={`
          w-full h-full object-contain
          ${isVerticalVideo && orientation === 'portrait' ? 'object-cover' : 'object-contain'}
        `}
        playsInline
        preload="metadata"
        onLoadedMetadata={handleVideoLoad}
        onTimeUpdate={handleTimeUpdate}
        onVolumeChange={handleVolumeChange}
        onPlay={() => setVideoState(prev => ({ ...prev, isPlaying: true }))}
        onPause={() => setVideoState(prev => ({ ...prev, isPlaying: false }))}
        onWaiting={() => setVideoState(prev => ({ ...prev, isLoading: true }))}
        onCanPlay={() => setVideoState(prev => ({ ...prev, isLoading: false }))}
        style={{ filter: `brightness(${brightness})` }}
      />

      {/* Loading Overlay */}
      <AnimatePresence>
        {videoState.isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50"
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
              <p className="text-white text-sm">Carregando vídeo...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture Controls */}
      {gesturesEnabled && (
        <GestureControls
          videoRef={videoRef}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeUpdate}
          onLessonChange={onLessonChange}
          onSpeedChange={handleSpeedUpdate}
          onPlayPause={handlePlayPause}
          isPlaying={videoState.isPlaying}
          currentVolume={videoState.volume}
          currentSpeed={videoState.playbackRate}
          gesturesEnabled={gesturesEnabled}
        />
      )}

      {/* Mobile Controls Overlay */}
      <AnimatePresence>
        {showMobileControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"
          >
            {/* Top Controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <h3 className="text-white font-semibold text-lg truncate flex-1">
                {title}
              </h3>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={videoState.isFullscreen ? exitFullscreen : requestFullscreen}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                >
                  {videoState.isFullscreen ? (
                    <Minimize className="h-5 w-5" />
                  ) : (
                    <Maximize className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Center Play/Pause */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayPause}
                className="w-16 h-16 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                {videoState.isPlaying ? (
                  <Pause className="h-8 w-8 text-white" />
                ) : (
                  <Play className="h-8 w-8 text-white ml-1" />
                )}
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-4 right-4">
              {/* Progress Bar */}
              <div className="w-full bg-white/20 h-1 rounded-full mb-4">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ 
                    width: videoState.duration > 0 
                      ? `${(videoState.currentTime / videoState.duration) * 100}%` 
                      : '0%' 
                  }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSeek(-10)}
                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={() => handleVolumeUpdate(videoState.isMuted ? 1 : 0)}
                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  >
                    {videoState.isMuted || videoState.volume === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleSeek(10)}
                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  >
                    <RotateCw className="h-5 w-5" />
                  </button>
                </div>

                <div className="text-white text-sm font-mono">
                  {Math.floor(videoState.currentTime / 60)}:{Math.floor(videoState.currentTime % 60).toString().padStart(2, '0')} / {Math.floor(videoState.duration / 60)}:{Math.floor(videoState.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Controls */}
      <FloatingControls
        currentSpeed={videoState.playbackRate}
        currentVolume={videoState.volume}
        onSpeedChange={handleSpeedUpdate}
        onVolumeChange={handleVolumeUpdate}
        onPiPToggle={togglePictureInPicture}
        onSettingsOpen={() => console.log('Settings opened')}
        onBrightnessChange={handleBrightnessChange}
        isVisible={!videoState.isFullscreen}
      />
    </div>
  );
}