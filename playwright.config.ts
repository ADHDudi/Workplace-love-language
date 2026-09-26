import { defineConfig, devices } from '@playwright/test';

// Set by scripts/e2e.mjs (`npm run test:e2e`); defaults to the local dev server.
const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';
const isLocal = baseURL.startsWith('http://localhost');

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['html', { open: 'always' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Reuse the already running dev server on port 3000; no server needed for a deployed environment
  webServer: isLocal ? {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 10 * 1000,
  } : undefined,
});
