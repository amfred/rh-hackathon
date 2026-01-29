# Tests

This directory contains all tests for the Griot & Grits project.

## Test Types

### E2E Tests (End-to-End)

Location: `tests/e2e/`

End-to-end tests validate the complete user journey from the frontend UI through the backend API to the database and storage systems.

**Quick Start:**
```bash
cd tests/e2e
./setup.sh
npm test
```

**Documentation:**
- [E2E Test README](./e2e/README.md) - Detailed documentation
- [Quick Start Guide](./e2e/QUICKSTART.md) - Get started in 5 minutes
- [Contributing Guide](./e2e/CONTRIBUTING.md) - Add new tests

**What's tested:**
- ✅ Artifact upload flow
- ✅ Transcription status monitoring
- ✅ Search functionality
- ✅ Security (no localhost:9000 exposure)

### Unit Tests (Coming Soon)

Backend unit tests for FastAPI endpoints, services, and utilities.

### Integration Tests (Coming Soon)

Tests for backend integration with MongoDB, MinIO, and Whisper.

## Running Tests

### E2E Tests
```bash
# From root directory
make test-e2e

# Or directly
cd tests/e2e && npm test
```

### All Tests (when available)
```bash
make test
```

## CI/CD

Tests run automatically on pull requests via GitHub Actions.

See `.github/workflows/` for CI configuration.

## Test Coverage

| Component | Test Type | Status |
|-----------|-----------|--------|
| Frontend UI | E2E | ✅ Implemented |
| Backend API | Unit | 🚧 Planned |
| Database | Integration | 🚧 Planned |
| Storage | Integration | 🚧 Planned |
| Transcription | Integration | 🚧 Planned |

## Contributing

See [E2E Contributing Guide](./e2e/CONTRIBUTING.md) for how to add tests.

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [pytest Documentation](https://docs.pytest.org/)
- [Testing Best Practices](https://testing.googleblog.com/)
