'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  onUpload?: (file: File | null) => void;
  currentImageUrl?: string;
  accept?: string;
  maxSize?: number; // in bytes
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
  disabled?: boolean;
  description?: string;
}

export function ImageUploader({
  label,
  value,
  onChange,
  onUpload,
  currentImageUrl,
  accept = 'image/jpeg,image/png,image/webp',
  maxSize = 1024 * 1024, // 1MB default
  maxWidth,
  maxHeight,
  className,
  disabled = false,
  description,
}: ImageUploaderProps) {
  const handleChange = onUpload || onChange || (() => {});
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate preview URL
  React.useEffect(() => {
    const imageSource = value || currentImageUrl;
    if (imageSource instanceof File) {
      const url = URL.createObjectURL(imageSource);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof imageSource === 'string' && imageSource) {
      setPreview(imageSource);
    } else {
      setPreview(null);
    }
  }, [value, currentImageUrl]);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      const acceptedTypes = accept.split(',').map(type => type.trim());
      if (!acceptedTypes.includes(file.type)) {
        return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
      }

      // Check file size
      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        return `File size too large. Maximum size: ${maxSizeMB}MB`;
      }

      return null;
    },
    [accept, maxSize]
  );

  const validateImageDimensions = useCallback(
    (file: File): Promise<string | null> => {
      return new Promise(resolve => {
        if (!maxWidth && !maxHeight) {
          resolve(null);
          return;
        }

        const img = new Image();
        img.onload = () => {
          let error = null;
          if (maxWidth && img.width > maxWidth) {
            error = `Image width too large. Maximum width: ${maxWidth}px`;
          } else if (maxHeight && img.height > maxHeight) {
            error = `Image height too large. Maximum height: ${maxHeight}px`;
          }
          resolve(error);
        };
        img.onerror = () => resolve('Invalid image file');
        img.src = URL.createObjectURL(file);
      });
    },
    [maxWidth, maxHeight]
  );

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      // Basic validation
      const basicError = validateFile(file);
      if (basicError) {
        setError(basicError);
        return;
      }

      // Dimension validation
      const dimensionError = await validateImageDimensions(file);
      if (dimensionError) {
        setError(dimensionError);
        return;
      }

      handleChange(file);
    },
    [validateFile, validateImageDimensions, handleChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleFile(files[0]);
      }
    },
    [disabled, handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    handleChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleChange]);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-white">{label}</Label>
      {description && <p className="text-sm text-white/70">{description}</p>}

      <div
        className={cn(
          'relative rounded-lg border-2 border-dashed transition-colors',
          dragActive ? 'border-blue-400 bg-blue-400/10' : 'border-white/20',
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer hover:border-white/40',
          error ? 'border-red-400' : ''
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {preview ? (
          <div className="relative p-4">
            <div className="flex items-center justify-center">
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 max-w-full rounded object-contain"
              />
            </div>
            {!disabled && (
              <Button
                variant="destructive"
                size="sm"
                className="absolute right-2 top-2"
                onClick={e => {
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {value instanceof File && (
              <div className="mt-2 text-center text-sm text-white/70">
                {value.name} ({formatFileSize(value.size)})
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full bg-white/10 p-3">
                <Upload className="h-6 w-6 text-white/70" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-white">
                  Drop your image here, or click to browse
                </p>
                <p className="text-sm text-white/70">
                  {accept
                    .split(',')
                    .map(type => type.split('/')[1])
                    .join(', ')
                    .toUpperCase()}
                  {maxSize && ` • Max ${formatFileSize(maxSize)}`}
                  {maxWidth && maxHeight && ` • Max ${maxWidth}x${maxHeight}px`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded border border-red-400/20 bg-red-400/10 p-2 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
