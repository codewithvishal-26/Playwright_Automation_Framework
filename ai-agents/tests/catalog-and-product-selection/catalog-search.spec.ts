import { expect, test } from '@playwright/test';

const homeUrl = 'https://rahulshettyacademy.com/seleniumPractise/#/';

test.describe('Catalog and Product Selection', () => {
  test('Search for a product and restore the catalog', async ({ page }) => {
    // 1. Open the home page in a fresh browser context.
    await page.goto(homeUrl);

    const search = page.getByRole('searchbox', { name: 'Search for Vegetables and Fruits' });
    const productHeadings = page.getByRole('heading', { level: 4 });
    const initialProductCount = await productHeadings.count();

    await expect(search).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cart' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Top Deals' })).toBeVisible();
    await expect(page.getByRole('row', { name: /Items : 0/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /Price : 0/ })).toBeVisible();
    expect(initialProductCount).toBeGreaterThan(1);

    // 2. Enter Brocolli in the catalog search box.
    await search.fill('Brocolli');

    await expect(page.getByRole('heading', { name: 'Brocolli - 1 Kg' })).toBeVisible();
    await expect(productHeadings).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Cucumber - 1 Kg' })).toHaveCount(0);

    // 3. Clear the search input.
    await search.clear();

    await expect(search).toHaveValue('');
    await expect(productHeadings).toHaveCount(initialProductCount);
  });
});
