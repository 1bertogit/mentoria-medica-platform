#!/usr/bin/env node

import { AuditRunner } from './index';
import logger from '@/lib/logger';
import { AuditConfig } from './types';
import * as process from 'process';

/**
 * CLI for running platform audits
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const flags = {
    full: args.includes('--full'),
    quick: args.includes('--quick'),
    area: args.includes('--area'),
    ci: args.includes('--ci'),
    help: args.includes('--help') || args.includes('-h'),
    verbose: args.includes('--verbose') || args.includes('-v'),
    json: args.includes('--json'),
    html: args.includes('--html'),
    markdown: args.includes('--markdown') || args.includes('--md'),
  };

  // Show help
  if (flags.help) {
    showHelp();
    process.exit(0);
  }

  // Get area name if --area flag is used
  const areaIndex = args.indexOf('--area');
  const areaName = areaIndex !== -1 && args[areaIndex + 1] 
    ? args[areaIndex + 1] 
    : null;

  // Get custom base URL if provided
  const baseUrlIndex = args.indexOf('--url');
  const customBaseUrl = baseUrlIndex !== -1 && args[baseUrlIndex + 1]
    ? args[baseUrlIndex + 1]
    : process.env.AUDIT_BASE_URL;

  // Get custom output directory
  const outputIndex = args.indexOf('--output');
  const outputDir = outputIndex !== -1 && args[outputIndex + 1]
    ? args[outputIndex + 1]
    : 'audit-reports';

  // Determine report format
  let reportFormat: 'json' | 'html' | 'markdown' | 'all' = 'all';
  if (flags.json && !flags.html && !flags.markdown) {
    reportFormat = 'json';
  } else if (flags.html && !flags.json && !flags.markdown) {
    reportFormat = 'html';
  } else if (flags.markdown && !flags.json && !flags.html) {
    reportFormat = 'markdown';
  }

  // Build configuration
  const config: Partial<AuditConfig> = {
    reporting: {
      format: reportFormat,
      outputDir
    }
  };

  // Add base URL if provided
  if (customBaseUrl) {
    config.baseUrl = customBaseUrl;
  }

  // Enable CI mode if requested
  if (flags.ci) {
    config.ci = {
      failOnCritical: true,
      failOnHigh: true,
      failThreshold: 80
    };
    
    // In CI mode, be less verbose unless explicitly requested
    if (!flags.verbose) {
      console.log = () => {};
    }
  }

  try {
    // Create audit runner
    const runner = new AuditRunner(config);
    
    let report;
    
    // Run appropriate audit based on flags
    if (flags.area && areaName) {
      report = await runner.runForArea(areaName);
    } else if (flags.quick) {
      console.log('\n  ⚡ Running quick audit...\n');
      report = await runner.runQuick();
    } else {
      report = await runner.run();
    }

    // In verbose mode, show detailed results
    if (flags.verbose && report) {
      for (const result of report.results) {
        // Show top 3 critical/high issues
        const criticalAndHigh = result.issues
          .filter(i => i.severity === 'critical' || i.severity === 'high')
          .slice(0, 3);
        
        if (criticalAndHigh.length > 0) {
          for (const issue of criticalAndHigh) {
            console.log(`    [${issue.severity}] ${issue.title}`);
          }
        }
      }
    }

    // Exit with appropriate code
    if (flags.ci && report) {
      const { criticalIssues, highIssues, overallScore } = report.summary;
      
      if (criticalIssues > 0) {
        logger.error('\n❌ Audit failed: Critical issues found');
        process.exit(1);
      }
      
      if (highIssues > 0) {
        logger.error('\n❌ Audit failed: High severity issues found');
        process.exit(1);
      }
      
      if (overallScore && overallScore < 80) {
        logger.error(`\n❌ Audit failed: Score ${overallScore}% below threshold 80%`);
        process.exit(1);
      }
    }
    
    process.exit(0);
    
  } catch (error) {
    logger.error('\n❌ Audit failed with error:', error);
    process.exit(1);
  }
}

function showHelp() {
  --quick         Run quick audit with critical checks only
  --area <name>   Run audit for specific area (Dashboard, Library, Academy, Cases, Archive)
  --ci            Enable CI mode with strict failure conditions
  --url <url>     Set custom base URL for audit
  --output <dir>  Set output directory for reports (default: audit-reports)
  --json          Save report in JSON format only
  --html          Save report in HTML format only
  --markdown      Save report in Markdown format only
  --verbose, -v   Show detailed output
  --help, -h      Show this help message

Examples:
  npm run audit                           # Run full audit
  npm run audit:quick                     # Run quick audit
  npm run audit:dev                       # Run audit on development server
  npm run audit:prod                      # Run audit on production
  npm run audit:area Dashboard            # Run audit on Dashboard area only
  npm run audit:ci                        # Run in CI mode with strict checks
  npm run audit -- --url http://custom.com --json  # Custom URL with JSON output

NPM Scripts:
  npm run audit         # Run standard audit
  npm run audit:all     # Run complete audit with all checks
  npm run audit:dev     # Run audit on development server (localhost:3000)
  npm run audit:prod    # Run audit on production server
  npm run audit:area    # Run audit on specific area (pass area name)
  npm run audit:quick   # Run quick audit (critical checks only)
  npm run audit:ci      # Run audit in CI mode

Environment Variables:
  AUDIT_BASE_URL    Base URL for audit (default: http://localhost:3000)
  HEADLESS          Run browser in headless mode (default: true)

Report Formats:
  - JSON: Machine-readable format with complete data
  - HTML: Visual report with charts and styling
  - Markdown: Documentation-friendly format

CI Integration:
  In CI mode, the audit will exit with code 1 if:
  - Any critical issues are found
  - Any high severity issues are found  
  - Overall score is below 80%
`);
}

// Run the CLI
if (require.main === module) {
  main().catch(error => {
    logger.error('Fatal error:', error);
    process.exit(1);
  });
}