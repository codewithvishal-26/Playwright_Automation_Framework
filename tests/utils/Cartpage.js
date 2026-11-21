class CartPage
{

constructor(page)
{
    this.page = page;
    this.checkoutButton = page.locator("text=Checkout");
}

async verifyProductInCart(productName)
{
    const productHeading = this.page.getByRole('heading', { name: productName, exact: true }).first();
    await productHeading.waitFor({ state: 'visible' });
    return productHeading.isVisible();
}

async goToCheckout()
{
    await this.checkoutButton.click();
}

}

module.exports = { CartPage };