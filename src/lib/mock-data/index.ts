/**
 * Central export file for all mock data
 */

// Admin data
export * from './admin';

// Academy data
export * from './academy';

// Archive data
export * from './archive';

// Cases data
export * from './cases';

// Course admin data (exported separately to avoid conflicts)
export {
  mockApiKeys,
  mockAssetUploads,
  mockEmailConfiguration,
  mockAppearanceConfiguration,
  mockGeneralConfiguration,
  mockUserConfiguration,
  mockSupportConfiguration,
  mockAdvancedConfiguration,
  mockGamificationConfiguration,
  mockCourseAdminConfiguration,
  mockConfigurationHistory,
  getCourseAdminConfiguration,
  getConfigurationSection,
  updateConfigurationSection,
  getAssetsByCategory,
  getConfigurationHistory,
  getActiveApiKeys,
  createApiKey,
  revokeApiKey,
  uploadAsset,
  createDefaultConfiguration,
} from './course-admin';

// Dashboard data
export * from './dashboard';

// Library data
export * from './library';

// Notifications data
export * from './notifications';

// Products data
export * from './products';
