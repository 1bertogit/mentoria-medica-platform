import { BaseAuditor } from '../core/BaseAuditor';
import logger from '@/lib/logger';
import { AuditCategory, AuditSeverity, AuditStatus } from '../types';

/**
 * SEO Auditor that checks for search engine optimization best practices
 * Works without Puppeteer using fetch API
 */
export class SEOAuditor extends BaseAuditor {
  getName(): string {
    return 'SEO Auditor';
  }

  getCategory(): AuditCategory {
    return AuditCategory.UI_UX;
  }

  async audit(): Promise<void> {
    const area = this.context.area;
    const baseUrl = this.context.config.baseUrl;
    const url = `${baseUrl}${area.path}`;

    try {
      // Fetch the page HTML
      const response = await fetch(url);
      
      if (!response.ok) {
        this.addIssue({
          id: 'seo-page-not-accessible',
          title: 'Page not accessible for SEO analysis',
          description: `Cannot analyze SEO for ${url} - Status: ${response.status}`,
          severity: AuditSeverity.HIGH,
          category: AuditCategory.UI_UX,
          status: AuditStatus.FAIL,
          suggestion: 'Ensure page is accessible for search engine crawlers',
          timestamp: new Date()
        });
        return;
      }

      const html = await response.text();

      // Check meta tags
      this.checkMetaTags(html, area.name);

      // Check title tag
      this.checkTitleTag(html, area.name);

      // Check headings structure
      this.checkHeadingsStructure(html);

      // Check Open Graph tags
      this.checkOpenGraphTags(html);

      // Check structured data
      this.checkStructuredData(html);

      // Check canonical URL
      this.checkCanonicalUrl(html, url);

      // Check robots.txt and sitemap
      await this.checkRobotsAndSitemap(baseUrl);

      // Check image alt texts
      this.checkImageAltTexts(html);

      // Check internal linking
      this.checkInternalLinking(html);

      // Add SEO metrics
      const metaDescription = this.extractMetaContent(html, 'description');
      const metaKeywords = this.extractMetaContent(html, 'keywords');
      const title = this.extractTitle(html);

      this.addMetrics({
        seo: {
          hasMetaDescription: !!metaDescription,
          hasMetaKeywords: !!metaKeywords,
          hasTitle: !!title,
          titleLength: title?.length || 0,
          descriptionLength: metaDescription?.length || 0
        }
      });

    } catch (error) {
      logger.error('SEO audit error:', error);
      this.addIssue({
        id: 'seo-audit-error',
        title: 'SEO audit failed',
        description: `Unable to complete SEO audit: ${error}`,
        severity: AuditSeverity.MEDIUM,
        category: AuditCategory.UI_UX,
        status: AuditStatus.ERROR,
        suggestion: 'Check if the page is accessible and returns valid HTML',
        timestamp: new Date()
      });
    }
  }

  /**
   * Check meta tags
   */
  private checkMetaTags(html: string, areaName: string): void {
    // Check meta description
    const metaDescription = this.extractMetaContent(html, 'description');
    
    if (!metaDescription) {
      this.addIssue({
        id: 'seo-missing-meta-description',
        title: 'Missing meta description',
        description: `${areaName} page is missing a meta description tag`,
        severity: AuditSeverity.HIGH,
        category: AuditCategory.UI_UX,
        status: AuditStatus.FAIL,
        suggestion: 'Add a unique meta description (150-160 characters) for better search results',
        timestamp: new Date()
      });
    } else if (metaDescription.length < 120 || metaDescription.length > 160) {
      this.addIssue({
        id: 'seo-meta-description-length',
        title: 'Meta description length not optimal',
        description: `Meta description is ${metaDescription.length} characters (optimal: 150-160)`,
        severity: AuditSeverity.MEDIUM,
        category: AuditCategory.UI_UX,
        status: AuditStatus.WARNING,
        suggestion: 'Adjust meta description to be between 150-160 characters',
        evidence: { currentLength: metaDescription.length },
        timestamp: new Date()
      });
    }

    // Check meta keywords (less important but still checked)
    const metaKeywords = this.extractMetaContent(html, 'keywords');
    if (!metaKeywords) {
      this.addIssue({
        id: 'seo-missing-meta-keywords',
        title: 'Missing meta keywords',
        description: 'Meta keywords tag not found',
        severity: AuditSeverity.LOW,
        category: AuditCategory.UI_UX,
        status: AuditStatus.INFO,
        suggestion: 'Consider adding relevant meta keywords (though less important for modern SEO)',
        timestamp: new Date()
      });
    }

    // Check viewport meta tag
    const viewport = this.extractMetaContent(html, 'viewport');
    if (!viewport) {
      this.addIssue({
        id: 'seo-missing-viewport',
        title: 'Missing viewport meta tag',
        description: 'Viewport meta tag is required for mobile optimization',
        severity: AuditSeverity.HIGH,
        category: AuditCategory.UI_UX,
        status: AuditStatus.FAIL,
        suggestion: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
        timestamp: new Date()
      });
    }
  }

