// Data Service Layer - Unified interface for all data operations
// Automatically switches between mock and real AWS services

import type { MedicalCase } from './mock-data/cases';
import type { Article } from './mock-data/library';
import { logger } from './logger';
import { healthChecker } from './aws/health-check';

// Cache do status de saúde para evitar verificações desnecessárias
let healthStatus: unknown = null;
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 30000; // 30 segundos

async function isAWSHealthy(): Promise<boolean> {
  const now = Date.now();

  // Usa cache se ainda válido
  if (healthStatus && now - lastHealthCheck < HEALTH_CHECK_INTERVAL) {
    return healthStatus.dynamodb?.status === 'healthy';
  }

  try {
    const health = await healthChecker.getHealthSummary();
    healthStatus = health.services.reduce((acc, service) => {
      acc[service.service.toLowerCase()] = service;
      return acc;
    }, {} as any);
    lastHealthCheck = now;

    return healthStatus.dynamodb?.status === 'healthy';
  } catch (error) {
    logger.debug('Health check failed, using mock data:', error);
    return false;
  }
}

export const dataService = {
  // Cases operations
  cases: {
    async getAll(): Promise<MedicalCase[]> {
      const isHealthy = await isAWSHealthy();

      if (isHealthy) {
        try {
          // TODO: Implementar busca real no DynamoDB
          logger.info(
            'AWS is healthy, but real implementation not ready yet. Using mock data.'
          );
        } catch (error) {
          logger.error(
            'Failed to fetch from DynamoDB, falling back to mock:',
            error
          );
        }
      }

      // Fallback para dados mock
      const { initialMedicalCases } = await import('./mock-data/cases');
      return initialMedicalCases;
    },

    async getById(id: string): Promise<MedicalCase | null> {
      const cases = await this.getAll();
      return cases.find(c => c.id === id) || null;
    },

    async create(data: Partial<MedicalCase>): Promise<MedicalCase> {
      const newCase: MedicalCase = {
        id: `case-${Date.now()}`,
        title: data.title || '',
        specialty: data.specialty || '',
        submittedBy: data.submittedBy || '',
        status: data.status || 'Em Análise',
        imageUrl: data.imageUrl,
        imageUrls: data.imageUrls || [],
        analysis: data.analysis || null,
        imageCount: data.imageCount || 0,
        videoCount: data.videoCount || 0,
        createdAt: new Date().toISOString(),
      };

      logger.debug('Mock: Would save case to DynamoDB:', newCase);
      return newCase;
    },

    async update(id: string, data: Partial<MedicalCase>): Promise<MedicalCase> {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('Case not found');
      }

      const updated = { ...existing, ...data };
      logger.debug('Mock: Would update case in DynamoDB:', updated);
      return updated;
    },

    async delete(id: string): Promise<void> {
      logger.debug('Mock: Would delete case from DynamoDB:', id);
    },
  },

  // Library operations
  library: {
    async getAll(): Promise<Article[]> {
      const { scientificArticles } = await import('./mock-data/library');
      return scientificArticles;
    },

    async getById(id: string): Promise<Article | null> {
      const articles = await this.getAll();
      return articles.find(a => a.id.toString() === id) || null;
    },

    async incrementViews(id: string): Promise<void> {
      logger.debug('Mock: Would increment views for article:', id);
    },
  },

  // File upload operations
  files: {
    async upload(
      file: File,
      options?: {
        folder?: string;
        onProgress?: (progress: unknown) => void;
        generateThumbnail?: boolean;
      }
    ): Promise<{ url: string; key: string; size: number }> {
      // Mock implementation
      return {
        url: `https://mock-s3-url.com/${file.name}`,
        key: `uploads/${Date.now()}-${file.name}`,
        size: file.size,
      };
    },

    async delete(key: string): Promise<void> {
      logger.debug('Mock: Would delete file from S3:', key);
    },
  },

  // Health check
  async healthCheck() {
    try {
      const health = await healthChecker.getHealthSummary();
      const serviceStatus = health.services.reduce((acc, service) => {
        acc[service.service.toLowerCase()] = service.status === 'healthy';
        return acc;
      }, {} as any);

      return {
        ...serviceStatus,
        redis: false, // Redis não implementado ainda
        cloudwatch: serviceStatus.cloudwatch || false,
        mock: health.healthy === 0, // Se nenhum serviço está saudável, está em modo mock
        overall: health.overall,
      };
    } catch (error) {
      logger.error('Health check failed:', error);
      return {
        dynamodb: false,
        s3: false,
        cognito: false,
        redis: false,
        cloudwatch: false,
        mock: true,
        overall: 'unhealthy',
      };
    }
  },
};
