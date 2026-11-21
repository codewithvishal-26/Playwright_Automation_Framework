const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const TD = require('../../tests/utils/testData');
const { LoginPage } = require('../../tests/utils/Loginpage');
const { DashboardPage } = require('../../tests/utils/DashboardPage');
const { CartPage } = require('../../tests/utils/Cartpage');
const { CheckoutPage } = require('../../tests/utils/Checkoutpage');

Given('I log in with email {string} and password {string}', async function (email, password) {
	this.loginPage = new LoginPage(this.page);
	this.dashboardPage = new DashboardPage(this.page);

	await this.loginPage.goTo();
	await this.loginPage.validLogin(email, password);
	await this.page.waitForLoadState('networkidle');
});

When('I search for {string} and add it to the cart', async function (productName) {
	await this.dashboardPage.searchProductAddCart(productName);
});

When('I open the cart', async function () {
	this.cartPage = new CartPage(this.page);
	await this.dashboardPage.goToCart();
});

Then('I should see {string} in the cart', async function (productName) {
	const isInCart = await this.cartPage.verifyProductInCart(productName);
	expect(isInCart).toBeTruthy();
});

When('I proceed to checkout and select {string} as the country', async function (country) {
	await this.cartPage.goToCheckout();
	this.checkoutPage = new CheckoutPage(this.page);
	await this.checkoutPage.selectCountry(country);
});

Then('the checkout email should match {string}', async function (email) {
	const emailMatches = await this.checkoutPage.verifyEmail(email);
	expect(emailMatches).toBeTruthy();
});

When('I place the order', async function () {
	await this.checkoutPage.placeOrder();
});

Then('I should see the order confirmation message {string}', async function (message) {
	const thankYouText = await this.checkoutPage.getThankYouMessage();
	expect(thankYouText).toContain(message);
});

Then('I should see the error message {string}', async function (message) {
	await expect(this.page.getByText(message)).toBeVisible();
});

// Uses the account stored in .env / GitHub Secrets (no password in the feature file)
Given('I log in with the valid client account', async function () {
	this.loginPage = new LoginPage(this.page);
	this.dashboardPage = new DashboardPage(this.page);
	await this.loginPage.goTo();
	await this.loginPage.validLogin(TD.CLIENT_EMAIL, TD.CLIENT_PASSWORD);
	await this.page.waitForLoadState('networkidle');
});

Then('the checkout email should match the logged-in account', async function () {
	const emailMatches = await this.checkoutPage.verifyEmail(TD.CLIENT_EMAIL);
	expect(emailMatches).toBeTruthy();
});
