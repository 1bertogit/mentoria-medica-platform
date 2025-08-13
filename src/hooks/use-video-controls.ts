'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { VideoChapter } from '@/lib/video/chapter-data';

interface VideoControlsOptions {
  onNextLesson?: () => void;
  onPreviousLesson?: () => void;
  onChapterChange?: (chapter: VideoChapter | null) => void;
  chapters?: VideoChapter[];
}

export interface VideoControlsState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  isPiPActive: boolean;
  playbackRate: number;
  currentChapter: VideoChapter | null;
}

export const useVideoControls = (
  playerRef: React.RefObject<any>,
  options: VideoControlsOptions = {}
) => {
  const { onNextLesson, onPreviousLesson, onChapterChange, chapters = [] } = options;
  
  const [state, setState] = useState<VideoControlsState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isFullscreen: false,
    isPiPActive: false,
    playbackRate: 1,
    currentChapter: null,
  });

  const keyboardHandlerRef = useRef<(event: KeyboardEvent) => void>();

  // Update current chapter based on time
  const updateCurrentChapter = useCallback((currentTime: number) => {
    if (chapters.length === 0) return;
    
    const chapter = chapters.find(ch => 
      currentTime >= ch.startTime && currentTime < ch.endTime
    ) || null;
    
    if (chapter?.id !== state.currentChapter?.id) {
      setState(prev => ({ ...prev, currentChapter: chapter }));
      onChapterChange?.(chapter);
    }
  }, [chapters, state.currentChapter?.id, onChapterChange]);

  // Helper functions for video controls
  const playVideo = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  }, [playerRef]);

  const pauseVideo = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, [playerRef]);

  const seekToTime = useCallback((time: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime(time);
      setState(prev => ({ ...prev, currentTime: time }));
      updateCurrentChapter(time);
    }
  }, [playerRef, updateCurrentChapter]);

  // Video control functions
  const controls = {
    play: playVideo,
    pause: pauseVideo,

    togglePlayPause: useCallback(() => {
      if (state.isPlaying) {
        pauseVideo();
      } else {
        playVideo();
      }
    }, [state.isPlaying, playVideo, pauseVideo]),

    seekTo: seekToTime,

    seekBy: useCallback((seconds: number) => {
      if (playerRef.current) {
        const newTime = Math.max(0, Math.min(state.duration, state.currentTime + seconds));
        seekToTime(newTime);
      }
    }, [playerRef, state.currentTime, state.duration, seekToTime]),

    setVolume: useCallback((volume: number) => {
      if (playerRef.current) {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        playerRef.current.volume(clampedVolume);
        setState(prev => ({ 
          ...prev, 
          volume: clampedVolume,
          isMuted: clampedVolume === 0 
        }));
      }
    }, [playerRef]),

    toggleMute: useCallback(() => {
      if (playerRef.current) {
        const isMuted = !state.isMuted;
        playerRef.current.muted(isMuted);
        setState(prev => ({ ...prev, isMuted }));
      }
    }, [playerRef, state.isMuted]),

    setPlaybackRate: useCallback((rate: number) => {
      if (playerRef.current) {
        playerRef.current.playbackRate(rate);
        setState(prev => ({ ...prev, playbackRate: rate }));
      }
    }, [playerRef]),

    toggleFullscreen: useCallback(() => {
      if (playerRef.current) {
        if (state.isFullscreen) {
          playerRef.current.exitFullscreen();
        } else {
          playerRef.current.requestFullscreen();
        }
      }
    }, [playerRef, state.isFullscreen]),

    enterPictureInPicture: useCallback(async () => {
      if (playerRef.current) {
        try {
          const videoElement = playerRef.current.el().querySelector('video');
          if (videoElement && 'requestPictureInPicture' in videoElement) {
            await videoElement.requestPictureInPicture();
            setState(prev => ({ ...prev, isPiPActive: true }));
          }
        } catch (error) {
          console.warn('Picture-in-Picture not supported or failed:', error);
        }
      }
    }, [playerRef]),

    exitPictureInPicture: useCallback(async () => {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
          setState(prev => ({ ...prev, isPiPActive: false }));
        }
      } catch (error) {
        console.warn('Failed to exit Picture-in-Picture:', error);
      }
    }, []),

    jumpToChapter: useCallback((chapter: VideoChapter) => {
      seekToTime(chapter.startTime);
    }, [seekToTime]),

    nextChapter: useCallback(() => {
      if (state.currentChapter && chapters.length > 0) {
        const currentIndex = chapters.findIndex(ch => ch.id === state.currentChapter!.id);
        if (currentIndex !== -1 && currentIndex < chapters.length - 1) {
          seekToTime(chapters[currentIndex + 1].startTime);
        }
      }
    }, [state.currentChapter, chapters, seekToTime]),

    previousChapter: useCallback(() => {
      if (state.currentChapter && chapters.length > 0) {
        const currentIndex = chapters.findIndex(ch => ch.id === state.currentChapter!.id);
        if (currentIndex > 0) {
          seekToTime(chapters[currentIndex - 1].startTime);
        }
      }
    }, [state.currentChapter, chapters, seekToTime]),
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          controls.togglePlayPause();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          controls.seekBy(-10);
          break;
        case 'ArrowRight':
          event.preventDefault();
          controls.seekBy(10);
          break;
        case 'ArrowUp':
          event.preventDefault();
          controls.setVolume(Math.min(1, state.volume + 0.1));
          break;
        case 'ArrowDown':
          event.preventDefault();
          controls.setVolume(Math.max(0, state.volume - 0.1));
          break;
        case 'KeyM':
          event.preventDefault();
          controls.toggleMute();
          break;
        case 'KeyF':
          event.preventDefault();
          controls.toggleFullscreen();
          break;
        case 'KeyP':
          if (event.shiftKey) {
            event.preventDefault();
            controls.enterPictureInPicture();
          } else if (onPreviousLesson) {
            event.preventDefault();
            onPreviousLesson();
          }
          break;
        case 'KeyN':
          if (onNextLesson) {
            event.preventDefault();
            onNextLesson();
          }
          break;
        case 'Escape':
          event.preventDefault();
          if (state.isPiPActive) {
            controls.exitPictureInPicture();
          } else if (state.isFullscreen) {
            controls.toggleFullscreen();
          }
          break;
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
        case 'Digit9':
          {
            event.preventDefault();
            const percentage = parseInt(event.code.slice(-1)) / 10;
            controls.seekTo(state.duration * percentage);
          }
          break;
        case 'Minus':
        case 'NumpadSubtract':
          event.preventDefault();
          controls.setVolume(Math.max(0, state.volume - 0.1));
          break;
        case 'Equal':
        case 'NumpadAdd':
          event.preventDefault();
          controls.setVolume(Math.min(1, state.volume + 0.1));
          break;
        default:
          break;
      }
    };

    keyboardHandlerRef.current = handleKeydown;
    document.addEventListener('keydown', handleKeydown);

    return () => {
      if (keyboardHandlerRef.current) {
        document.removeEventListener('keydown', keyboardHandlerRef.current);
      }
    };
  }, [controls, state, onNextLesson, onPreviousLesson]);

  // Picture-in-Picture event listeners
  useEffect(() => {
    const handlePiPEnter = () => setState(prev => ({ ...prev, isPiPActive: true }));
    const handlePiPLeave = () => setState(prev => ({ ...prev, isPiPActive: false }));

    document.addEventListener('enterpictureinpicture', handlePiPEnter);
    document.addEventListener('leavepictureinpicture', handlePiPLeave);

    return () => {
      document.removeEventListener('enterpictureinpicture', handlePiPEnter);
      document.removeEventListener('leavepictureinpicture', handlePiPLeave);
    };
  }, []);

  // Update state from player events
  const updatePlayerState = useCallback((player: any) => {
    if (!player) return;

    setState(prev => ({
      ...prev,
      currentTime: player.currentTime() || 0,
      duration: player.duration() || 0,
      volume: player.volume() || 0,
      isMuted: player.muted() || false,
      isFullscreen: player.isFullscreen() || false,
      playbackRate: player.playbackRate() || 1,
    }));

    updateCurrentChapter(player.currentTime() || 0);
  }, [updateCurrentChapter]);

  return {
    state,
    controls,
    updatePlayerState,
  };
};