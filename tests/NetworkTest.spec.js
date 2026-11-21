const { test, expect } = require('@playwright/test');
const TD = require('./utils/testData');

test('@QW Security test request intercept', async ({ page }) => {

  // login and reach orders page
  await page.goto("https://rahulshettyacademy.com/client", { waitUntil: 'domcontentloaded' });
  await page.locator("#userEmail").fill(TD.CLIENT_EMAIL);
  await page.locator("#userPassword").type(TD.CLIENT_PASSWORD);
  await page.locator("[value='Login']").click();
  await page.locator(".card-body b").first().waitFor();

  await page.goto("https://rahulshettyacademy.com/client/dashboard/myorders");

  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    route => route.continue({
      url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=REPLACE_WITH_ANOTHER_USERS_ORDER_ID'
    })
  );

  await page.locator("button:has-text('View')").first().click();

  await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
});