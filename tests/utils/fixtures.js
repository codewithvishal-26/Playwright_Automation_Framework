const base = require("@playwright/test");
const TD = require('./testData');

exports.customTest = base.test.extend({
   authenticatePage: async ({ page }, use) => {
      const email = TD.CLIENT_EMAIL;
      const password = TD.CLIENT_PASSWORD;

      await page.goto("https://rahulshettyacademy.com/client");
      await page.locator("#userEmail").fill(email);
      await page.locator("#userPassword").fill(password);
      await page.locator("[value='Login']").click();
      await page.waitForLoadState("networkidle");
      await use(page);
   },
});