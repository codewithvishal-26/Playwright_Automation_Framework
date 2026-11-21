import 'dotenv/config';
const TD = { CLIENT_EMAIL: process.env.CLIENT_EMAIL as string, CLIENT_PASSWORD: process.env.CLIENT_PASSWORD as string };
import { test as base, Page } from '@playwright/test';

export const customTest = base.extend<{ authenticatePage: Page }>({
  authenticatePage: async ({ page }, use) => {
    const email = TD.CLIENT_EMAIL;
    const password = TD.CLIENT_PASSWORD;

    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill(password);
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');

    await use(page);
  },
});