'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  X,
  FileVideo,
  FileImage,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileUploaderProps {
  folder: 'courses' | 'library' | 'profiles' | 'resources';
  accept?: string;
  maxSize?: number;
  onUploadComplete?: (url: string, key: string) => void;
  onError?: (error: string) => void;
}

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  key?: string;
  error?: string;
}

export function FileUploader({
  folder,
  accept = 'video/*,image/*,application/pdf',
  maxSize = 500 * 1024 * 1024, // 500MB
  onUploadComplete,
  onError,
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    maxSize,
    multiple: true,
  });

  const uploadFile = async (uploadFile: UploadFile, index: number) => {
    // Update status to uploading
    setFiles((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, status: 'uploading' } : f
      )
    );

    const formData = new FormData();
    formData.append('file', uploadFile.file);
    formData.append('folder', folder);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index && f.status === 'uploading'
              ? { ...f, progress: Math.min(f.progress + 10, 90) }
              : f
          )
        );
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();

      // Update status to success
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                status: 'success',
                progress: 100,
                url: data.url,
                key: data.key,
              }
            : f
        )
      );

      if (onUploadComplete) {
        onUploadComplete(data.url, data.key);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, status: 'error', error: errorMessage }
            : f
        )
      );

      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const uploadAll = async () => {
    setIsUploading(true);
    
    const pendingFiles = files.filter((f) => f.status === 'pending');
    
    // Upload files in parallel (max 3 at a time)
    const batchSize = 3;
    for (let i = 0; i < pendingFiles.length; i += batchSize) {
      const batch = pendingFiles.slice(i, i + batchSize);
      const batchIndexes = files
        .map((f, index) => (batch.includes(f) ? index : -1))
        .filter((index) => index !== -1);
      
      await Promise.all(
        batchIndexes.map((index) => uploadFile(files[index], index))
      );
    }
    
    setIsUploading(false);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video/')) return FileVideo;
    if (file.type.startsWith('image/')) return FileImage;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${
            isDragActive
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        {isDragActive ? (
          <p className="text-purple-600 dark:text-purple-400">
            Drop the files here...
          </p>
        ) : (
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Accepted: Videos, Images, PDFs (Max {maxSize / (1024 * 1024)}MB)
            </p>
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          {files.map((uploadFile, index) => {
            const Icon = getFileIcon(uploadFile.file);
            
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-8 h-8 text-gray-400 flex-shrink-0 mt-1" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {uploadFile.file.name}
                      </p>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        disabled={uploadFile.status === 'uploading'}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-2">
                      {formatFileSize(uploadFile.file.size)}
                    </p>

                    {/* Progress Bar */}
                    {uploadFile.status === 'uploading' && (
                      <div className="space-y-1">
                        <Progress value={uploadFile.progress} className="h-1" />
                        <p className="text-xs text-gray-500">
                          Uploading... {uploadFile.progress}%
                        </p>
                      </div>
                    )}

                    {/* Success */}
                    {uploadFile.status === 'success' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Upload complete</span>
                      </div>
                    )}

                    {/* Error */}
                    {uploadFile.status === 'error' && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">
                          {uploadFile.error || 'Upload failed'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Button */}
      {files.some((f) => f.status === 'pending') && (
        <div className="mt-6">
          <Button
            onClick={uploadAll}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {files.filter((f) => f.status === 'pending').length} file(s)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}