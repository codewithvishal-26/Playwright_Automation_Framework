const { expect } = require('@playwright/test');

async function registerTestAccount(page) {
    const suffix = `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
    const email = `playwright-${suffix}@example.com`;
    const password = `Pw@${suffix}Aa1`;

    await page.goto('https://rahulshettyacademy.com/client/#/auth/register');
    await page.getByPlaceholder('First Name').fill('Playwright');
    await page.getByPlaceholder('Last Name').fill('Test');
    await page.getByPlaceholder('email@example.com').fill(email);
    await page.getByPlaceholder('enter your number').fill('9876543210');
    await page.locator("select[formcontrolname='occupation']").selectOption({ label: 'Engineer' });
    await page.locator("input[formcontrolname='gender'][value='Male']").check();
    await page.getByPlaceholder('Passsword', { exact: true }).fill(password);
    await page.getByPlaceholder('Confirm Passsword').fill(password);
    await page.locator("input[type='checkbox']").check();
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByRole('heading', { name: 'Account Created Successfully' })).toBeVisible();

    return { email, password };
}

module.exports = { registerTestAccount };
