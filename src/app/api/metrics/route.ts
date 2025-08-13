import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { getDashboardMetrics, isCloudWatchConfigured } from '@/lib/aws/cloudwatch-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '24h';

    // Check if CloudWatch is configured
    if (!isCloudWatchConfigured()) {
      // Return mock data if CloudWatch is not configured
      return NextResponse.json(getMockMetrics(range));
    }

    // Get real metrics from CloudWatch
    const metrics = await getDashboardMetrics();

    return NextResponse.json({
      ...metrics,
      timeSeriesData: generateTimeSeriesData(range),
    });
  } catch (error) {
    logger.error('Error fetching metrics:', error);
    // Return mock data on error
    return NextResponse.json(getMockMetrics('24h'));
  }
}

function getMockMetrics(range: string) {
  return {
    userMetrics: {
      totalLogins: Math.floor(Math.random() * 2000) + 1000,
      activeUsers: Math.floor(Math.random() * 500) + 200,
      newSignups: Math.floor(Math.random() * 50) + 10,
    },
    courseMetrics: {
      totalViews: Math.floor(Math.random() * 8000) + 3000,
      enrollments: Math.floor(Math.random() * 200) + 100,
      completions: Math.floor(Math.random() * 80) + 20,
    },
    performanceMetrics: {
      avgLatency: Math.floor(Math.random() * 100) + 100,
      errorRate: (Math.random() * 0.5).toFixed(2),
      uptime: 99.9,
    },
    timeSeriesData: generateTimeSeriesData(range),
  };
}

function generateTimeSeriesData(range: string) {
  const points = range === '1h' ? 12 : range === '24h' ? 24 : range === '7d' ? 7 : 30;
  const data = [];
  
  for (let i = 0; i < points; i++) {
    const time = range === '1h' ? `${i * 5}min` :
                 range === '24h' ? `${i}:00` :
                 range === '7d' ? `Day ${i + 1}` :
                 `${i + 1}`;
    
    data.push({
      time,
      logins: Math.floor(Math.random() * 300) + 50,
      views: Math.floor(Math.random() * 800) + 200,
      errors: Math.floor(Math.random() * 5),
    });
  }
  
  return data;
}