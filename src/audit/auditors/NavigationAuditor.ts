import { BaseAuditor } from '../core/BaseAuditor';
import logger from '@/lib/logger';
import { AuditCategory, AuditSeverity, AuditStatus } from '../types';

/**
 * Navigation Auditor that validates links and navigation structure
 * Works without Puppeteer using fetch API
 */
export class NavigationAuditor extends BaseAuditor {
  getName(): string {
    return 'Navigation Auditor';
  }

  getCategory(): AuditCategory {
    return AuditCategory.FUNCTIONALITY;
  }

  async audit(): Promise<void> {
    const area = this.context.area;
    const baseUrl = this.context.config.baseUrl;
    const url = `${baseUrl}${area.path}`;

    try {
      // Check main page accessibility
      const mainResponse = await this.checkUrl(url);
      
      if (!mainResponse.ok) {
        this.addIssue({
          id: 'nav-main-page-error',
          title: `Main page returns error: ${mainResponse.status}`,
          description: `The main page ${url} returned status ${mainResponse.status}`,
          severity: mainResponse.status === 404 ? AuditSeverity.CRITICAL : AuditSeverity.HIGH,
          category: AuditCategory.FUNCTIONALITY,
          status: AuditStatus.FAIL,
          suggestion: 'Ensure the page is accessible and returns a 200 status',
          timestamp: new Date()
        });
      }

      // Check common navigation paths
      const navigationPaths = this.getNavigationPaths(area.name);
      const brokenLinks: string[] = [];
      const redirects: string[] = [];
      const slowLinks: string[] = [];

      for (const navPath of navigationPaths) {
        const navUrl = `${baseUrl}${navPath}`;
        const startTime = Date.now();
        const response = await this.checkUrl(navUrl);
        const responseTime = Date.now() - startTime;

        if (!response.ok && response.status !== 0) {
          if (response.status === 404) {
            brokenLinks.push(navPath);
          } else if (response.status >= 300 && response.status < 400) {
            redirects.push(navPath);
          }
        }

        if (responseTime > 3000) {
          slowLinks.push(navPath);
        }
      }

      // Report broken links
      if (brokenLinks.length > 0) {
        this.addIssue({
          id: 'nav-broken-links',
          title: 'Broken navigation links found',
          description: `Found ${brokenLinks.length} broken links: ${brokenLinks.join(', ')}`,
          severity: AuditSeverity.HIGH,
          category: AuditCategory.FUNCTIONALITY,
          status: AuditStatus.FAIL,
          suggestion: 'Fix or remove broken links',
          evidence: { brokenLinks },
          timestamp: new Date()
        });
      }

      // Report redirects
      if (redirects.length > 0) {
        this.addIssue({
          id: 'nav-redirects',
          title: 'Navigation links with redirects',
          description: `Found ${redirects.length} links with redirects: ${redirects.join(', ')}`,
          severity: AuditSeverity.MEDIUM,
          category: AuditCategory.FUNCTIONALITY,
          status: AuditStatus.WARNING,
          suggestion: 'Update links to point directly to final destination',
          evidence: { redirects },
          timestamp: new Date()
        });
      }

      // Report slow links
      if (slowLinks.length > 0) {
        this.addIssue({
          id: 'nav-slow-links',
          title: 'Slow navigation response times',
          description: `Found ${slowLinks.length} links with response time > 3s: ${slowLinks.join(', ')}`,
          severity: AuditSeverity.MEDIUM,
          category: AuditCategory.PERFORMANCE,
          status: AuditStatus.WARNING,
          suggestion: 'Optimize server response times for these pages',
          evidence: { slowLinks },
          timestamp: new Date()
        });
      }

      // Check for navigation consistency
      this.checkNavigationConsistency(area.name);

      // Check for breadcrumbs
      this.checkBreadcrumbs(area.name);

      // Add navigation metrics
      this.addMetrics({
        navigation: {
          totalLinks: navigationPaths.length,
          brokenLinks: brokenLinks.length,
          redirects: redirects.length,
          slowLinks: slowLinks.length
        }
      });

    } catch (error) {
      logger.error('Navigation audit error:', error);
      this.addIssue({
        id: 'nav-audit-error',
        title: 'Navigation audit failed',
        description: `Unable to complete navigation audit: ${error}`,
        severity: AuditSeverity.HIGH,
        category: AuditCategory.FUNCTIONALITY,
        status: AuditStatus.ERROR,
        suggestion: 'Check network connectivity and server availability',
        timestamp: new Date()
      });
    }
  }

  /**
   * Check if a URL is accessible
   */
  private async checkUrl(url: string): Promise<{ ok: boolean; status: number }> {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'manual',
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      return { ok: response.ok, status: response.status };
    } catch (error) {
      // Network error or timeout
      return { ok: false, status: 0 };
    }
  }

  /**
   * Get navigation paths to check based on area
   */
  private getNavigationPaths(areaName: string): string[] {
    const commonPaths = [
      '/',
      '/dashboard',
      '/library',
      '/academy', 
      '/cases',
      '/archive'
    ];

    const areaPaths: Record<string, string[]> = {
      Dashboard: [
        ...commonPaths,
        '/notifications',
        '/settings'
      ],
      Library: [
        ...commonPaths,
        '/library/search',
        '/library/categories',
        '/library/recent'
      ],
      Academy: [
        ...commonPaths,
        '/academy/courses',
        '/academy/certificates',
        '/academy/progress'
      ],
      Cases: [
        ...commonPaths,
        '/cases/new',
        '/cases/categories',
        '/cases/archive'
      ],
      Archive: [
        ...commonPaths,
        '/archive/search',
        '/archive/categories',
        '/archive/recent'
      ]
    };

    return areaPaths[areaName] || commonPaths;
  }

  /**
   * Check navigation consistency
   */
  private checkNavigationConsistency(areaName: string): void {
    // Check if main navigation items are consistent
    const expectedNavItems = ['Dashboard', 'Library', 'Academy', 'Cases', 'Archive'];
    
    // This is a simplified check - in a real implementation, 
    // we would parse HTML and check actual navigation elements
    this.addIssue({
      id: 'nav-consistency-check',
      title: 'Navigation consistency check',
      description: 'Verify that all pages have consistent navigation menu',
      severity: AuditSeverity.INFO,
      category: AuditCategory.UI_UX,
      status: AuditStatus.INFO,
      suggestion: 'Ensure navigation menu is consistent across all pages',
      evidence: { expectedItems: expectedNavItems },
      timestamp: new Date()
    });
  }

  /**
   * Check for breadcrumb navigation
   */
  private checkBreadcrumbs(areaName: string): void {
    // Areas that should have breadcrumbs
    const breadcrumbAreas = ['Library', 'Academy', 'Cases', 'Archive'];
    
    if (breadcrumbAreas.includes(areaName)) {
      this.addIssue({
        id: 'nav-breadcrumbs-check',
        title: 'Breadcrumb navigation check',
        description: `Verify that ${areaName} pages have breadcrumb navigation`,
        severity: AuditSeverity.LOW,
        category: AuditCategory.UI_UX,
        status: AuditStatus.INFO,
        suggestion: 'Add breadcrumb navigation for better user orientation',
        timestamp: new Date()
      });
    }
  }
}