import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { healthChecker } from '@/lib/aws/health-check';

export async function GET() {
  try {
    const healthSummary = await healthChecker.getHealthSummary();

    return NextResponse.json(healthSummary, {
      status: healthSummary.overall === 'unhealthy' ? 503 : 200,
    });
  } catch (error) {
    logger.error('Health check API error:', error);

    return NextResponse.json(
      {
        overall: 'unhealthy',
        services: [],
        timestamp: new Date().toISOString(),
        configured: 0,
        healthy: 0,
        total: 0,
        error: 'Health check failed',
      },
      { status: 500 }
    );
  }
}
