import { expect, test } from '@playwright/test';

test('seed: GreenKart catalog is available', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');

  await expect(page.getByRole('heading', { name: 'Brocolli - 1 Kg' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Cart' })).toBeVisible();
  await expect(page.getByRole('row', { name: /Items : 0/ })).toBeVisible();
});
