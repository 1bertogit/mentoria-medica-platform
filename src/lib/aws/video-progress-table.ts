'use client';

import { 
  DynamoDBClient, 
  CreateTableCommand, 
  DescribeTableCommand,
  ResourceNotFoundException 
} from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  BatchGetCommand,
  BatchWriteCommand
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLES } from './dynamodb-client';
import logger from '@/lib/logger';

export interface VideoProgressRecord {
  PK: string; // USER#userId
  SK: string; // COURSE#courseId#LESSON#lessonId
  currentTime: number;
  duration: number;
  completionPercentage: number;
  watchedTime: number;
  lastUpdated: string; // ISO date
  completed: boolean;
  chaptersWatched: string[];
  metadata: {
    playbackSpeed: number;
    sessionId: string;
    deviceType: string;
    userAgent: string;
  };
  TTL?: number; // Optional expiration (1 year from last update)
  GSI1PK?: string; // For secondary index: COURSE#courseId
  GSI1SK?: string; // For secondary index: USER#userId#LESSON#lessonId
}

export interface CourseProgressSummary {
  courseId: string;
  userId: string;
  totalLessons: number;
  completedLessons: number;
  totalWatchTime: number;
  progressPercentage: number;
  lastWatched: string;
  currentLesson?: {
    lessonId: string;
    currentTime: number;
    duration: number;
  };
}

class VideoProgressTable {
  private static instance: VideoProgressTable;
  private tableInitialized = false;

  static getInstance(): VideoProgressTable {
    if (!VideoProgressTable.instance) {
      VideoProgressTable.instance = new VideoProgressTable();
    }
    return VideoProgressTable.instance;
  }

