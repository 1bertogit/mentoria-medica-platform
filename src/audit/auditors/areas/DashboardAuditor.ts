import { BaseAuditor } from '../../core/BaseAuditor';
import logger from '@/lib/logger';
import { AuditCategory, AuditSeverity, AuditStatus } from '../../types';

/**
 * Dashboard-specific auditor that validates dashboard functionality and metrics
 */
export class DashboardAuditor extends BaseAuditor {
  getName(): string {
    return 'Dashboard Auditor';
  }

  getCategory(): AuditCategory {
    return AuditCategory.FUNCTIONALITY;
  }

  async audit(): Promise<void> {
    const area = this.context.area;
    
    // Only run for Dashboard area
    if (area.name !== 'Dashboard') {
      return;
    }

    const baseUrl = this.context.config.baseUrl;
    const url = `${baseUrl}${area.path}`;

    try {
      // Fetch dashboard page
      const response = await fetch(url);
      
      if (!response.ok) {
        this.addIssue({
          id: 'dashboard-not-accessible',
          title: 'Dashboard not accessible',
          description: `Dashboard returned status ${response.status}`,
          severity: AuditSeverity.CRITICAL,
          category: AuditCategory.FUNCTIONALITY,
          status: AuditStatus.FAIL,
          suggestion: 'Ensure dashboard is accessible to authenticated users',
          timestamp: new Date()
        });
        return;
      }

      const html = await response.text();

      // Check for critical dashboard components
      this.checkDashboardComponents(html);

      // Check for dashboard widgets
      this.checkDashboardWidgets(html);

      // Check for real-time data indicators
      this.checkRealTimeData(html);

      // Check for quick actions
      this.checkQuickActions(html);

      // Check for notifications panel
      this.checkNotificationsPanel(html);

      // Check for user metrics display
      this.checkUserMetrics(html);

      // Check for recent activity feed
      this.checkActivityFeed(html);

      // Check for navigation shortcuts
      this.checkNavigationShortcuts(html);

      // Add dashboard-specific metrics
      this.addMetrics({
        dashboard: {
          hasStatistics: this.hasComponent(html, 'statistics'),
          hasQuickActions: this.hasComponent(html, 'quick-actions'),
          hasNotifications: this.hasComponent(html, 'notifications'),
          hasActivityFeed: this.hasComponent(html, 'activity'),
          hasUserProfile: this.hasComponent(html, 'user-profile')
        }
      });

    } catch (error) {
      logger.error('Dashboard audit error:', error);
      this.addIssue({
        id: 'dashboard-audit-error',
        title: 'Dashboard audit failed',
        description: `Unable to complete dashboard audit: ${error}`,
        severity: AuditSeverity.HIGH,
        category: AuditCategory.FUNCTIONALITY,
        status: AuditStatus.ERROR,
        suggestion: 'Check if dashboard is properly configured',
        timestamp: new Date()
      });
    }
  }

  /**
   * Check for critical dashboard components
   */
  private checkDashboardComponents(html: string): void {
    const criticalComponents = [
      { id: 'user-stats', name: 'User Statistics', selector: 'stats|statistics|metrics' },
      { id: 'nav-menu', name: 'Navigation Menu', selector: 'nav|menu|sidebar' },
      { id: 'header', name: 'Dashboard Header', selector: 'header|top-bar' },
      { id: 'main-content', name: 'Main Content Area', selector: 'main|content|dashboard-content' }
    ];

    for (const component of criticalComponents) {
      if (!this.hasComponent(html, component.selector)) {
        this.addIssue({
          id: `dashboard-missing-${component.id}`,
          title: `Missing ${component.name}`,
          description: `Dashboard is missing ${component.name} component`,
          severity: AuditSeverity.HIGH,
          category: AuditCategory.UI_UX,
          status: AuditStatus.FAIL,
          suggestion: `Add ${component.name} to the dashboard`,
          timestamp: new Date()
        });
      }
    }
  }

  /**
   * Check for dashboard widgets
   */
  private checkDashboardWidgets(html: string): void {
    const expectedWidgets = [
      'Welcome Widget',
      'Statistics Cards',
      'Progress Indicators',
      'Quick Links'
    ];

    const missingWidgets: string[] = [];

    // Simplified check - in real implementation would parse DOM
    if (!this.hasComponent(html, 'welcome|greeting')) {
      missingWidgets.push('Welcome Widget');
    }

    if (!this.hasComponent(html, 'card|stat|metric')) {
      missingWidgets.push('Statistics Cards');
    }

    if (!this.hasComponent(html, 'progress|chart|graph')) {
      missingWidgets.push('Progress Indicators');
    }

    if (missingWidgets.length > 0) {
      this.addIssue({
        id: 'dashboard-missing-widgets',
        title: 'Missing dashboard widgets',
        description: `Missing widgets: ${missingWidgets.join(', ')}`,
        severity: AuditSeverity.MEDIUM,
        category: AuditCategory.UI_UX,
        status: AuditStatus.WARNING,
        suggestion: 'Add missing widgets to improve dashboard functionality',
        evidence: { missingWidgets },
        timestamp: new Date()
      });
    }
  }

