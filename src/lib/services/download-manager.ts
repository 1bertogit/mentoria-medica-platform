/**
 * Download Manager - Handles video download operations with compression and chunking
 */

import { DownloadTask, VideoQuality, LessonData } from './offline-service';

interface CompressionOptions {
  quality: VideoQuality;
  maxBitrate: number;
  resolution: string;
  format: string;
}

interface DownloadChunk {
  start: number;
  end: number;
  data: Uint8Array;
}

export class DownloadManager {
  private readonly CHUNK_SIZE = 1024 * 1024; // 1MB chunks
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 5000; // 5 seconds

  private compressionWorker: Worker | null = null;

  constructor() {
    this.initializeCompressionWorker();
  }

  private initializeCompressionWorker(): void {
    try {
      // Create compression worker for video processing
      const workerCode = `
        self.onmessage = function(e) {
          const { type, data } = e.data;
          
          if (type === 'compress') {
            // Mock compression - in real implementation, use ffmpeg.wasm
            const { videoBlob, options } = data;
            
            // Simulate compression processing
            setTimeout(() => {
              self.postMessage({
                type: 'compressed',
                data: {
                  compressedBlob: videoBlob, // In real implementation, this would be compressed
                  originalSize: videoBlob.size,
                  compressedSize: Math.floor(videoBlob.size * 0.7), // Mock 30% compression
                  compressionRatio: 0.3
                }
              });
            }, 1000);
          }
        };
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.compressionWorker = new Worker(URL.createObjectURL(blob));
    } catch (error) {
      console.warn('[DownloadManager] Web Worker not available, compression will be disabled');
    }
  }

  async downloadVideo(url: string, lessonId: string, quality: VideoQuality): Promise<Blob> {
    let retries = 0;
    
    while (retries < this.MAX_RETRIES) {
      try {
        return await this.downloadWithResume(url, lessonId, quality);
      } catch (error) {
        retries++;
        console.error(`[DownloadManager] Download attempt ${retries} failed:`, error);
        
        if (retries >= this.MAX_RETRIES) {
          throw error;
        }
        
        // Wait before retry with exponential backoff
        await this.delay(this.RETRY_DELAY * Math.pow(2, retries - 1));
      }
    }
    
    throw new Error('Download failed after maximum retries');
  }

  private async downloadWithResume(url: string, lessonId: string, quality: VideoQuality): Promise<Blob> {
    // Check for existing partial download
    const existingChunks = await this.getExistingChunks(lessonId);
    let totalSize = 0;
    let downloadedSize = existingChunks.reduce((sum, chunk) => sum + chunk.data.length, 0);

    // Get file size
    const headResponse = await fetch(url, { method: 'HEAD' });
    const contentLength = headResponse.headers.get('content-length');
    if (contentLength) {
      totalSize = parseInt(contentLength, 10);
    }

    const chunks: DownloadChunk[] = [...existingChunks];
    
    // Determine ranges to download
    const ranges = this.calculateMissingRanges(existingChunks, totalSize);
    
    for (const range of ranges) {
      const chunkData = await this.downloadChunk(url, range.start, range.end);
      chunks.push({
        start: range.start,
        end: range.end,
        data: chunkData
      });
      
      downloadedSize += chunkData.length;
      
      // Update progress
      this.updateDownloadProgress(lessonId, downloadedSize, totalSize);
    }

    // Sort chunks by start position
    chunks.sort((a, b) => a.start - b.start);
    
    // Combine chunks into final blob
    const combinedData = new Uint8Array(totalSize);
    let offset = 0;
    
    for (const chunk of chunks) {
      combinedData.set(chunk.data, offset);
      offset += chunk.data.length;
    }

    const finalBlob = new Blob([combinedData], { type: 'video/mp4' });
    
    // Clean up stored chunks
    await this.cleanupChunks(lessonId);
    
    return finalBlob;
  }

  private async downloadChunk(url: string, start: number, end: number): Promise<Uint8Array> {
    const response = await fetch(url, {
      headers: {
        Range: `bytes=${start}-${end}`
      }
    });

    if (!response.ok) {
      throw new Error(`Chunk download failed: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }

  private calculateMissingRanges(existingChunks: DownloadChunk[], totalSize: number): Array<{start: number, end: number}> {
    if (existingChunks.length === 0) {
      // Download in chunks
      const ranges: Array<{start: number, end: number}> = [];
      for (let start = 0; start < totalSize; start += this.CHUNK_SIZE) {
        const end = Math.min(start + this.CHUNK_SIZE - 1, totalSize - 1);
        ranges.push({ start, end });
      }
      return ranges;
    }

    // Calculate missing ranges between existing chunks
    const ranges: Array<{start: number, end: number}> = [];
    existingChunks.sort((a, b) => a.start - b.start);
    
    let lastEnd = -1;
    for (const chunk of existingChunks) {
      if (chunk.start > lastEnd + 1) {
        ranges.push({ start: lastEnd + 1, end: chunk.start - 1 });
      }
      lastEnd = Math.max(lastEnd, chunk.end);
    }
    
    // Add final range if needed
    if (lastEnd < totalSize - 1) {
      ranges.push({ start: lastEnd + 1, end: totalSize - 1 });
    }
    
    return ranges;
  }

  async compressVideo(videoBlob: Blob, options: CompressionOptions): Promise<Blob> {
    if (!this.compressionWorker) {
      console.warn('[DownloadManager] Compression worker not available, returning original video');
      return videoBlob;
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Compression timeout'));
      }, 30000); // 30 second timeout

      this.compressionWorker!.onmessage = (e) => {
        const { type, data } = e.data;
        
        if (type === 'compressed') {
          clearTimeout(timeout);
          resolve(data.compressedBlob);
        } else if (type === 'error') {
          clearTimeout(timeout);
          reject(new Error(data.message));
        }
      };

      this.compressionWorker!.postMessage({
        type: 'compress',
        data: { videoBlob, options }
      });
    });
  }

  async getDownloadedLesson(lessonId: string): Promise<Blob | null> {
    try {
      const lesson = await this.getLessonFromStorage(lessonId);
      return lesson?.videoBlob || null;
    } catch (error) {
      console.error('[DownloadManager] Failed to get downloaded lesson:', error);
      return null;
    }
  }

  private async getLessonFromStorage(lessonId: string): Promise<LessonData | null> {
    // This would connect to IndexedDB
    // For now, return null as placeholder
    return null;
  }

  private async getExistingChunks(lessonId: string): Promise<DownloadChunk[]> {
    // Implementation would check for existing chunks in IndexedDB
    return [];
  }

  private async cleanupChunks(lessonId: string): Promise<void> {
    // Implementation would clean up temporary chunks from IndexedDB
  }

  private updateDownloadProgress(lessonId: string, downloaded: number, total: number): void {
    const progress = total > 0 ? (downloaded / total) * 100 : 0;
    
    // Dispatch custom event for progress updates
    window.dispatchEvent(new CustomEvent('downloadProgress', {
      detail: { lessonId, progress, downloaded, total }
    }));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getCompressionOptions(quality: VideoQuality): CompressionOptions {
    switch (quality) {
      case 'audio':
        return {
          quality: 'audio',
          maxBitrate: 64,
          resolution: 'audio-only',
          format: 'mp3'
        };
      case 'sd':
        return {
          quality: 'sd',
          maxBitrate: 1000,
          resolution: '480p',
          format: 'mp4'
        };
      case 'hd':
        return {
          quality: 'hd',
          maxBitrate: 2500,
          resolution: '720p',
          format: 'mp4'
        };
      default:
        return {
          quality: 'sd',
          maxBitrate: 1000,
          resolution: '480p',
          format: 'mp4'
        };
    }
  }

  // Utility methods for storage management
  async getStorageSize(): Promise<number> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return estimate.usage || 0;
      }
      return 0;
    } catch (error) {
      console.error('[DownloadManager] Failed to get storage size:', error);
      return 0;
    }
  }

  async clearDownloadCache(): Promise<void> {
    try {
      // Clear video cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(name => name.includes('video'))
            .map(name => caches.delete(name))
        );
      }
      
      console.log('[DownloadManager] Download cache cleared');
    } catch (error) {
      console.error('[DownloadManager] Failed to clear cache:', error);
    }
  }

  destroy(): void {
    if (this.compressionWorker) {
      this.compressionWorker.terminate();
      this.compressionWorker = null;
    }
  }
}

// Singleton instance
export const downloadManager = new DownloadManager();