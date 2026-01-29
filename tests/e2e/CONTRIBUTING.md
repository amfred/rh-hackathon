# Contributing to E2E Tests

Thank you for contributing to the Griot & Grits E2E tests!

## Getting Started

1. **Setup your environment**:
   ```bash
   cd tests/e2e
   ./setup.sh
   ```

2. **Start services locally**:
   ```bash
   # From the root directory
   make dev
   ```

3. **Run tests**:
   ```bash
   npm test
   ```

## Writing Tests

### Test Structure

Each test file should focus on a specific feature or user flow:

```typescript
import { test, expect } from '@playwright/test';
import { helperFunction } from '../utils/helpers';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/');
  });

  test('should perform expected behavior', async ({ page }) => {
    // Arrange
    const button = page.locator('[data-testid="submit"]');
    
    // Act
    await button.click();
    
    // Assert
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

### Best Practices

1. **Use data-testid attributes**
   ```html
   <!-- Good -->
   <button data-testid="upload-button">Upload</button>
   
   <!-- Avoid -->
   <button class="btn btn-primary">Upload</button>
   ```

2. **Prefer user-facing selectors**
   ```typescript
   // Good - uses role and accessible name
   await page.locator('role=button[name="Upload"]').click();
   
   // Better - uses data-testid
   await page.locator('[data-testid="upload-button"]').click();
   
   // Avoid - brittle CSS selectors
   await page.locator('.container > div:nth-child(2) > button').click();
   ```

3. **Wait for conditions, not fixed timeouts**
   ```typescript
   // Good - wait for specific condition
   await expect(page.locator('.result')).toBeVisible();
   await page.waitForLoadState('networkidle');
   
   // Avoid - fixed timeout
   await page.waitForTimeout(5000);
   ```

4. **Keep tests independent**
   - Each test should work in isolation
   - Don't rely on test execution order
   - Clean up test data after tests

5. **Use meaningful test descriptions**
   ```typescript
   // Good
   test('should display error message when upload fails', ...)
   
   // Avoid
   test('test upload', ...)
   ```

### Adding New Tests

1. Create a new spec file in `specs/`:
   ```bash
   touch specs/05-my-new-feature.spec.ts
   ```

2. Follow the naming convention:
   ```
   XX-feature-name.spec.ts
   ```
   Where XX is a number for ordering (01, 02, 03...)

3. Import required utilities:
   ```typescript
   import { test, expect } from '@playwright/test';
   import { myHelper } from '../utils/helpers';
   import { TEST_SELECTORS } from '../utils/test-data';
   ```

4. Write your tests following the structure above

5. Add any new helpers to `utils/helpers.ts`

6. Add any new constants to `utils/test-data.ts`

7. Update the README.md with your new test

### Creating Reusable Helpers

Add helpers to `utils/helpers.ts`:

```typescript
/**
 * Description of what this helper does
 * @param page - Playwright page object
 * @param param - Description of parameter
 */
export async function myHelper(
  page: Page,
  param: string
): Promise<void> {
  // Implementation
}
```

### Adding Test Data

Add constants to `utils/test-data.ts`:

```typescript
export const TEST_SELECTORS = {
  MY_NEW_BUTTON: '[data-testid="my-button"]',
  // ...
};

export const TEST_MESSAGES = {
  MY_SUCCESS_MESSAGE: /success|completed/i,
  // ...
};
```

## Running Tests Locally

### All tests
```bash
npm test
```

### Specific test file
```bash
npx playwright test specs/01-artifact-upload.spec.ts
```

### Specific test by name
```bash
npx playwright test -g "should upload artifact"
```

### Debug mode
```bash
npm run test:debug
```

### UI mode (interactive)
```bash
npm run test:ui
```

### With custom environment
```bash
BASE_URL=https://frontend.example.com npm test
```

## Debugging Tests

### 1. Use console.log
```typescript
test('my test', async ({ page }) => {
  console.log('Current URL:', page.url());
  const text = await page.locator('.result').textContent();
  console.log('Result text:', text);
});
```

### 2. Use Playwright Inspector
```bash
npm run test:debug
```

### 3. Take screenshots
```typescript
await page.screenshot({ path: 'debug.png' });
```

### 4. Use pause()
```typescript
test('my test', async ({ page }) => {
  await page.goto('/');
  await page.pause(); // Test will pause here
});
```

### 5. View trace
```bash
npx playwright show-trace test-results/*/trace.zip
```

## Testing Against OpenShift

### Update environment
```bash
# Edit .env
BASE_URL=https://frontend-gng-user1.apps.example.com
API_URL=https://backend-gng-user1.apps.example.com
```

### Run tests
```bash
npm test
```

## CI/CD

Tests run automatically on pull requests. See:
- `.github/workflows/e2e-tests.yml`
- `.github/workflows/e2e-tests-openshift.yml`

### Manual CI run

```bash
# Set CI flag
CI=true npm test
```

## Common Issues

### Tests timing out
- Increase timeout in `playwright.config.ts`
- Use `page.waitForLoadState('networkidle')`
- Check if services are running

### Element not found
- Add `data-testid` attributes to frontend
- Use `page.waitForSelector()` before interaction
- Check selector in TEST_SELECTORS

### Flaky tests
- Replace fixed timeouts with conditional waits
- Use `expect().toBeVisible({ timeout })` with explicit timeout
- Check for race conditions

### Services not available
- Ensure frontend is running at BASE_URL
- Ensure backend is running at API_URL
- Check CORS settings

## Code Review Checklist

- [ ] Tests are independent and can run in any order
- [ ] Used data-testid or role-based selectors
- [ ] Added console.log for debugging
- [ ] No fixed timeouts (use waitFor* instead)
- [ ] Added helpers to utils/ if reusable
- [ ] Updated README.md
- [ ] Tests pass locally
- [ ] Meaningful test descriptions

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

## Questions?

- Open an issue on GitHub
- Ask in team Slack/Discord
- Check existing tests for examples
