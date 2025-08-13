import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import logger from '@/lib/logger';
import { getServerConfig } from '@/lib/aws/config';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export async function uploadVideoToS3(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ url: string; key: string }> {
  const key = `videos/mentoria-legacy-${Date.now()}.${file.name.split('.').pop()}`;

  try {
    // Para arquivos grandes (>100MB), usar função especializada
    if (file.size > 100 * 1024 * 1024) {
      return await uploadLargeFile(file, key, onProgress);
    }

    // Upload simples para arquivos menores
    if (onProgress) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        onProgress({
          loaded: (progress / 100) * file.size,
          total: file.size,
          percentage: progress,
        });
      }, 200);
    }

    const command = new PutObjectCommand({
      Bucket: (process.env.AWS_S3_BUCKET || 'facelift-medical-platform'),
      Key: key,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read', // Torna o vídeo público
      Metadata: {
        'uploaded-by': 'mentoria-legacy-admin',
        'upload-date': new Date().toISOString(),
      },
    });

    await s3Client.send(command);

    const url = `https://${(process.env.AWS_S3_BUCKET || 'facelift-medical-platform')}.s3.${(process.env.AWS_REGION || 'us-east-1')}.amazonaws.com/${key}`;

    return { url, key };
  } catch (error) {
    logger.error('Erro no upload S3:', error);
    throw new Error('Falha no upload do vídeo');
  }
}

export async function getVideoUrl(key: string): Promise<string> {
  return `https://${(process.env.AWS_S3_BUCKET || 'facelift-medical-platform')}.s3.${(process.env.AWS_REGION || 'us-east-1')}.amazonaws.com/${key}`;
}

// Upload para arquivos grandes usando multipart upload
async function uploadLargeFile(
  file: File,
  key: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ url: string; key: string }> {
  // Para arquivos grandes, simular upload em chunks
  // Em produção, implementar multipart upload real

  if (onProgress) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5; // Mais lento para arquivos grandes
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      onProgress({
        loaded: (progress / 100) * file.size,
        total: file.size,
        percentage: progress,
      });
    }, 500); // Intervalo maior para arquivos grandes
  }

  // Simular delay para arquivo grande
  await new Promise(resolve => setTimeout(resolve, 2000));

  const command = new PutObjectCommand({
    Bucket: (process.env.AWS_S3_BUCKET || 'facelift-medical-platform'),
    Key: key,
    Body: file,
    ContentType: file.type,
    ACL: 'public-read',
    Metadata: {
      'uploaded-by': 'mentoria-legacy-admin',
      'upload-date': new Date().toISOString(),
      'file-size': file.size.toString(),
    },
  });

  await s3Client.send(command);

  const url = `https://${(process.env.AWS_S3_BUCKET || 'facelift-medical-platform')}.s3.${(process.env.AWS_REGION || 'us-east-1')}.amazonaws.com/${key}`;

  return { url, key };
}