  /**
   * Check title tag
   */
  private checkTitleTag(html: string, areaName: string): void {
    const title = this.extractTitle(html);
    
    if (!title) {
      this.addIssue({
        id: 'seo-missing-title',
        title: 'Missing page title',
        description: `${areaName} page is missing a title tag`,
        severity: AuditSeverity.CRITICAL,
        category: AuditCategory.UI_UX,
        status: AuditStatus.FAIL,
        suggestion: 'Add a unique, descriptive title tag (50-60 characters)',
        timestamp: new Date()
      });
    } else if (title.length < 30 || title.length > 60) {
      this.addIssue({
        id: 'seo-title-length',
        title: 'Page title length not optimal',
        description: `Title is ${title.length} characters (optimal: 50-60)`,
        severity: AuditSeverity.MEDIUM,
        category: AuditCategory.UI_UX,
        status: AuditStatus.WARNING,
        suggestion: 'Adjust title to be between 50-60 characters',
        evidence: { currentLength: title.length, title },
        timestamp: new Date()
      });
    }
  }

  /**
   * Check headings structure
   */
  private checkHeadingsStructure(html: string): void {
    const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
    const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
    
    if (h1Count === 0) {
      this.addIssue({
        id: 'seo-missing-h1',
        title: 'Missing H1 heading',
        description: 'Page should have exactly one H1 heading',
        severity: AuditSeverity.HIGH,
        category: AuditCategory.UI_UX,
        status: AuditStatus.FAIL,
        suggestion: 'Add a single, descriptive H1 heading to the page',
        timestamp: new Date()
      });
    } else if (h1Count > 1) {
      this.addIssue({
        id: 'seo-multiple-h1',
        title: 'Multiple H1 headings found',
        description: `Found ${h1Count} H1 headings (should have exactly 1)`,
        severity: AuditSeverity.MEDIUM,
        category: AuditCategory.UI_UX,
        status: AuditStatus.WARNING,
        suggestion: 'Use only one H1 heading per page',
        evidence: { h1Count },
        timestamp: new Date()
      });
    }

    if (h2Count === 0 && html.length > 2000) {
      this.addIssue({
        id: 'seo-missing-subheadings',
        title: 'Missing subheadings',
        description: 'Long content should be structured with H2-H6 subheadings',
        severity: AuditSeverity.LOW,
        category: AuditCategory.UI_UX,
        status: AuditStatus.INFO,
        suggestion: 'Add H2-H6 headings to structure your content',
        timestamp: new Date()
      });
    }
  }

  /**
   * Check Open Graph tags
   */
  private checkOpenGraphTags(html: string): void {
    const ogTags = ['og:title', 'og:description', 'og:image', 'og:url'];
    const missingOgTags: string[] = [];

    for (const tag of ogTags) {
      if (!html.includes(`property="${tag}"`) && !html.includes(`property='${tag}'`)) {
        missingOgTags.push(tag);
      }
    }

    if (missingOgTags.length > 0) {
      this.addIssue({
        id: 'seo-missing-og-tags',
        title: 'Missing Open Graph tags',
        description: `Missing Open Graph tags for social sharing: ${missingOgTags.join(', ')}`,
        severity: AuditSeverity.MEDIUM,
        category: AuditCategory.UI_UX,
        status: AuditStatus.WARNING,
        suggestion: 'Add Open Graph meta tags for better social media sharing',
        evidence: { missingTags: missingOgTags },
        timestamp: new Date()
      });
    }
  }

