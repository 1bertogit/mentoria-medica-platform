import { NextRequest, NextResponse } from 'next/server';
import { getPublicConfig } from '@/lib/aws/config';

import logger from '@/lib/logger';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: getPublicConfig().region || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Generate presigned URL for direct upload from browser
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, fileType, fileSize, category = 'cursos' } = body;

    if (!fileName || !fileType || !fileSize) {
      return NextResponse.json(
        { error: 'fileName, fileType, and fileSize are required' },
        { status: 400 }
      );
    }

    // Validate file type (only video formats)
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only video files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5GB)
    const maxSize = 5 * 1024 * 1024 * 1024; // 5GB in bytes
    if (fileSize > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5GB limit' },
        { status: 400 }
      );
    }

    // Generate unique key for the video
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `videos/${category}/${timestamp}_${sanitizedFileName}`;

    // Create the PutObject command
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      ContentType: fileType,
      // Add metadata
      Metadata: {
        originalName: fileName,
        uploadedAt: new Date().toISOString(),
        category: category,
      },
    });

    // Generate presigned URL for upload (expires in 10 minutes)
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 600, // 10 minutes
    });

    return NextResponse.json({
      uploadUrl,
      key,
      expiresIn: 600,
    });
  } catch (error) {
    logger.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}

// Get upload progress (optional - requires additional setup)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const uploadId = searchParams.get('uploadId');

    if (!uploadId) {
      return NextResponse.json(
        { error: 'Upload ID is required' },
        { status: 400 }
      );
    }

    // This would typically check the upload progress from a database
    // or use AWS S3 multipart upload API for large files
    
    return NextResponse.json({
      uploadId,
      progress: 100, // Placeholder
      status: 'completed',
    });
  } catch (error) {
    logger.error('Error checking upload progress:', error);
    return NextResponse.json(
      { error: 'Failed to check upload progress' },
      { status: 500 }
    );
  }
}