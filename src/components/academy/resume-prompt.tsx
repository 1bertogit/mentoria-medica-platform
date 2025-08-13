'use client';

import { useState } from 'react';
import { Play, RotateCcw, X, Clock, Smartphone, Monitor, Tablet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatTime } from '@/lib/video/chapter-data';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface ResumePromptProps {
  isOpen: boolean;
  onAcceptResume: () => void;
  onStartFromBeginning: () => void;
  onDismiss: () => void;
  resumePosition: number;
  duration?: number;
  courseName: string;
  lessonName: string;
  lastWatched?: Date;
  deviceType?: string;
  thumbnailUrl?: string;
}

export function ResumePrompt({
  isOpen,
  onAcceptResume,
  onStartFromBeginning,
  onDismiss,
  resumePosition,
  duration = 0,
  courseName,
  lessonName,
  lastWatched,
  deviceType = 'desktop',
  thumbnailUrl
}: ResumePromptProps) {
  const [rememberChoice, setRememberChoice] = useLocalStorage('video_resume_preference', 'ask');
  const [dontAskAgain, setDontAskAgain] = useState(false);

  const progressPercentage = duration > 0 ? (resumePosition / duration) * 100 : 0;
  const remainingTime = duration > 0 ? duration - resumePosition : 0;

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'há poucos segundos';
    if (diffInMinutes < 60) return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const handleAcceptResume = () => {
    if (dontAskAgain) {
      setRememberChoice('resume');
    }
    onAcceptResume();
  };

  const handleStartFromBeginning = () => {
    if (dontAskAgain) {
      setRememberChoice('beginning');
    }
    onStartFromBeginning();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900/95 backdrop-blur-xl border-slate-700/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Play className="h-5 w-5 text-blue-400" />
            Continuar assistindo?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Course and Lesson Info */}
          <div className="space-y-2">
            <h3 className="font-medium text-white">{lessonName}</h3>
            <p className="text-sm text-slate-400">{courseName}</p>
          </div>

          {/* Thumbnail with Progress Overlay */}
          <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden">
            {thumbnailUrl ? (
              <img 
                src={thumbnailUrl} 
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="h-12 w-12 text-slate-600" />
              </div>
            )}
            
            {/* Progress Bar Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <div className="flex items-center justify-between text-white text-sm mb-2">
                <span>{formatTime(resumePosition)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Resume Position Indicator */}
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs font-medium">
              {Math.round(progressPercentage)}% concluído
            </div>
          </div>

          {/* Watch Details */}
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {lastWatched ? getRelativeTime(lastWatched) : 'Visto recentemente'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {getDeviceIcon(deviceType)}
              <span className="capitalize">{deviceType}</span>
            </div>
          </div>

          {/* Time Remaining */}
          {remainingTime > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <p className="text-slate-300 text-sm">
                Restam aproximadamente <span className="font-medium text-white">{formatTime(remainingTime)}</span> para terminar
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleAcceptResume}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
            >
              <Play className="h-4 w-4 mr-2" />
              Continuar de {formatTime(resumePosition)}
            </Button>
            
            <Button
              onClick={handleStartFromBeginning}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white font-medium py-3"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Começar do início
            </Button>
          </div>

          {/* Remember Preference */}
          <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={dontAskAgain}
                onChange={(e) => setDontAskAgain(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
              />
              Lembrar minha escolha
            </label>
            
            <Button
              onClick={onDismiss}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Settings Link */}
          <p className="text-xs text-slate-500 text-center">
            Você pode alterar esta preferência nas configurações da conta
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}