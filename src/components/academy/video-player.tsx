'use client';

import { useState } from 'react';
import { Play, Pause, RotateCcw, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VideoPlayerProps {
  videoUrl?: string;
  title: string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
}

export function VideoPlayer({ 
  videoUrl, 
  title, 
  isPlaying = false,
  onPlayPause 
}: VideoPlayerProps) {
  const [playbackSpeed, setPlaybackSpeed] = useState('1');

  const handlePlayPause = () => {
    if (onPlayPause) {
      onPlayPause();
    }
  };

  const handleSkipBackward = () => {
    // Skip backward 10 seconds
    console.log('Skip backward 10s');
  };

  const handleSkipForward = () => {
    // Skip forward 10 seconds
    console.log('Skip forward 10s');
  };

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
        <div className="relative aspect-video w-full">
          {videoUrl ? (
            // Real video iframe (for course ID 1)
            <iframe
              src={videoUrl}
              title={title}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            // Video placeholder with play button
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
              <button
                onClick={handlePlayPause}
                className="w-20 h-20 bg-blue-500/90 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg shadow-blue-500/20"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white ml-0" />
                ) : (
                  <Play className="h-8 w-8 text-white ml-1" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Video Controls */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
        {/* Control Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 bg-white/10 border-white/20 text-slate-300 hover:bg-white/15 hover:text-white"
            onClick={handleSkipBackward}
            title="Voltar 10s"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 bg-white/10 border-white/20 text-slate-300 hover:bg-white/15 hover:text-white"
            onClick={handlePlayPause}
            title="Play/Pause"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 bg-white/10 border-white/20 text-slate-300 hover:bg-white/15 hover:text-white"
            onClick={handleSkipForward}
            title="Avançar 10s"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Playback Speed */}
        <Select value={playbackSpeed} onValueChange={setPlaybackSpeed}>
          <SelectTrigger className="w-20 h-9 bg-white/10 border-white/20 text-slate-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="0.5">0.5x</SelectItem>
            <SelectItem value="0.75">0.75x</SelectItem>
            <SelectItem value="1">1x</SelectItem>
            <SelectItem value="1.25">1.25x</SelectItem>
            <SelectItem value="1.5">1.5x</SelectItem>
            <SelectItem value="2">2x</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}