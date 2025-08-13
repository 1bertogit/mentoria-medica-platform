import { NextRequest, NextResponse } from 'next/server';
import { getPublicConfig } from '@/lib/aws/config';

import logger from '@/lib/logger';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 Client
const s3Client = new S3Client({
  region: getPublicConfig().region || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function GET(request: NextRequest) {
  try {
    // Get video key from query params
    const searchParams = request.nextUrl.searchParams;
    const videoKey = searchParams.get('key');

    if (!videoKey) {
      return NextResponse.json(
        { error: 'Video key is required' },
        { status: 400 }
      );
    }

    // TODO: Add authentication check here
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // TODO: Add authorization check - verify user has access to this video
    // const hasAccess = await checkUserVideoAccess(session.user.id, videoKey);
    // if (!hasAccess) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    // Generate signed URL (expires in 1 hour)
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: videoKey,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    // Log access for analytics
    console.log(`Video access: ${videoKey} at ${new Date().toISOString()}`);

    return NextResponse.json({
      url: signedUrl,
      expiresIn: 3600,
    });
  } catch (error) {
    logger.error('Error generating signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate video URL' },
      { status: 500 }
    );
  }
}

// Optional: Add POST endpoint for getting multiple URLs at once
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoKeys } = body;

    if (!Array.isArray(videoKeys) || videoKeys.length === 0) {
      return NextResponse.json(
        { error: 'Video keys array is required' },
        { status: 400 }
      );
    }

    // Generate signed URLs for multiple videos
    const signedUrls = await Promise.all(
      videoKeys.map(async (key) => {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: key,
        });

        const url = await getSignedUrl(s3Client, command, {
          expiresIn: 3600,
        });

        return {
          key,
          url,
          expiresIn: 3600,
        };
      })
    );

    return NextResponse.json({ urls: signedUrls });
  } catch (error) {
    logger.error('Error generating signed URLs:', error);
    return NextResponse.json(
      { error: 'Failed to generate video URLs' },
      { status: 500 }
    );
  }
}