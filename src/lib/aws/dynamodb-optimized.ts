import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { getPublicConfig } from '@/lib/aws/config';

import logger from '@/lib/logger';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

// Initialize optimized DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: getPublicConfig().region || 'us-east-1',
  credentials: /* Use getServerConfig() for server-side only */ && /* Use getServerConfig() for server-side only */ ? {
    accessKeyId: /* Use getServerConfig() for server-side only */,
    secretAccessKey: /* Use getServerConfig() for server-side only */,
  } : undefined,
});

export const docClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: {
    convertEmptyValues: false,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

// Table names with GSI
export const TABLES = {
  COURSES: 'plataforma-courses',
  LIBRARY: 'plataforma-library', 
  USERS: 'plataforma-users',
  ENROLLMENTS: 'plataforma-enrollments',
  PROGRESS: 'plataforma-progress',
} as const;

// GSI names
export const GSI = {
  CATEGORY_CREATED_AT: 'category-createdAt-index',
  EMAIL_INDEX: 'email-index',
  COURSE_ID_INDEX: 'courseId-index',
  COURSE_ID_COMPLETED_AT: 'courseId-completedAt-index',
} as const;

// Interfaces
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  duration: string;
  level: 'Básico' | 'Intermediário' | 'Avançado';
  thumbnail?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  createdAt: string;
  lastLoginAt?: string;
}

export interface Enrollment {
  userId: string;
  courseId: string;
  enrolledAt: string;
  status: 'active' | 'completed' | 'cancelled';
  progress?: number;
}

export interface Progress {
  userId: string;
  itemId: string; // courseId + moduleId
  courseId: string;
  moduleId?: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
  timeSpent?: number;
  score?: number;
}

export interface LibraryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'article' | 'video' | 'guide' | 'case';
  author?: string;
  fileUrl?: string;
  thumbnail?: string;
  tags?: string[];
  viewCount?: number;
  createdAt: string;
  updatedAt?: string;
}

// 🚀 OPTIMIZED DYNAMODB SERVICE CLASS
export class OptimizedDynamoDBService {
  private static instance: OptimizedDynamoDBService;

  public static getInstance(): OptimizedDynamoDBService {
    if (!OptimizedDynamoDBService.instance) {
      OptimizedDynamoDBService.instance = new OptimizedDynamoDBService();
    }
    return OptimizedDynamoDBService.instance;
  }

  // ✅ COURSES - Optimized queries
  async getCoursesByCategory(category: string): Promise<Course[]> {
    try {
      const command = new QueryCommand({
        TableName: TABLES.COURSES,
        IndexName: GSI.CATEGORY_CREATED_AT,
        KeyConditionExpression: 'category = :category',
        ExpressionAttributeValues: {
          ':category': category,
        },
        ScanIndexForward: false, // Most recent first
      });

      const result = await docClient.send(command);
      return result.Items as Course[];
    } catch (error) {
      logger.error('Error getting courses by category:', error);
      throw error;
    }
  }

  async getAllCoursesSorted(): Promise<Course[]> {
    try {
      // Use scan but with projection to minimize data transfer
      const command = new ScanCommand({
        TableName: TABLES.COURSES,
        ProjectionExpression: 'id, title, description, category, instructor, #level, thumbnail, createdAt',
        ExpressionAttributeNames: {
          '#level': 'level', // level is a reserved word
        },
      });

      const result = await docClient.send(command);
      const courses = result.Items as Course[];
      
      // Sort by createdAt descending
      return courses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      logger.error('Error getting all courses:', error);
      throw error;
    }
  }

  // ✅ USERS - Optimized queries
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const command = new QueryCommand({
        TableName: TABLES.USERS,
        IndexName: GSI.EMAIL_INDEX,
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
      });

