import logger from '@/lib/logger';
import {
  CloudWatchClient,
  PutMetricDataCommand,
  GetMetricStatisticsCommand,
  GetMetricDataCommand,
  ListMetricsCommand,
  PutDashboardCommand,
  Dimension,
  MetricDatum,
  Statistic,
} from '@aws-sdk/client-cloudwatch';

// Initialize CloudWatch client
const cloudWatchClient = new CloudWatchClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

const NAMESPACE = 'PlataformaMedica';

// Metric types
export enum MetricType {
  // User metrics
  USER_LOGIN = 'UserLogin',
  USER_SIGNUP = 'UserSignup',
  USER_LOGOUT = 'UserLogout',
  USER_ACTIVE = 'ActiveUsers',
  
  // Course metrics
  COURSE_VIEW = 'CourseView',
  COURSE_ENROLLMENT = 'CourseEnrollment',
  COURSE_COMPLETION = 'CourseCompletion',
  LESSON_VIEW = 'LessonView',
  
  // Library metrics
  LIBRARY_VIEW = 'LibraryView',
  LIBRARY_DOWNLOAD = 'LibraryDownload',
  
  // Upload metrics
  FILE_UPLOAD = 'FileUpload',
  FILE_DOWNLOAD = 'FileDownload',
  UPLOAD_SIZE = 'UploadSize',
  
  // Performance metrics
  API_LATENCY = 'APILatency',
  PAGE_LOAD = 'PageLoadTime',
  ERROR_RATE = 'ErrorRate',
}

// Send custom metric
export async function sendMetric(
  metricName: MetricType,
  value: number,
  unit: 'Count' | 'Seconds' | 'Milliseconds' | 'Bytes' | 'Percent' = 'Count',
  dimensions?: Dimension[]
): Promise<boolean> {
  try {
    const metricData: MetricDatum = {
      MetricName: metricName,
      Value: value,
      Unit: unit,
      Timestamp: new Date(),
      Dimensions: dimensions,
    };

    const command = new PutMetricDataCommand({
      Namespace: NAMESPACE,
      MetricData: [metricData],
    });

    await cloudWatchClient.send(command);
    return true;
  } catch (error) {
    logger.error('Error sending metric to CloudWatch:', error);
    return false;
  }
}

// Send batch metrics
export async function sendBatchMetrics(
  metrics: Array<{
    name: MetricType;
    value: number;
    unit?: 'Count' | 'Seconds' | 'Milliseconds' | 'Bytes' | 'Percent';
    dimensions?: Dimension[];
  }>
): Promise<boolean> {
  try {
    const metricData: MetricDatum[] = metrics.map(metric => ({
      MetricName: metric.name,
      Value: metric.value,
      Unit: metric.unit || 'Count',
      Timestamp: new Date(),
      Dimensions: metric.dimensions,
    }));

    const command = new PutMetricDataCommand({
      Namespace: NAMESPACE,
      MetricData: metricData,
    });

    await cloudWatchClient.send(command);
    return true;
  } catch (error) {
    logger.error('Error sending batch metrics to CloudWatch:', error);
    return false;
  }
}

// Track user activity
export async function trackUserActivity(
  userId: string,
  activity: 'login' | 'logout' | 'course_view' | 'library_view' | 'file_upload'
): Promise<void> {
  const metricMap = {
    login: MetricType.USER_LOGIN,
    logout: MetricType.USER_LOGOUT,
    course_view: MetricType.COURSE_VIEW,
    library_view: MetricType.LIBRARY_VIEW,
    file_upload: MetricType.FILE_UPLOAD,
  };

  await sendMetric(
    metricMap[activity],
    1,
    'Count',
    [{ Name: 'UserId', Value: userId }]
  );
}

// Track API performance
export async function trackAPIPerformance(
  endpoint: string,
  latency: number,
  statusCode: number
): Promise<void> {
  await sendBatchMetrics([
    {
      name: MetricType.API_LATENCY,
      value: latency,
      unit: 'Milliseconds',
      dimensions: [
        { Name: 'Endpoint', Value: endpoint },
        { Name: 'StatusCode', Value: statusCode.toString() },
      ],
    },
    {
      name: MetricType.ERROR_RATE,
      value: statusCode >= 400 ? 1 : 0,
      unit: 'Count',
      dimensions: [
        { Name: 'Endpoint', Value: endpoint },
      ],
    },
  ]);
}

