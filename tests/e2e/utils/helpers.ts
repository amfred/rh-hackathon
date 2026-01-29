import { Page, expect } from '@playwright/test';

/**
 * Poll for a condition to be true with a maximum timeout
 * @param condition - Function that returns true when condition is met
 * @param timeout - Maximum time to wait in milliseconds
 * @param interval - Time between checks in milliseconds
 */
export async function waitForCondition(
  condition: () => Promise<boolean>,
  timeout: number = 30000,
  interval: number = 1000
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Wait for an element to be visible and return it
 * @param page - Playwright page object
 * @param selector - CSS selector or text selector
 * @param timeout - Maximum time to wait in milliseconds
 */
export async function waitForElement(
  page: Page,
  selector: string,
  timeout: number = 15000
) {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible', timeout });
  return element;
}

/**
 * Check if any network requests or page content contains a forbidden URL
 * @param page - Playwright page object
 * @param forbiddenUrl - URL pattern to check for
 */
export async function assertNoForbiddenUrl(
  page: Page,
  forbiddenUrl: string
): Promise<void> {
  // Check page content
  const content = await page.content();
  if (content.includes(forbiddenUrl)) {
    throw new Error(`Page content contains forbidden URL: ${forbiddenUrl}`);
  }
  
  // Check all links on the page
  const links = await page.locator('a').all();
  for (const link of links) {
    const href = await link.getAttribute('href');
    if (href && href.includes(forbiddenUrl)) {
      throw new Error(`Link contains forbidden URL: ${forbiddenUrl} (href: ${href})`);
    }
  }
}

/**
 * Upload a file using a file input
 * @param page - Playwright page object
 * @param fileInputSelector - Selector for the file input element
 * @param filePath - Path to the file to upload
 */
export async function uploadFile(
  page: Page,
  fileInputSelector: string,
  filePath: string
): Promise<void> {
  const fileInput = page.locator(fileInputSelector);
  await fileInput.setInputFiles(filePath);
}

/**
 * Wait for transcription to complete
 * @param page - Playwright page object
 * @param maxWaitTime - Maximum time to wait in milliseconds
 */
export async function waitForTranscriptionComplete(
  page: Page,
  maxWaitTime: number = 120000
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    // Look for transcription status indicators
    const statusText = await page.textContent('body');
    
    if (statusText?.includes('Complete') || 
        statusText?.includes('Done') || 
        statusText?.includes('Finished')) {
      return;
    }
    
    if (statusText?.includes('Failed') || statusText?.includes('Error')) {
      throw new Error('Transcription failed');
    }
    
    // Wait before checking again
    await page.waitForTimeout(2000);
    
    // Refresh or poll for updates
    await page.reload({ waitUntil: 'networkidle' });
  }
  
  throw new Error(`Transcription did not complete within ${maxWaitTime}ms`);
}

/**
 * Search for a term and wait for results
 * @param page - Playwright page object
 * @param searchTerm - Term to search for
 */
export async function searchAndWaitForResults(
  page: Page,
  searchTerm: string
): Promise<void> {
  // Find search input (adjust selector based on actual implementation)
  const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input[name="search"]').first();
  await searchInput.fill(searchTerm);
  
  // Submit search (press Enter or click search button)
  await searchInput.press('Enter');
  
  // Wait for results to load
  await page.waitForLoadState('networkidle');
  
  // Wait for results container to appear
  await page.waitForSelector('[data-testid="search-results"], .search-results, [role="list"]', {
    timeout: 10000
  });
}

/**
 * Get network requests that match a pattern
 * @param page - Playwright page object
 * @param pattern - URL pattern to match
 */
export async function captureNetworkRequests(
  page: Page,
  pattern: string | RegExp
): Promise<string[]> {
  const matchedUrls: string[] = [];
  
  page.on('request', (request) => {
    const url = request.url();
    if (typeof pattern === 'string' ? url.includes(pattern) : pattern.test(url)) {
      matchedUrls.push(url);
    }
  });
  
  return matchedUrls;
}

/**
 * Bypass authentication if test mode is enabled
 * @param page - Playwright page object
 */
export async function bypassAuthIfNeeded(page: Page): Promise<void> {
  // Check if auth bypass is available (dev mode)
  const bodyText = await page.textContent('body');
  
  if (bodyText?.includes('dev') || bodyText?.includes('bypass')) {
    // Click bypass button if available
    const bypassButton = page.locator('button:has-text("Bypass"), button:has-text("Dev")').first();
    if (await bypassButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bypassButton.click();
      await page.waitForLoadState('networkidle');
    }
  }
}
