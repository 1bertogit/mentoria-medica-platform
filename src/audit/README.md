# Medical Education Platform - Audit System

## Overview

Comprehensive automated audit system for the Medical Education Platform that validates functionality, performance, accessibility, security, and overall quality across all platform areas.

## Features

### 🔍 Five Specialized Auditors

1. **Component Auditor** - UI/UX validation
   - Interactive element testing
   - Form validation
   - Loading states verification
   - Error handling checks
   - Responsive design validation

2. **Navigation Auditor** - Link and routing validation
   - Broken link detection
   - Redirect chain analysis
   - Deep link verification
   - Navigation consistency
   - Breadcrumb validation

3. **Performance Auditor** - Speed and optimization
   - Lighthouse integration
   - Core Web Vitals measurement
   - Bundle size analysis
   - Resource optimization checks
   - Loading time benchmarks

4. **Accessibility Auditor** - WCAG compliance
   - axe-core integration
   - Color contrast validation
   - Keyboard navigation testing
   - ARIA attribute verification
   - Screen reader compatibility

5. **Security Auditor** - Vulnerability detection
   - Security header validation
   - HTTPS enforcement
   - Cookie security
   - XSS vulnerability scanning
   - CSRF protection verification
   - Content Security Policy checks

### 📊 Comprehensive Reporting

- **Multiple Formats**: JSON, HTML, Markdown
- **Detailed Metrics**: Performance scores, issue counts, recommendations
- **Visual Reports**: HTML reports with charts and styling
- **CI Integration**: Exit codes and threshold-based failures
- **Issue Prioritization**: Critical, High, Medium, Low, Info severity levels

## Installation

The audit system is already integrated into the project. All dependencies are installed:

```bash
# Dependencies already included:
- @playwright/test    # Browser automation
- lighthouse         # Performance auditing
- axe-core          # Accessibility testing
- tsx               # TypeScript execution
```

## Usage

### Basic Commands

```bash
# Run full audit
npm run audit

# Run quick audit (critical checks only)
npm run audit:quick

# Run audit on specific area
npm run audit:area Dashboard

# Run audit on development server
npm run audit:dev

# Run audit on production
npm run audit:prod

# Run audit in CI mode
npm run audit:ci
```

### Advanced Options

```bash
# Custom URL with specific format
npm run audit -- --url https://custom.com --json

# Verbose output with custom output directory
npm run audit -- --verbose --output ./custom-reports

# CI mode with custom thresholds
npm run audit -- --ci --url https://staging.com
```

### Command Line Options

| Option | Description |
|--------|-------------|
| `--full` | Run complete audit (default) |
| `--quick` | Run quick audit with critical checks only |
| `--area <name>` | Run audit for specific area |
| `--ci` | Enable CI mode with strict failure conditions |
| `--url <url>` | Set custom base URL for audit |
| `--output <dir>` | Set output directory for reports |
| `--json` | Save report in JSON format only |
| `--html` | Save report in HTML format only |
| `--markdown` | Save report in Markdown format only |
| `--verbose, -v` | Show detailed output |
| `--help, -h` | Show help message |

## Configuration

### Default Configuration

The audit system uses sensible defaults configured in `audit.config.ts`:

```typescript
{
  baseUrl: 'http://localhost:3000',
  areas: [
    'Dashboard',
    'Library', 
    'Academy',
    'Cases',
    'Archive',
    'Profile'
  ],
  auditors: {
    component: { enabled: true },
    navigation: { enabled: true },
    performance: { enabled: true },
    accessibility: { enabled: true },
    security: { enabled: true }
  },
  reporting: {
    format: 'all',
    outputDir: 'audit-reports'
  }
}
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AUDIT_BASE_URL` | Base URL to audit | `http://localhost:3000` |
| `HEADLESS` | Run browser in headless mode | `true` |
| `NODE_ENV` | Environment (development/production/ci) | `development` |
| `DEBUG` | Enable debug mode | `false` |

### Custom Configuration

Create a custom configuration by modifying the `AuditRunner` initialization:

