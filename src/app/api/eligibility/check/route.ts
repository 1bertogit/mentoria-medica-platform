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
    const { userId, courseId, userProfile } = body;

    // Validate required fields
    if (!userId || !courseId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, courseId' },
        { status: 400 }
      );
    }

    const client = getLambdaClient();
    if (!client) {
      // Fallback to mock eligibility check
      logger.warn('Lambda client not available, using mock eligibility check');
      return checkMockEligibility(userId, courseId, userProfile);
    }

    const config = getServerConfig();
    const lambdaArn = config.lambda.checkEligibilityArn;

    if (!lambdaArn) {
      logger.warn('Lambda ARN not configured, using mock eligibility check');
      return checkMockEligibility(userId, courseId, userProfile);
    }

    // Prepare Lambda payload
    const payload = {
      userId,
      courseId,
      userProfile: userProfile || {},
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
      throw new Error(result.error || 'Eligibility check failed');
    }

    logger.info('Eligibility check completed:', {
      userId,
      courseId,
      eligible: result.eligible,
    });

    return NextResponse.json({
      success: true,
      eligible: result.eligible,
      reasons: result.reasons || [],
      requirements: result.requirements || [],
      message: result.eligible ? 'User is eligible' : 'User is not eligible',
    });

  } catch (error) {
    logger.error('Eligibility check error:', error);
    
    return NextResponse.json(
      { 
        error: 'Eligibility check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Mock eligibility check for development/fallback
async function checkMockEligibility(userId: string, courseId: string, userProfile: any) {
  logger.info('Checking mock eligibility:', { userId, courseId, userProfile });

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mock eligibility logic - most users are eligible
  const eligible = Math.random() > 0.1; // 90% eligible

  const reasons = eligible ? [] : [
    'Incomplete profile information',
    'Missing required certifications'
  ];

  const requirements = eligible ? [] : [
    'Complete your medical license information',
    'Upload proof of current practice'
  ];

  return NextResponse.json({
    success: true,
    eligible,
    reasons,
    requirements,
    userId,
    courseId,
    checkedAt: new Date().toISOString(),
    mock: true,
    message: eligible ? 'Mock user is eligible' : 'Mock user is not eligible',
  });
}
