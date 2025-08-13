import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { uploadFile, isS3Configured } from '@/lib/aws/s3-client';

export async function POST(request: NextRequest) {
  try {
    // Check if S3 is configured
    if (!isS3Configured()) {
      return NextResponse.json(
        { error: 'S3 is not configured' },
        { status: 503 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!folder || !['courses', 'library', 'profiles', 'resources'].includes(folder)) {
      return NextResponse.json(
        { error: 'Invalid folder specified' },
        { status: 400 }
      );
    }

    // Upload to S3
    const result = await uploadFile(
      file,
      folder as 'courses' | 'library' | 'profiles' | 'resources'
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
    });
  } catch (error) {
    logger.error('Error in upload API:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Configure for large file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500mb',
    },
  },
};