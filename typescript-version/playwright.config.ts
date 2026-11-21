import { defineConfig, devices } from '@playwright/test';

// TypeScript version of the framework (same tests, typed page objects).
// Run from repo root:  npx playwright test -c typescript-version/playwright.config.ts
export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  reporter: [['html', { open: 'never' }]],
  use: { screenshot: 'only-on-failure', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
