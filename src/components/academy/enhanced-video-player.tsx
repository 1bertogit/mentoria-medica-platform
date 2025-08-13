'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/forest/index.css';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  PictureInPicture2,
  Settings,
  Download,
  Keyboard,
  WifiOff,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { VideoChapters, ChapterProgressBar } from './video-chapters';
import { useVideoControls } from '@/hooks/use-video-controls';
import { useOffline } from '@/hooks/use-offline';
import { downloadManager } from '@/lib/services/download-manager';
import { VideoChapter, formatTime } from '@/lib/video/chapter-data';

interface EnhancedVideoPlayerProps {
  videoUrl?: string;
  title: string;
  chapters?: VideoChapter[];
  onPlayPause?: () => void;
  onNextLesson?: () => void;
  onPreviousLesson?: () => void;
  autoplay?: boolean;
  className?: string;
  // Additional props for integration
  userId?: string;
  courseId?: string;
  lessonId?: string;
  courseName?: string;
  lessonName?: string;
  onWatchTimeUpdate?: (minutes: number) => void;
  onSpeedChange?: (speed: number) => void;
  onNoteTaken?: () => void;
  onBookmarkCreated?: () => void;
}

export function EnhancedVideoPlayer({
  videoUrl,
  title,
  chapters = [],
  onPlayPause,
  onNextLesson,
  onPreviousLesson,
  autoplay = false,
  className = '',
  userId,
  courseId,
  lessonId,
  courseName,
  lessonName,
  onWatchTimeUpdate,
  onSpeedChange,
  onNoteTaken,
  onBookmarkCreated,
}: EnhancedVideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [offlineVideoUrl, setOfflineVideoUrl] = useState<string | null>(null);
  const [isOfflineVideo, setIsOfflineVideo] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Offline functionality
  const { isOnline, downloadedLessons } = useOffline();

  // Video controls hook
  const { state, controls, updatePlayerState } = useVideoControls(playerRef, {
    onNextLesson,
    onPreviousLesson,
    chapters,
    onChapterChange: chapter => {
      console.log('Chapter changed:', chapter?.title);
    },
  });

  // Check for offline video when component mounts or lesson changes
  useEffect(() => {
    const checkOfflineVideo = async () => {
      if (lessonId && downloadedLessons.includes(lessonId)) {
        try {
          const offlineBlob =
            await downloadManager.getDownloadedLesson(lessonId);
          if (offlineBlob) {
            const blobUrl = URL.createObjectURL(offlineBlob);
            setOfflineVideoUrl(blobUrl);
            setIsOfflineVideo(true);
          }
        } catch (error) {
          console.error('Failed to load offline video:', error);
        }
      } else {
        setOfflineVideoUrl(null);
        setIsOfflineVideo(false);
      }
    };

    checkOfflineVideo();
  }, [lessonId, downloadedLessons]);

  // Temporary mock for markCompleted until full integration
  const markCompleted = async () => {
    console.log('Lesson completed:', { userId, courseId, lessonId });
  };

  const videoRef = useCallback(
    (node: HTMLVideoElement) => {
      if (node === null) return;

      const videoSource =
        isOfflineVideo && offlineVideoUrl ? offlineVideoUrl : videoUrl;
      if (!videoSource) return;

      const videoJsOptions = {
        autoplay: autoplay,
        controls: false,
        responsive: true,
        fluid: true,
        preload: 'metadata',
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2, 3],
        html5: {
          vhs: {
            overrideNative: true,
          },
        },
        sources: [
          {
            src: videoSource,
            type: getVideoType(videoSource),
          },
        ],
        poster: undefined,
      };

      playerRef.current = videojs(node, videoJsOptions, () => {
        console.log('Video.js player ready');
        setIsLoading(false);
      });

      const player = playerRef.current;

      player.on('play', () => updatePlayerState(player));
      player.on('pause', () => updatePlayerState(player));
      player.on('timeupdate', () => updatePlayerState(player));
      player.on('loadedmetadata', () => updatePlayerState(player));
      player.on('volumechange', () => updatePlayerState(player));
      player.on('ratechange', () => updatePlayerState(player));
      player.on('fullscreenchange', () => updatePlayerState(player));
      player.on('ended', () => {
        if (userId && courseId && lessonId) {
          markCompleted().catch(console.error);
        }
      });
      player.on('error', (error: any) => {
        console.error('Video.js error:', error);
        setIsLoading(false);
      });

      return () => {
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
      };
    },
    [
      videoUrl,
      autoplay,
      updatePlayerState,
      onPlayPause,
      userId,
      courseId,
      lessonId,
      isOfflineVideo,
      offlineVideoUrl,
    ]
  );

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);

    if (state.isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [state.isPlaying]);

  // Mouse movement handler
  const handleMouseMove = useCallback(() => {
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Show controls when paused
  useEffect(() => {
    if (!state.isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    } else {
      resetControlsTimeout();
    }
  }, [state.isPlaying, resetControlsTimeout]);

  const getVideoType = (url: string): string => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'video/youtube';
    }
    if (url.includes('.m3u8')) {
      return 'application/x-mpegURL';
    }
    if (url.includes('.mp4')) {
      return 'video/mp4';
    }
    return 'video/mp4'; // default
  };

  const playbackRates = [
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: '1x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' },
    { value: 3, label: '3x' },
  ];

  const keyboardShortcuts = [
    { key: 'Space', action: 'Play/Pause' },
    { key: '← →', action: 'Skip ±10s' },
    { key: '↑ ↓', action: 'Volume ±10%' },
    { key: 'M', action: 'Mute/Unmute' },
    { key: 'F', action: 'Fullscreen' },
    { key: 'Shift + P', action: 'Picture-in-Picture' },
    { key: 'N/P', action: 'Next/Previous Lesson' },
    { key: '1-9', action: 'Jump to 10%-90%' },
    { key: 'Esc', action: 'Exit Fullscreen/PiP' },
  ];

  if (!videoUrl) {
    return (
      <div
        className={`overflow-hidden rounded-xl bg-slate-900/50 backdrop-blur-sm ${className}`}
      >
        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
          <div className="text-center">
            <Play className="mx-auto mb-4 h-16 w-16 text-slate-600" />
            <p className="text-slate-400">Nenhum vídeo disponível</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={`space-y-4 ${className}`}>
        {/* Video Container */}
        <div className="relative overflow-hidden rounded-xl bg-black shadow-2xl">
          <div
            className="relative aspect-video w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => state.isPlaying && setShowControls(false)}
          >
            {/* Video Element */}
            <div data-vjs-player>
              <video
                ref={videoRef}
                className="video-js vjs-theme-forest vjs-fluid h-full w-full"
              />
            </div>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                  <p className="text-white">Carregando vídeo...</p>
                </div>
              </div>
            )}

            {/* Custom Controls Overlay */}
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'pointer-events-none opacity-0'} `}
            >
              {/* Top Controls */}
              <div className="absolute left-0 right-0 top-0 bg-gradient-to-b from-black/60 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {title}
                    </h3>
                    {state.currentChapter && (
                      <p className="text-sm text-blue-400">
                        {state.currentChapter.title}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                          onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
                        >
                          <Keyboard className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Atalhos do teclado</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                          onClick={() => setShowSettings(!showSettings)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Configurações</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Center Play/Pause Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-20 w-20 rounded-full bg-black/50 text-white transition-all duration-200 hover:scale-110 hover:bg-black/70"
                  onClick={controls.togglePlayPause}
                >
                  {state.isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="ml-1 h-8 w-8" />
                  )}
                </Button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Chapter Progress Bar */}
                {chapters.length > 0 && (
                  <div className="mb-4">
                    <ChapterProgressBar
                      chapters={chapters}
                      currentTime={state.currentTime}
                      duration={state.duration}
                      onSeek={controls.seekTo}
                    />
                  </div>
                )}

                {/* Main Controls */}
                <div className="flex items-center justify-between">
                  {/* Left Controls */}
                  <div className="flex items-center gap-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                          onClick={() => controls.seekBy(-10)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Voltar 10s</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                          onClick={controls.togglePlayPause}
                        >
                          {state.isPlaying ? (
                            <Pause className="h-5 w-5" />
                          ) : (
                            <Play className="ml-0.5 h-5 w-5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Play/Pause (Space)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                          onClick={() => controls.seekBy(10)}
                        >
                          <RotateCw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Avançar 10s</TooltipContent>
                    </Tooltip>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                            onClick={controls.toggleMute}
                          >
                            {state.isMuted || state.volume === 0 ? (
                              <VolumeX className="h-4 w-4" />
                            ) : (
                              <Volume2 className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Mute/Unmute (M)</TooltipContent>
                      </Tooltip>

                      <div className="w-20">
                        <Slider
                          value={[state.isMuted ? 0 : state.volume * 100]}
                          onValueChange={([value]) =>
                            controls.setVolume(value / 100)
                          }
                          max={100}
                          step={1}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Time Display */}
                    <div className="font-mono text-sm text-white">
                      {formatTime(state.currentTime)} /{' '}
                      {formatTime(state.duration)}
                    </div>
                  </div>

                  {/* Right Controls */}
                  <div className="flex items-center gap-3">
                    {/* Offline Indicator */}
                    {isOfflineVideo && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 rounded bg-green-500/20 px-2 py-1 text-xs text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            <span>Offline</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Playing from downloaded content
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* Connection Warning */}
                    {!isOnline && !isOfflineVideo && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 rounded bg-red-500/20 px-2 py-1 text-xs text-red-400">
                            <WifiOff className="h-3 w-3" />
                            <span>No Connection</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Content unavailable offline
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* Playback Speed */}
                    <Select
                      value={state.playbackRate.toString()}
                      onValueChange={value =>
                        controls.setPlaybackRate(parseFloat(value))
                      }
                    >
                      <SelectTrigger className="h-8 w-20 border-white/20 bg-white/10 text-sm text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-slate-700 bg-slate-800">
                        {playbackRates.map(rate => (
                          <SelectItem
                            key={rate.value}
                            value={rate.value.toString()}
                          >
                            {rate.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Picture-in-Picture */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                          onClick={controls.enterPictureInPicture}
                        >
                          <PictureInPicture2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Picture-in-Picture (Shift+P)
                      </TooltipContent>
                    </Tooltip>

                    {/* Fullscreen */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                          onClick={controls.toggleFullscreen}
                        >
                          {state.isFullscreen ? (
                            <Minimize className="h-4 w-4" />
                          ) : (
                            <Maximize className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Fullscreen (F)</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Keyboard Help Modal */}
              {showKeyboardHelp && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <div className="mx-4 w-full max-w-md rounded-xl bg-slate-800 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold text-white">
                        Atalhos do Teclado
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white"
                        onClick={() => setShowKeyboardHelp(false)}
                      >
                        ×
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {keyboardShortcuts.map((shortcut, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-slate-400">{shortcut.key}</span>
                          <span className="text-white">{shortcut.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chapters Component */}
        {chapters.length > 0 && (
          <VideoChapters
            chapters={chapters}
            currentChapter={state.currentChapter}
            onChapterClick={controls.jumpToChapter}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
