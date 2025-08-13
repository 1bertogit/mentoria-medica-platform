// AWS Service exports
export * from './config';
export * from './cognito-auth';
export * from './users';

// Mock AWS Service for development
export const awsService = {
  dynamodb: {
    getItem: async (params: unknown) => ({ Item: {} }),
    putItem: async (params: unknown) => ({}),
    query: async (params: unknown) => ({ Items: [] }),
    scan: async (params: unknown) => ({ Items: [] }),
  },
  s3: {
    getObject: async (params: unknown) => ({ Body: '' }),
    putObject: async (params: unknown) => ({}),
  },
  cognito: {
    signIn: async (username: string, password: string) => ({ user: {}, token: '' }),
    signOut: async () => ({}),
  }
};

// Mock Cache Service for development  
export const cacheService = {
  get: (key: string) => null,
  set: (key: string, value: any, ttl?: number) => {},
  clear: () => {},
  has: (key: string) => false,
  delete: (key: string) => {},
};