  async ensureTableExists(): Promise<void> {
    if (this.tableInitialized) return;

    try {
      // Check if table exists
      const describeCommand = new DescribeTableCommand({
        TableName: TABLES.VIDEO_PROGRESS
      });
      
      const client = new DynamoDBClient({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        } : undefined,
      });

      await client.send(describeCommand);
      this.tableInitialized = true;
      logger.info('Video progress table exists and is ready');
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        logger.info('Video progress table does not exist, creating...');
        await this.createTable();
      } else {
        logger.error('Error checking video progress table:', error);
        throw error;
      }
    }
  }

  private async createTable(): Promise<void> {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      } : undefined,
    });

    const createCommand = new CreateTableCommand({
      TableName: TABLES.VIDEO_PROGRESS,
      KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' },
        { AttributeName: 'SK', KeyType: 'RANGE' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'PK', AttributeType: 'S' },
        { AttributeName: 'SK', AttributeType: 'S' },
        { AttributeName: 'GSI1PK', AttributeType: 'S' },
        { AttributeName: 'GSI1SK', AttributeType: 'S' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'GSI1',
          KeySchema: [
            { AttributeName: 'GSI1PK', KeyType: 'HASH' },
            { AttributeName: 'GSI1SK', KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
      },
      TimeToLiveSpecification: {
        AttributeName: 'TTL',
        Enabled: true
      }
    });

    try {
      await client.send(createCommand);
      this.tableInitialized = true;
      logger.info('Video progress table created successfully');
    } catch (error) {
      logger.error('Error creating video progress table:', error);
      throw error;
    }
  }

  private generateKeys(userId: string, courseId: string, lessonId: string): {
    PK: string;
    SK: string;
    GSI1PK: string;
    GSI1SK: string;
  } {
    return {
      PK: `USER#${userId}`,
      SK: `COURSE#${courseId}#LESSON#${lessonId}`,
      GSI1PK: `COURSE#${courseId}`,
      GSI1SK: `USER#${userId}#LESSON#${lessonId}`
    };
  }

  async getProgress(userId: string, courseId: string, lessonId: string): Promise<VideoProgressRecord | null> {
    await this.ensureTableExists();

    try {
      const { PK, SK } = this.generateKeys(userId, courseId, lessonId);
      
      const command = new GetCommand({
        TableName: TABLES.VIDEO_PROGRESS,
        Key: { PK, SK }
      });

      const response = await docClient.send(command);
      return response.Item as VideoProgressRecord || null;
    } catch (error) {
      logger.error('Error getting video progress:', error);
      throw error;
    }
  }

  async saveProgress(progress: Omit<VideoProgressRecord, 'PK' | 'SK' | 'GSI1PK' | 'GSI1SK'>): Promise<void> {
    await this.ensureTableExists();

    try {
      // Extract identifiers from the SK pattern
      const skParts = progress.SK?.split('#') || [];
      if (skParts.length < 4) {
        throw new Error('Invalid progress record: missing course or lesson ID');
      }

      const courseId = skParts[1];
      const lessonId = skParts[3];
      const userId = progress.PK?.replace('USER#', '') || '';

      const keys = this.generateKeys(userId, courseId, lessonId);
      
      const record: VideoProgressRecord = {
        ...progress,
        ...keys,
        TTL: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year
        lastUpdated: new Date().toISOString()
      };

      const command = new PutCommand({
        TableName: TABLES.VIDEO_PROGRESS,
        Item: record
      });

      await docClient.send(command);
    } catch (error) {
      logger.error('Error saving video progress:', error);
      throw error;
    }
  }

  async updateProgress(
    userId: string, 
    courseId: string, 
    lessonId: string, 
    updates: Partial<Omit<VideoProgressRecord, 'PK' | 'SK' | 'GSI1PK' | 'GSI1SK'>>
  ): Promise<void> {
    await this.ensureTableExists();

    try {
      const { PK, SK } = this.generateKeys(userId, courseId, lessonId);
      
      // Build update expression dynamically
      const updateExpressions: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          const attrName = `#${key}`;
          const attrValue = `:${key}`;
          
          updateExpressions.push(`${attrName} = ${attrValue}`);
          expressionAttributeNames[attrName] = key;
          expressionAttributeValues[attrValue] = value;
        }
      });

      // Always update lastUpdated
      updateExpressions.push('#lastUpdated = :lastUpdated');
      expressionAttributeNames['#lastUpdated'] = 'lastUpdated';
      expressionAttributeValues[':lastUpdated'] = new Date().toISOString();

      // Always update TTL
      updateExpressions.push('#TTL = :TTL');
      expressionAttributeNames['#TTL'] = 'TTL';
      expressionAttributeValues[':TTL'] = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);

      const command = new UpdateCommand({
        TableName: TABLES.VIDEO_PROGRESS,
        Key: { PK, SK },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
      });

      await docClient.send(command);
    } catch (error) {
      logger.error('Error updating video progress:', error);
      throw error;
    }
  }

  async getUserProgressForCourse(userId: string, courseId: string): Promise<VideoProgressRecord[]> {
    await this.ensureTableExists();

    try {
      const command = new QueryCommand({
        TableName: TABLES.VIDEO_PROGRESS,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk_prefix)',
        ExpressionAttributeValues: {
          ':pk': `USER#${userId}`,
          ':sk_prefix': `COURSE#${courseId}#LESSON#`
        }
      });

      const response = await docClient.send(command);
      return response.Items as VideoProgressRecord[] || [];
    } catch (error) {
      logger.error('Error getting user progress for course:', error);
      throw error;
    }
  }

  async getCourseProgressForAllUsers(courseId: string): Promise<VideoProgressRecord[]> {
    await this.ensureTableExists();

    try {
      const command = new QueryCommand({
        TableName: TABLES.VIDEO_PROGRESS,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :gsi1pk',
        ExpressionAttributeValues: {
          ':gsi1pk': `COURSE#${courseId}`
        }
      });

      const response = await docClient.send(command);
      return response.Items as VideoProgressRecord[] || [];
    } catch (error) {
      logger.error('Error getting course progress for all users:', error);
      throw error;
    }
  }

  async getCourseProgressSummary(userId: string, courseId: string): Promise<CourseProgressSummary | null> {
    try {
      const progressRecords = await this.getUserProgressForCourse(userId, courseId);
      
      if (progressRecords.length === 0) {
        return null;
      }

      const completedLessons = progressRecords.filter(record => record.completed).length;
      const totalWatchTime = progressRecords.reduce((sum, record) => sum + (record.watchedTime || 0), 0);
      const lastWatchedRecord = progressRecords.reduce((latest, current) => 
        new Date(current.lastUpdated) > new Date(latest.lastUpdated) ? current : latest
      );

      // Find current lesson (most recently watched incomplete lesson)
      const incompleteRecords = progressRecords.filter(record => !record.completed);
      const currentLessonRecord = incompleteRecords.reduce((latest, current) => 
        new Date(current.lastUpdated) > new Date(latest?.lastUpdated || '1970-01-01') ? current : latest
      , incompleteRecords[0]);

      return {
        courseId,
        userId,
        totalLessons: progressRecords.length,
        completedLessons,
        totalWatchTime,
        progressPercentage: progressRecords.length > 0 ? (completedLessons / progressRecords.length) * 100 : 0,
        lastWatched: lastWatchedRecord.lastUpdated,
        currentLesson: currentLessonRecord ? {
          lessonId: currentLessonRecord.SK.split('#')[3],
          currentTime: currentLessonRecord.currentTime,
          duration: currentLessonRecord.duration
        } : undefined
      };
    } catch (error) {
      logger.error('Error getting course progress summary:', error);
      return null;
    }
  }

  async batchGetProgress(requests: Array<{userId: string, courseId: string, lessonId: string}>): Promise<VideoProgressRecord[]> {
    await this.ensureTableExists();

    try {
      const keys = requests.map(req => {
        const { PK, SK } = this.generateKeys(req.userId, req.courseId, req.lessonId);
        return { PK, SK };
      });

      const command = new BatchGetCommand({
        RequestItems: {
          [TABLES.VIDEO_PROGRESS]: {
            Keys: keys
          }
        }
      });

      const response = await docClient.send(command);
      return response.Responses?.[TABLES.VIDEO_PROGRESS] as VideoProgressRecord[] || [];
    } catch (error) {
      logger.error('Error batch getting video progress:', error);
      throw error;
    }
  }

  async batchSaveProgress(progressRecords: VideoProgressRecord[]): Promise<void> {
    await this.ensureTableExists();

    try {
      const writeRequests = progressRecords.map(record => ({
        PutRequest: {
          Item: {
            ...record,
            TTL: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60),
            lastUpdated: new Date().toISOString()
          }
        }
      }));

      // DynamoDB batch write limit is 25 items
      const chunks = this.chunkArray(writeRequests, 25);
      
      for (const chunk of chunks) {
        const command = new BatchWriteCommand({
          RequestItems: {
            [TABLES.VIDEO_PROGRESS]: chunk
          }
        });

        await docClient.send(command);
      }
    } catch (error) {
      logger.error('Error batch saving video progress:', error);
      throw error;
    }
  }

  async deleteProgress(userId: string, courseId: string, lessonId: string): Promise<void> {
    await this.ensureTableExists();

    try {
      const { PK, SK } = this.generateKeys(userId, courseId, lessonId);
      
      const command = new DeleteCommand({
        TableName: TABLES.VIDEO_PROGRESS,
        Key: { PK, SK }
      });

      await docClient.send(command);
    } catch (error) {
      logger.error('Error deleting video progress:', error);
      throw error;
    }
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  // Analytics methods
  async getWatchTimeAnalytics(userId: string, startDate?: Date, endDate?: Date): Promise<{
    totalWatchTime: number;
    averageSessionLength: number;
    courseBreakdown: Array<{courseId: string; watchTime: number}>;
  }> {
    // This would require more complex querying in a production system
    // For now, return basic structure
    return {
      totalWatchTime: 0,
      averageSessionLength: 0,
      courseBreakdown: []
    };
  }

  async getCourseAnalytics(courseId: string): Promise<{
    totalUsers: number;
    averageCompletionRate: number;
    averageWatchTime: number;
    lessonDropoffPoints: Array<{lessonId: string; dropoffRate: number}>;
  }> {
    // This would require aggregating data across all users
    // For now, return basic structure
    return {
      totalUsers: 0,
      averageCompletionRate: 0,
      averageWatchTime: 0,
      lessonDropoffPoints: []
    };
  }
}

export default VideoProgressTable;