// Get metric statistics
export async function getMetricStatistics(
  metricName: MetricType,
  startTime: Date,
  endTime: Date,
  period: number = 300, // 5 minutes
  statistic: Statistic = Statistic.Sum
): Promise<unknown> {
  try {
    const command = new GetMetricStatisticsCommand({
      Namespace: NAMESPACE,
      MetricName: metricName,
      StartTime: startTime,
      EndTime: endTime,
      Period: period,
      Statistics: [statistic],
    });

    const response = await cloudWatchClient.send(command);
    return response.Datapoints || [];
  } catch (error) {
    logger.error('Error getting metric statistics:', error);
    return [];
  }
}

// Get dashboard data
export async function getDashboardMetrics(): Promise<{
  userMetrics: unknown;
  courseMetrics: unknown;
  performanceMetrics: unknown;
}> {
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours

  try {
    const [
      userLogins,
      courseViews,
      apiLatency,
      errorRate,
    ] = await Promise.all([
      getMetricStatistics(MetricType.USER_LOGIN, startTime, endTime),
      getMetricStatistics(MetricType.COURSE_VIEW, startTime, endTime),
      getMetricStatistics(MetricType.API_LATENCY, startTime, endTime, 300, Statistic.Average),
      getMetricStatistics(MetricType.ERROR_RATE, startTime, endTime),
    ]);

    return {
      userMetrics: {
        logins: userLogins,
        totalLogins: userLogins.reduce((sum: number, point: unknown) => sum + (point.Sum || 0), 0),
      },
      courseMetrics: {
        views: courseViews,
        totalViews: courseViews.reduce((sum: number, point: unknown) => sum + (point.Sum || 0), 0),
      },
      performanceMetrics: {
        avgLatency: apiLatency.reduce((sum: number, point: unknown) => sum + (point.Average || 0), 0) / (apiLatency.length || 1),
        errorCount: errorRate.reduce((sum: number, point: unknown) => sum + (point.Sum || 0), 0),
      },
    };
  } catch (error) {
    logger.error('Error getting dashboard metrics:', error);
    return {
      userMetrics: {},
      courseMetrics: {},
      performanceMetrics: {},
    };
  }
}

// Create CloudWatch Dashboard
export async function createDashboard(): Promise<boolean> {
  try {
    const dashboardBody = {
      widgets: [
        {
          type: 'metric',
          properties: {
            metrics: [
              [NAMESPACE, MetricType.USER_LOGIN, { stat: 'Sum', label: 'User Logins' }],
              [NAMESPACE, MetricType.USER_SIGNUP, { stat: 'Sum', label: 'User Signups' }],
            ],
            period: 300,
            stat: 'Sum',
            region: process.env.AWS_REGION || 'us-east-1',
            title: 'User Activity',
          },
        },
        {
          type: 'metric',
          properties: {
            metrics: [
              [NAMESPACE, MetricType.COURSE_VIEW, { stat: 'Sum', label: 'Course Views' }],
              [NAMESPACE, MetricType.COURSE_ENROLLMENT, { stat: 'Sum', label: 'Enrollments' }],
            ],
            period: 300,
            stat: 'Sum',
            region: process.env.AWS_REGION || 'us-east-1',
            title: 'Course Metrics',
          },
        },
        {
          type: 'metric',
          properties: {
            metrics: [
              [NAMESPACE, MetricType.API_LATENCY, { stat: 'Average', label: 'API Latency (ms)' }],
              [NAMESPACE, MetricType.ERROR_RATE, { stat: 'Sum', label: 'Errors' }],
            ],
            period: 300,
            stat: 'Average',
            region: process.env.AWS_REGION || 'us-east-1',
            title: 'Performance Metrics',
          },
        },
      ],
    };

    const command = new PutDashboardCommand({
      DashboardName: 'PlataformaMedica-Dashboard',
      DashboardBody: JSON.stringify(dashboardBody),
    });

    await cloudWatchClient.send(command);
    return true;
  } catch (error) {
    logger.error('Error creating dashboard:', error);
    return false;
  }
}

// Check if CloudWatch is configured
export function isCloudWatchConfigured(): boolean {
  return !!(
    process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY
  );
}