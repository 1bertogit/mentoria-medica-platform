import { NextRequest, NextResponse } from 'next/server';
import { getServerConfig, publicAwsConfig } from '@/lib/aws/config';
import { createDynamoClient, createS3Client, createCognitoClient, createCloudWatchClient } from '@/lib/aws/config';
import { LambdaClient, ListFunctionsCommand } from '@aws-sdk/client-lambda';
import { SESClient, GetSendQuotaCommand } from '@aws-sdk/client-ses';
import logger from '@/lib/logger';

export async function GET(request: NextRequest) {
  const testResults = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    tests: {} as Record<string, any>,
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
    }
  };

  // Test 1: Configuration Validation
  testResults.tests.configuration = await testConfiguration();
  
  // Test 2: DynamoDB Connection
  testResults.tests.dynamodb = await testDynamoDB();
  
  // Test 3: S3 Connection
  testResults.tests.s3 = await testS3();
  
  // Test 4: Cognito Connection
  testResults.tests.cognito = await testCognito();
  
  // Test 5: Lambda Functions
  testResults.tests.lambda = await testLambda();
  
  // Test 6: CloudWatch
  testResults.tests.cloudwatch = await testCloudWatch();
  
  // Test 7: SES
  testResults.tests.ses = await testSES();

  // Calculate summary
  Object.values(testResults.tests).forEach((test: any) => {
    testResults.summary.total++;
    if (test.status === 'PASS') testResults.summary.passed++;
    else if (test.status === 'FAIL') testResults.summary.failed++;
    else if (test.status === 'WARN') testResults.summary.warnings++;
  });

  const statusCode = testResults.summary.failed > 0 ? 500 : 200;

  return NextResponse.json(testResults, { status: statusCode });
}

async function testConfiguration() {
  try {
    const config = getServerConfig();
    const publicConfig = publicAwsConfig;

    const checks = {
      awsCredentials: !!(config.credentials.accessKeyId && config.credentials.secretAccessKey),
      cognitoConfig: !!(publicConfig.cognito.userPoolId && publicConfig.cognito.clientId),
      s3Config: !!publicConfig.s3.bucketName,
      dynamodbTables: Object.keys(config.dynamodb).length === 6,
      lambdaArns: Object.values(config.lambda).filter(arn => arn).length,
    };

    const allPassed = Object.values(checks).every(Boolean);

    return {
      status: allPassed ? 'PASS' : 'WARN',
      message: allPassed ? 'All configurations valid' : 'Some configurations missing',
      details: checks,
    };
  } catch (error) {
    return {
      status: 'FAIL',
      message: 'Configuration validation failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function testDynamoDB() {
  try {
    const client = createDynamoClient();
    const { ListTablesCommand } = await import('@aws-sdk/client-dynamodb');
    
    const command = new ListTablesCommand({});
    const response = await client.send(command);
    
    const config = getServerConfig();
    const expectedTables = Object.values(config.dynamodb);
    const existingTables = response.TableNames || [];
    
    const missingTables = expectedTables.filter(table => !existingTables.includes(table));
    
    return {
      status: missingTables.length === 0 ? 'PASS' : 'WARN',
      message: missingTables.length === 0 ? 'All tables accessible' : `Missing tables: ${missingTables.join(', ')}`,
      details: {
        expectedTables: expectedTables.length,
        existingTables: existingTables.length,
        missingTables,
      },
    };
  } catch (error) {
    return {
      status: 'FAIL',
      message: 'DynamoDB connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function testS3() {
  try {
    const client = createS3Client();
    const { HeadBucketCommand } = await import('@aws-sdk/client-s3');
    
    const bucketName = publicAwsConfig.s3.bucketName;
    if (!bucketName) {
      return {
        status: 'WARN',
        message: 'S3 bucket not configured',
      };
    }
    
    const command = new HeadBucketCommand({ Bucket: bucketName });
    await client.send(command);
    
    return {
      status: 'PASS',
      message: 'S3 bucket accessible',
      details: { bucket: bucketName },
    };
  } catch (error) {
    return {
      status: 'FAIL',
      message: 'S3 connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function testCognito() {
  try {
    const client = createCognitoClient();
    const { DescribeUserPoolCommand } = await import('@aws-sdk/client-cognito-identity-provider');
    
    const userPoolId = publicAwsConfig.cognito.userPoolId;
    if (!userPoolId) {
      return {
        status: 'WARN',
        message: 'Cognito User Pool not configured',
      };
    }
    
    const command = new DescribeUserPoolCommand({ UserPoolId: userPoolId });
    const response = await client.send(command);
    
    return {
      status: 'PASS',
      message: 'Cognito User Pool accessible',
      details: {
        userPoolId,
        userPoolName: response.UserPool?.Name,
      },
    };
  } catch (error) {
    return {
      status: 'FAIL',
      message: 'Cognito connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function testLambda() {
  try {
    const config = getServerConfig();
    const client = new LambdaClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: config.credentials,
    });
    
    const command = new ListFunctionsCommand({});
    const response = await client.send(command);
    
    const configuredArns = Object.values(config.lambda).filter(arn => arn);
    const existingFunctions = response.Functions?.map(f => f.FunctionArn) || [];
    
    return {
      status: configuredArns.length > 0 ? 'PASS' : 'WARN',
      message: `${configuredArns.length} Lambda functions configured`,
      details: {
        configuredFunctions: configuredArns.length,
        totalFunctions: existingFunctions.length,
      },
    };
  } catch (error) {
    return {
      status: 'FAIL',
      message: 'Lambda connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function testCloudWatch() {
  try {
    const client = createCloudWatchClient();
    const { ListMetricsCommand } = await import('@aws-sdk/client-cloudwatch');
    
    const command = new ListMetricsCommand({
      Namespace: 'PlataformaMedica',
    });
    const response = await client.send(command);
    
    return {
      status: 'PASS',
      message: 'CloudWatch accessible',
      details: {
        metricsCount: response.Metrics?.length || 0,
      },
    };
  } catch (error) {
    return {
      status: 'FAIL',
      message: 'CloudWatch connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function testSES() {
  try {
    const config = getServerConfig();
    const client = new SESClient({
      region: config.ses.region,
      credentials: config.credentials,
    });
    
    const command = new GetSendQuotaCommand({});
    const response = await client.send(command);
    
    return {
      status: 'PASS',
      message: 'SES accessible',
      details: {
        sendQuota: response.Max24HourSend,
        sentLast24Hours: response.SentLast24Hours,
      },
    };
  } catch (error) {
    return {
      status: 'FAIL',
      message: 'SES connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
