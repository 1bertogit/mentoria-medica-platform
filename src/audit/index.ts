import { AuditEngine } from './core/AuditEngine';
import logger from '@/lib/logger';
import { ComponentAuditor } from './auditors/ComponentAuditor';
import { NavigationAuditor } from './auditors/NavigationAuditor';
import { PerformanceAuditor } from './auditors/PerformanceAuditor';
import { AccessibilityAuditor } from './auditors/AccessibilityAuditor';
import { SecurityAuditor } from './auditors/SecurityAuditor';
import { SEOAuditor } from './auditors/SEOAuditor';
import { DashboardAuditor, LibraryAuditor } from './auditors/areas';
import { AuditConfig, AuditReport } from './types';

/**
 * Main audit runner that configures and executes the audit
 */
export class AuditRunner {
  private engine: AuditEngine;
  private config: AuditConfig;

  constructor(config?: Partial<AuditConfig>) {
    // Default configuration
    this.config = {
      baseUrl: config?.baseUrl || process.env.AUDIT_BASE_URL || 'http://localhost:3000',
      areas: config?.areas || [
        {
          name: 'Dashboard',
          path: '/',
          description: 'Main dashboard page'
        },
        {
          name: 'Library',
          path: '/library',
          description: 'Medical library and resources'
        },
        {
          name: 'Academy',
          path: '/academy',
          description: 'Educational courses and materials'
        },
        {
          name: 'Cases',
          path: '/cases',
          description: 'Clinical cases and scenarios'
        },
        {
          name: 'Archive',
          path: '/archive',
          description: 'Historical records and documents'
        }
      ],
      auditors: config?.auditors || {
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
        },
        seo: {
          enabled: true
        }
      },
      reporting: config?.reporting || {
        format: 'all',
        outputDir: 'audit-reports'
      },
      ci: config?.ci || {
        failOnCritical: true,
        failOnHigh: false,
        failThreshold: 70
      },
      ...config
    };

    // Create audit engine
    this.engine = new AuditEngine(this.config);

