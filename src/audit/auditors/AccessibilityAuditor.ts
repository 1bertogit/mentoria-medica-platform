import { BaseAuditor } from '../core/BaseAuditor';
import { AuditCategory, AuditSeverity, AuditStatus } from '../types';
import * as axe from 'axe-core';

interface AccessibilityViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary?: string;
  }>;
  tags: string[];
}

/**
 * Auditor for accessibility compliance (WCAG)
 */
export class AccessibilityAuditor extends BaseAuditor {
  getName(): string {
    return 'accessibility';
  }

  getCategory(): AuditCategory {
    return AuditCategory.ACCESSIBILITY;
  }

  async audit(): Promise<void> {
    const page = this.getPage();
    if (!page) {
      // In no-browser mode, just skip the audit gracefully
      // No critical errors for missing browser in development
      return;
    }

    // Run axe-core accessibility tests
    await this.runAxeAudit();
    
    // Check color contrast
    await this.checkColorContrast();
    
    // Check keyboard navigation
    await this.checkKeyboardNavigation();
    
    // Check ARIA attributes
    await this.checkAriaAttributes();
    
    // Check form labels
    await this.checkFormLabels();
    
    // Check heading structure
    await this.checkHeadingStructure();
    
    // Check language attributes
    await this.checkLanguageAttributes();
    
    // Check media alternatives
    await this.checkMediaAlternatives();
  }

  private async runAxeAudit(): Promise<void> {
    const page = this.getPage();
    if (!page) return;

    try {
      // Inject axe-core
      await page.evaluate((axeSource: string) => {
        const script = document.createElement('script');
        script.textContent = axeSource;
        document.head.appendChild(script);
      }, axe.source);

      // Run axe audit
      const results = await page.evaluate(() => {
        return (window as any).axe.run();
      });

      // Process violations
      const violations = results.violations as AccessibilityViolation[];
      const violationCount = violations.length;
      const totalNodes = violations.reduce((sum, v) => sum + v.nodes.length, 0);

      // Add metrics
      this.addMetrics({
        accessibility: {
          score: results.violations.length === 0 ? 100 : Math.max(0, 100 - (violations.length * 10)),
          violations: violationCount,
          warnings: results.incomplete?.length || 0,
          wcagLevel: 'AA' // Default target
        }
      });

      // Report violations
      for (const violation of violations) {
        const severity = this.mapAxeImpactToSeverity(violation.impact);
        
        this.addIssue({
          title: violation.help,
          description: violation.description,
          severity,
          status: AuditStatus.FAIL,
          category: AuditCategory.ACCESSIBILITY,
          evidence: {
            id: violation.id,
            impact: violation.impact,
            nodes: violation.nodes.slice(0, 3), // Limit to first 3 instances
            tags: violation.tags
          },
          suggestion: `Fix: ${violation.help}`,
          documentation: violation.helpUrl
        });
      }

      // Report incomplete tests as warnings
      const incomplete = results.incomplete || [];
      for (const inc of incomplete.slice(0, 5)) { // Limit to 5 warnings
        this.addIssue({
          title: `Needs Review: ${inc.help}`,
          description: inc.description,
          severity: AuditSeverity.LOW,
          status: AuditStatus.WARNING,
          category: AuditCategory.ACCESSIBILITY,
          suggestion: 'Manual review required',
          documentation: inc.helpUrl
        });
      }

      // Summary issue if many violations
      if (violationCount > 10) {
        this.addIssue({
          title: 'Multiple Accessibility Violations',
          description: `Found ${violationCount} accessibility violations affecting ${totalNodes} elements`,
          severity: AuditSeverity.CRITICAL,
          status: AuditStatus.FAIL,
          suggestion: 'Conduct thorough accessibility review and fixes'
        });
      }

    } catch (error) {
      this.log(`Axe audit failed: ${error}`, 'error');
      this.addIssue({
        title: 'Accessibility Audit Error',
        description: `Failed to run axe-core: ${error}`,
        severity: AuditSeverity.HIGH,
        status: AuditStatus.ERROR
      });
    }
  }

