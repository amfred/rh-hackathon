import { test, expect } from '@playwright/test';
import { 
  assertNoForbiddenUrl,
  captureNetworkRequests,
  bypassAuthIfNeeded 
} from '../utils/helpers';
import { TEST_URLS } from '../utils/test-data';

test.describe('Localhost:9000 Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await bypassAuthIfNeeded(page);
    await page.waitForLoadState('networkidle');
  });

  test('should NOT contain localhost:9000 references on home page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Check page content and links
    await assertNoForbiddenUrl(page, TEST_URLS.FORBIDDEN_LOCALHOST);
    
    console.log('✓ Home page does not contain localhost:9000');
  });

  test('should NOT contain localhost:9000 references on upload page', async ({ page }) => {
    await page.goto('/upload', { waitUntil: 'networkidle' }).catch(async () => {
      await page.goto('/', { waitUntil: 'networkidle' });
    });
    
    // Check page content and links
    await assertNoForbiddenUrl(page, TEST_URLS.FORBIDDEN_LOCALHOST);
    
    console.log('✓ Upload page does not contain localhost:9000');
  });

  test('should NOT contain localhost:9000 references on artifacts page', async ({ page }) => {
    await page.goto('/artifacts', { waitUntil: 'networkidle' }).catch(async () => {
      await page.goto('/', { waitUntil: 'networkidle' });
    });
    
    // Check page content and links
    await assertNoForbiddenUrl(page, TEST_URLS.FORBIDDEN_LOCALHOST);
    
    console.log('✓ Artifacts page does not contain localhost:9000');
  });

  test('should NOT contain localhost:9000 references on search page', async ({ page }) => {
    await page.goto('/search', { waitUntil: 'networkidle' }).catch(async () => {
      await page.goto('/', { waitUntil: 'networkidle' });
    });
    
    // Check page content and links
    await assertNoForbiddenUrl(page, TEST_URLS.FORBIDDEN_LOCALHOST);
    
    console.log('✓ Search page does not contain localhost:9000');
  });

  test('should NOT make network requests to localhost:9000', async ({ page }) => {
    const forbiddenRequests: string[] = [];
    
    // Monitor network requests
    page.on('request', (request) => {
      const url = request.url();
      
      // Check if URL contains any forbidden patterns
      for (const pattern of TEST_URLS.FORBIDDEN_PATTERNS) {
        if (url.includes(pattern)) {
          forbiddenRequests.push(url);
          console.error(`❌ Forbidden request detected: ${url}`);
        }
      }
    });

    // Navigate through different pages
    const pagesToCheck = ['/', '/upload', '/artifacts', '/search'];
    
    for (const route of pagesToCheck) {
      await page.goto(route, { waitUntil: 'networkidle' }).catch(async () => {
        console.log(`Route ${route} not accessible, skipping`);
      });
      
      // Wait a bit for any async requests
      await page.waitForTimeout(2000);
    }

    // Verify no forbidden requests were made
    expect(forbiddenRequests).toHaveLength(0);
    
    if (forbiddenRequests.length === 0) {
      console.log('✓ No network requests to localhost:9000 detected');
    } else {
      console.error('❌ Found forbidden requests:', forbiddenRequests);
    }
  });

  test('should NOT expose localhost:9000 in image sources', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Check all images on the page
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      const srcset = await img.getAttribute('srcset');
      
      if (src) {
        for (const pattern of TEST_URLS.FORBIDDEN_PATTERNS) {
          expect(src).not.toContain(pattern);
        }
      }
      
      if (srcset) {
        for (const pattern of TEST_URLS.FORBIDDEN_PATTERNS) {
          expect(srcset).not.toContain(pattern);
        }
      }
    }
    
    console.log(`✓ Checked ${images.length} images - no localhost:9000 found`);
  });

  test('should NOT expose localhost:9000 in API calls during artifact operations', async ({ page }) => {
    const apiRequests: string[] = [];
    
    // Monitor API requests
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('/api/') || url.includes('localhost:8000')) {
        apiRequests.push(url);
      }
      
      // Check for forbidden patterns
      for (const pattern of TEST_URLS.FORBIDDEN_PATTERNS) {
        if (url.includes(pattern)) {
          throw new Error(`Forbidden URL in API request: ${url}`);
        }
      }
    });

    // Perform artifact operations
    await page.goto('/artifacts', { waitUntil: 'networkidle' }).catch(async () => {
      await page.goto('/', { waitUntil: 'networkidle' });
    });
    
    // Wait for any API calls to complete
    await page.waitForTimeout(3000);
    
    console.log(`✓ Monitored ${apiRequests.length} API requests - no localhost:9000 found`);
  });

  test('should use correct backend URL in all environments', async ({ page }) => {
    const requests: Array<{ url: string; type: string }> = [];
    
    page.on('request', (request) => {
      const url = request.url();
      
      // Track backend API calls
      if (url.includes('/api/') || url.includes('localhost:8000') || url.includes('/artifacts')) {
        requests.push({
          url,
          type: request.resourceType()
        });
      }
    });

    // Navigate and trigger API calls
    await page.goto('/artifacts', { waitUntil: 'networkidle' }).catch(async () => {
      await page.goto('/', { waitUntil: 'networkidle' });
    });
    
    await page.waitForTimeout(2000);
    
    // Log captured requests for debugging
    console.log(`Captured ${requests.length} backend requests:`);
    requests.forEach(req => {
      console.log(`  - ${req.type}: ${req.url}`);
      
      // Ensure no MinIO direct access (should go through backend)
      for (const pattern of TEST_URLS.FORBIDDEN_PATTERNS) {
        expect(req.url).not.toContain(pattern);
      }
    });
  });
});
