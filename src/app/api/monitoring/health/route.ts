import { NextRequest, NextResponse } from 'next/server';
import { CloudWatchClient, PutMetricDataCommand, GetMetricStatisticsCommand } from '@aws-sdk/client-cloudwatch';
import { getServerConfig } from '@/lib/aws/config';
import logger from '@/lib/logger';

export async function GET(request: NextRequest) {
  const healthCheck = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    services: {} as Record<string, any>,
    metrics: {} as Record<string, any>,
    alerts: [] as string[],
  };

  try {
    // Check CloudWatch connectivity
    healthCheck.services.cloudwatch = await checkCloudWatch();
    
    // Check system metrics
    healthCheck.metrics = await getSystemMetrics();
    
    // Check for alerts
    healthCheck.alerts = await checkAlerts();
    
    // Determine overall health
    const failedServices = Object.values(healthCheck.services).filter((service: any) => service.status === 'unhealthy');
    healthCheck.status = failedServices.length === 0 ? 'healthy' : 'degraded';

    // Send health metrics to CloudWatch
    await sendHealthMetrics(healthCheck);

    const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
    return NextResponse.json(healthCheck, { status: statusCode });

  } catch (error) {
    logger.error('Health check failed:', error);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 503 });
  }
}

async function checkCloudWatch() {
  try {
    const config = getServerConfig();
    const client = new CloudWatchClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: config.credentials,
    });

    // Test CloudWatch connectivity by listing metrics
    const command = new GetMetricStatisticsCommand({
      Namespace: 'PlataformaMedica',
      MetricName: 'HealthCheck',
      StartTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      EndTime: new Date(),
      Period: 300, // 5 minutes
      Statistics: ['Sum'],
    });

    await client.send(command);

    return {
      status: 'healthy',
      message: 'CloudWatch accessible',
      lastCheck: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: 'CloudWatch connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      lastCheck: new Date().toISOString(),
    };
  }
}

async function getSystemMetrics() {
  try {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    return {
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memoryUsage.external / 1024 / 1024), // MB
        rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
      },
      uptime: {
        seconds: Math.round(uptime),
        formatted: formatUptime(uptime),
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Failed to get system metrics:', error);
    return {
      error: 'Failed to collect system metrics',
    };
  }
}

async function checkAlerts() {
  const alerts = [];

  try {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);

    // Memory usage alert
    if (heapUsedMB > 200) {
      alerts.push(`High memory usage: ${heapUsedMB}MB`);
    }

    // Environment alerts
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === 'true') {
      alerts.push('Mock authentication enabled in production');
    }

    // Configuration alerts
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      alerts.push('AWS credentials not configured');
    }

    if (!process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID) {
      alerts.push('Cognito User Pool not configured');
    }

    return alerts;
  } catch (error) {
    logger.error('Failed to check alerts:', error);
    return ['Failed to check system alerts'];
  }
}

async function sendHealthMetrics(healthCheck: any) {
  try {
    const config = getServerConfig();
    const client = new CloudWatchClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: config.credentials,
    });

    const metrics = [
      {
        MetricName: 'HealthCheck',
        Value: healthCheck.status === 'healthy' ? 1 : 0,
        Unit: 'Count',
        Timestamp: new Date(),
      },
      {
        MetricName: 'MemoryUsage',
        Value: healthCheck.metrics.memory?.heapUsed || 0,
        Unit: 'Count',
        Timestamp: new Date(),
      },
      {
        MetricName: 'Uptime',
        Value: healthCheck.metrics.uptime?.seconds || 0,
        Unit: 'Seconds',
        Timestamp: new Date(),
      },
      {
        MetricName: 'AlertCount',
        Value: healthCheck.alerts.length,
        Unit: 'Count',
        Timestamp: new Date(),
      },
    ];

    const command = new PutMetricDataCommand({
      Namespace: 'PlataformaMedica/Health',
      MetricData: metrics,
    });

    await client.send(command);
    logger.info('Health metrics sent to CloudWatch');
  } catch (error) {
    logger.error('Failed to send health metrics to CloudWatch:', error);
    // Don't throw error - health check should still work even if metrics fail
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.join(' ') || '0s';
}

// POST endpoint to manually trigger health check and send metrics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { metricName, value, unit = 'Count' } = body;

    if (!metricName || value === undefined) {
      return NextResponse.json(
        { error: 'Missing metricName or value' },
        { status: 400 }
      );
    }

    const config = getServerConfig();
    const client = new CloudWatchClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: config.credentials,
    });

    const command = new PutMetricDataCommand({
      Namespace: 'PlataformaMedica/Custom',
      MetricData: [
        {
          MetricName: metricName,
          Value: value,
          Unit: unit,
          Timestamp: new Date(),
        },
      ],
    });

    await client.send(command);

    return NextResponse.json({
      success: true,
      message: 'Custom metric sent to CloudWatch',
      metric: { metricName, value, unit },
    });
  } catch (error) {
    logger.error('Failed to send custom metric:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send metric',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
