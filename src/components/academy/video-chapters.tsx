'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Play, Clock } from 'lucide-react';
import { VideoChapter, formatTime } from '@/lib/video/chapter-data';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface VideoChaptersProps {
  chapters: VideoChapter[];
  currentChapter: VideoChapter | null;
  onChapterClick: (chapter: VideoChapter) => void;
  className?: string;
}

export function VideoChapters({ 
  chapters, 
  currentChapter, 
  onChapterClick,
  className = '' 
}: VideoChaptersProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (chapters.length === 0) {
    return null;
  }

  return (
    <div className={`bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto text-white hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Play className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Capítulos do Vídeo</h3>
                <p className="text-sm text-slate-400">{chapters.length} capítulos</p>
              </div>
            </div>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4">
            <div className="space-y-2">
              {chapters.map((chapter, index) => {
                const isActive = currentChapter?.id === chapter.id;
                const duration = chapter.endTime - chapter.startTime;

                return (
                  <button
                    key={chapter.id}
                    onClick={() => onChapterClick(chapter)}
                    className={`
                      w-full text-left p-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-500/20 border border-blue-500/30' 
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                      }
                      group
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {/* Chapter Number */}
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5
                        ${isActive 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'
                        }
                      `}>
                        {index + 1}
                      </div>

                      {/* Chapter Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`
                            font-medium text-sm truncate
                            ${isActive ? 'text-blue-400' : 'text-white group-hover:text-blue-300'}
                          `}>
                            {chapter.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-400 ml-2">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>

                        {chapter.description && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {chapter.description}
                          </p>
                        )}

                        {/* Key Points */}
                        {chapter.keyPoints && chapter.keyPoints.length > 0 && (
                          <div className="mt-2">
                            <ul className="text-xs text-slate-500 space-y-0.5">
                              {chapter.keyPoints.slice(0, 2).map((point, pointIndex) => (
                                <li key={pointIndex} className="flex items-center gap-1">
                                  <div className="w-1 h-1 bg-slate-500 rounded-full flex-shrink-0" />
                                  <span className="truncate">{point}</span>
                                </li>
                              ))}
                              {chapter.keyPoints.length > 2 && (
                                <li className="text-slate-600">
                                  +{chapter.keyPoints.length - 2} mais pontos...
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Time Range */}
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                          <span>{formatTime(chapter.startTime)}</span>
                          <div className="w-2 h-px bg-slate-600" />
                          <span>{formatTime(chapter.endTime)}</span>
                        </div>
                      </div>

                      {/* Play Icon */}
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                        ${isActive 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-transparent text-slate-500 group-hover:bg-white/10 group-hover:text-white'
                        }
                      `}>
                        <Play className="h-3 w-3" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// Chapter Progress Bar Component
interface ChapterProgressBarProps {
  chapters: VideoChapter[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
}

export function ChapterProgressBar({ 
  chapters, 
  currentTime, 
  duration, 
  onSeek,
  className = '' 
}: ChapterProgressBarProps) {
  if (chapters.length === 0 || duration === 0) {
    return null;
  }

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = percentage * duration;
    onSeek(seekTime);
  };

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <div className={`relative ${className}`}>
      {/* Progress Bar Background */}
      <div 
        className="h-2 bg-slate-700/50 rounded-full cursor-pointer group"
        onClick={handleProgressClick}
      >
        {/* Chapter Markers */}
        {chapters.map((chapter, index) => {
          const startPercentage = (chapter.startTime / duration) * 100;
          const widthPercentage = ((chapter.endTime - chapter.startTime) / duration) * 100;
          const isActive = currentTime >= chapter.startTime && currentTime < chapter.endTime;

          return (
            <div key={chapter.id} className="absolute inset-y-0 group">
              {/* Chapter Segment */}
              <div
                className={`
                  h-full rounded-full transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-500/60' 
                    : 'bg-slate-600/40 group-hover:bg-slate-500/60'
                  }
                `}
                style={{
                  left: `${startPercentage}%`,
                  width: `${widthPercentage}%`,
                }}
              />

              {/* Chapter Marker */}
              {index > 0 && (
                <div
                  className="absolute top-0 w-px h-full bg-slate-400/60"
                  style={{ left: `${startPercentage}%` }}
                />
              )}

              {/* Chapter Tooltip on Hover */}
              <div
                className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10"
                style={{
                  left: `${startPercentage + widthPercentage / 2}%`,
                }}
              >
                <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {chapter.title}
                  <div className="text-slate-400">
                    {formatTime(chapter.startTime)} - {formatTime(chapter.endTime)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Current Progress */}
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-200"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Progress Handle */}
        <div 
          className="absolute top-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ left: `${progressPercentage}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>
    </div>
  );
}