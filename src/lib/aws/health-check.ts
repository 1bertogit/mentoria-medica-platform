import {
  dynamoClient,
  s3Client,
  cognitoClient,
  cloudWatchClient,
  awsConfig,
} from './config';
import { DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { getPublicConfig } from '@/lib/aws/config';

import { HeadBucketCommand } from '@aws-sdk/client-s3';
import { DescribeUserPoolCommand } from '@aws-sdk/client-cognito-identity-provider';
import { logger } from '../logger';

export interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'unhealthy' | 'not_configured';
  message: string;
  details?: unknown;
}

export class AWSHealthChecker {
  async checkDynamoDB(): Promise<HealthCheckResult> {
    try {
      if (!getPublicConfig().credentials.accessKeyId) {
        return {
          service: 'DynamoDB',
          status: 'not_configured',
          message: 'AWS credentials not configured',
        };
      }

      // Tenta listar uma tabela para verificar conectividade
      const command = new DescribeTableCommand({
        TableName: getPublicConfig().dynamodb.casesTable,
      });

      await dynamoClient.send(command);

      return {
        service: 'DynamoDB',
        status: 'healthy',
        message: 'Connected successfully',
        details: {
          region: getPublicConfig().region,
          tablesConfigured: Object.keys(getPublicConfig().dynamodb).length,
        },
      };
    } catch (error: unknown) {
      logger.error('DynamoDB health check failed:', error);

      if (error.name === 'ResourceNotFoundException') {
        return {
          service: 'DynamoDB',
          status: 'unhealthy',
          message: `Table ${getPublicConfig().dynamodb.casesTable} not found - needs to be created`,
          details: { error: error.message },
        };
      }

      return {
        service: 'DynamoDB',
        status: 'unhealthy',
        message: 'Connection failed',
        details: { error: error.message },
      };
    }
  }

  async checkS3(): Promise<HealthCheckResult> {
    try {
      if (!getPublicConfig().credentials.accessKeyId) {
        return {
          service: 'S3',
          status: 'not_configured',
          message: 'AWS credentials not configured',
        };
      }

      const command = new HeadBucketCommand({
        Bucket: getPublicConfig().s3.bucketName,
      });

      await s3Client.send(command);

      return {
        service: 'S3',
        status: 'healthy',
        message: 'Bucket accessible',
        details: {
          bucket: getPublicConfig().s3.bucketName,
          region: getPublicConfig().region,
        },
      };
    } catch (error: unknown) {
      logger.error('S3 health check failed:', error);

      if (error.name === 'NotFound') {
        return {
          service: 'S3',
          status: 'unhealthy',
          message: `Bucket ${getPublicConfig().s3.bucketName} not found - needs to be created`,
          details: { error: error.message },
        };
      }

      return {
        service: 'S3',
        status: 'unhealthy',
        message: 'Bucket not accessible',
        details: { error: error.message },
      };
    }
  }

  async checkCognito(): Promise<HealthCheckResult> {
    try {
      if (!getPublicConfig().cognito.userPoolId) {
        return {
          service: 'Cognito',
          status: 'not_configured',
          message: 'Cognito User Pool ID not configured',
        };
      }

      const command = new DescribeUserPoolCommand({
        UserPoolId: getPublicConfig().cognito.userPoolId,
      });

      const result = await cognitoClient.send(command);

      return {
        service: 'Cognito',
        status: 'healthy',
        message: 'User Pool accessible',
        details: {
          userPoolId: getPublicConfig().cognito.userPoolId,
          userPoolName: result.UserPool?.Name,
          status: result.UserPool?.Status,
        },
      };
    } catch (error: unknown) {
      logger.error('Cognito health check failed:', error);

      return {
        service: 'Cognito',
        status: 'unhealthy',
        message: 'User Pool not accessible',
        details: { error: error.message },
      };
    }
  }

  async checkAll(): Promise<HealthCheckResult[]> {
    const checks = await Promise.allSettled([
      this.checkDynamoDB(),
      this.checkS3(),
      this.checkCognito(),
    ]);

    return checks.map(result =>
      result.status === 'fulfilled'
        ? result.value
        : {
            service: 'Unknown',
            status: 'unhealthy' as const,
            message: 'Health check failed',
            details: { error: result.reason },
          }
    );
  }

  async getHealthSummary() {
    const results = await this.checkAll();

    const summary = {
      overall: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
      services: results,
      timestamp: new Date().toISOString(),
      configured: results.filter(r => r.status !== 'not_configured').length,
      healthy: results.filter(r => r.status === 'healthy').length,
      total: results.length,
    };

    // Determina status geral
    if (summary.healthy === 0) {
      summary.overall = 'unhealthy';
    } else if (summary.healthy < summary.configured) {
      summary.overall = 'degraded';
    }

    return summary;
  }
}

export const healthChecker = new AWSHealthChecker();
