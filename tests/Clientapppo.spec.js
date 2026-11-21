const { test, expect } = require('@playwright/test');
const TD = require('./utils/testData');
const { LoginPage } = require('./utils/Loginpage');

test('Client App login using Page Object Model', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goTo();
    await loginPage.validLogin(TD.CLIENT_EMAIL, TD.CLIENT_PASSWORD);

    await page.waitForLoadState('networkidle');

    const products = page.locator(".card-body");
    await expect(products.first()).toBeVisible();
});