```typescript
import { AuditRunner } from './src/audit';

const customConfig = {
  baseUrl: 'https://my-site.com',
  areas: [
    { name: 'Home', path: '/' },
    { name: 'Custom', path: '/custom' }
  ],
  auditors: {
    performance: { 
      enabled: true,
      config: {
        categories: {
          performance: 0.9 // 90% minimum
        }
      }
    }
  }
};

const runner = new AuditRunner(customConfig);
await runner.run();
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Audit

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  audit:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci --legacy-peer-deps
        
      - name: Build application
        run: npm run build
        
      - name: Start server
        run: npm start &
        env:
          PORT: 3000
          
      - name: Wait for server
        run: npx wait-on http://localhost:3000
        
      - name: Run audit
        run: npm run audit:ci
        
      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: audit-reports
          path: ci-reports/
```

### Exit Codes

In CI mode, the audit system uses these exit codes:

- `0` - Success, all checks passed
- `1` - Critical issues found
- `2` - High severity issues found
- `3` - Score below threshold
- `4` - Execution error

## Reports

### HTML Report

Beautiful visual report with:
- Overall score and metrics
- Issue breakdown by severity
- Area-by-area analysis
- Actionable recommendations
- Interactive charts

### JSON Report

Machine-readable format containing:
- Complete issue details
- Performance metrics
- Timestamps and durations
- Evidence and suggestions

### Markdown Report

Documentation-friendly format with:
- Summary statistics
- Issue listings
- Severity indicators
- Suggestions for fixes

## Areas Audited

### Dashboard (/)
- Main overview page
- User statistics
- Quick actions
- Recent activity

### Library (/library)
- Medical resources
- Books and articles
- Video content
- Search functionality

### Academy (/academy)
- Educational courses
- Learning materials
- Certificates
- Progress tracking

### Cases (/cases)
- Clinical scenarios
- Patient cases
- Discussion forums
- Case archives

### Archive (/archive)
- Historical records
- Past materials
- Search capabilities
- Categories

### Profile (/profile)
- User settings
- Achievements
- Personal information
- Preferences

## Issue Severity Levels

| Level | Description | Action Required |
|-------|-------------|-----------------|
| 🔴 **Critical** | Severe issues that block functionality | Immediate fix required |
| 🟠 **High** | Major issues affecting user experience | Fix within 24-48 hours |
| 🟡 **Medium** | Moderate issues with workarounds | Fix in next sprint |
| 🟢 **Low** | Minor issues or improvements | Fix when convenient |
| ℹ️ **Info** | Suggestions and best practices | Consider for future |

## Troubleshooting

### Common Issues

1. **Browser not found**
   ```bash
   npx playwright install chromium
   ```

2. **Port already in use**
   ```bash
   # Change port or kill existing process
   AUDIT_BASE_URL=http://localhost:3001 npm run audit
   ```

3. **Timeout errors**
   - Increase timeout in configuration
   - Check network connectivity
   - Verify server is running

4. **Permission errors**
   ```bash
   # Ensure write permissions for reports
   chmod 755 audit-reports
   ```

## Development

### Adding a New Auditor

1. Create new auditor class extending `BaseAuditor`:

```typescript
import { BaseAuditor } from '../core/BaseAuditor';

export class CustomAuditor extends BaseAuditor {
  getName(): string {
    return 'custom';
  }
  
  async audit(): Promise<void> {
    // Implementation
  }
}
```

2. Register in `AuditRunner`:

```typescript
this.engine.registerAuditor('custom', CustomAuditor);
```

3. Add configuration in `audit.config.ts`

### Running Tests

```bash
# Run audit system tests
npm test src/audit

# Run with coverage
npm run test:coverage
```

## Performance Benchmarks

Expected audit execution times:

- **Quick audit**: 30-60 seconds
- **Single area**: 1-2 minutes
- **Full audit**: 5-10 minutes

Factors affecting performance:
- Network speed
- Server response time
- Number of pages
- Enabled auditors
- Browser mode (headless vs headed)

## Best Practices

1. **Regular Audits**: Run daily in development, on every PR in CI
2. **Progressive Fixes**: Start with critical issues, work down
3. **Baseline Metrics**: Establish baseline scores and improve over time
4. **Team Reviews**: Share reports with the team regularly
5. **Automation**: Integrate into CI/CD pipeline
6. **Custom Rules**: Add project-specific validations as needed

## Support

For issues or questions about the audit system:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review recent audit reports for patterns
3. Enable verbose mode for detailed debugging
4. Check browser console for client-side errors

## License

Part of the Medical Education Platform project.