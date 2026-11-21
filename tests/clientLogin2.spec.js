const { test, expect } = require('@playwright/test');
// Throwaway password for users registered on the practice site (each run creates a new random user)
const NEW_USER_PASSWORD = process.env.NEW_USER_PASSWORD || `Pw@${Date.now()}`;

test.describe.serial('Register then login and add product', () => {
    let registeredEmail;

    test('Register new user', async ({ page }) => {
        registeredEmail = `testuser${Date.now()}@test.com`;
        console.log("REGISTERED EMAIL:", registeredEmail);

        await page.goto("https://rahulshettyacademy.com/client/#/auth/register");

        await page.getByPlaceholder("First Name").fill("Vishal");
        await page.getByPlaceholder("Last Name").fill("Chandrabanshi");
        await page.getByPlaceholder("email@example.com").fill(registeredEmail);
        await page.getByPlaceholder("enter your number").fill("9876543210");

        await page
            .locator("select[formcontrolname='occupation']")
            .selectOption({ label: "Engineer" });

        await page
            .locator("input[formcontrolname='gender'][value='Male']")
            .check();

        await page
            .getByPlaceholder("Passsword", { exact: true })
            .fill(NEW_USER_PASSWORD);

        await page
            .getByPlaceholder("Confirm Passsword")
            .fill(NEW_USER_PASSWORD);

        await page.locator("input[type='checkbox']").check();

        await page.getByRole('button', { name: 'Register' }).click();

        await expect(
            page.getByRole('heading', { name: 'Account Created Successfully' })
        ).toBeVisible();
    });

    test('Login and add product to cart', async ({ page }) => {
        const productName = 'ZARA COAT 3';

        await page.goto("https://rahulshettyacademy.com/client/#/auth/login");

        await page.locator("#userEmail").fill(registeredEmail);
        await page.locator("#userPassword").fill(NEW_USER_PASSWORD);
        await page.locator("input[value='Login']").click();

        await expect(page).toHaveURL(/dashboard/);

        const productCard = page
            .locator(".card-body")
            .filter({ hasText: productName });

        await expect(productCard).toBeVisible();

        await productCard
            .getByRole('button', { name: 'Add To Cart' })
            .click();

        console.log(`${productName} added to cart`);
    });
});