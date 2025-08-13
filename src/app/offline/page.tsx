'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  WifiOff, 
  Download, 
  Play, 
  RefreshCw, 
  HardDrive, 
  Clock,
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react';
import { useOffline } from '@/hooks/use-offline';
import { formatBytes, formatDuration } from '@/lib/utils';

interface OfflineLesson {
  id: string;
  title: string;
  duration: number;
  downloadDate: Date;
  size: number;
  quality: 'sd' | 'hd' | 'audio';
  moduleTitle: string;
}

export default function OfflinePage() {
  const {
    isOnline,
    downloadedLessons,
    storageUsage,
    syncStatus,
    forcSync,
    clearAllDownloads,
    optimizeStorage
  } = useOffline();

  const [offlineLessons, setOfflineLessons] = useState<OfflineLesson[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    // Load offline lessons from IndexedDB
    loadOfflineLessons();
  }, [downloadedLessons]);

  const loadOfflineLessons = async () => {
    // Mock data - in real implementation, this would load from IndexedDB
    const mockLessons: OfflineLesson[] = [
      {
        id: '1',
        title: 'Introduction to Facial Anatomy',
        duration: 1800, // 30 minutes
        downloadDate: new Date('2024-08-10'),
        size: 245760000, // ~245MB
        quality: 'hd',
        moduleTitle: 'Browlift & EndomidFace'
      },
      {
        id: '2',
        title: 'Surgical Techniques Overview',
        duration: 2400, // 40 minutes
        downloadDate: new Date('2024-08-09'),
        size: 180224000, // ~180MB
        quality: 'sd',
        moduleTitle: 'Browlift & EndomidFace'
      },
      {
        id: '3',
        title: 'Post-operative Care',
        duration: 900, // 15 minutes
        downloadDate: new Date('2024-08-08'),
        size: 45056000, // ~45MB
        quality: 'audio',
        moduleTitle: 'Recovery Protocols'
      }
    ];
    setOfflineLessons(mockLessons);
  };

  const handleRetrySync = async () => {
    try {
      await forcSync();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const handleOptimizeStorage = async () => {
    setIsOptimizing(true);
    try {
      await optimizeStorage();
      await loadOfflineLessons();
    } catch (error) {
      console.error('Storage optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const getQualityBadgeVariant = (quality: string) => {
    switch (quality) {
      case 'hd': return 'default';
      case 'sd': return 'secondary';
      case 'audio': return 'outline';
      default: return 'secondary';
    }
  };

  const getSyncStatusColor = () => {
    switch (syncStatus.status) {
      case 'synced': return 'text-green-600';
      case 'syncing': return 'text-blue-600';
      case 'failed': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus.status) {
      case 'synced': return <CheckCircle className="h-4 w-4" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <WifiOff className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <WifiOff className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Offline Mode</h1>
          </div>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Continue your medical education even without an internet connection. 
            Access your downloaded lessons and manage your offline content.
          </p>
        </div>

        {/* Connection Status */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">
                {isOnline ? 'Connected to internet' : 'Offline mode active'}
              </span>
              {!isOnline && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check Connection
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sync Status */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getSyncStatusIcon()}
              Sync Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${getSyncStatusColor()}`}>
                  {syncStatus.status === 'synced' && 'All data synchronized'}
                  {syncStatus.status === 'syncing' && 'Synchronizing data...'}
                  {syncStatus.status === 'failed' && 'Sync failed'}
                  {syncStatus.status === 'pending' && `${syncStatus.pendingItems} items pending`}
                </p>
                {syncStatus.lastSync && (
                  <p className="text-sm text-slate-400">
                    Last sync: {syncStatus.lastSync.toLocaleDateString()} at {syncStatus.lastSync.toLocaleTimeString()}
                  </p>
                )}
              </div>
              {(syncStatus.status === 'failed' || syncStatus.status === 'pending') && isOnline && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRetrySync}
                  disabled={syncStatus.status === 'syncing'}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Sync
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Storage Usage */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Storage Usage
            </CardTitle>
            <CardDescription>
              Manage your offline content storage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Used: {formatBytes(storageUsage.used)}</span>
                <span>Available: {formatBytes(storageUsage.available)}</span>
              </div>
              <Progress value={storageUsage.usage} className="h-2" />
              <p className="text-xs text-slate-400 mt-1">
                {storageUsage.usage.toFixed(1)}% of {formatBytes(storageUsage.total)} used
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleOptimizeStorage}
                disabled={isOptimizing}
              >
                <Settings className="h-4 w-4 mr-2" />
                {isOptimizing ? 'Optimizing...' : 'Optimize Storage'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearAllDownloads}
              >
                Clear All Downloads
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Downloaded Lessons */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Downloaded Lessons ({offlineLessons.length})
            </CardTitle>
            <CardDescription>
              Access your offline medical education content
            </CardDescription>
          </CardHeader>
          <CardContent>
            {offlineLessons.length === 0 ? (
              <div className="text-center py-8">
                <Download className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-300 mb-2">No Downloaded Content</h3>
                <p className="text-slate-400 mb-4">
                  Download lessons when online to access them offline
                </p>
                {isOnline && (
                  <Button asChild>
                    <a href="/academy">Browse Academy</a>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {offlineLessons.map((lesson, index) => (
                  <div key={lesson.id}>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white">{lesson.title}</h4>
                          <Badge variant={getQualityBadgeVariant(lesson.quality)}>
                            {lesson.quality.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{lesson.moduleTitle}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(lesson.duration)}
                          </span>
                          <span>{formatBytes(lesson.size)}</span>
                          <span>Downloaded {lesson.downloadDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button size="sm" asChild>
                        <a href={`/academy/${lesson.id}?offline=true`}>
                          <Play className="h-4 w-4 mr-2" />
                          Watch
                        </a>
                      </Button>
                    </div>
                    {index < offlineLessons.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-4">
            {isOnline ? (
              <>
                <Button asChild>
                  <a href="/academy">Browse Academy</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/dashboard">Go to Dashboard</a>
                </Button>
              </>
            ) : (
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Connection
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}