const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./utils/Loginpage');
const { DashboardPage } = require('./utils/DashboardPage');
const { CartPage } = require('./utils/Cartpage');
const { CheckoutPage } = require('./utils/Checkoutpage');
const { registerTestAccount } = require('./utils/registerTestAccount');

test('Client App full checkout flow using Page Object Model', async ({ page }) => {
    const { email, password } = await registerTestAccount(page);
    const productName = 'ZARA COAT 3';

    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // ---- Login ----
    await loginPage.goTo();
    await loginPage.validLogin(email, password);
    await page.locator('.card-body b').first().waitFor();

    // ---- Search product and add to cart ----
    await dashboardPage.searchProductAddCart(productName);

    // ---- Go to cart and verify product ----
    await dashboardPage.goToCart();
    const isInCart = await cartPage.verifyProductInCart(productName);
    expect(isInCart).toBeTruthy();

    // ---- Checkout ----
    await cartPage.goToCheckout();
    await checkoutPage.selectCountry('India');

    const emailMatches = await checkoutPage.verifyEmail(email);
    expect(emailMatches).toBeTruthy();

    await checkoutPage.placeOrder();

    const thankYouText = await checkoutPage.getThankYouMessage();
    expect(thankYouText).toContain('Thankyou for the order');
});