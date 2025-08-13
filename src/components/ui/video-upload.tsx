'use client';

import { useState, useRef } from 'react';
import logger from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Upload, X, Play, Loader2 } from 'lucide-react';

interface VideoUploadProps {
  onVideoUploaded?: (videoUrl: string) => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  className?: string;
}

export function VideoUpload({
  onVideoUploaded,
  maxSizeMB = 1024,
  acceptedFormats = ['mp4', 'webm', 'mov', 'avi'],
  className = '',
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações
    const fileSizeMB = file.size / (1024 * 1024);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileSizeMB > maxSizeMB) {
      setError(`Arquivo muito grande. Máximo ${maxSizeMB}MB`);
      return;
    }

    if (!fileExtension || !acceptedFormats.includes(fileExtension)) {
      setError(`Formato não suportado. Use: ${acceptedFormats.join(', ')}`);
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload real para S3
      const s3Url = await uploadToS3(file);
      setVideoUrl(s3Url);
      onVideoUploaded?.(s3Url);
    } catch (err) {
      setError('Erro no upload. Tente novamente.');
      logger.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadToS3 = async (file: File): Promise<string> => {
    try {
      // Importa dinamicamente para evitar problemas de SSR
      const { uploadVideoToS3 } = await import('@/lib/aws/s3-upload');

      const result = await uploadVideoToS3(file, progress => {
        setUploadProgress(progress.percentage);
      });

      return result.url;
    } catch (error) {
      logger.error('Upload S3 falhou, usando local:', error);
      // Fallback para URL local
      return URL.createObjectURL(file);
    }
  };

  const handleRemoveVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  if (videoUrl) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm ${className}`}
      >
        <video
          className="aspect-video w-full object-cover"
          controls
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
          Seu navegador não suporta vídeo HTML5.
        </video>

        <div className="absolute right-4 top-4">
          <Button
            onClick={handleRemoveVideo}
            size="sm"
            variant="ghost"
            className="h-8 w-8 rounded-full bg-black/50 p-0 text-white hover:bg-black/70"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-4 rounded-lg bg-black/50 px-3 py-1 backdrop-blur-sm">
          <span className="text-sm text-white">✅ Vídeo carregado</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.map(format => `.${format}`).join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onClick={triggerFileSelect}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10"
      >
        {isUploading ? (
          <div className="space-y-4">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-purple-400" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-white">
                Fazendo upload...
              </p>
              <div className="mx-auto h-2 w-64 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-white/70">
                {Math.round(uploadProgress)}%
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20 group-hover:bg-purple-500/30">
              <Upload className="h-8 w-8 text-purple-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                Faça upload do seu vídeo
              </h3>
              <p className="text-white/70">
                Arraste e solte ou clique para selecionar
              </p>
              <p className="text-sm text-white/50">
                Formatos: {acceptedFormats.join(', ')} • Máximo {maxSizeMB}MB
              </p>
            </div>

            <Button
              variant="ghost"
              className="border border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              Selecionar Arquivo
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 backdrop-blur-sm">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
