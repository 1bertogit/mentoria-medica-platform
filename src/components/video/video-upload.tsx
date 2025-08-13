'use client';

import { useState, useCallback } from 'react';
import logger from '@/lib/logger';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle, AlertCircle, Loader2, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface VideoUploadProps {
  category?: 'cursos' | 'gravacoes';
  onUploadComplete?: (videoKey: string) => void;
  onUploadError?: (error: string) => void;
  maxSize?: number; // in MB
  className?: string;
}

export function VideoUpload({
  category = 'cursos',
  onUploadComplete,
  onUploadError,
  maxSize = 5000, // 5GB default
  className,
}: VideoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [videoKey, setVideoKey] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: unknown[]) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      setErrorMessage(error.message);
      setUploadStatus('error');
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadStatus('idle');
      setErrorMessage('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.webm', '.mov', '.avi'],
    },
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    multiple: false,
  });

  const uploadVideo = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setUploadStatus('uploading');
      setUploadProgress(0);

      // Step 1: Get presigned URL from our API
      const response = await fetch('/api/video/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, key } = await response.json();
      setVideoKey(key);

      // Step 2: Upload directly to S3 using presigned URL
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 204) {
          setUploadStatus('success');
          setUploadProgress(100);
          onUploadComplete?.(key);
        } else {
          throw new Error('Upload failed');
        }
      });

      xhr.addEventListener('error', () => {
        throw new Error('Upload failed');
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);

    } catch (error) {
      logger.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    setErrorMessage('');
    setVideoKey('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Dropzone */}
      {!file && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
            isDragActive
              ? 'border-cyan-400 bg-cyan-400/10'
              : 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10'
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-white/40 mb-4" />
          {isDragActive ? (
            <p className="text-cyan-400">Solte o vídeo aqui...</p>
          ) : (
            <>
              <p className="text-white/80 mb-2">
                Arraste um vídeo ou clique para selecionar
              </p>
              <p className="text-white/40 text-sm">
                MP4, WebM, MOV até {maxSize / 1000}GB
              </p>
            </>
          )}
        </div>
      )}

      {/* File Preview */}
      {file && (
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <Film className="h-10 w-10 text-cyan-400 mt-1" />
              <div>
                <p className="text-white/90 font-medium">{file.name}</p>
                <p className="text-white/60 text-sm">{formatFileSize(file.size)}</p>
                <p className="text-white/40 text-xs">Categoria: {category}</p>
              </div>
            </div>
            {uploadStatus === 'idle' && (
              <button
                onClick={resetUpload}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="h-5 w-5 text-white/60" />
              </button>
            )}
          </div>

          {/* Upload Progress */}
          {uploadStatus === 'uploading' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/60">
                <span>Enviando...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Success Message */}
          {uploadStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">Upload concluído com sucesso!</span>
            </div>
          )}

          {/* Error Message */}
          {uploadStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            {uploadStatus === 'idle' && (
              <>
                <Button
                  onClick={uploadVideo}
                  className="flex-1 bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar Vídeo
                </Button>
                <Button
                  onClick={resetUpload}
                  variant="ghost"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </>
            )}

            {uploadStatus === 'uploading' && (
              <Button disabled className="flex-1">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando... {uploadProgress}%
              </Button>
            )}

            {(uploadStatus === 'success' || uploadStatus === 'error') && (
              <Button onClick={resetUpload} className="flex-1">
                Enviar Novo Vídeo
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Display Video Key for Testing */}
      {videoKey && uploadStatus === 'success' && (
        <div className="mt-4 p-3 bg-green-500/10 rounded-lg">
          <p className="text-green-400 text-sm font-medium mb-1">Vídeo enviado!</p>
          <p className="text-white/60 text-xs break-all">
            Chave: <code className="bg-black/30 px-1 rounded">{videoKey}</code>
          </p>
        </div>
      )}
    </div>
  );
}