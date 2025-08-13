import { DynamoDBClient } from '@aws-sdk/client-dynamodb';


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

// Initialize DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

// Create document client for easier use
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

import { getServerConfig } from './config';

// Get table names from configuration
function getTableNames() {
  try {
    const config = getServerConfig();
    return {
      COURSES: config.dynamodb.coursesTable,
      LIBRARY: config.dynamodb.libraryTable,
      USERS: config.dynamodb.usersTable,
      ENROLLMENTS: config.dynamodb.enrollmentsTable,
      PROGRESS: config.dynamodb.progressTable,
      VIDEO_PROGRESS: config.dynamodb.videoProgressTable,
    };
  } catch (error) {
    // Fallback to default table names if config fails
    return {
      COURSES: 'plataforma-courses',
      LIBRARY: 'plataforma-library',
      USERS: 'plataforma-users',
      ENROLLMENTS: 'plataforma-enrollments',
      PROGRESS: 'plataforma-progress',
      VIDEO_PROGRESS: 'plataforma-video-progress',
    };
  }
}

export const TABLES = getTableNames();

// Course interface
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  duration: string;
  level: 'Básico' | 'Intermediário' | 'Avançado';
  price?: number;
  thumbnail?: string;
  modules?: CourseModule[];
  enrolledCount?: number;
  rating?: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz';
  duration?: string;
  videoUrl?: string;
  content?: string;
  resources?: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link';
  url: string;
}

// Library item interface
export interface LibraryItem {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide' | 'case';
  category: string;
  author?: string;
  fileUrl?: string;
  thumbnail?: string;
  tags?: string[];
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// User progress interface
export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  progress: number;
  lastAccessedAt: string;
  startedAt: string;
  completedAt?: string;
}

// Course operations
export const courseOperations = {
  // Get all courses
  async getAllCourses(): Promise<Course[]> {
    try {
      const command = new ScanCommand({
        TableName: TABLES.COURSES,
      });
      
      const response = await docClient.send(command);
      return response.Items as Course[] || [];
    } catch (error) {
      logger.error('Error fetching courses:', error);
      return [];
    }
  },

  // Get course by ID
  async getCourseById(id: string): Promise<Course | null> {
    try {
      const command = new GetCommand({
        TableName: TABLES.COURSES,
        Key: { id },
      });
      
      const response = await docClient.send(command);
      return response.Item as Course || null;
    } catch (error) {
      logger.error('Error fetching course:', error);
      return null;
    }
  },

  // Get courses by category
  async getCoursesByCategory(category: string): Promise<Course[]> {
    try {
      const command = new QueryCommand({
        TableName: TABLES.COURSES,
        IndexName: 'category-index',
        KeyConditionExpression: 'category = :category',
        ExpressionAttributeValues: {
          ':category': category,
        },
      });
      
      const response = await docClient.send(command);
      return response.Items as Course[] || [];
    } catch (error) {
      logger.error('Error fetching courses by category:', error);
      // Fallback to scan with filter
      const scanCommand = new ScanCommand({
        TableName: TABLES.COURSES,
        FilterExpression: 'category = :category',
        ExpressionAttributeValues: {
          ':category': category,
        },
      });
      
      const response = await docClient.send(scanCommand);
      return response.Items as Course[] || [];
    }
  },

  // Create or update course
  async saveCourse(course: Course): Promise<boolean> {
    try {
      const command = new PutCommand({
        TableName: TABLES.COURSES,
        Item: {
          ...course,
          updatedAt: new Date().toISOString(),
        },
      });
      
      await docClient.send(command);
      return true;
    } catch (error) {
      logger.error('Error saving course:', error);
      return false;
    }
  },
};

// Library operations
export const libraryOperations = {
  // Get all library items
  async getAllItems(): Promise<LibraryItem[]> {
    try {
      const command = new ScanCommand({
        TableName: TABLES.LIBRARY,
      });
      
      const response = await docClient.send(command);
      return response.Items as LibraryItem[] || [];
    } catch (error) {
      logger.error('Error fetching library items:', error);
      return [];
    }
  },

  // Get library item by ID
  async getItemById(id: string): Promise<LibraryItem | null> {
    try {
      const command = new GetCommand({
        TableName: TABLES.LIBRARY,
        Key: { id },
      });
      
      const response = await docClient.send(command);
      return response.Item as LibraryItem || null;
    } catch (error) {
      logger.error('Error fetching library item:', error);
      return null;
    }
  },

  // Get items by category
  async getItemsByCategory(category: string): Promise<LibraryItem[]> {
    try {
      const command = new ScanCommand({
        TableName: TABLES.LIBRARY,
        FilterExpression: 'category = :category',
        ExpressionAttributeValues: {
          ':category': category,
        },
      });
      
      const response = await docClient.send(command);
      return response.Items as LibraryItem[] || [];
    } catch (error) {
      logger.error('Error fetching library items by category:', error);
      return [];
    }
  },

  // Save library item
  async saveItem(item: LibraryItem): Promise<boolean> {
    try {
      const command = new PutCommand({
        TableName: TABLES.LIBRARY,
        Item: {
          ...item,
          updatedAt: new Date().toISOString(),
        },
      });
      
      await docClient.send(command);
      return true;
    } catch (error) {
      logger.error('Error saving library item:', error);
      return false;
    }
  },
};

// User progress operations
export const progressOperations = {
  // Get user progress for a course
  async getUserProgress(userId: string, courseId: string): Promise<UserProgress | null> {
    try {
      const command = new GetCommand({
        TableName: TABLES.PROGRESS,
        Key: { userId, courseId },
      });
      
      const response = await docClient.send(command);
      return response.Item as UserProgress || null;
    } catch (error) {
      logger.error('Error fetching user progress:', error);
      return null;
    }
  },

  // Update user progress
  async updateProgress(progress: UserProgress): Promise<boolean> {
    try {
      const command = new PutCommand({
        TableName: TABLES.PROGRESS,
        Item: {
          ...progress,
          lastAccessedAt: new Date().toISOString(),
        },
      });
      
      await docClient.send(command);
      return true;
    } catch (error) {
      logger.error('Error updating progress:', error);
      return false;
    }
  },

  // Get all user progress
  async getAllUserProgress(userId: string): Promise<UserProgress[]> {
    try {
      const command = new QueryCommand({
        TableName: TABLES.PROGRESS,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      });
      
      const response = await docClient.send(command);
      return response.Items as UserProgress[] || [];
    } catch (error) {
      logger.error('Error fetching all user progress:', error);
      return [];
    }
  },
};

// Check if DynamoDB is configured
export function isDynamoDBConfigured(): boolean {
  return !!(
    process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY
  );
}