  /**
   * Check for real-time data indicators
   */
  private checkRealTimeData(html: string): void {
    if (!this.hasComponent(html, 'real-time|live|refresh|update')) {
      this.addIssue({
        id: 'dashboard-no-realtime',
        title: 'No real-time data indicators',
        description: 'Dashboard lacks real-time data update indicators',
        severity: AuditSeverity.LOW,
        category: AuditCategory.UI_UX,
        status: AuditStatus.INFO,
        suggestion: 'Add indicators showing when data was last updated',
        timestamp: new Date()
      });
    }
  }

  /**
   * Check for quick actions
   */
  private checkQuickActions(html: string): void {
    const quickActions = [
      'New Case',
      'Upload Document',
      'Schedule Meeting',
      'View Reports'
    ];

    if (!this.hasComponent(html, 'quick-action|shortcut|action-button')) {
      this.addIssue({
        id: 'dashboard-no-quick-actions',
        title: 'Missing quick actions',
        description: 'Dashboard should have quick action buttons for common tasks',
        severity: AuditSeverity.MEDIUM,
        category: AuditCategory.UI_UX,
        status: AuditStatus.WARNING,
        suggestion: `Add quick actions for: ${quickActions.join(', ')}`,
        evidence: { suggestedActions: quickActions },
        timestamp: new Date()
      });
    }
  }

  /**
   * Check for notifications panel
   */
  private checkNotificationsPanel(html: string): void {
    if (!this.hasComponent(html, 'notification|alert|message|bell')) {
      this.addIssue({
        id: 'dashboard-no-notifications',
        title: 'Missing notifications panel',
        description: 'Dashboard should display recent notifications',
        severity: AuditSeverity.MEDIUM,
        category: AuditCategory.FUNCTIONALITY,
        status: AuditStatus.WARNING,
        suggestion: 'Add a notifications panel to keep users informed',
        timestamp: new Date()
      });
    }
  }

  /**
   * Check for user metrics display
   */
  private checkUserMetrics(html: string): void {
    const importantMetrics = [
      'Total Cases',
      'Completed Courses',
      'Study Hours',
      'Achievement Points'
    ];

    if (!this.hasComponent(html, 'metric|stat|count|total')) {
      this.addIssue({
        id: 'dashboard-no-metrics',
        title: 'Missing user metrics',
        description: 'Dashboard should display key user metrics',
        severity: AuditSeverity.MEDIUM,
        category: AuditCategory.UI_UX,
        status: AuditStatus.WARNING,
        suggestion: `Display metrics like: ${importantMetrics.join(', ')}`,
        evidence: { suggestedMetrics: importantMetrics },
        timestamp: new Date()
      });
    }
  }

  /**
   * Check for activity feed
   */
  private checkActivityFeed(html: string): void {
    if (!this.hasComponent(html, 'activity|recent|feed|timeline|history')) {
      this.addIssue({
        id: 'dashboard-no-activity-feed',
        title: 'Missing activity feed',
        description: 'Dashboard should show recent user activity',
        severity: AuditSeverity.LOW,
        category: AuditCategory.UI_UX,
        status: AuditStatus.INFO,
        suggestion: 'Add an activity feed showing recent actions and updates',
        timestamp: new Date()
      });
    }
  }

  /**
   * Check for navigation shortcuts
   */
  private checkNavigationShortcuts(html: string): void {
    const expectedShortcuts = ['Library', 'Academy', 'Cases', 'Archive'];
    
    // Check if navigation links exist
    const hasNavigation = expectedShortcuts.every(shortcut => 
      html.toLowerCase().includes(shortcut.toLowerCase())
    );

    if (!hasNavigation) {
      this.addIssue({
        id: 'dashboard-incomplete-navigation',
        title: 'Incomplete navigation shortcuts',
        description: 'Dashboard should have shortcuts to all main sections',
        severity: AuditSeverity.MEDIUM,
        category: AuditCategory.UI_UX,
        status: AuditStatus.WARNING,
        suggestion: `Ensure shortcuts to: ${expectedShortcuts.join(', ')}`,
        evidence: { expectedShortcuts },
        timestamp: new Date()
      });
    }
  }

  /**
   * Helper to check if a component exists in HTML
   */
  private hasComponent(html: string, keywords: string): boolean {
    const keywordList = keywords.split('|');
    const lowerHtml = html.toLowerCase();
    return keywordList.some(keyword => lowerHtml.includes(keyword));
  }
}