    // Register all auditors
    this.registerAuditors();
  }

  /**
   * Register all available auditors with the engine
   */
  private registerAuditors(): void {
    // Register core auditors
    this.engine.registerAuditor('component', ComponentAuditor as any);
    this.engine.registerAuditor('navigation', NavigationAuditor as any);
    this.engine.registerAuditor('performance', PerformanceAuditor as any);
    this.engine.registerAuditor('accessibility', AccessibilityAuditor as any);
    this.engine.registerAuditor('security', SecurityAuditor as any);
    this.engine.registerAuditor('seo', SEOAuditor as any);
    
    // Register area-specific auditors
    this.engine.registerAuditor('dashboard', DashboardAuditor as any);
    this.engine.registerAuditor('library', LibraryAuditor as any);
  }

  /**
   * Run the complete audit
   */
  async run(): Promise<AuditReport> {
    try {
      const report = await this.engine.run();
      this.printFinalSummary(report);
      return report;
    } catch (error) {
      logger.error('❌ Audit failed with error:', error);
      throw error;
    }
  }

  /**
   * Run audit for a specific area only
   */
  async runForArea(areaName: string): Promise<AuditReport> {
    // Filter config to only include specified area
    const area = this.config.areas.find(a => 
      a.name.toLowerCase() === areaName.toLowerCase()
    );

    if (!area) {
      throw new Error(`Area "${areaName}" not found. Available areas: ${
        this.config.areas.map(a => a.name).join(', ')
      }`);
    }

    // Create temporary config with single area
    const tempConfig = {
      ...this.config,
      areas: [area]
    };

    const tempEngine = new AuditEngine(tempConfig);
    
    // Register auditors to temp engine
    tempEngine.registerAuditor('component', ComponentAuditor as any);
    tempEngine.registerAuditor('navigation', NavigationAuditor as any);
    tempEngine.registerAuditor('performance', PerformanceAuditor as any);
    tempEngine.registerAuditor('accessibility', AccessibilityAuditor as any);
    tempEngine.registerAuditor('security', SecurityAuditor as any);
    tempEngine.registerAuditor('seo', SEOAuditor as any);
    tempEngine.registerAuditor('dashboard', DashboardAuditor as any);
    tempEngine.registerAuditor('library', LibraryAuditor as any);

    return tempEngine.run();
  }

  /**
   * Run quick audit with only critical checks
   */
  async runQuick(): Promise<AuditReport> {
    // Create config with only critical auditors
    const quickConfig = {
      ...this.config,
      auditors: {
        component: { enabled: true },
        navigation: { enabled: false },
        performance: { enabled: false },
        accessibility: { enabled: true },
        security: { enabled: true }
      }
    };

    const quickEngine = new AuditEngine(quickConfig);
    
    // Register only enabled auditors
    quickEngine.registerAuditor('component', ComponentAuditor as any);
    quickEngine.registerAuditor('accessibility', AccessibilityAuditor as any);
    quickEngine.registerAuditor('security', SecurityAuditor as any);
    quickEngine.registerAuditor('seo', SEOAuditor as any);

    ...\n');
    return quickEngine.run();
  }

  /**
   * Print final summary with recommendations
   */
  private printFinalSummary(report: AuditReport): void {
    );
    );

    // Determine overall health
    const { overallScore, criticalIssues, highIssues } = report.summary;
    
    let healthStatus = '';
    let healthEmoji = '';
    
    if (overallScore !== undefined && overallScore >= 90 && criticalIssues === 0) {
      healthStatus = 'EXCELLENT';
      healthEmoji = '🌟';
    } else if (overallScore !== undefined && overallScore >= 75 && criticalIssues === 0) {
      healthStatus = 'GOOD';
      healthEmoji = '✅';
    } else if ((overallScore !== undefined && overallScore >= 60) || criticalIssues <= 2) {
      healthStatus = 'NEEDS IMPROVEMENT';
      healthEmoji = '⚠️';
    } else {
      healthStatus = 'CRITICAL';
      healthEmoji = '🔴';
    }

    // Priority recommendations
    if (criticalIssues > 0) {
      immediately`);
    }
    
    if (highIssues > 0) {
      within 24-48 hours`);
    }

    // Category-specific recommendations
    const categoryRecommendations: Record<string, string[]> = {
      security: [
        'Implement security headers',
        'Enable HTTPS everywhere',
        'Add CSRF protection'
      ],
      accessibility: [
        'Fix color contrast issues',
        'Add proper ARIA labels',
        'Ensure keyboard navigation'
      ],
      performance: [
        'Optimize images and assets',
        'Reduce JavaScript bundle size',
        'Implement lazy loading'
      ],
      functionality: [
        'Fix broken links',
        'Improve error handling',
        'Add loading states'
      ],
      ui_ux: [
        'Fix layout issues',
        'Improve mobile responsiveness',
        'Add user feedback'
      ]
    };

    // Find top issues by category
    const issuesByCategory: Record<string, number> = {};
    
    for (const result of report.results) {
      for (const issue of result.issues) {
        issuesByCategory[issue.category] = (issuesByCategory[issue.category] || 0) + 1;
      }
    }

    // Show top 3 categories with issues
    const topCategories = Object.entries(issuesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (topCategories.length > 0) {
      for (const [category, count] of topCategories) {
        }: ${count} issues`);
        const recommendations = categoryRecommendations[category] || [];
        if (recommendations.length > 0) {
          recommendations.slice(0, 2).forEach(rec => {
            });
        }
      }
    }

    // Next steps
    );
  }

  /**
   * Get current configuration
   */
  getConfig(): AuditConfig {
    return this.config;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AuditConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
    
    // Recreate engine with new config
    this.engine = new AuditEngine(this.config);
    this.registerAuditors();
  }
}

// Export convenience function for running audit
export async function runAudit(config?: Partial<AuditConfig>): Promise<AuditReport> {
  const runner = new AuditRunner(config);
  return runner.run();
}

// Export types for external use
export * from './types';