  /**
   * Check structured data
   */
  private checkStructuredData(html: string): void {
    const hasJsonLd = html.includes('application/ld+json');
    const hasMicrodata = html.includes('itemscope');
    
    if (!hasJsonLd && !hasMicrodata) {
      this.addIssue({
        id: 'seo-missing-structured-data',
        title: 'Missing structured data',
        description: 'No structured data (JSON-LD or Microdata) found',
        severity: AuditSeverity.LOW,
        category: AuditCategory.UI_UX,
        status: AuditStatus.INFO,
        suggestion: 'Add structured data markup for better search engine understanding',
        timestamp: new Date()
      });
    }
  }

  /**
   * Check canonical URL
   */
  private checkCanonicalUrl(html: string, currentUrl: string): void {
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i);
    
    if (!canonicalMatch) {
      this.addIssue({
        id: 'seo-missing-canonical',
        title: 'Missing canonical URL',
        description: 'No canonical URL specified',
        severity: AuditSeverity.MEDIUM,
        category: AuditCategory.UI_UX,
        status: AuditStatus.WARNING,
        suggestion: 'Add canonical URL to prevent duplicate content issues',
        timestamp: new Date()
      });
    }
  }

  /**
   * Check robots.txt and sitemap
   */
  private async checkRobotsAndSitemap(baseUrl: string): Promise<void> {
    // Check robots.txt
    try {
      const robotsResponse = await fetch(`${baseUrl}/robots.txt`);
      if (!robotsResponse.ok) {
        this.addIssue({
          id: 'seo-missing-robots',
          title: 'Missing robots.txt file',
          description: 'robots.txt file not found',
          severity: AuditSeverity.MEDIUM,
          category: AuditCategory.UI_UX,
          status: AuditStatus.WARNING,
          suggestion: 'Create a robots.txt file to guide search engine crawlers',
          timestamp: new Date()
        });
      }
    } catch (error) {
      // Ignore network errors for robots.txt
    }

    // Check sitemap
    try {
      const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
      if (!sitemapResponse.ok) {
        this.addIssue({
          id: 'seo-missing-sitemap',
          title: 'Missing sitemap.xml file',
          description: 'sitemap.xml file not found',
          severity: AuditSeverity.MEDIUM,
          category: AuditCategory.UI_UX,
          status: AuditStatus.WARNING,
          suggestion: 'Create a sitemap.xml file to help search engines discover all pages',
          timestamp: new Date()
        });
      }
    } catch (error) {
      // Ignore network errors for sitemap
    }
  }

  /**
   * Check image alt texts
   */
  private checkImageAltTexts(html: string): void {
    const imgTags = html.match(/<img[^>]*>/gi) || [];
    const missingAlt = imgTags.filter(tag => !tag.includes('alt=')).length;
    
    if (missingAlt > 0) {
      this.addIssue({
        id: 'seo-missing-image-alt',
        title: 'Images missing alt text',
        description: `Found ${missingAlt} images without alt text`,
        severity: AuditSeverity.MEDIUM,
        category: AuditCategory.ACCESSIBILITY,
        status: AuditStatus.WARNING,
        suggestion: 'Add descriptive alt text to all images for SEO and accessibility',
        evidence: { count: missingAlt },
        timestamp: new Date()
      });
    }
  }

  /**
   * Check internal linking
   */
  private checkInternalLinking(html: string): void {
    const internalLinks = (html.match(/<a[^>]*href=["'](\/[^"']*|#[^"']*)/gi) || []).length;
    
    if (internalLinks < 3) {
      this.addIssue({
        id: 'seo-poor-internal-linking',
        title: 'Poor internal linking',
        description: `Only ${internalLinks} internal links found`,
        severity: AuditSeverity.LOW,
        category: AuditCategory.UI_UX,
        status: AuditStatus.INFO,
        suggestion: 'Add more internal links to improve site navigation and SEO',
        evidence: { linkCount: internalLinks },
        timestamp: new Date()
      });
    }
  }

  /**
   * Extract meta content
   */
  private extractMetaContent(html: string, name: string): string | null {
    const regex = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)/["']`, 'i');
    const match = html.match(regex);
    return match ? match[1] : null;
  }

  /**
   * Extract title
   */
  private extractTitle(html: string): string | null {
    const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
    return match ? match[1].trim() : null;
  }
}