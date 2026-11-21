import 'dotenv/config';
const TD = { CLIENT_EMAIL: process.env.CLIENT_EMAIL as string, CLIENT_PASSWORD: process.env.CLIENT_PASSWORD as string };
import { test, expect } from '@playwright/test';
import { LoginPage } from './PageObject/Loginpage';

test('Client App login using Page Object Model', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goTo();
  await loginPage.validLogin(TD.CLIENT_EMAIL, TD.CLIENT_PASSWORD);

  await page.waitForLoadState('networkidle');

  const products = page.locator('.card-body');
  await expect(products.first()).toBeVisible();
});