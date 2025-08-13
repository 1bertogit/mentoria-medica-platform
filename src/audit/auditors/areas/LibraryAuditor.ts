import { BaseAuditor } from '../../core/BaseAuditor';
import logger from '@/lib/logger';
import { AuditCategory, AuditSeverity, AuditStatus } from '../../types';

/**
 * Library-specific auditor that validates library functionality and content organization
 */
export class LibraryAuditor extends BaseAuditor {
  getName(): string {
    return 'Library Auditor';
  }

  getCategory(): AuditCategory {
    return AuditCategory.FUNCTIONALITY;
  }

  async audit(): Promise<void> {
    const area = this.context.area;
    
    // Only run for Library area
    if (area.name !== 'Library') {
      return;
    }

    const baseUrl = this.context.config.baseUrl;
    const url = `${baseUrl}${area.path}`;

    try {
      // Fetch library page
      const response = await fetch(url);
      
      if (!response.ok) {
        this.addIssue({
          id: 'library-not-accessible',
          title: 'Library not accessible',
          description: `Library page returned status ${response.status}`,
          severity: AuditSeverity.CRITICAL,
          category: AuditCategory.FUNCTIONALITY,
          status: AuditStatus.FAIL,
          suggestion: 'Ensure library page is accessible',
          timestamp: new Date()
        });
        return;
      }

      const html = await response.text();

      // Check for search functionality
      this.checkSearchFunctionality(html);

      // Check for content categories
      this.checkContentCategories(html);

      // Check for filtering options
      this.checkFilteringOptions(html);

      // Check for resource cards/items
      this.checkResourceDisplay(html);

      // Check for download/view options
      this.checkResourceActions(html);

      // Check for pagination
      this.checkPagination(html);

      // Check for sorting options
      this.checkSortingOptions(html);

      // Check for favorites/bookmarks
      this.checkFavoritesFeature(html);

      // Check for content metadata
      this.checkContentMetadata(html);

      // Add library-specific metrics
      this.addMetrics({
        library: {
          hasSearch: this.hasComponent(html, 'search'),
          hasFilters: this.hasComponent(html, 'filter'),
          hasCategories: this.hasComponent(html, 'category|categories'),
          hasPagination: this.hasComponent(html, 'pagination|page'),
          hasSorting: this.hasComponent(html, 'sort'),
          hasFavorites: this.hasComponent(html, 'favorite|bookmark')
        }
      });

    } catch (error) {
      logger.error('Library audit error:', error);
      this.addIssue({
        id: 'library-audit-error',
        title: 'Library audit failed',
        description: `Unable to complete library audit: ${error}`,
        severity: AuditSeverity.HIGH,
        category: AuditCategory.FUNCTIONALITY,
        status: AuditStatus.ERROR,
        suggestion: 'Check if library module is properly configured',
        timestamp: new Date()
      });
    }
  }

  /**
   * Check for search functionality
   */
  private checkSearchFunctionality(html: string): void {
    if (!this.hasComponent(html, 'search|busca|pesquisa')) {
      this.addIssue({
        id: 'library-no-search',
        title: 'Missing search functionality',
        description: 'Library should have a search bar for finding resources',
        severity: AuditSeverity.HIGH,
        category: AuditCategory.FUNCTIONALITY,
        status: AuditStatus.FAIL,
        suggestion: 'Add a prominent search bar to help users find content',
        timestamp: new Date()
      });
    }

    // Check for advanced search
    if (!this.hasComponent(html, 'advanced|filter|refine')) {
      this.addIssue({
        id: 'library-no-advanced-search',
        title: 'No advanced search options',
        description: 'Library should offer advanced search filters',
        severity: AuditSeverity.LOW,
        category: AuditCategory.FUNCTIONALITY,
        status: AuditStatus.INFO,
        suggestion: 'Consider adding advanced search with filters by type, date, author, etc.',
        timestamp: new Date()
      });
    }
  }

  /**
   * Check for content categories
   */
  private checkContentCategories(html: string): void {
    const expectedCategories = [
      'Books',
      'Articles', 
      'Videos',
      'Cases',
      'Guidelines',
      'Research Papers'
    ];

    if (!this.hasComponent(html, 'category|categories|tipo|type')) {
      this.addIssue({
        id: 'library-no-categories',
        title: 'Missing content categories',
        description: 'Library should organize content by categories',
        severity: AuditSeverity.HIGH,
        category: AuditCategory.UI_UX,
        status: AuditStatus.FAIL,
        suggestion: `Add categories like: ${expectedCategories.join(', ')}`,
        evidence: { suggestedCategories: expectedCategories },
        timestamp: new Date()
      });
    }
  }