  private mapAxeImpactToSeverity(impact: string): AuditSeverity {
    switch (impact) {
      case 'critical':
        return AuditSeverity.CRITICAL;
      case 'serious':
        return AuditSeverity.HIGH;
      case 'moderate':
        return AuditSeverity.MEDIUM;
      case 'minor':
        return AuditSeverity.LOW;
      default:
        return AuditSeverity.INFO;
    }
  }

  private async checkColorContrast(): Promise<void> {
    const page = this.getPage();
    if (!page) return;

    const contrastIssues = await page.evaluate(() => {
      const getContrastRatio = (color1: string, color2: string): number => {
        // Simplified contrast calculation
        const getLuminance = (color: string): number => {
          // This is a simplified version
          const rgb = color.match(/\d+/g);
          if (!rgb || rgb.length < 3) return 0;
          
          const [r, g, b] = rgb.map(n => {
            const val = parseInt(n) / 255;
            return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
          });
          
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };

        const l1 = getLuminance(color1);
        const l2 = getLuminance(color2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        
        return (lighter + 0.05) / (darker + 0.05);
      };

      const elements = document.querySelectorAll('*');
      const issues: unknown[] = [];

      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        if (color && backgroundColor && 
            color !== 'rgba(0, 0, 0, 0)' && 
            backgroundColor !== 'rgba(0, 0, 0, 0)') {
          
          const ratio = getContrastRatio(color, backgroundColor);
          const fontSize = parseFloat(style.fontSize);
          const fontWeight = style.fontWeight;
          
          // WCAG AA requirements
          const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight === 'bold');
          const requiredRatio = isLargeText ? 3 : 4.5;
          
          if (ratio < requiredRatio) {
            issues.push({
              element: el.tagName.toLowerCase(),
              text: (el.textContent || '').substring(0, 50),
              ratio: ratio.toFixed(2),
              required: requiredRatio,
              fontSize,
              isLargeText
            });
          }
        }
      });

      return issues.slice(0, 10); // Limit to first 10 issues
    });

    if (contrastIssues.length > 0) {
      this.addIssue({
        title: 'Insufficient Color Contrast',
        description: `Found ${contrastIssues.length} element(s) with insufficient color contrast`,
        severity: AuditSeverity.HIGH,
        status: AuditStatus.FAIL,
        evidence: contrastIssues.slice(0, 5),
        suggestion: 'Increase contrast ratio to meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)'
      });
    }
  }

  private async checkKeyboardNavigation(): Promise<void> {
    const page = this.getPage();
    if (!page) return;

    // Check for keyboard traps
    const keyboardTraps = await page.evaluate(() => {
      const focusableElements = Array.from(
        document.querySelectorAll('a, button, input, select, textarea, [tabindex]')
      );
      
      const traps: unknown[] = [];
      focusableElements.forEach(el => {
        const tabindex = el.getAttribute('tabindex');
        if (tabindex && parseInt(tabindex) < -1) {
          traps.push({
            element: el.tagName.toLowerCase(),
            tabindex,
            text: (el.textContent || '').substring(0, 50)
          });
        }
      });
      
      return traps;
    });

    if (keyboardTraps.length > 0) {
      this.addIssue({
        title: 'Potential Keyboard Traps',
        description: `Found ${keyboardTraps.length} element(s) with problematic tabindex values`,
        severity: AuditSeverity.HIGH,
        status: AuditStatus.FAIL,
        evidence: keyboardTraps,
        suggestion: 'Use tabindex="0" or "-1" only, avoid other negative values'
      });
    }

    // Check for focus indicators
    const missingFocusIndicators = await page.evaluate(() => {
      const interactiveElements = Array.from(
        document.querySelectorAll('a, button, input, select, textarea')
      );
      
      const missing: unknown[] = [];
      interactiveElements.forEach(el => {
        const style = window.getComputedStyle(el, ':focus');
        const outline = style.outline;
        const border = style.border;
        const boxShadow = style.boxShadow;
        
        if (outline === 'none' && border === 'none' && boxShadow === 'none') {
          missing.push({
            element: el.tagName.toLowerCase(),
            class: el.className,
            text: (el.textContent || '').substring(0, 50)
          });
        }
      });
      
      return missing.slice(0, 10);
    });

    if (missingFocusIndicators.length > 0) {
      this.addIssue({
        title: 'Missing Focus Indicators',
        description: `Found ${missingFocusIndicators.length} interactive element(s) without visible focus indicators`,
        severity: AuditSeverity.MEDIUM,
        status: AuditStatus.WARNING,
        evidence: missingFocusIndicators.slice(0, 5),
        suggestion: 'Add visible focus indicators for all interactive elements'
      });
    }
  }

  private async checkAriaAttributes(): Promise<void> {
    const page = this.getPage();
    if (!page) return;

    const ariaIssues = await page.evaluate(() => {
      const issues: unknown[] = [];
      
      // Check for invalid ARIA roles
      const elementsWithRoles = document.querySelectorAll('[role]');
      const validRoles = [
        'alert', 'button', 'checkbox', 'dialog', 'gridcell', 'link', 'log', 'marquee',
        'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'progressbar',
        'radio', 'scrollbar', 'searchbox', 'slider', 'spinbutton', 'status', 'switch',
        'tab', 'tabpanel', 'textbox', 'timer', 'tooltip', 'treeitem', 'combobox',
        'grid', 'listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree',
        'treegrid', 'article', 'document', 'group', 'img', 'list', 'listitem',
        'main', 'navigation', 'region', 'row', 'rowheader', 'application', 'banner',
        'complementary', 'contentinfo', 'form', 'heading', 'search', 'alert',
        'alertdialog', 'presentation', 'none'
      ];
      
      elementsWithRoles.forEach(el => {
        const role = el.getAttribute('role');
        if (role && !validRoles.includes(role)) {
          issues.push({
            type: 'invalid-role',
            element: el.tagName.toLowerCase(),
            role,
            html: el.outerHTML.substring(0, 100)
          });
        }
      });
      
      // Check for missing ARIA labels on interactive elements
      const interactiveWithoutLabel = Array.from(
        document.querySelectorAll('button:not([aria-label]):not([aria-labelledby]), a:not([aria-label]):not([aria-labelledby])')
      ).filter(el => !(el.textContent?.trim()));
      
      interactiveWithoutLabel.forEach(el => {
        issues.push({
          type: 'missing-label',
          element: el.tagName.toLowerCase(),
          html: el.outerHTML.substring(0, 100)
        });
      });
      
      // Check for ARIA attributes without proper roles
      const ariaAttrs = document.querySelectorAll('[aria-expanded], [aria-selected], [aria-checked]');
      ariaAttrs.forEach(el => {
        if (!el.getAttribute('role') && !['BUTTON', 'A', 'INPUT'].includes(el.tagName)) {
          issues.push({
            type: 'aria-without-role',
            element: el.tagName.toLowerCase(),
            attributes: Array.from(el.attributes).map(a => a.name).filter(n => n.startsWith('aria-')),
            html: el.outerHTML.substring(0, 100)
          });
        }
      });
      
      return issues.slice(0, 15);
    });

    if (ariaIssues.length > 0) {
      const invalidRoles = ariaIssues.filter(i => i.type === 'invalid-role');
      const missingLabels = ariaIssues.filter(i => i.type === 'missing-label');
      const ariaWithoutRole = ariaIssues.filter(i => i.type === 'aria-without-role');
      
      if (invalidRoles.length > 0) {
        this.addIssue({
          title: 'Invalid ARIA Roles',
          description: `Found ${invalidRoles.length} element(s) with invalid ARIA roles`,
          severity: AuditSeverity.HIGH,
          status: AuditStatus.FAIL,
          evidence: invalidRoles.slice(0, 3),
          suggestion: 'Use only valid ARIA roles from WAI-ARIA specification'
        });
      }
      
      if (missingLabels.length > 0) {
        this.addIssue({
          title: 'Interactive Elements Missing Labels',
          description: `Found ${missingLabels.length} interactive element(s) without accessible labels`,
          severity: AuditSeverity.HIGH,
          status: AuditStatus.FAIL,
          evidence: missingLabels.slice(0, 3),
          suggestion: 'Add aria-label or visible text to all interactive elements'
        });
      }
      
      if (ariaWithoutRole.length > 0) {
        this.addIssue({
          title: 'ARIA Attributes Without Roles',
          description: `Found ${ariaWithoutRole.length} element(s) with ARIA attributes but no role`,
          severity: AuditSeverity.MEDIUM,
          status: AuditStatus.WARNING,
          evidence: ariaWithoutRole.slice(0, 3),
          suggestion: 'Add appropriate roles to elements using ARIA attributes'
        });
      }
    }
  }

  private async checkFormLabels(): Promise<void> {
    const page = this.getPage();
    if (!page) return;

    const formIssues = await page.evaluate(() => {
      const issues: unknown[] = [];
      
      // Check inputs without labels
      const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
      inputs.forEach(input => {
        const id = input.id;
        const ariaLabel = input.getAttribute('aria-label');
        const ariaLabelledby = input.getAttribute('aria-labelledby');
        const label = id ? document.querySelector(`label[for="${id}"]`) : null;
        const parentLabel = input.closest('label');
        
        if (!label && !parentLabel && !ariaLabel && !ariaLabelledby) {
          const type = input.getAttribute('type') || 'text';
          if (type !== 'hidden' && type !== 'submit' && type !== 'button') {
            issues.push({
              type: 'missing-label',
              element: input.tagName.toLowerCase(),
              inputType: type,
              name: input.getAttribute('name'),
              id: input.id
            });
          }
        }
      });
      
      // Check for empty labels
      const labels = Array.from(document.querySelectorAll('label'));
      labels.forEach(label => {
        if (!label.textContent?.trim()) {
          issues.push({
            type: 'empty-label',
            for: label.getAttribute('for')
          });
        }
      });
      
      // Check required fields
      const requiredFields = Array.from(document.querySelectorAll('[required]'));
      requiredFields.forEach(field => {
        const ariaRequired = field.getAttribute('aria-required');
        if (!ariaRequired) {
          issues.push({
            type: 'missing-aria-required',
            element: field.tagName.toLowerCase(),
            name: field.getAttribute('name')
          });
        }
      });
      
      return issues;
    });

    const missingLabels = formIssues.filter(i => i.type === 'missing-label');
    const emptyLabels = formIssues.filter(i => i.type === 'empty-label');
    const missingAriaRequired = formIssues.filter(i => i.type === 'missing-aria-required');
    
    if (missingLabels.length > 0) {
      this.addIssue({
        title: 'Form Inputs Without Labels',
        description: `Found ${missingLabels.length} form input(s) without associated labels`,
        severity: AuditSeverity.HIGH,
        status: AuditStatus.FAIL,
        evidence: missingLabels.slice(0, 5),
        suggestion: 'Add labels to all form inputs using <label> or aria-label'
      });
    }
    
    if (emptyLabels.length > 0) {
      this.addIssue({
        title: 'Empty Form Labels',
        description: `Found ${emptyLabels.length} empty label element(s)`,
        severity: AuditSeverity.MEDIUM,
        status: AuditStatus.WARNING,
        evidence: emptyLabels.slice(0, 3),
        suggestion: 'Add descriptive text to all label elements'
      });
    }
    
    if (missingAriaRequired.length > 0) {
      this.addIssue({
        title: 'Required Fields Missing ARIA',
        description: `Found ${missingAriaRequired.length} required field(s) without aria-required`,
        severity: AuditSeverity.LOW,
        status: AuditStatus.WARNING,
        evidence: missingAriaRequired.slice(0, 3),
        suggestion: 'Add aria-required="true" to required form fields'
      });
    }
  }

  private async checkHeadingStructure(): Promise<void> {
    const page = this.getPage();
    if (!page) return;

    const headingIssues = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const issues: unknown[] = [];
      
      // Check for multiple h1s
      const h1s = headings.filter(h => h.tagName === 'H1');
      if (h1s.length > 1) {
        issues.push({
          type: 'multiple-h1',
          count: h1s.length,
          texts: h1s.map(h => h.textContent?.trim()).slice(0, 3)
        });
      } else if (h1s.length === 0) {
        issues.push({
          type: 'missing-h1'
        });
      }
      
      // Check heading hierarchy
      let previousLevel = 0;
      const hierarchyIssues: unknown[] = [];
      
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.substring(1));
        
        if (previousLevel > 0 && level > previousLevel + 1) {
          hierarchyIssues.push({
            index,
            skipped: level - previousLevel - 1,
            from: `h${previousLevel}`,
            to: `h${level}`,
            text: heading.textContent?.trim().substring(0, 50)
          });
        }
        
        previousLevel = level;
      });
      
      if (hierarchyIssues.length > 0) {
        issues.push({
          type: 'skipped-levels',
          count: hierarchyIssues.length,
          examples: hierarchyIssues.slice(0, 3)
        });
      }
      
      // Check for empty headings
      const emptyHeadings = headings.filter(h => !h.textContent?.trim());
      if (emptyHeadings.length > 0) {
        issues.push({
          type: 'empty-headings',
          count: emptyHeadings.length,
          levels: emptyHeadings.map(h => h.tagName.toLowerCase())
        });
      }
      
      return issues;
    });

    headingIssues.forEach(issue => {
      if (issue.type === 'multiple-h1') {
        this.addIssue({
          title: 'Multiple H1 Elements',
          description: `Found ${issue.count} H1 elements (should have only one per page)`,
          severity: AuditSeverity.MEDIUM,
          status: AuditStatus.WARNING,
          evidence: issue.texts,
          suggestion: 'Use only one H1 per page as the main heading'
        });
      } else if (issue.type === 'missing-h1') {
        this.addIssue({
          title: 'Missing H1 Element',
          description: 'Page has no H1 element',
          severity: AuditSeverity.MEDIUM,
          status: AuditStatus.WARNING,
          suggestion: 'Add an H1 element as the main page heading'
        });
      } else if (issue.type === 'skipped-levels') {
        this.addIssue({
          title: 'Skipped Heading Levels',
          description: `Found ${issue.count} instance(s) of skipped heading levels`,
          severity: AuditSeverity.LOW,
          status: AuditStatus.WARNING,
          evidence: issue.examples,
          suggestion: 'Maintain proper heading hierarchy without skipping levels'
        });
      } else if (issue.type === 'empty-headings') {
        this.addIssue({
          title: 'Empty Headings',
          description: `Found ${issue.count} empty heading element(s)`,
          severity: AuditSeverity.MEDIUM,
          status: AuditStatus.FAIL,
          evidence: issue.levels,
          suggestion: 'Remove empty headings or add appropriate content'
        });
      }
    });
  }

  private async checkLanguageAttributes(): Promise<void> {
    const page = this.getPage();
    if (!page) return;

    const langIssues = await page.evaluate(() => {
      const issues: unknown[] = [];
      
      // Check for lang attribute on html element
      const htmlElement = document.documentElement;
      const htmlLang = htmlElement.getAttribute('lang');
      
      if (!htmlLang) {
        issues.push({
          type: 'missing-lang',
          element: 'html'
        });
      } else if (htmlLang.length !== 2 && !htmlLang.match(/^[a-z]{2}-[A-Z]{2}$/)) {
        issues.push({
          type: 'invalid-lang',
          element: 'html',
          value: htmlLang
        });
      }
      
      // Check for lang changes in content
      const elementsWithLang = Array.from(document.querySelectorAll('[lang]'));
      elementsWithLang.forEach(el => {
        const lang = el.getAttribute('lang');
        if (lang && lang.length !== 2 && !lang.match(/^[a-z]{2}-[A-Z]{2}$/)) {
          issues.push({
            type: 'invalid-lang',
            element: el.tagName.toLowerCase(),
            value: lang
          });
        }
      });
      
      return issues;
    });

    langIssues.forEach(issue => {
      if (issue.type === 'missing-lang') {
        this.addIssue({
          title: 'Missing Language Attribute',
          description: 'HTML element lacks lang attribute',
          severity: AuditSeverity.HIGH,
          status: AuditStatus.FAIL,
          suggestion: 'Add lang="pt-BR" to the <html> element'
        });
      } else if (issue.type === 'invalid-lang') {
        this.addIssue({
          title: 'Invalid Language Code',
          description: `Invalid language code "${issue.value}" on ${issue.element} element`,
          severity: AuditSeverity.MEDIUM,
          status: AuditStatus.WARNING,
          suggestion: 'Use valid ISO 639-1 language codes (e.g., "pt", "en", "pt-BR")'
        });
      }
    });
  }

  private async checkMediaAlternatives(): Promise<void> {
    const page = this.getPage();
    if (!page) return;

    const mediaIssues = await page.evaluate(() => {
      const issues: unknown[] = [];
      
      // Check images for alt text
      const images = Array.from(document.querySelectorAll('img'));
      const imagesWithoutAlt = images.filter(img => !img.hasAttribute('alt'));
      const imagesWithEmptyAlt = images.filter(img => img.getAttribute('alt') === '');
      
      if (imagesWithoutAlt.length > 0) {
        issues.push({
          type: 'missing-alt',
          count: imagesWithoutAlt.length,
          examples: imagesWithoutAlt.slice(0, 3).map(img => ({
            src: img.src.substring(img.src.lastIndexOf('/') + 1)
          }))
        });
      }
      
      // Check for decorative images that should have empty alt
      const decorativeImages = images.filter(img => {
        const alt = img.getAttribute('alt');
        return alt && (
          alt.toLowerCase().includes('decorative') ||
          alt.toLowerCase().includes('spacer') ||
          alt.toLowerCase().includes('icon')
        );
      });
      
      if (decorativeImages.length > 0) {
        issues.push({
          type: 'decorative-alt',
          count: decorativeImages.length
        });
      }
      
      // Check videos for captions
      const videos = Array.from(document.querySelectorAll('video'));
      const videosWithoutTracks = videos.filter(video => {
        const tracks = video.querySelectorAll('track[kind="captions"], track[kind="subtitles"]');
        return tracks.length === 0;
      });
      
      if (videosWithoutTracks.length > 0) {
        issues.push({
          type: 'missing-captions',
          count: videosWithoutTracks.length
        });
      }
      
      // Check audio elements
      const audioElements = Array.from(document.querySelectorAll('audio'));
      if (audioElements.length > 0) {
        const audioWithoutControls = audioElements.filter(audio => !audio.hasAttribute('controls'));
        if (audioWithoutControls.length > 0) {
          issues.push({
            type: 'audio-no-controls',
            count: audioWithoutControls.length
          });
        }
      }
      
      return issues;
    });

    mediaIssues.forEach(issue => {
      if (issue.type === 'missing-alt') {
        this.addIssue({
          title: 'Images Missing Alt Attribute',
          description: `Found ${issue.count} image(s) without alt attribute`,
          severity: AuditSeverity.HIGH,
          status: AuditStatus.FAIL,
          evidence: issue.examples,
          suggestion: 'Add alt="" for decorative images or descriptive alt text for informative images'
        });
      } else if (issue.type === 'decorative-alt') {
        this.addIssue({
          title: 'Decorative Images With Text',
          description: `Found ${issue.count} potentially decorative image(s) with alt text`,
          severity: AuditSeverity.LOW,
          status: AuditStatus.WARNING,
          suggestion: 'Use alt="" for purely decorative images'
        });
      } else if (issue.type === 'missing-captions') {
        this.addIssue({
          title: 'Videos Without Captions',
          description: `Found ${issue.count} video(s) without caption tracks`,
          severity: AuditSeverity.HIGH,
          status: AuditStatus.FAIL,
          suggestion: 'Add caption tracks to all videos for deaf/hard-of-hearing users'
        });
      } else if (issue.type === 'audio-no-controls') {
        this.addIssue({
          title: 'Audio Without Controls',
          description: `Found ${issue.count} audio element(s) without controls`,
          severity: AuditSeverity.MEDIUM,
          status: AuditStatus.WARNING,
          suggestion: 'Add controls attribute to audio elements'
        });
      }
    });
  }
}