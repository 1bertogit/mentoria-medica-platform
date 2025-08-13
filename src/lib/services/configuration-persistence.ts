import type { Course } from '@/types';
/**
 * Configuration Persistence Layer
 * Handles saving, loading, and managing course admin configurations
 */

import {
  CourseAdminConfiguration,
  ConfigurationHistory,
  ConfigurationChange,
} from '@/types/course-admin';
import {
  getCourseAdminConfiguration,
  getConfigurationHistory as getMockHistory,
  updateConfigurationSection,
  createDefaultConfiguration,
} from '@/lib/mock-data/course-admin';

export interface ConfigurationPersistenceOptions {
  autoSave?: boolean;
  autoSaveInterval?: number;
  enableHistory?: boolean;
  maxHistoryEntries?: number;
}

export class ConfigurationPersistenceService {
  private options: Required<ConfigurationPersistenceOptions>;
  private autoSaveTimer?: NodeJS.Timeout;
  private pendingChanges: Map<string, any> = new Map();

  constructor(options: ConfigurationPersistenceOptions = {}) {
    this.options = {
      autoSave: options.autoSave ?? true,
      autoSaveInterval: options.autoSaveInterval ?? 30000, // 30 seconds
      enableHistory: options.enableHistory ?? true,
      maxHistoryEntries: options.maxHistoryEntries ?? 100,
    };
  }

