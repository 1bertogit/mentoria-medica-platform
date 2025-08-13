import { Page, Browser } from '@playwright/test';
import logger from '@/lib/logger';
import {
  AuditIssue,
  AuditMetrics,
  AuditorConfig,
  AuditArea,
  AuditSeverity,
  AuditCategory,
  AuditStatus,
  AuditorContext
} from '../types';

/**
 * Base class for all auditors
 * Provides common functionality and structure for specific auditors
 */
export abstract class BaseAuditor {
  protected context: AuditorContext;
  protected config: AuditorConfig;
  protected issues: AuditIssue[] = [];
  protected metrics: AuditMetrics = {};

  constructor(context: AuditorContext, config?: AuditorConfig) {
    this.context = context;
    this.config = config || { enabled: true };
    this.issues = [];
    this.metrics = {};
  }

  /**
   * Abstract method that must be implemented by each auditor
   */
  abstract audit(): Promise<void>;

  /**
   * Get the name of the auditor
   */
  abstract getName(): string;

  /**
   * Get the category of issues this auditor reports
   */
  abstract getCategory(): AuditCategory;

  /**
   * Initialize the auditor before running audit
   */
  async initialize(): Promise<void> {
    this.issues = [];
    this.metrics = {};
  }

  /**
   * Clean up after audit
   */
  async cleanup(): Promise<void> {
    // Override in subclasses if needed
  }

  /**
   * Add an issue to the results
   */
  protected addIssue(issue: Partial<AuditIssue>): void {
    const fullIssue: AuditIssue = {
      id: this.generateIssueId(),
      title: issue.title || 'Untitled Issue',
      description: issue.description || '',
      severity: issue.severity || AuditSeverity.LOW,
      category: issue.category || this.getCategory(),
      status: issue.status || AuditStatus.FAIL,
      timestamp: new Date(),
      ...issue
    };

    // Check if issue should be filtered based on config
    if (this.shouldReportIssue(fullIssue)) {
      this.issues.push(fullIssue);
    }
  }

  /**
   * Add metrics to the results
   */
  protected addMetrics(metrics: Partial<AuditMetrics>): void {
    this.metrics = {
      ...this.metrics,
      ...metrics
    };
  }

  /**
   * Check if an issue should be reported based on config
   */
  protected shouldReportIssue(issue: AuditIssue): boolean {
    if (!this.config.enabled) {
      return false;
    }

    // Check severity threshold
    if (this.config.severity) {
      const severityOrder = [
        AuditSeverity.INFO,
        AuditSeverity.LOW,
        AuditSeverity.MEDIUM,
        AuditSeverity.HIGH,
        AuditSeverity.CRITICAL
      ];
      const configIndex = severityOrder.indexOf(this.config.severity);
      const issueIndex = severityOrder.indexOf(issue.severity);
      if (issueIndex < configIndex) {
        return false;
      }
    }

    // Check exclude patterns
    if (this.config.exclude && issue.file) {
      for (const pattern of this.config.exclude) {
        if (issue.file.includes(pattern)) {
          return false;
        }
      }
    }

    // Check include patterns
    if (this.config.include && this.config.include.length > 0 && issue.file) {
      let included = false;
      for (const pattern of this.config.include) {
        if (issue.file.includes(pattern)) {
          included = true;
          break;
        }
      }
      if (!included) {
        return false;
      }
    }

    return true;
  }

  /**
   * Generate a unique ID for an issue
   */
  protected generateIssueId(): string {
    return `${this.getName()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get the Playwright page instance
   */
  protected getPage(): Page | undefined {
    return this.context.page;
  }

  /**
   * Get the Playwright browser instance
   */
  protected getBrowser(): Browser | undefined {
    return this.context.browser;
  }

  /**
   * Get the current area being audited
   */
  protected getArea(): AuditArea {
    return this.context.area;
  }

  /**
   * Navigate to a URL and wait for it to load
   */
  protected async navigateTo(url: string): Promise<void> {
    const page = this.getPage();
    if (!page) {
      throw new Error('No page instance available');
    }
    await page.goto(url, { waitUntil: 'networkidle' });
  }

  /**
   * Wait for a selector to be visible
   */
  protected async waitForSelector(selector: string, timeout = 5000): Promise<boolean> {
    const page = this.getPage();
    if (!page) {
      return false;
    }
    try {
      await page.waitForSelector(selector, { timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Take a screenshot for evidence
   */
  protected async takeScreenshot(name: string): Promise<string | undefined> {
    const page = this.getPage();
    if (!page) {
      return undefined;
    }
    const screenshotPath = `test-results/screenshots/${this.getName()}-${name}-${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  }

  /**
   * Log a message
   */
  protected log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const prefix = `[${this.getName()}]`;
    switch (level) {
      case 'error':
        logger.error(prefix, message);
        break;
      case 'warn':
        logger.warn(prefix, message);
        break;
      default:
        }
  }

  /**
   * Get the audit results
   */
  getResults(): { issues: AuditIssue[]; metrics: AuditMetrics } {
    return {
      issues: this.issues,
      metrics: this.metrics
    };
  }

  /**
   * Get a summary of the audit results
   */
  getSummary(): {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  } {
    const summary = {
      total: this.issues.length,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0
    };

    for (const issue of this.issues) {
      switch (issue.severity) {
        case AuditSeverity.CRITICAL:
          summary.critical++;
          break;
        case AuditSeverity.HIGH:
          summary.high++;
          break;
        case AuditSeverity.MEDIUM:
          summary.medium++;
          break;
        case AuditSeverity.LOW:
          summary.low++;
          break;
        case AuditSeverity.INFO:
          summary.info++;
          break;
      }
    }

    return summary;
  }

  /**
   * Run the audit
   */
  async run(): Promise<{ issues: AuditIssue[]; metrics: AuditMetrics }> {
    try {
      this.log(`Starting audit for ${this.getArea().name}`);
      await this.initialize();
      await this.audit();
      await this.cleanup();
      this.log(`Completed audit for ${this.getArea().name}`);
      return this.getResults();
    } catch (error) {
      this.log(`Error during audit: ${error}`, 'error');
      this.addIssue({
        title: 'Audit Error',
        description: `Failed to complete audit: ${error}`,
        severity: AuditSeverity.CRITICAL,
        status: AuditStatus.ERROR
      });
      return this.getResults();
    }
  }
}