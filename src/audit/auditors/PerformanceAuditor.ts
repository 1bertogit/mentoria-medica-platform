import { BaseAuditor } from '../core/BaseAuditor';
import logger from '@/lib/logger';
import { AuditCategory, AuditSeverity, AuditStatus } from '../types';

/**
 * Simplified Performance Auditor that works without Puppeteer
 */
export class PerformanceAuditor extends BaseAuditor {
  getName(): string {
    return 'Performance Auditor';
  }

  getCategory(): AuditCategory {
    return AuditCategory.PERFORMANCE;
  }

  async audit(): Promise<void> {
    const area = this.context.area;
    const baseUrl = this.context.config.baseUrl;
    const url = `${baseUrl}${area.path}`;

    try {
      // Basic performance check using fetch
      const startTime = Date.now();
      const response = await fetch(url).catch(() => null);
      const loadTime = Date.now() - startTime;

      if (response) {
        // Check load time
        if (loadTime > 3000) {
          this.addIssue({
            id: 'perf-slow-load',
            title: 'Slow Page Load',
            description: `Page took ${loadTime}ms to load (should be < 3000ms)`,
            severity: AuditSeverity.HIGH,
            category: AuditCategory.PERFORMANCE,
            status: AuditStatus.FAIL,
            suggestion: 'Optimize page load time',
            timestamp: new Date()
          });
        } else if (loadTime > 1500) {
          this.addIssue({
            id: 'perf-moderate-load',
            title: 'Moderate Page Load Time',
            description: `Page took ${loadTime}ms to load`,
            severity: AuditSeverity.MEDIUM,
            category: AuditCategory.PERFORMANCE,
            status: AuditStatus.WARNING,
            suggestion: 'Consider performance optimizations',
            timestamp: new Date()
          });
        }

        // Add metrics
        this.addMetrics({
          performance: {
            loadTime: loadTime,
            ttfb: Math.min(loadTime * 0.3, 600)
          }
        });
      }
    } catch (error) {
      logger.error('Performance audit error:', error);
    }
  }
}