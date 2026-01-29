/**
 * Test data and constants for E2E tests
 */

export const TEST_URLS = {
  FORBIDDEN_LOCALHOST: 'localhost:9000',
  FORBIDDEN_PATTERNS: [
    'localhost:9000',
    '127.0.0.1:9000',
    'http://localhost:9000',
  ],
};

export const TEST_TIMEOUTS = {
  DEFAULT: 30000,
  UPLOAD: 60000,
  TRANSCRIPTION: 120000,
  SEARCH: 15000,
};

export const TEST_SELECTORS = {
  // Upload
  UPLOAD_BUTTON: '[data-testid="upload-button"], button:has-text("Upload")',
  FILE_INPUT: 'input[type="file"]',
  UPLOAD_FORM: '[data-testid="upload-form"], form',
  
  // Artifact list/display
  ARTIFACT_LIST: '[data-testid="artifact-list"], [data-testid="artifacts"]',
  ARTIFACT_CARD: '[data-testid="artifact-card"], .artifact-card, [data-artifact-id]',
  ARTIFACT_ROW: '[data-testid="artifact-row"], tr[data-artifact-id]',
  
  // Transcription status
  TRANSCRIPTION_STATUS: '[data-testid="transcription-status"], .transcription-status',
  STATUS_COMPLETE: '[data-status="complete"], .status-complete, :has-text("Complete")',
  STATUS_PROCESSING: '[data-status="processing"], .status-processing, :has-text("Processing")',
  
  // Search
  SEARCH_INPUT: 'input[type="search"], input[placeholder*="Search"], input[name="search"]',
  SEARCH_BUTTON: '[data-testid="search-button"], button:has-text("Search")',
  SEARCH_RESULTS: '[data-testid="search-results"], .search-results, [role="list"]',
  RESULT_ITEM: '[data-testid="result-item"], .result-item, [role="listitem"]',
};

export const TEST_MESSAGES = {
  UPLOAD_SUCCESS: /uploaded successfully|upload complete/i,
  TRANSCRIPTION_COMPLETE: /transcription complete|transcription done|finished/i,
  TRANSCRIPTION_PROCESSING: /processing|transcribing/i,
  SEARCH_NO_RESULTS: /no results|no matches found/i,
};

/**
 * Generate test artifact data
 */
export function generateTestArtifact(overrides?: Partial<TestArtifact>): TestArtifact {
  const timestamp = Date.now();
  return {
    name: `test-artifact-${timestamp}`,
    description: 'E2E test artifact',
    type: 'audio',
    searchTerm: 'test',
    ...overrides,
  };
}

export interface TestArtifact {
  name: string;
  description: string;
  type: string;
  searchTerm: string;
}
