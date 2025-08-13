'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Pause, 
  Play, 
  X, 
  HardDrive, 
  Wifi, 
  WifiOff,
  CheckCircle,
  AlertTriangle,
  Settings,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { useOffline } from '@/hooks/use-offline';
import { VideoQuality, DownloadTask } from '@/lib/services/offline-service';
import { formatBytes, formatDuration } from '@/lib/utils';

interface Lesson {
  id: string;
  title: string;
  duration: number;
  moduleTitle: string;
  videoUrl: string;
  size?: number;
}

interface DownloadManagerUIProps {
  lesson?: Lesson;
  module?: {
    id: string;
    title: string;
    lessons: Lesson[];
  };
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  className?: string;
}

export function DownloadManagerUI({ 
  lesson, 
  module, 
  onDownloadStart, 
  onDownloadComplete,
  className 
}: DownloadManagerUIProps) {
  const {
    isOnline,
    isDownloading,
    downloadedLessons,
    storageUsage,
    downloadQueue,
    downloadLesson,
    downloadModule,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    deleteDownload
  } = useOffline();

  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>('sd');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);

  // Check storage usage for warnings
  useEffect(() => {
    setStorageWarning(storageUsage.usage > 85);
  }, [storageUsage.usage]);

  const isLessonDownloaded = (lessonId: string) => {
    return downloadedLessons.includes(lessonId);
  };

  const getDownloadTask = (lessonId: string): DownloadTask | undefined => {
    return downloadQueue.find(task => task.lessonId === lessonId);
  };

  const handleDownloadLesson = async () => {
    if (!lesson || !isOnline) return;

    try {
      onDownloadStart?.();
      await downloadLesson(lesson.id, selectedQuality);
      onDownloadComplete?.();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDownloadModule = async () => {
    if (!module || !isOnline) return;

    try {
      onDownloadStart?.();
      await downloadModule(module.id, selectedQuality);
      onDownloadComplete?.();
    } catch (error) {
      console.error('Module download failed:', error);
    }
  };

  const handlePauseResume = async (task: DownloadTask) => {
    try {
      if (task.status === 'downloading') {
        await pauseDownload(task.id);
      } else if (task.status === 'paused') {
        await resumeDownload(task.id);
      }
    } catch (error) {
      console.error('Pause/Resume failed:', error);
    }
  };

  const handleCancel = async (task: DownloadTask) => {
    try {
      await cancelDownload(task.id);
    } catch (error) {
      console.error('Cancel failed:', error);
    }
  };

  const handleDelete = async (lessonId: string) => {
    try {
      await deleteDownload(lessonId);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const getQualityInfo = (quality: VideoQuality) => {
    switch (quality) {
      case 'audio':
        return { label: 'Audio Only', size: '~15MB', description: 'Audio track only for listening' };
      case 'sd':
        return { label: 'Standard (480p)', size: '~150MB', description: 'Good quality for mobile viewing' };
      case 'hd':
        return { label: 'High (720p)', size: '~300MB', description: 'Best quality for detailed viewing' };
      default:
        return { label: 'Standard', size: '~150MB', description: 'Standard quality' };
    }
  };

  const getStatusIcon = (status: DownloadTask['status']) => {
    switch (status) {
      case 'downloading':
        return <Download className="h-4 w-4 animate-pulse text-blue-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Download className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: DownloadTask['status']) => {
    switch (status) {
      case 'downloading': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={className}>
      {/* Storage Warning */}
      {storageWarning && (
        <Alert className="mb-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            Storage is {storageUsage.usage.toFixed(1)}% full. Consider cleaning up old downloads.
          </AlertDescription>
        </Alert>
      )}

      {/* Connection Status */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4 text-green-500" />
            <span className="text-green-600">Online - Downloads available</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-red-500" />
            <span className="text-red-600">Offline - Cannot download new content</span>
          </>
        )}
      </div>

      {/* Single Lesson Download */}
      {lesson && (
        <Card className="glass-card mb-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Download Lesson</span>
              {isLessonDownloaded(lesson.id) && (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Downloaded
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{lesson.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quality Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quality</label>
              <Select value={selectedQuality} onValueChange={(value) => setSelectedQuality(value as VideoQuality)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['audio', 'sd', 'hd'] as VideoQuality[]).map((quality) => {
                    const info = getQualityInfo(quality);
                    return (
                      <SelectItem key={quality} value={quality}>
                        <div className="flex items-center justify-between w-full">
                          <span>{info.label}</span>
                          <span className="text-xs text-gray-500 ml-2">{info.size}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">{getQualityInfo(selectedQuality).description}</p>
            </div>

            {/* Download Actions */}
            <div className="flex gap-2">
              {!isLessonDownloaded(lesson.id) ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button disabled={!isOnline || isDownloading}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Lesson
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Download</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p><strong>Lesson:</strong> {lesson.title}</p>
                        <p><strong>Quality:</strong> {getQualityInfo(selectedQuality).label}</p>
                        <p><strong>Estimated Size:</strong> {getQualityInfo(selectedQuality).size}</p>
                        <p><strong>Duration:</strong> {formatDuration(lesson.duration)}</p>
                      </div>
                      
                      {/* Storage Info */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Storage Used:</span>
                          <span>{formatBytes(storageUsage.used)} / {formatBytes(storageUsage.total)}</span>
                        </div>
                        <Progress value={storageUsage.usage} className="h-2" />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={handleDownloadLesson} disabled={!isOnline}>
                          Confirm Download
                        </Button>
                        <DialogTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogTrigger>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(lesson.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Download
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Module Download */}
      {module && (
        <Card className="glass-card mb-4">
          <CardHeader>
            <CardTitle>Download Module</CardTitle>
            <CardDescription>
              {module.title} - {module.lessons.length} lessons
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Total Lessons:</span>
                <p>{module.lessons.length}</p>
              </div>
              <div>
                <span className="font-medium">Downloaded:</span>
                <p>{module.lessons.filter(l => isLessonDownloaded(l.id)).length}</p>
              </div>
            </div>
            
            <Button 
              onClick={handleDownloadModule} 
              disabled={!isOnline || isDownloading}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download All Lessons ({getQualityInfo(selectedQuality).label})
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Downloads */}
      {downloadQueue.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Queue ({downloadQueue.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {downloadQueue.map((task) => (
                <div key={task.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-gray-500">{task.moduleTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {task.quality.toUpperCase()}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {task.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formatBytes(task.downloadedSize)} / {formatBytes(task.size)}</span>
                      <span>{task.progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={task.progress} className={`h-2 ${getStatusColor(task.status)}`} />
                    {task.status === 'downloading' && task.estimatedTimeRemaining > 0 && (
                      <p className="text-xs text-gray-500">
                        {task.estimatedTimeRemaining}s remaining
                      </p>
                    )}
                  </div>

                  {/* Task Actions */}
                  <div className="flex gap-2">
                    {(task.status === 'downloading' || task.status === 'paused') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePauseResume(task)}
                      >
                        {task.status === 'downloading' ? (
                          <>
                            <Pause className="h-3 w-3 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Resume
                          </>
                        )}
                      </Button>
                    )}
                    
                    {task.status === 'failed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePauseResume(task)}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Retry
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleCancel(task)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>

                  {/* Error Message */}
                  {task.status === 'failed' && task.error && (
                    <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <AlertDescription className="text-red-700 dark:text-red-300 text-xs">
                        {task.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Management */}
      <Card className="glass-card mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used:</span>
              <span>{formatBytes(storageUsage.used)} / {formatBytes(storageUsage.total)}</span>
            </div>
            <Progress value={storageUsage.usage} className="h-2" />
            <p className="text-xs text-gray-500">
              {storageUsage.usage.toFixed(1)}% of available storage used
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}