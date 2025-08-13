import { NextRequest, NextResponse } from 'next/server';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { getServerConfig } from '@/lib/aws/config';
import logger from '@/lib/logger';

// Initialize Lambda client
let lambdaClient: LambdaClient | null = null;

function getLambdaClient() {
  if (!lambdaClient) {
    try {
      const config = getServerConfig();
      lambdaClient = new LambdaClient({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: config.credentials,
      });
    } catch (error) {
      logger.error('Failed to initialize Lambda client:', error);
      return null;
    }
  }
  return lambdaClient;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, courseId, courseName, userName, completionDate } = body;

    // Validate required fields
    if (!userId || !courseId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, courseId' },
        { status: 400 }
      );
    }

    const client = getLambdaClient();
    if (!client) {
      // Fallback to mock certificate generation
      logger.warn('Lambda client not available, using mock certificate generation');
      return generateMockCertificate(userId, courseId, courseName, userName, completionDate);
    }

    const config = getServerConfig();
    const lambdaArn = config.lambda.generateCertificateArn;

    if (!lambdaArn) {
      logger.warn('Lambda ARN not configured, using mock certificate generation');
      return generateMockCertificate(userId, courseId, courseName, userName, completionDate);
    }

    // Prepare Lambda payload
    const payload = {
      userId,
      courseId,
      courseName: courseName || 'Medical Course',
      userName: userName || 'Student',
      completionDate: completionDate || new Date().toISOString(),
    };

    // Invoke Lambda function
    const command = new InvokeCommand({
      FunctionName: lambdaArn,
      Payload: JSON.stringify(payload),
      InvocationType: 'RequestResponse',
    });

    const response = await client.send(command);
    
    if (!response.Payload) {
      throw new Error('No response from Lambda function');
    }

    const result = JSON.parse(new TextDecoder().decode(response.Payload));

    if (result.statusCode !== 200) {
      throw new Error(result.error || 'Certificate generation failed');
    }

    logger.info('Certificate generated successfully:', {
      userId,
      courseId,
      certificateId: result.certificateId,
    });

    return NextResponse.json({
      success: true,
      certificateId: result.certificateId,
      certificateUrl: result.certificateUrl,
      generatedAt: result.generatedAt,
      message: 'Certificate generated successfully',
    });

  } catch (error) {
    logger.error('Certificate generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Certificate generation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Mock certificate generation for development/fallback
async function generateMockCertificate(
  userId: string, 
  courseId: string, 
  courseName?: string, 
  userName?: string, 
  completionDate?: string
) {
  logger.info('Generating mock certificate:', { userId, courseId });

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const certificateId = `MOCK-CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const generatedAt = new Date().toISOString();

  // Mock certificate URL (would be S3 URL in real implementation)
  const certificateUrl = `https://mock-certificates.s3.amazonaws.com/certificates/${userId}/${certificateId}.pdf`;

  return NextResponse.json({
    success: true,
    certificateId,
    certificateUrl,
    userId,
    courseId,
    courseName: courseName || 'Medical Course',
    generatedAt,
    mock: true,
    message: 'Mock certificate generated successfully',
  });
}
