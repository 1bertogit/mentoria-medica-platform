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
    const { userId, courseId, paymentDetails, eligibilityDetails } = body;

    // Validate required fields
    if (!userId || !courseId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, courseId' },
        { status: 400 }
      );
    }

    const client = getLambdaClient();
    if (!client) {
      // Fallback to mock enrollment creation
      logger.warn('Lambda client not available, using mock enrollment creation');
      return createMockEnrollment(userId, courseId, paymentDetails, eligibilityDetails);
    }

    const config = getServerConfig();
    const lambdaArn = config.lambda.createEnrollmentArn;

    if (!lambdaArn) {
      logger.warn('Lambda ARN not configured, using mock enrollment creation');
      return createMockEnrollment(userId, courseId, paymentDetails, eligibilityDetails);
    }

    // Prepare Lambda payload
    const payload = {
      userId,
      courseId,
      paymentDetails: paymentDetails || {},
      eligibilityDetails: eligibilityDetails || {},
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
      throw new Error(result.error || 'Enrollment creation failed');
    }

    logger.info('Enrollment created successfully:', {
      userId,
      courseId,
      enrollmentId: result.enrollmentId,
    });

    return NextResponse.json({
      success: true,
      enrollmentId: result.enrollmentId,
      enrollmentRecord: result.enrollmentRecord,
      courseAccess: result.courseAccess,
      message: 'Enrollment created successfully',
    });

  } catch (error) {
    logger.error('Enrollment creation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Enrollment creation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Mock enrollment creation for development/fallback
async function createMockEnrollment(
  userId: string, 
  courseId: string, 
  paymentDetails: any, 
  eligibilityDetails: any
) {
  logger.info('Creating mock enrollment:', { userId, courseId });

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const enrollmentId = `MOCK-ENR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const enrollmentDate = new Date().toISOString();

  const enrollmentRecord = {
    enrollmentId,
    userId,
    courseId,
    status: 'active',
    enrollmentDate,
    paymentDetails: paymentDetails || {},
    eligibilityDetails: eligibilityDetails || {},
    progress: {
      completedLessons: [],
      currentLesson: null,
      percentComplete: 0,
      lastAccessedAt: null
    },
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    mock: true,
  };

  const courseAccess = {
    accessToken: generateAccessToken(),
    courseUrl: `https://platform.medical.com/courses/${courseId}`,
    validUntil: enrollmentRecord.expiresAt
  };

  return NextResponse.json({
    success: true,
    enrollmentId,
    enrollmentRecord,
    courseAccess,
    message: 'Mock enrollment created successfully',
  });
}

function generateAccessToken() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}
