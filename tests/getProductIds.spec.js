const { test, expect, request } = require('@playwright/test');
const TD = require('./utils/testData');

test('Get product IDs', async () => {
  const apiContext = await request.newContext();

  try {
    const loginResponse = await apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/auth/login",
      {
        data: {
          userEmail: TD.CLIENT_EMAIL,
          userPassword: TD.CLIENT_PASSWORD
        }
      }
    );
    expect(loginResponse.ok(), 'API login should succeed').toBeTruthy();

    const { token } = await loginResponse.json();
    expect(token, 'API login should return an authorization token').toBeTruthy();

    const productsResponse = await apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/product/get-all-products",
      {
        data: {},
        headers: { 'Authorization': token }
      }
    );
    expect(productsResponse.ok(), `Product API returned HTTP ${productsResponse.status()}`).toBeTruthy();

    const productsJson = await productsResponse.json();
    expect(Array.isArray(productsJson.data), 'Product API should return a data array').toBeTruthy();
    expect(productsJson.data.length).toBeGreaterThan(0);

    productsJson.data.forEach(p => console.log(p.productName, '->', p._id));
  } finally {
    await apiContext.dispose();
  }
});