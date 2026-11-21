class DashboardPage
{

constructor(page)
{
    this.page = page;
    this.products = page.locator(".card-body");
    this.productsText = page.locator(".card-body b");
}

async searchProductAddCart(productName)
{
    const titles = await this.productsText.allTextContents();
    console.log(titles);

    const count = await this.products.count();
    for (let i = 0; i < count; ++i)
    {
        if (await this.products.nth(i).locator("b").textContent() === productName)
        {
            //add to cart
            const addToCartResponse = this.page.waitForResponse(response =>
                response.url().includes('/api/ecom/user/add-to-cart') && response.ok()
            );
            await this.products.nth(i).locator("text=Add To Cart").click();
            await addToCartResponse;
            break;
        }
    }
}

async goToCart()
{
    await this.page.goto("https://rahulshettyacademy.com/client/dashboard/cart");
}

}

module.exports = { DashboardPage };