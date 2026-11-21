// @ts-check
require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  reporter: [['html'], ['allure-playwright']],
  retries: 2,

  /* Shared settings for all the projects below. */
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    // slow motion only on your machine; CI runs at full speed
    slowMo: process.env.CI ? 0 : 1000,
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
  },

  /* Run the same tests against multiple browser/device configurations */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});