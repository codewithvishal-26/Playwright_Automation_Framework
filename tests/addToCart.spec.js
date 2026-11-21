const { test, expect } = require('@playwright/test');
const { CheckoutPage } = require('./utils/Checkoutpage');
const { registerTestAccount } = require('./utils/registerTestAccount');


test('@Webst Client App login', async ({ page }) => {
    const { email, password } = await registerTestAccount(page);
    const productName = 'ZARA COAT 3';
    const products = page.locator(".card-body");

    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill(password);
    await page.locator("[value='Login']").click();
    await page.locator(".card-body b").first().waitFor();
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);

    const count = await products.count();
    for (let i = 0; i < count; ++i) {
        if ((await products.nth(i).locator("b").textContent())?.trim() === productName) {
            const addToCartResponse = page.waitForResponse(response =>
                response.url().includes('/api/ecom/user/add-to-cart') && response.ok()
            );
            await products.nth(i).getByRole('button', { name: 'Add To Cart' }).click();
            await addToCartResponse;
            break;
        }
    }

    await page.goto("https://rahulshettyacademy.com/client/dashboard/cart");
    await expect(page.getByRole('heading', { name: productName, exact: true }).first()).toBeVisible();

    await page.locator("text=Checkout").click();
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.selectCountry('India');
    await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await checkoutPage.placeOrder();
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderId);

    // ---- NEW ORDER VERIFICATION BLOCK STARTS HERE ----
    await page.goto("https://rahulshettyacademy.com/client/dashboard/myorders");
    await page.locator("table tbody").waitFor();

    const rows = page.locator("table tbody tr");
    const rowCount = await rows.count();
    let matched = false;

    for (let i = 0; i < rowCount; ++i) {
        const rowOrderId = (await rows.nth(i).locator("th").textContent())?.trim();

        if (orderId.includes(rowOrderId)) {
            matched = true;

            const rowProductName = (await rows.nth(i).locator("td").nth(1).textContent())?.trim();
            console.log("Order row product name:", rowProductName);
            expect(rowProductName).toBe(productName);

            await rows.nth(i).getByRole('button', { name: 'View' }).click();
            break;
        }
    }

    expect(matched).toBeTruthy();

    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails.trim())).toBeTruthy();
    // ---- NEW ORDER VERIFICATION BLOCK ENDS HERE ----
});