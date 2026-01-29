# E2E Tests Quick Start Guide

Get up and running with E2E tests in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Frontend running at http://localhost:3000
- Backend running at http://localhost:8000

## Setup (First Time Only)

```bash
cd tests/e2e
./setup.sh
```

This will:
- Install dependencies
- Install Playwright browsers
- Create `.env` file
- Generate sample test fixtures

## Run Tests

### Run all tests
```bash
npm test
```

### Watch tests run in a browser
```bash
npm run test:headed
```

### Interactive UI mode (recommended for development)
```bash
npm run test:ui
```

### Debug a specific test
```bash
npm run test:debug
```

## What Gets Tested?

✅ **Upload Flow**
- Upload an artifact via UI
- Verify it appears in the artifacts list

✅ **Transcription**  
- Monitor transcription status
- Verify it reaches "Complete" state

✅ **Search**
- Search for artifacts
- Verify results are displayed

✅ **Security**
- Ensure no localhost:9000 references (MinIO shouldn't be exposed)

## Test Results

After running tests, view the HTML report:

```bash
npm run test:report
```

Reports include:
- Test status (passed/failed)
- Screenshots of failures
- Video recordings
- Network activity traces

## Common Issues

### "Services not available"
Make sure frontend and backend are running:
```bash
# In the root directory
make dev
```

### "Cannot find fixture file"
Run setup script to generate fixtures:
```bash
./setup.sh
```

Or create manually:
```bash
cd fixtures
ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 5 -acodec libmp3lame -ab 64k sample-audio.mp3
```

### Tests timing out
Increase timeouts in `.env`:
```
DEFAULT_TIMEOUT=60000
UPLOAD_TIMEOUT=120000
```

## Testing Against OpenShift

Edit `.env` to point to your OpenShift deployment:

```bash
BASE_URL=https://frontend-gng-user1.apps.example.com
API_URL=https://backend-gng-user1.apps.example.com
```

Then run tests as normal:
```bash
npm test
```

## CI/CD

Tests run automatically on pull requests. Check the "Actions" tab on GitHub to see results.

## Next Steps

- Read [README.md](./README.md) for detailed documentation
- Read [CONTRIBUTING.md](./CONTRIBUTING.md) to add new tests
- Check [fixtures/README.md](./fixtures/README.md) for test data info

## Need Help?

- Check test output for error messages
- Run in UI mode: `npm run test:ui`
- Enable debug mode: `npm run test:debug`
- Open an issue on GitHub
