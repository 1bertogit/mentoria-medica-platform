'use client';

import { useEffect, useState } from 'react';
import logger from '@/lib/logger';
import { Loader2, Play, Pause, Volume2, VolumeX, Maximize2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AWSVideoPlayerProps {
  videoKey: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  showControls?: boolean;
  showDownload?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export function AWSVideoPlayer({
  videoKey,
  title,
  description,
  thumbnail,
  className,
  autoPlay = false,
  muted = false,
  showControls = true,
  showDownload = false,
  onPlay,
  onPause,
  onEnded,
}: AWSVideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetchVideoUrl();
  }, [videoKey]);

  const fetchVideoUrl = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we're using CloudFront (public videos) or need signed URL (private)
      if (videoKey.startsWith('public/')) {
        // Use CloudFront URL directly for public videos
        const cloudfrontUrl = process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL;
        if (!cloudfrontUrl) {
          throw new Error('CloudFront URL not configured');
        }
        setVideoUrl(`${cloudfrontUrl}/${videoKey}`);
      } else {
        // Get signed URL for private videos
        const response = await fetch(`/api/video/signed-url?key=${encodeURIComponent(videoKey)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch video URL');
        }
        const data = await response.json();
        setVideoUrl(data.url);
      }
    } catch (err) {
      logger.error('Error fetching video:', err);
      setError(err instanceof Error ? err.message : 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setDuration(video.duration);
  };

  const handlePlayPause = () => {
    const video = document.getElementById('aws-video') as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        video.play();
        setIsPlaying(true);
        onPlay?.();
      }
    }
  };

  const handleMute = () => {
    const video = document.getElementById('aws-video') as HTMLVideoElement;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    const video = document.getElementById('aws-video') as HTMLVideoElement;
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    }
  };

  const handleDownload = async () => {
    if (videoUrl) {
      try {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = title || 'video.mp4';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        logger.error('Error downloading video:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center bg-black/10 rounded-lg', className)}>
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('flex flex-col items-center justify-center bg-red-500/10 rounded-lg p-8', className)}>
        <p className="text-red-400 text-sm mb-2">Erro ao carregar vídeo</p>
        <p className="text-white/60 text-xs">{error}</p>
        <button
          onClick={fetchVideoUrl}
          className="mt-4 px-4 py-2 bg-cyan-400/20 hover:bg-cyan-400/30 rounded-lg text-cyan-300 text-sm transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className={cn('relative group', className)}>
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white/90 mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-white/60">{description}</p>
          )}
        </div>
      )}

      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          id="aws-video"
          src={videoUrl}
          poster={thumbnail}
          className="w-full h-full"
          autoPlay={autoPlay}
          muted={muted}
          controls={false}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            setIsPlaying(false);
            onEnded?.();
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="bg-white/20 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-400 h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-white/60">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayPause}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-white" />
                  ) : (
                    <Play className="h-5 w-5 text-white" />
                  )}
                </button>

                <button
                  onClick={handleMute}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5 text-white" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                {showDownload && (
                  <button
                    onClick={handleDownload}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Baixar vídeo"
                  >
                    <Download className="h-5 w-5 text-white" />
                  </button>
                )}

                <button
                  onClick={handleFullscreen}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Tela cheia"
                >
                  <Maximize2 className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}