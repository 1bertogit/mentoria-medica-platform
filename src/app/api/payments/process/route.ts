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
    const { userId, courseId, paymentData } = body;

    // Validate required fields
    if (!userId || !courseId || !paymentData) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, courseId, paymentData' },
        { status: 400 }
      );
    }

    // Validate payment data
    if (!paymentData.method || !paymentData.amount) {
      return NextResponse.json(
        { error: 'Missing payment method or amount' },
        { status: 400 }
      );
    }

    const client = getLambdaClient();
    if (!client) {
      // Fallback to mock payment processing
      logger.warn('Lambda client not available, using mock payment processing');
      return processMockPayment(userId, courseId, paymentData);
    }

    const config = getServerConfig();
    const lambdaArn = config.lambda.processPaymentArn;

    if (!lambdaArn) {
      logger.warn('Lambda ARN not configured, using mock payment processing');
      return processMockPayment(userId, courseId, paymentData);
    }

    // Prepare Lambda payload
    const payload = {
      userId,
      courseId,
      enrollmentData: {
        payment: paymentData,
        timestamp: new Date().toISOString(),
      }
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
      throw new Error(result.error || 'Payment processing failed');
    }

    logger.info('Payment processed successfully:', {
      userId,
      courseId,
      transactionId: result.transactionId,
    });

    return NextResponse.json({
      success: true,
      paymentSuccessful: result.paymentSuccessful,
      transactionId: result.transactionId,
      paymentDetails: result.paymentDetails,
      message: 'Payment processed successfully',
    });

  } catch (error) {
    logger.error('Payment processing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Payment processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Mock payment processing for development/fallback
async function processMockPayment(userId: string, courseId: string, paymentData: any) {
  logger.info('Processing mock payment:', { userId, courseId, paymentData });

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate random failure (5% chance)
  if (Math.random() < 0.05) {
    return NextResponse.json(
      { 
        error: 'Payment failed',
        message: 'Insufficient funds or card declined',
      },
      { status: 400 }
    );
  }

  const transactionId = `MOCK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return NextResponse.json({
    success: true,
    paymentSuccessful: true,
    transactionId,
    paymentDetails: {
      method: paymentData.method,
      amount: paymentData.amount,
      currency: paymentData.currency || 'BRL',
      processedAt: new Date().toISOString(),
      status: 'approved',
      mock: true,
    },
    message: 'Mock payment processed successfully',
  });
}