      const result = await docClient.send(command);
      return result.Items?.[0] as User || null;
    } catch (error) {
      logger.error('Error getting user by email:', error);
      throw error;
    }
  }

  // ✅ ENROLLMENTS - Optimized queries (requires new GSI)
  async getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]> {
    try {
      const command = new QueryCommand({
        TableName: TABLES.ENROLLMENTS,
        IndexName: GSI.COURSE_ID_INDEX, // New GSI needed
        KeyConditionExpression: 'courseId = :courseId',
        ExpressionAttributeValues: {
          ':courseId': courseId,
        },
      });

      const result = await docClient.send(command);
      return result.Items as Enrollment[];
    } catch (error) {
      logger.error('Error getting enrollments by course:', error);
      // Fallback to scan if GSI doesn't exist yet
      return this.getEnrollmentsByCourseFallback(courseId);
    }
  }

  async getEnrollmentsByUser(userId: string): Promise<Enrollment[]> {
    try {
      const command = new QueryCommand({
        TableName: TABLES.ENROLLMENTS,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      });

      const result = await docClient.send(command);
      return result.Items as Enrollment[];
    } catch (error) {
      logger.error('Error getting enrollments by user:', error);
      throw error;
    }
  }

  // Fallback method for enrollments (until GSI is created)
  private async getEnrollmentsByCourseFallback(courseId: string): Promise<Enrollment[]> {
    try {
      const command = new ScanCommand({
        TableName: TABLES.ENROLLMENTS,
        FilterExpression: 'courseId = :courseId',
        ExpressionAttributeValues: {
          ':courseId': courseId,
        },
      });

      const result = await docClient.send(command);
      return result.Items as Enrollment[];
    } catch (error) {
      logger.error('Error in enrollments fallback:', error);
      return [];
    }
  }

  // ✅ PROGRESS - Optimized queries (requires new GSI)
  async getCourseProgress(courseId: string): Promise<Progress[]> {
    try {
      const command = new QueryCommand({
        TableName: TABLES.PROGRESS,
        IndexName: GSI.COURSE_ID_COMPLETED_AT, // New GSI needed
        KeyConditionExpression: 'courseId = :courseId',
        ExpressionAttributeValues: {
          ':courseId': courseId,
        },
        ScanIndexForward: false, // Most recent first
      });

      const result = await docClient.send(command);
      return result.Items as Progress[];
    } catch (error) {
      logger.error('Error getting course progress:', error);
      // Fallback to scan if GSI doesn't exist yet
      return this.getCourseProgressFallback(courseId);
    }
  }

  async getUserProgress(userId: string): Promise<Progress[]> {
    try {
      const command = new QueryCommand({
        TableName: TABLES.PROGRESS,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      });

      const result = await docClient.send(command);
      return result.Items as Progress[];
    } catch (error) {
      logger.error('Error getting user progress:', error);
      throw error;
    }
  }

  // Fallback method for progress (until GSI is created)
  private async getCourseProgressFallback(courseId: string): Promise<Progress[]> {
    try {
      const command = new ScanCommand({
        TableName: TABLES.PROGRESS,
        FilterExpression: 'courseId = :courseId',
        ExpressionAttributeValues: {
          ':courseId': courseId,
        },
      });

      const result = await docClient.send(command);
      return result.Items as Progress[];
    } catch (error) {
      logger.error('Error in progress fallback:', error);
      return [];
    }
  }

  // ✅ LIBRARY - Optimized queries
  async getLibraryByCategory(category: string): Promise<LibraryItem[]> {
    try {
      const command = new QueryCommand({
        TableName: TABLES.LIBRARY,
        IndexName: GSI.CATEGORY_CREATED_AT,
        KeyConditionExpression: 'category = :category',
        ExpressionAttributeValues: {
          ':category': category,
        },
        ScanIndexForward: false, // Most recent first
      });

      const result = await docClient.send(command);
      return result.Items as LibraryItem[];
    } catch (error) {
      logger.error('Error getting library by category:', error);
      throw error;
    }
  }

  // ✅ ANALYTICS - Optimized combined queries
  async getCourseAnalytics(courseId: string) {
    try {
      const [enrollments, progress] = await Promise.all([
        this.getEnrollmentsByCourse(courseId),
        this.getCourseProgress(courseId),
      ]);

      const analytics = {
        totalStudents: enrollments.length,
        activeStudents: enrollments.filter(e => e.status === 'active').length,
        completedStudents: enrollments.filter(e => e.status === 'completed').length,
        totalProgress: progress.length,
        completedModules: progress.filter(p => p.completed).length,
        averageProgress: progress.length > 0 
          ? progress.reduce((acc, p) => acc + p.progress, 0) / progress.length 
          : 0,
        averageScore: progress.filter(p => p.score).length > 0
          ? progress.filter(p => p.score).reduce((acc, p) => acc + (p.score || 0), 0) / progress.filter(p => p.score).length
          : 0,
      };

      return analytics;
    } catch (error) {
      logger.error('Error getting course analytics:', error);
      throw error;
    }
  }

  async getDashboardData(userId: string) {
    try {
      const [userEnrollments, userProgress] = await Promise.all([
        this.getEnrollmentsByUser(userId),
        this.getUserProgress(userId),
      ]);

      // Get recent courses from all categories
      const recentCourses = await this.getAllCoursesSorted();

      return {
        enrollments: userEnrollments,
        progress: userProgress,
        recentCourses: recentCourses.slice(0, 6), // Latest 6 courses
        stats: {
          totalEnrollments: userEnrollments.length,
          completedCourses: userEnrollments.filter(e => e.status === 'completed').length,
          inProgressCourses: userEnrollments.filter(e => e.status === 'active').length,
          totalProgress: userProgress.length,
          completedModules: userProgress.filter(p => p.completed).length,
        },
      };
    } catch (error) {
      logger.error('Error getting dashboard data:', error);
      throw error;
    }
  }

  // ✅ CRUD Operations (optimized)
  async createItem<T extends Record<string, any>>(tableName: string, item: T): Promise<T> {
    try {
      const command = new PutCommand({
        TableName: tableName,
        Item: item,
      });

      await docClient.send(command);
      return item;
    } catch (error) {
      logger.error(`Error creating item in ${tableName}:`, error);
      throw error;
    }
  }

  async getItem<T>(tableName: string, key: Record<string, any>): Promise<T | null> {
    try {
      const command = new GetCommand({
        TableName: tableName,
        Key: key,
      });

      const result = await docClient.send(command);
      return result.Item as T || null;
    } catch (error) {
      logger.error(`Error getting item from ${tableName}:`, error);
      throw error;
    }
  }

  async updateItem<T>(
    tableName: string, 
    key: Record<string, any>, 
    updates: Record<string, any>
  ): Promise<T> {
    try {
      const updateExpression = Object.keys(updates)
        .map(key => `#${key} = :${key}`)
        .join(', ');

      const expressionAttributeNames = Object.keys(updates)
        .reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {});

      const expressionAttributeValues = Object.keys(updates)
        .reduce((acc, key) => ({ ...acc, [`:${key}`]: updates[key] }), {});

      const command = new UpdateCommand({
        TableName: tableName,
        Key: key,
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      });

      const result = await docClient.send(command);
      return result.Attributes as T;
    } catch (error) {
      logger.error(`Error updating item in ${tableName}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const optimizedDynamoDB = OptimizedDynamoDBService.getInstance();

// Export individual operations for backward compatibility
export const optimizedOperations = {
  courses: {
    getByCategory: (category: string) => optimizedDynamoDB.getCoursesByCategory(category),
    getAll: () => optimizedDynamoDB.getAllCoursesSorted(),
  },
  users: {
    getByEmail: (email: string) => optimizedDynamoDB.getUserByEmail(email),
  },
  enrollments: {
    getByCourse: (courseId: string) => optimizedDynamoDB.getEnrollmentsByCourse(courseId),
    getByUser: (userId: string) => optimizedDynamoDB.getEnrollmentsByUser(userId),
  },
  progress: {
    getByCourse: (courseId: string) => optimizedDynamoDB.getCourseProgress(courseId),
    getByUser: (userId: string) => optimizedDynamoDB.getUserProgress(userId),
  },
  library: {
    getByCategory: (category: string) => optimizedDynamoDB.getLibraryByCategory(category),
  },
  analytics: {
    getCourse: (courseId: string) => optimizedDynamoDB.getCourseAnalytics(courseId),
    getDashboard: (userId: string) => optimizedDynamoDB.getDashboardData(userId),
  },
};
