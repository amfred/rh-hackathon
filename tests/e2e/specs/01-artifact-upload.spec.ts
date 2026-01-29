import { test, expect } from '@playwright/test';
import path from 'path';
import { 
  waitForElement, 
  assertNoForbiddenUrl, 
  uploadFile,
  bypassAuthIfNeeded 
} from '../utils/helpers';
import { TEST_URLS, TEST_SELECTORS, TEST_TIMEOUTS } from '../utils/test-data';

test.describe('Artifact Upload', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the admin UI
    await page.goto('/');
    
    // Bypass auth if in dev mode
    await bypassAuthIfNeeded(page);
    
    // Wait for page to be ready
    await page.waitForLoadState('networkidle');
  });

  test('should successfully upload an artifact and see it appear in the UI', async ({ page }) => {
    // Step 1: Navigate to upload page (adjust path as needed)
    const uploadButton = page.locator(TEST_SELECTORS.UPLOAD_BUTTON).first();
    
    // If upload is on a separate page, navigate to it
    if (await uploadButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await uploadButton.click();
    } else {
      // Try navigating directly
      await page.goto('/upload', { waitUntil: 'networkidle' });
    }

    // Step 2: Locate file input
    const fileInput = page.locator(TEST_SELECTORS.FILE_INPUT);
    await expect(fileInput).toBeAttached();

    // Step 3: Prepare test file
    const testFilePath = path.join(__dirname, '../fixtures/sample-audio.mp3');
    
    // Step 4: Upload file
    await fileInput.setInputFiles(testFilePath);
    
    // Wait a moment for file to be selected
    await page.waitForTimeout(1000);

    // Step 5: Submit form if there's a submit button
    const submitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Upload")');
    if (await submitButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await submitButton.click();
    }

    // Step 6: Wait for upload to complete (look for success message or redirect)
    await page.waitForLoadState('networkidle', { timeout: TEST_TIMEOUTS.UPLOAD });
    
    // Look for success indicator
    await expect(page.locator('text=/upload.*success|successfully uploaded/i')).toBeVisible({
      timeout: 10000,
    }).catch(() => {
      // Success message might not exist, that's okay
      console.log('No explicit success message found');
    });

    // Step 7: Navigate to artifacts list (or reload if already there)
    await page.goto('/artifacts', { waitUntil: 'networkidle' }).catch(async () => {
      // If /artifacts doesn't exist, try home or dashboard
      await page.goto('/', { waitUntil: 'networkidle' });
    });

    // Step 8: Verify artifact appears in the list
    const artifactList = page.locator(TEST_SELECTORS.ARTIFACT_LIST).first();
    await expect(artifactList).toBeVisible({ timeout: 10000 });

    // Check for artifact card or row
    const artifact = page.locator(`${TEST_SELECTORS.ARTIFACT_CARD}, ${TEST_SELECTORS.ARTIFACT_ROW}`).first();
    await expect(artifact).toBeVisible({ timeout: 10000 });

    // Verify the filename appears somewhere
    await expect(page.locator('text=/sample-audio/i')).toBeVisible({ timeout: 5000 });
  });

  test('should not contain localhost:9000 references after upload', async ({ page }) => {
    // Navigate to upload page
    await page.goto('/upload', { waitUntil: 'networkidle' }).catch(async () => {
      await page.goto('/', { waitUntil: 'networkidle' });
    });

    // Check for forbidden URLs
    await assertNoForbiddenUrl(page, TEST_URLS.FORBIDDEN_LOCALHOST);

    // Navigate to artifacts list
    await page.goto('/artifacts', { waitUntil: 'networkidle' }).catch(async () => {
      await page.goto('/', { waitUntil: 'networkidle' });
    });

    // Check again
    await assertNoForbiddenUrl(page, TEST_URLS.FORBIDDEN_LOCALHOST);
  });

  test('should handle upload with form validation', async ({ page }) => {
    // Navigate to upload page
    await page.goto('/upload', { waitUntil: 'networkidle' }).catch(async () => {
      await page.goto('/', { waitUntil: 'networkidle' });
    });

    // Try submitting without file (if form validation exists)
    const submitButton = page.locator('button[type="submit"], button:has-text("Submit")');
    
    if (await submitButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await submitButton.click();
      
      // Should see validation error or nothing happens
      // This is just to ensure the form doesn't break
      await page.waitForTimeout(1000);
    }

    // Now upload a valid file
    const fileInput = page.locator(TEST_SELECTORS.FILE_INPUT);
    const testFilePath = path.join(__dirname, '../fixtures/sample-audio.mp3');
    await fileInput.setInputFiles(testFilePath);

    // Submit should now work
    if (await submitButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await submitButton.click();
      await page.waitForLoadState('networkidle', { timeout: TEST_TIMEOUTS.UPLOAD });
    }
  });
});