  /**
   * Check for filtering options
   */
  private checkFilteringOptions(html: string): void {
    const importantFilters = [
      'Content Type',
      'Publication Date',
      'Author',
      'Language',
      'Difficulty Level'
    ];

    if (!this.hasComponent(html, 'filter|filtro|refine')) {
      this.addIssue({
        id: 'library-no-filters',
        title: 'Missing filter options',
        description: 'Library should have filters to refine search results',
        severity: AuditSeverity.MEDIUM,
        category: AuditCategory.FUNCTIONALITY,
        status: AuditStatus.WARNING,
        suggestion: `Add filters for: ${importantFilters.join(', ')}`,
        evidence: { suggestedFilters: importantFilters },
        timestamp: new Date()
      });
    }
  }

  /**
   * Check for resource display
   */
  private checkResourceDisplay(html: string): void {
    if (!this.hasComponent(html, 'card|item|resource|content|article|book')) {
      this.addIssue({
        id: 'library-no-resources',
        title: 'No resource display',
        description: 'Library page should display available resources',
        severity: AuditSeverity.CRITICAL,
        category: AuditCategory.FUNCTIONALITY,
        status: AuditStatus.FAIL,
        suggestion: 'Display library resources in cards or list format',
        timestamp: new Date()
      });
    }

    // Check for resource thumbnails
    if (!this.hasComponent(html, 'thumbnail|image|cover|preview')) {
      this.addIssue({
        id: 'library-no-thumbnails',
        title: 'Missing resource thumbnails',
        description: 'Resources should have visual previews or covers',
        severity: AuditSeverity.LOW,
        category: AuditCategory.UI_UX,
        status: AuditStatus.INFO,
        suggestion: 'Add thumbnails or cover images for resources',
        timestamp: new Date()
      });
    }
  }

  /**
   * Check for resource actions
   */
  private checkResourceActions(html: string): void {
    const expectedActions = ['View', 'Download', 'Share', 'Save'];

    if (!this.hasComponent(html, 'download|view|open|read|baixar|ver')) {
      this.addIssue({
        id: 'library-no-actions',
        title: 'Missing resource actions',
        description: 'Resources should have action buttons',
        severity: AuditSeverity.HIGH,
        category: AuditCategory.FUNCTIONALITY,
        status: AuditStatus.FAIL,
        suggestion: `Add actions: ${expectedActions.join(', ')}`,
        evidence: { expectedActions },
        timestamp: new Date()
      });
    }
  }

  /**
   * Check for pagination
   */
  private checkPagination(html: string): void {
    if (!this.hasComponent(html, 'pagination|page|next|previous|página')) {
      this.addIssue({
        id: 'library-no-pagination',
        title: 'Missing pagination',
        description: 'Library should have pagination for large result sets',
        severity: AuditSeverity.MEDIUM,
        category: AuditCategory.UI_UX,
        status: AuditStatus.WARNING,
        suggestion: 'Add pagination controls for better navigation',
        timestamp: new Date()
      });
    }
  }

  /**
   * Check for sorting options
   */
  private checkSortingOptions(html: string): void {
    const sortOptions = [
      'Relevance',
      'Date (Newest)',
      'Date (Oldest)', 
      'Title (A-Z)',
      'Most Popular'
    ];

    if (!this.hasComponent(html, 'sort|order|ordenar')) {
      this.addIssue({
        id: 'library-no-sorting',
        title: 'Missing sorting options',
        description: 'Library should allow sorting of results',
        severity: AuditSeverity.MEDIUM,
        category: AuditCategory.UI_UX,
        status: AuditStatus.WARNING,
        suggestion: `Add sorting by: ${sortOptions.join(', ')}`,
        evidence: { suggestedSorting: sortOptions },
        timestamp: new Date()
      });
    }
  }

  /**
   * Check for favorites/bookmarks feature
   */
  private checkFavoritesFeature(html: string): void {
    if (!this.hasComponent(html, 'favorite|bookmark|save|star|favorito')) {
      this.addIssue({
        id: 'library-no-favorites',
        title: 'Missing favorites feature',
        description: 'Users should be able to save favorite resources',
        severity: AuditSeverity.LOW,
        category: AuditCategory.FUNCTIONALITY,
        status: AuditStatus.INFO,
        suggestion: 'Add ability to bookmark or favorite resources',
        timestamp: new Date()
      });
    }
  }

  /**
   * Check for content metadata
   */
  private checkContentMetadata(html: string): void {
    const importantMetadata = [
      'Author',
      'Publication Date',
      'File Size',
      'Format',
      'Duration (for videos)',
      'Pages (for documents)'
    ];

    if (!this.hasComponent(html, 'author|date|size|format|duration|pages')) {
      this.addIssue({
        id: 'library-insufficient-metadata',
        title: 'Insufficient resource metadata',
        description: 'Resources should display relevant metadata',
        severity: AuditSeverity.LOW,
        category: AuditCategory.UI_UX,
        status: AuditStatus.INFO,
        suggestion: `Display metadata: ${importantMetadata.join(', ')}`,
        evidence: { suggestedMetadata: importantMetadata },
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