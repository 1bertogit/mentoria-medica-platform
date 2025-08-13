'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  HardDrive,
  Settings
} from 'lucide-react';
import { useOffline } from '@/hooks/use-offline';
import { formatBytes } from '@/lib/utils';

interface OfflineIndicatorProps {
  position?: 'top' | 'bottom';
  showSyncStatus?: boolean;
  showStorageInfo?: boolean;
  className?: string;
}

export function OfflineIndicator({ 
  position = 'top', 
  showSyncStatus = true,
  showStorageInfo = false,
  className 
}: OfflineIndicatorProps) {
  const {
    isOnline,
    isDownloading,
    downloadProgress,
    downloadedLessons,
    storageUsage,
    syncStatus,
    forcSync,
    downloadQueue
  } = useOffline();

  const [showDetails, setShowDetails] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    if (syncStatus.lastSync) {
      setLastSyncTime(syncStatus.lastSync);
    }
  }, [syncStatus.lastSync]);

  const getSyncStatusIcon = () => {
    switch (syncStatus.status) {
      case 'synced':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'syncing':
        return <RefreshCw className="h-3 w-3 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      case 'pending':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      default:
        return <WifiOff className="h-3 w-3 text-gray-500" />;
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus.status) {
      case 'synced':
        return 'Synced';
      case 'syncing':
        return 'Syncing...';
      case 'failed':
        return 'Sync failed';
      case 'pending':
        return `${syncStatus.pendingItems} pending`;
      default:
        return 'Unknown';
    }
  };

  const handleRetrySync = async () => {
    try {
      await forcSync();
    } catch (error) {
      console.error('Sync retry failed:', error);
    }
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const activeDownloads = downloadQueue.filter(task => 
    task.status === 'downloading' || task.status === 'pending'
  );

  return (
    <div className={`${className} ${position === 'bottom' ? 'order-last' : ''}`}>
      {/* Main Indicator */}
      <Card className="glass-card border-0 shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Download Status */}
              {isDownloading && (
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3 text-blue-500 animate-pulse" />
                  <span className="text-xs text-blue-600">
                    {downloadProgress.toFixed(0)}%
                  </span>
                </div>
              )}

              {/* Downloaded Content Indicator */}
              {downloadedLessons.length > 0 && (
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  {downloadedLessons.length} offline
                </Badge>
              )}
            </div>

            {/* Sync Status */}
            {showSyncStatus && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {getSyncStatusIcon()}
                  <span className="text-xs">{getSyncStatusText()}</span>
                </div>
                
                <Dialog open={showDetails} onOpenChange={setShowDetails}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Offline Status</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      {/* Connection Details */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Connection</h4>
                        <div className="flex items-center gap-2">
                          {isOnline ? (
                            <>
                              <Wifi className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600">Connected to internet</span>
                            </>
                          ) : (
                            <>
                              <WifiOff className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-red-600">No internet connection</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Sync Details */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Sync Status</h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getSyncStatusIcon()}
                              <span className="text-sm">{getSyncStatusText()}</span>
                            </div>
                            {(syncStatus.status === 'failed' || syncStatus.status === 'pending') && isOnline && (
                              <Button size="sm" variant="outline" onClick={handleRetrySync}>
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Retry
                              </Button>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            Last sync: {formatLastSync(lastSyncTime)}
                          </p>
                          {syncStatus.error && (
                            <p className="text-xs text-red-500">{syncStatus.error}</p>
                          )}
                        </div>
                      </div>

                      {/* Download Queue */}
                      {activeDownloads.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Active Downloads</h4>
                          <div className="space-y-2">
                            {activeDownloads.map((task) => (
                              <div key={task.id} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium truncate">{task.title}</span>
                                  <span className="text-xs text-gray-500">{task.progress.toFixed(0)}%</span>
                                </div>
                                <Progress value={task.progress} className="h-1" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Storage Info */}
                      {showStorageInfo && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm flex items-center gap-2">
                            <HardDrive className="h-3 w-3" />
                            Storage Usage
                          </h4>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Used: {formatBytes(storageUsage.used)}</span>
                              <span>Total: {formatBytes(storageUsage.total)}</span>
                            </div>
                            <Progress value={storageUsage.usage} className="h-2" />
                            <p className="text-xs text-gray-500">
                              {storageUsage.usage.toFixed(1)}% used
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Offline Content */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Offline Content</h4>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-500">Downloaded lessons:</span>
                            <p className="font-medium">{downloadedLessons.length}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Queue:</span>
                            <p className="font-medium">{downloadQueue.length}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href="/offline">Manage Offline</a>
                        </Button>
                        {!isOnline && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.location.reload()}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Check Connection
                          </Button>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {/* Download Progress Bar */}
          {isDownloading && (
            <div className="mt-2">
              <Progress value={downloadProgress} className="h-1" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compact Mode for Mobile */}
      <div className="md:hidden">
        <div className={`fixed ${position === 'top' ? 'top-4' : 'bottom-4'} right-4 z-50`}>
          <Card className="glass-card border-0 shadow-lg">
            <CardContent className="p-2">
              <div className="flex items-center gap-1">
                {isOnline ? (
                  <Wifi className="h-3 w-3 text-green-500" />
                ) : (
                  <WifiOff className="h-3 w-3 text-red-500" />
                )}
                
                {showSyncStatus && (
                  <div className="flex items-center gap-1">
                    {getSyncStatusIcon()}
                    {syncStatus.status === 'pending' && (
                      <span className="text-xs">{syncStatus.pendingItems}</span>
                    )}
                  </div>
                )}
                
                {downloadedLessons.length > 0 && (
                  <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                    {downloadedLessons.length}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}