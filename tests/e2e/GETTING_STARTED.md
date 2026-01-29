# Getting Started with E2E Tests

Welcome! This guide will help you get the E2E tests running in under 5 minutes.

## Prerequisites

Make sure you have:
- ✅ Node.js 18 or higher
- ✅ npm (comes with Node.js)
- ✅ Git

Check versions:
```bash
node --version   # Should be v18.x or higher
npm --version    # Should be v9.x or higher
```

## Step 1: Setup E2E Tests

From the root of the rh-hackathon repository:

```bash
make test-e2e-setup
```

This will:
- Install npm dependencies
- Install Playwright browsers
- Create `.env` configuration file
- Generate test fixtures (if ffmpeg is available)

**Alternative (manual setup):**
```bash
cd tests/e2e
./setup.sh
```

## Step 2: Start Services

The E2E tests need the frontend and backend services running.

### Option A: Local Development

```bash
# From the root directory
make dev
```

This starts:
- Frontend at http://localhost:3000
- Backend at http://localhost:8000
- MongoDB and MinIO services

### Option B: OpenShift

If you're using OpenShift, update `tests/e2e/.env`:

```bash
BASE_URL=https://frontend-gng-youruser.apps.example.com
API_URL=https://backend-gng-youruser.apps.example.com
```

## Step 3: Run Tests

### Quick Test
```bash
make test-e2e
```

### Interactive Mode (Recommended for First Run)
```bash
make test-e2e-ui
```

This opens Playwright's UI where you can:
- See all tests
- Run individual tests
- Watch tests execute
- Debug failures

### Other Options
```bash
# Run with visible browser
make test-e2e-headed

# Debug mode (step through tests)
make test-e2e-debug

# View test report
make test-e2e-report
```

## Step 4: Verify Results

After tests complete:

### View HTML Report
```bash
make test-e2e-report
```

Opens a browser with:
- ✅ Test results
- 📸 Screenshots of failures
- 🎥 Video recordings
- 📊 Network traces

### Check Test Artifacts

```bash
ls tests/e2e/test-results/
```

Contains:
- Screenshots (`.png`)
- Videos (`.webm`)
- Traces (`.zip`)

## What's Being Tested?

The E2E tests validate:

1. **📤 Upload Flow**
   - Upload artifact via UI
   - Verify artifact appears in list
   - Check upload success

2. **⚙️ Transcription**
   - Monitor transcription status
   - Wait for "Complete" state
   - Handle progress updates

3. **🔍 Search**
   - Search for artifacts
   - Verify results display
   - Handle empty results

4. **🔒 Security**
   - No localhost:9000 exposed (MinIO should be proxied)
   - Validate API calls
   - Check network requests

## Troubleshooting

### "Cannot find module..."
```bash
cd tests/e2e
npm install
```

### "Services not available"

Make sure services are running:
```bash
# Check if frontend is accessible
curl http://localhost:3000

# Check if backend is accessible
curl http://localhost:8000/health
```

Start services if needed:
```bash
make dev
```

### "No such file: sample-audio.mp3"

Generate test fixture:
```bash
cd tests/e2e/fixtures

# With ffmpeg
ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 5 -acodec libmp3lame -ab 64k sample-audio.mp3

# Or copy any small audio file
cp ~/Music/some-song.mp3 sample-audio.mp3
```

### "Browser not installed"
```bash
cd tests/e2e
npx playwright install chromium
```

### Tests timing out

Increase timeouts in `tests/e2e/.env`:
```
DEFAULT_TIMEOUT=60000
UPLOAD_TIMEOUT=120000
TRANSCRIPTION_TIMEOUT=180000
```

### Tests failing with "Element not found"

This might mean:
1. Services aren't fully started (wait a bit longer)
2. Frontend UI changed (selectors need updating)
3. Auth is required (check `ADMIN_DEV_BYPASS` is set)

Check the test output for the specific selector that failed.

## Next Steps

### For Developers
- Read [README.md](./README.md) for full documentation
- Read [CONTRIBUTING.md](./CONTRIBUTING.md) to add new tests
- Check [QUICKSTART.md](./QUICKSTART.md) for quick reference

### For CI/CD
Tests automatically run on PRs via GitHub Actions.

See:
- `.github/workflows/e2e-tests.yml`
- `.github/workflows/e2e-tests-openshift.yml`

### For Debugging
```bash
# Run specific test
npx playwright test specs/01-artifact-upload.spec.ts

# Run with debug
make test-e2e-debug

# Generate test code
cd tests/e2e
npx playwright codegen http://localhost:3000
```

## Common Commands

```bash
# Setup (first time)
make test-e2e-setup

# Run tests
make test-e2e

# Interactive mode
make test-e2e-ui

# Debug mode
make test-e2e-debug

# View report
make test-e2e-report

# Run specific test
cd tests/e2e
npx playwright test specs/01-artifact-upload.spec.ts
```

## Need Help?

1. Check the [README.md](./README.md)
2. Review test output and logs
3. Run in UI mode to see what's happening
4. Open an issue on GitHub
5. Ask the team on Slack/Discord

## Success!

Once tests are passing, you'll see:
```
✓ All tests passed!
  - 01-artifact-upload.spec.ts (3 tests)
  - 02-transcription-status.spec.ts (3 tests)
  - 03-search-functionality.spec.ts (4 tests)
  - 04-localhost-validation.spec.ts (6 tests)
```

You're now ready to add new tests or run tests in CI!

---

**Quick Links:**
- [Full Documentation](./README.md)
- [Quick Start](./QUICKSTART.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
