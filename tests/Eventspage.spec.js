const { test, expect } = require('@playwright/test');

test('redirects unauthenticated visitors from events to sign-in', async ({ page }) => {
  await page.goto('https://eventhub.rahulshettyacademy.com/events');

  await expect(page).toHaveURL(/\/login(?:\?.*)?$/);
  await expect(page.getByRole('heading', { name: 'Sign in to EventHub' })).toBeVisible();
});