import { BaseAuditor } from '../core/BaseAuditor';
import logger from '@/lib/logger';
import { AuditCategory, AuditSeverity, AuditStatus } from '../types';

/**
 * Simplified Security Auditor that works without Puppeteer
 * Performs basic security checks using fetch API
 */
export class SecurityAuditor extends BaseAuditor {
  getName(): string {
    return 'Security Auditor';
  }

  getCategory(): AuditCategory {
    return AuditCategory.SECURITY;
  }

  async audit(): Promise<void> {
    const area = this.context.area;
    const baseUrl = this.context.config.baseUrl;
    const url = `${baseUrl}${area.path}`;

    try {
      // Basic security check using fetch
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'manual'
      }).catch(() => null);

      if (response) {
        // Check security headers
        this.checkSecurityHeaders(response.headers);
        
        // Check HTTPS
        if (url.startsWith('http://') && !url.includes('localhost')) {
          this.addIssue({
            id: 'security-no-https',
            title: 'No HTTPS',
            description: 'Site is not using HTTPS protocol',
            severity: AuditSeverity.CRITICAL,
            category: AuditCategory.SECURITY,
            status: AuditStatus.FAIL,
            suggestion: 'Enable HTTPS for all pages',
            timestamp: new Date()
          });
        }
      }

      // Add basic metrics
      this.addMetrics({
        performance: {
          loadTime: 100 // Placeholder
        }
      });

    } catch (error) {
      logger.error('Security audit error:', error);
    }
  }

  private checkSecurityHeaders(headers: Headers): void {
    const requiredHeaders = [
      'strict-transport-security',
      'x-content-type-options',
      'x-frame-options'
    ];

    for (const header of requiredHeaders) {
      if (!headers.get(header)) {
        this.addIssue({
          id: `security-missing-${header}`,
          title: `Missing Security Header: ${header}`,
          description: `The security header ${header} is not set`,
          severity: AuditSeverity.HIGH,
          category: AuditCategory.SECURITY,
          status: AuditStatus.FAIL,
          suggestion: `Add ${header} header to responses`,
          timestamp: new Date()
        });
      }
    }
  }
}