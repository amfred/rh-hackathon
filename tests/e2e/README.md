# E2E Tests for Griot & Grits Frontend

End-to-end tests validating critical user flows in the Admin UI using [Playwright](https://playwright.dev/).

## Overview

These E2E tests validate the complete user journey from artifact upload through transcription to search functionality, ensuring the entire pipeline works as expected.

### Test Coverage

1. **Artifact Upload** (`01-artifact-upload.spec.ts`)
   - ✅ Upload artifact via UI
   - ✅ Verify artifact appears in the list
   - ✅ Validate no localhost:9000 references

2. **Transcription Status** (`02-transcription-status.spec.ts`)
   - ✅ Monitor transcription progress
   - ✅ Verify status reaches "Complete" state
   - ✅ Handle transcription UI updates

3. **Search Functionality** (`03-search-functionality.spec.ts`)
   - ✅ Search for artifacts
   - ✅ Verify results are rendered
   - ✅ Handle empty results gracefully

4. **Localhost Validation** (`04-localhost-validation.spec.ts`)
   - ✅ Ensure no localhost:9000 in page content
   - ✅ Validate no localhost:9000 in network requests
   - ✅ Check image sources and API calls

## Prerequisites

- **Node.js 18+**
- **npm**
- **Running frontend** (default: http://localhost:3000)
- **Running backend** (default: http://localhost:8000)

## Installation

```bash
cd tests/e2e
npm install
npx playwright install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run specific test file
```bash
npx playwright test specs/01-artifact-upload.spec.ts
```

### Run tests against custom URL
```bash
BASE_URL=https://frontend-gng-user1.apps.example.com npm test
```

## Configuration

### Environment Variables

Create a `.env` file in `tests/e2e/`:

```bash
# Frontend URL
BASE_URL=http://localhost:3000

# Backend API URL
API_URL=http://localhost:8000

# Test credentials (if auth enabled)
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword

# Timeouts
DEFAULT_TIMEOUT=30000
UPLOAD_TIMEOUT=60000
TRANSCRIPTION_TIMEOUT=120000
```

See `.env.example` for all available options.

### Playwright Configuration

Edit `playwright.config.ts` to customize:
- Browsers to test against
- Test timeout values
- Reporter options
- Video/screenshot capture settings

## Test Structure

```
tests/e2e/
├── specs/                      # Test specifications
│   ├── 01-artifact-upload.spec.ts
│   ├── 02-transcription-status.spec.ts
│   ├── 03-search-functionality.spec.ts
│   └── 04-localhost-validation.spec.ts
├── utils/                      # Helper utilities
│   ├── helpers.ts              # Reusable test helpers
│   └── test-data.ts            # Test data and constants
├── fixtures/                   # Test files
│   ├── sample-audio.mp3        # Small audio file for testing
│   └── README.md
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

## CI/CD Integration

### GitHub Actions

Tests run automatically on pull requests via GitHub Actions:

**Workflow 1: Local Environment** (`.github/workflows/e2e-tests.yml`)
- Triggered on PRs to `main` or `develop`
- Starts services locally
- Runs E2E tests
- Uploads test reports as artifacts

**Workflow 2: OpenShift Deployment** (`.github/workflows/e2e-tests-openshift.yml`)
- Tests against live OpenShift deployments
- Validates production-like environments
- Can be triggered manually with custom URLs

### Running in CI

```bash
# Set CI environment variable
CI=true npm test
```

In CI mode:
- Tests run with 2 retries on failure
- HTML and JUnit reports are generated
- Screenshots and videos captured on failure
- Tests run serially (not in parallel)

## Debugging Failed Tests

### View test report
```bash
npm run test:report
```

### Run with debug mode
```bash
npm run test:debug
```

### Generate test code interactively
```bash
npm run test:codegen
```

### Check test artifacts
Failed tests generate:
- **Screenshots**: `test-results/*/test-failed-1.png`
- **Videos**: `test-results/*/video.webm`
- **Traces**: `test-results/*/trace.zip`

View traces at: https://trace.playwright.dev/

## Test Fixtures

Test files are located in `fixtures/`:

- **sample-audio.mp3**: Small audio file (~5 seconds) for upload testing

### Creating test fixtures

```bash
cd tests/e2e/fixtures

# Generate a test audio file
ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 5 -acodec libmp3lame -ab 64k sample-audio.mp3
```

Keep fixtures small (< 5MB) for fast test execution.

## Known Issues & Limitations

1. **Auth Bypass**: Tests assume `ADMIN_DEV_BYPASS=true` for local development. Update `bypassAuthIfNeeded()` helper if auth is required.

2. **Transcription Timeout**: Transcription tests may time out if Whisper is not running or is processing slowly. Adjust `TRANSCRIPTION_TIMEOUT` as needed.

3. **Dynamic Selectors**: If UI changes, update selectors in `utils/test-data.ts`.

4. **Network Timing**: Some tests use fixed timeouts. Consider using `page.waitForLoadState('networkidle')` or custom waiters for better reliability.

## Success Criteria (from Issue #22)

- ✅ Artifact Upload succeeds and artifact appears in UI
- ✅ Transcription status shows progress and reaches "Complete"
- ✅ Search returns results and renders artifacts
- ✅ No localhost:9000 references in UI or network requests
- ✅ CI pipeline fails if E2E tests fail

## Contributing

### Adding new tests

1. Create a new spec file in `specs/`:
   ```typescript
   import { test, expect } from '@playwright/test';
   
   test.describe('Feature Name', () => {
     test('should do something', async ({ page }) => {
       // Test implementation
     });
   });
   ```

2. Add reusable helpers to `utils/helpers.ts`
3. Add constants to `utils/test-data.ts`
4. Update this README

### Best practices

- Use data-testid attributes for stable selectors
- Keep tests independent (no dependencies between tests)
- Clean up test data after tests
- Use meaningful test descriptions
- Add console.log for debugging
- Handle flaky tests with proper waits (not fixed timeouts)

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Playwright Tests](https://playwright.dev/docs/debug)
- [Issue #22 - E2E Tests Requirements](https://github.com/griot-and-grits/rh-hackathon/issues/22)

## Support

For questions or issues:
1. Check test output and reports
2. Review Playwright logs
3. Open an issue on GitHub
4. Contact the team on Slack/Discord
