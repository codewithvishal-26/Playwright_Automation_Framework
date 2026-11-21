const { test, expect, request } = require('@playwright/test');
const TD = require('./utils/testData');
const { ApiUtils } = require('./utils/ApiUtils');

const loginPayLoad = {
  userEmail: TD.CLIENT_EMAIL,
  userPassword: TD.CLIENT_PASSWORD
};

const orderPayLoad = {
  orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }]
};

const fakePayLoadOrders = { data: [], message: "No Orders" };

let response;

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new ApiUtils(apiContext, loginPayLoad);
  response = await apiUtils.createOrder(orderPayLoad);
});

//create order is success
test('@SP Place the order', async ({ page }) => {
  await page.addInitScript(value => {
    window.localStorage.setItem('token', value);
  }, response.token);

  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    async route => {
      const response = await page.request.fetch(route.request());
      let body = JSON.stringify(fakePayLoadOrders);
      route.fulfill({
        response,
        body,
      });
      //intercepting response -API response-> { playwright fakeresponse}->browser->render data on front end
    }
  );

  const ordersResponse = page.waitForResponse(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*"
  );
  await page.goto("https://rahulshettyacademy.com/client/dashboard/myorders");
  await ordersResponse;

  console.log(await page.locator(".mt-4").textContent());
});