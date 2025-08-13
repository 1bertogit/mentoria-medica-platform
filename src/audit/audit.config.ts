import { AuditConfig } from './types';

/**
 * Default audit configuration
 * Can be customized per environment or project needs
 */
export const defaultAuditConfig: AuditConfig = {
  // Base URL to audit (can be overridden by environment variable)
  baseUrl: process.env.AUDIT_BASE_URL || 'http://localhost:3000',
  
  // Areas to audit in the medical education platform
  areas: [
    {
      name: 'Dashboard',
      path: '/',
      description: 'Main dashboard and overview page'
    },
    {
      name: 'Library',
      path: '/library',
      description: 'Medical library and educational resources'
    },
    {
      name: 'Academy',
      path: '/academy',
      description: 'Educational courses and learning materials'
    },
    {
      name: 'Cases',
      path: '/cases',
      description: 'Clinical cases and patient scenarios'
    },
    {
      name: 'Archive',
      path: '/archive',
      description: 'Historical records and past materials'
    },
    {
      name: 'Profile',
      path: '/profile',
      description: 'User profile and settings'
    }
  ],
  
  // Auditor configuration
  auditors: {
    component: {
      enabled: true
    },
    navigation: {
      enabled: true
    },
    performance: {
      enabled: true
    },
    accessibility: {
      enabled: true
    },
    security: {
      enabled: true
    }
  },
  
  // Reporting configuration
  reporting: {
    format: 'all', // 'json' | 'html' | 'markdown' | 'all'
    outputDir: 'audit-reports'
  },
  
  // CI/CD integration settings
  ci: {
    failOnCritical: true,
    failOnHigh: false,
    failThreshold: 70 // Fail if overall score is below this percentage
  }
};

/**
 * Development configuration (extends default)
 */
export const developmentConfig: Partial<AuditConfig> = {
  baseUrl: 'http://localhost:3000',
  ci: {
    failOnCritical: false,
    failOnHigh: false,
    failThreshold: 0
  }
};

/**
 * Production configuration (extends default)
 */
export const productionConfig: Partial<AuditConfig> = {
  baseUrl: 'https://plataforma-medica.vercel.app',
  ci: {
    failOnCritical: true,
    failOnHigh: true,
    failThreshold: 80
  }
};

/**
 * CI configuration (extends default)
 */
export const ciConfig: Partial<AuditConfig> = {
  ci: {
    failOnCritical: true,
    failOnHigh: true,
    failThreshold: 75
  },
  reporting: {
    format: 'json',
    outputDir: 'ci-reports'
  }
};

/**
 * Get configuration based on environment
 */
export function getAuditConfig(environment?: string): AuditConfig {
  const env = environment || process.env.NODE_ENV || 'development';
  
  let envConfig: Partial<AuditConfig> = {};
  
  switch (env) {
    case 'development':
      envConfig = developmentConfig;
      break;
    case 'production':
      envConfig = productionConfig;
      break;
    case 'ci':
      envConfig = ciConfig;
      break;
  }
  
  // Merge configurations
  return {
    ...defaultAuditConfig,
    ...envConfig
  };
}

/**
 * Validate configuration
 */
export function validateConfig(config: AuditConfig): boolean {
  // Check required fields
  if (!config.baseUrl) {
    throw new Error('baseUrl is required in audit configuration');
  }
  
  if (!config.areas || config.areas.length === 0) {
    throw new Error('At least one area must be defined for audit');
  }
  
  // Check if at least one auditor is enabled
  const enabledAuditors = Object.values(config.auditors).filter(a => a?.enabled);
  if (enabledAuditors.length === 0) {
    throw new Error('At least one auditor must be enabled');
  }
  
  // Validate CI thresholds
  if (config.ci?.failThreshold && (config.ci.failThreshold < 0 || config.ci.failThreshold > 100)) {
    throw new Error('CI failThreshold must be between 0 and 100');
  }
  
  return true;
}

// Export default configuration
export default defaultAuditConfig;