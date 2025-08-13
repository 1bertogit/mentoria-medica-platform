/**
 * Core types for the audit system
 */

export enum AuditSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}

export enum AuditCategory {
  PERFORMANCE = 'performance',
  ACCESSIBILITY = 'accessibility',
  SEO = 'seo',
  SECURITY = 'security',
  BEST_PRACTICES = 'best_practices',
  UI_UX = 'ui_ux',
  FUNCTIONALITY = 'functionality'
}

export enum AuditStatus {
  PASS = 'pass',
  FAIL = 'fail',
  WARNING = 'warning',
  ERROR = 'error',
  SKIPPED = 'skipped',
  INFO = 'info'
}

export interface AuditIssue {
  id: string;
  title: string;
  description: string;
  severity: AuditSeverity;
  category: AuditCategory;
  status: AuditStatus;
  component?: string;
  file?: string;
  line?: number;
  column?: number;
  evidence?: unknown;
  suggestion?: string;
  documentation?: string;
  timestamp: Date;
}

export interface AuditMetrics {
  performance?: {
    fcp?: number; // First Contentful Paint
    lcp?: number; // Largest Contentful Paint
    fid?: number; // First Input Delay
    cls?: number; // Cumulative Layout Shift
    ttfb?: number; // Time to First Byte
    tti?: number; // Time to Interactive
    tbt?: number; // Total Blocking Time
    bundleSize?: number;
    loadTime?: number;
  };
  accessibility?: {
    score?: number;
    violations?: number;
    warnings?: number;
    wcagLevel?: 'A' | 'AA' | 'AAA';
  };
  seo?: {
    score?: number;
    metaTags?: boolean;
    sitemap?: boolean;
    robots?: boolean;
    structuredData?: boolean;
    hasMetaDescription?: boolean;
    hasMetaKeywords?: boolean;
    hasTitle?: boolean;
    titleLength?: number;
    descriptionLength?: number;
  };
  coverage?: {
    lines?: number;
    functions?: number;
    branches?: number;
    statements?: number;
  };
  navigation?: {
    totalLinks?: number;
    brokenLinks?: number;
    redirects?: number;
    slowLinks?: number;
  };
  dashboard?: {
    hasStatistics?: boolean;
    hasQuickActions?: boolean;
    hasNotifications?: boolean;
    hasActivityFeed?: boolean;
    hasUserProfile?: boolean;
  };
  library?: {
    hasSearch?: boolean;
    hasFilters?: boolean;
    hasCategories?: boolean;
    hasPagination?: boolean;
    hasSorting?: boolean;
    hasFavorites?: boolean;
  };
  [key: string]: unknown; // Allow custom metrics from area-specific auditors
}

export interface AuditArea {
  name: string;
  path: string;
  description?: string;
  components?: string[];
  routes?: string[];
  priority?: number;
}

export interface AuditResult {
  id: string;
  timestamp: Date;
  duration: number;
  area: AuditArea;
  issues: AuditIssue[];
  metrics: AuditMetrics;
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    errors: number;
    skipped: number;
  };
  score?: number;
}

export interface AuditReport {
  id: string;
  projectName: string;
  projectVersion?: string;
  timestamp: Date;
  duration: number;
  environment: {
    node: string;
    npm: string;
    os: string;
    browser?: string;
  };
  results: AuditResult[];
  globalMetrics: AuditMetrics;
  summary: {
    areas: number;
    totalIssues: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
    infoIssues: number;
    overallScore?: number;
  };
}

export interface AuditorConfig {
  enabled: boolean;
  severity?: AuditSeverity;
  category?: AuditCategory;
  rules?: Record<string, any>;
  threshold?: Record<string, number>;
  exclude?: string[];
  include?: string[];
}

export interface AuditConfig {
  baseUrl: string;
  areas: AuditArea[];
  auditors: {
    component?: AuditorConfig;
    navigation?: AuditorConfig;
    performance?: AuditorConfig;
    accessibility?: AuditorConfig;
    security?: AuditorConfig;
    seo?: AuditorConfig;
    [key: string]: AuditorConfig | undefined;
  };
  reporting: {
    format: 'json' | 'html' | 'markdown' | 'all';
    outputDir: string;
    openReport?: boolean;
    sendEmail?: boolean;
    emailRecipients?: string[];
  };
  ci?: {
    failOnCritical?: boolean;
    failOnHigh?: boolean;
    failThreshold?: number;
    annotations?: boolean;
  };
}

export interface AuditorContext {
  config: AuditConfig;
  area: AuditArea;
  page?: unknown; // Playwright Page
  browser?: unknown; // Playwright Browser
  results: AuditIssue[];
  metrics: AuditMetrics;
}