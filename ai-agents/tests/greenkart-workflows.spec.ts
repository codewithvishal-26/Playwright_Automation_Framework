import { expect, test } from '@playwright/test';

const homeUrl = 'https://rahulshettyacademy.com/seleniumPractise/#/';
const offersUrl = 'https://rahulshettyacademy.com/seleniumPractise/#/offers';

async function addToCart(page: import('@playwright/test').Page, productIndex = 0) {
  await page.getByRole('button', { name: 'ADD TO CART' }).nth(productIndex).click();
}

async function addProductByName(page: import('@playwright/test').Page, productName: string) {
  const product = page
    .getByRole('heading', { name: productName, exact: true })
    .locator('xpath=ancestor::div[.//button[normalize-space()="ADD TO CART"]][1]');
  await product.getByRole('button', { name: 'ADD TO CART' }).click();
}

async function openCheckout(page: import('@playwright/test').Page) {
  await page.getByRole('link', { name: 'Cart' }).click();
  await page.getByRole('button', { name: 'PROCEED TO CHECKOUT' }).click();
}

test.describe('GreenKart E-commerce Workflows', () => {
  test('1.1 adds a product with an adjusted quantity and verifies totals', async ({ page }) => {
    await page.goto(homeUrl);
    const quantity = page.getByRole('spinbutton').first();
    await page.getByRole('link', { name: '+' }).first().click();
    await page.getByRole('link', { name: '+' }).first().click();
    await page.getByRole('link', { name: '–' }).first().click();
    await expect(quantity).toHaveValue('2');
    await addToCart(page);

    await expect(page.getByRole('row', { name: /Items : 1/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /Price : 240/ })).toBeVisible();
    await openCheckout(page);
    await expect(page.getByRole('row', { name: /Brocolli - 1 Kg 2 120 240/ })).toBeVisible();
    await expect(page.getByText('Total After Discount : 240')).toBeVisible();
  });

  test('1.2 calculates totals for different products', async ({ page }) => {
    await page.goto(homeUrl);
    await addProductByName(page, 'Brocolli - 1 Kg');
    await addProductByName(page, 'Cucumber - 1 Kg');

    await expect(page.getByRole('row', { name: /Items : 2/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /Price : 168/ })).toBeVisible();
    await openCheckout(page);
    await expect(page.getByRole('row', { name: /Brocolli - 1 Kg 1 120 120/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /Cucumber - 1 Kg 1 48 48/ })).toBeVisible();
    await expect(page.getByText('Total After Discount : 168')).toBeVisible();
  });

  test('2.1 rejects an invalid promo code without changing the order total', async ({ page }) => {
    await page.goto(homeUrl);
    await addToCart(page);
    await openCheckout(page);

    await page.getByRole('textbox', { name: 'Enter promo code' }).fill('INVALID123');
    await page.getByRole('button', { name: 'Apply' }).click();
    await expect(page.getByText('Invalid code ..!', { exact: true })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Discount : 0%')).toBeVisible();
    await expect(page.getByText('Total After Discount : 120')).toBeVisible();
    await expect(page.getByRole('row', { name: /Brocolli - 1 Kg 1 120 120/ })).toBeVisible();
  });

  test('2.2 completes checkout after selecting country and accepting terms', async ({ page }) => {
    await page.goto(homeUrl);
    await addToCart(page);
    await openCheckout(page);
    await page.getByRole('button', { name: 'Place Order' }).click();

    await page.getByRole('combobox').selectOption({ label: 'India' });
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Proceed' }).click();
    await expect(page.getByText(/Thank you, your order has been placed successfully/)).toBeVisible();
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page.getByRole('heading', { name: 'Brocolli - 1 Kg' })).toBeVisible();
  });

  test('2.3 does not complete checkout with required fields missing', async ({ page }) => {
    await page.goto(homeUrl);
    await addToCart(page);
    await openCheckout(page);
    await page.getByRole('button', { name: 'Place Order' }).click();

    await page.getByRole('button', { name: 'Proceed' }).click();
    await expect(page).toHaveURL(/#\/country$/);
    await expect(page.getByText(/Thank you, your order has been placed successfully/)).toHaveCount(0);
  });

  test('3.1 filters offers and changes the visible page size', async ({ page }) => {
    await page.goto(offersUrl);
    await expect(page.getByRole('columnheader', { name: /Veg\/fruit name/ })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Discount price/ })).toBeVisible();

    const search = page.getByRole('searchbox', { name: 'Search:' });
    await search.fill('Wheat');
    await expect(page.getByRole('row', { name: 'Wheat 67 28' })).toBeVisible();
    await expect(page.getByRole('row', { name: /Tomato/ })).toHaveCount(0);

    await search.clear();
    await page.getByRole('combobox', { name: 'Page size:' }).selectOption('10');
    await expect(page.getByRole('row')).toHaveCount(11);
  });

  test('3.2 sorts offers and navigates between pages', async ({ page }) => {
    await page.goto(offersUrl);
    const rows = page.getByRole('row');

    await page.getByRole('columnheader', { name: /Price/ }).click();
    const prices = await rows.evaluateAll((elements) =>
      elements.slice(1).map((row) => Number(row.querySelectorAll('td')[1]?.textContent?.trim())),
    );
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    const sortedFirstPageFirstCell = await rows.nth(1).getByRole('cell').first().innerText();

    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('button', { name: 'Previous' })).toBeEnabled();
    await page.getByRole('button', { name: 'Previous' }).click();
    await expect(rows.nth(1).getByRole('cell').first()).toHaveText(sortedFirstPageFirstCell);
  });
});
