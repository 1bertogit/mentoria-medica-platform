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
    const { type, userId, data } = body;

    // Validate required fields
    if (!type || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: type, userId' },
        { status: 400 }
      );
    }

    const client = getLambdaClient();
    if (!client) {
      // Fallback to mock notification
      logger.warn('Lambda client not available, using mock notification');
      return sendMockNotification(type, userId, data);
    }

    const config = getServerConfig();
    const lambdaArn = config.lambda.emailNotificationArn;

    if (!lambdaArn) {
      logger.warn('Lambda ARN not configured, using mock notification');
      return sendMockNotification(type, userId, data);
    }

    // Prepare Lambda payload
    const payload = {
      type,
      userId,
      data: data || {},
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
      throw new Error(result.error || 'Notification sending failed');
    }

    logger.info('Notification sent successfully:', {
      type,
      userId,
      messageId: result.messageId,
    });

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      message: 'Notification sent successfully',
    });

  } catch (error) {
    logger.error('Notification sending error:', error);
    
    return NextResponse.json(
      { 
        error: 'Notification sending failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Mock notification for development/fallback
async function sendMockNotification(type: string, userId: string, data: any) {
  logger.info('Sending mock notification:', { type, userId, data });

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const messageId = `MOCK-MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return NextResponse.json({
    success: true,
    messageId,
    type,
    userId,
    sentAt: new Date().toISOString(),
    mock: true,
    message: 'Mock notification sent successfully',
  });
}