  /**
   * Load configuration for an organization
   */
  async loadConfiguration(
    organizationId: string
  ): Promise<CourseAdminConfiguration> {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use the mock data
      const config = getCourseAdminConfiguration(organizationId);

      if (!config) {
        // Create default configuration if none exists
        return createDefaultConfiguration(organizationId);
      }

      return config;
    } catch (error) {
      throw new Error(
        `Failed to load configuration: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Save configuration changes
   */
  async saveConfiguration(
    configuration: CourseAdminConfiguration,
    changes?: ConfigurationChange[],
    reason?: string
  ): Promise<CourseAdminConfiguration> {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate the save operation
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedConfig: CourseAdminConfiguration = {
        ...configuration,
        version: configuration.version + 1,
        lastModified: new Date().toISOString(),
      };

      // Save history if enabled and changes are provided
      if (this.options.enableHistory && changes && changes.length > 0) {
        await this.saveConfigurationHistory(configuration.id, changes, reason);
      }

      // Clear pending changes for this configuration
      this.pendingChanges.delete(configuration.id);

      return updatedConfig;
    } catch (error) {
      throw new Error(
        `Failed to save configuration: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Save configuration section with automatic change tracking
   */
  async saveConfigurationSection<T extends keyof CourseAdminConfiguration>(
    configurationId: string,
    section: T,
    oldData: CourseAdminConfiguration[T],
    newData: CourseAdminConfiguration[T],
    reason?: string
  ): Promise<void> {
    try {
      // Track changes
      const changes = this.detectChanges(section, oldData, newData);

      if (changes.length === 0) {
        return; // No changes to save
      }

      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 200));

      // Save history
      if (this.options.enableHistory) {
        await this.saveConfigurationHistory(configurationId, changes, reason);
      }
    } catch (error) {
      throw new Error(
        `Failed to save configuration section: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Load configuration history
   */
  async loadConfigurationHistory(
    configurationId: string
  ): Promise<ConfigurationHistory[]> {
    try {
      // In a real implementation, this would be an API call
      const history = getMockHistory(configurationId);

      // Limit history entries based on options
      return history.slice(0, this.options.maxHistoryEntries);
    } catch (error) {
      throw new Error(
        `Failed to load configuration history: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Save configuration history entry
   */
  private async saveConfigurationHistory(
    configurationId: string,
    changes: ConfigurationChange[],
    reason?: string
  ): Promise<void> {
    try {
      const historyEntry: ConfigurationHistory = {
        id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        configurationId,
        changes,
        timestamp: new Date().toISOString(),
        userId: 'current-user-id', // In real implementation, get from auth context
        userName: 'Current User', // In real implementation, get from auth context
        reason,
      };

      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 100));

      // For mock implementation, we would add to the mock history array
      } catch (error) {
      throw new Error(
        `Failed to save configuration history: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Rollback configuration to a previous version
   */
  async rollbackConfiguration(
    configurationId: string,
    historyId: string
  ): Promise<CourseAdminConfiguration> {
    try {
      // Load the history entry
      const history = await this.loadConfigurationHistory(configurationId);
      const historyEntry = history.find(h => h.id === historyId);

      if (!historyEntry) {
        throw new Error('History entry not found');
      }

      // Load current configuration
      const currentConfig = await this.loadConfiguration(configurationId);

      // Apply rollback changes (reverse the changes)
      const rollbackChanges: ConfigurationChange[] = historyEntry.changes.map(
        change => ({
          ...change,
          oldValue: change.newValue,
          newValue: change.oldValue,
        })
      );

      // Create rolled back configuration
      const rolledBackConfig = this.applyChangesToConfiguration(
        currentConfig,
        rollbackChanges
      );

      // Save the rolled back configuration
      return await this.saveConfiguration(
        rolledBackConfig,
        rollbackChanges,
        `Rollback to version ${historyEntry.timestamp}`
      );
    } catch (error) {
      throw new Error(
        `Failed to rollback configuration: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Enable auto-save for a configuration
   */
  enableAutoSave(
    configurationId: string,
    getCurrentConfig: () => CourseAdminConfiguration,
    onSave: (config: CourseAdminConfiguration) => void
  ): void {
    if (!this.options.autoSave) return;

    // Clear existing timer
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    this.autoSaveTimer = setInterval(async () => {
      try {
        const currentConfig = getCurrentConfig();
        if (this.pendingChanges.has(configurationId)) {
          const savedConfig = await this.saveConfiguration(currentConfig);
          onSave(savedConfig);
        }
      } catch (error) {
        logger.error('Auto-save failed:', error);
      }
    }, this.options.autoSaveInterval);
  }

  /**
   * Disable auto-save
   */
  disableAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = undefined;
    }
  }

  /**
   * Mark configuration as having pending changes
   */
  markPendingChanges(configurationId: string, changes: unknown): void {
    this.pendingChanges.set(configurationId, changes);
  }

  /**
   * Check if configuration has pending changes
   */
  hasPendingChanges(configurationId: string): boolean {
    return this.pendingChanges.has(configurationId);
  }

  /**
   * Detect changes between old and new data
   */
  private detectChanges<T extends keyof CourseAdminConfiguration>(
    section: T,
    oldData: CourseAdminConfiguration[T],
    newData: CourseAdminConfiguration[T]
  ): ConfigurationChange[] {
    const changes: ConfigurationChange[] = [];

    if (
      typeof oldData === 'object' &&
      typeof newData === 'object' &&
      oldData !== null &&
      newData !== null
    ) {
      const oldObj = oldData as Record<string, any>;
      const newObj = newData as Record<string, any>;

      // Deep comparison for nested objects
      this.compareObjects(oldObj, newObj, section, '', changes);
    } else if (oldData !== newData) {
      changes.push({
        field: section,
        oldValue: oldData,
        newValue: newData,
        section: section as string,
      });
    }

    return changes;
  }

  /**
   * Recursively compare objects to detect changes
   */
  private compareObjects(
    oldObj: Record<string, any>,
    newObj: Record<string, any>,
    section: string,
    path: string,
    changes: ConfigurationChange[]
  ): void {
    const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

    for (const key of allKeys) {
      const fullPath = path ? `${path}.${key}` : key;
      const oldValue = oldObj[key];
      const newValue = newObj[key];

      if (
        typeof oldValue === 'object' &&
        typeof newValue === 'object' &&
        oldValue !== null &&
        newValue !== null &&
        !Array.isArray(oldValue) &&
        !Array.isArray(newValue)
      ) {
        // Recursively compare nested objects
        this.compareObjects(oldValue, newValue, section, fullPath, changes);
      } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          field: fullPath,
          oldValue,
          newValue,
          section,
        });
      }
    }
  }

  /**
   * Apply changes to a configuration object
   */
  private applyChangesToConfiguration(
    config: CourseAdminConfiguration,
    changes: ConfigurationChange[]
  ): CourseAdminConfiguration {
    const updatedConfig = JSON.parse(JSON.stringify(config)); // Deep clone

    for (const change of changes) {
      const pathParts = change.field.split('.');
      let current = updatedConfig;

      // Navigate to the parent object
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (current[pathParts[i]] === undefined) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }

      // Set the new value
      const lastKey = pathParts[pathParts.length - 1];
      current[lastKey] = change.newValue;
    }

    return updatedConfig;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.disableAutoSave();
    this.pendingChanges.clear();
  }
}

// Export singleton instance
export const configurationPersistence = new ConfigurationPersistenceService();
