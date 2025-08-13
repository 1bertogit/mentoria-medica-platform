import { BaseAuditor } from '../core/BaseAuditor';
import logger from '@/lib/logger';
import { AuditCategory, AuditSeverity, AuditStatus } from '../types';

/**
 * Simplified Component Auditor that works without Puppeteer
 */
export class ComponentAuditor extends BaseAuditor {
  getName(): string {
    return 'Component Auditor';
  }

  getCategory(): AuditCategory {
    return AuditCategory.UI_UX;
  }

  async audit(): Promise<void> {
    const area = this.context.area;
    const baseUrl = this.context.config.baseUrl;
    const url = `${baseUrl}${area.path}`;

    try {
      // Basic component check using fetch
      const response = await fetch(url).catch(() => null);

      if (response && response.ok) {
        const html = await response.text();
        
        // Check for basic UI elements
        this.checkBasicComponents(html, area.name);
        
        // Add basic metrics
        this.addMetrics({
          performance: {
            loadTime: 200 // Placeholder
          }
        });
      } else {
        this.addIssue({
          id: 'component-page-error',
          title: 'Page Load Error',
          description: `Failed to load page at ${url}`,
          severity: AuditSeverity.HIGH,
          category: AuditCategory.UI_UX,
          status: AuditStatus.FAIL,
          suggestion: 'Check if page is accessible',
          timestamp: new Date()
        });
      }
    } catch (error) {
      logger.error('Component audit error:', error);
    }
  }

  private checkBasicComponents(html: string, pageName: string): void {
    // Check for navigation
    if (!html.includes('<nav') && !html.includes('role="navigation"')) {
      this.addIssue({
        id: 'component-no-navigation',
        title: 'Missing Navigation',
        description: `No navigation element found on ${pageName}`,
        severity: AuditSeverity.MEDIUM,
        category: AuditCategory.UI_UX,
        status: AuditStatus.WARNING,
        suggestion: 'Add navigation element to page',
        timestamp: new Date()
      });
    }

    // Check for main content
    if (!html.includes('<main') && !html.includes('role="main"')) {
      this.addIssue({
        id: 'component-no-main',
        title: 'Missing Main Content Area',
        description: `No main content area found on ${pageName}`,
        severity: AuditSeverity.LOW,
        category: AuditCategory.UI_UX,
        status: AuditStatus.WARNING,
        suggestion: 'Add main element for better structure',
        timestamp: new Date()
      });
    }

    // Check for headings
    if (!html.includes('<h1')) {
      this.addIssue({
        id: 'component-no-h1',
        title: 'Missing H1 Heading',
        description: `No H1 heading found on ${pageName}`,
        severity: AuditSeverity.MEDIUM,
        category: AuditCategory.ACCESSIBILITY,
        status: AuditStatus.WARNING,
        suggestion: 'Add H1 heading for better SEO and accessibility',
        timestamp: new Date()
      });
    }
  }
}