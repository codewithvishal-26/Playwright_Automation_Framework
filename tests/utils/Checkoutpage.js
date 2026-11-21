const { expect } = require('@playwright/test');

class CheckoutPage
{

constructor(page)
{
    this.page = page;
    this.countryInput = page.getByPlaceholder('Select Country');
    this.countryDropdownResults = page.locator(".ta-results");
    this.emailField = page.locator(".user__name [type='text']").first();
    this.placeOrderButton = page.locator(".action__submit");
    this.thankYouMessage = page.locator(".hero-primary");
}

async selectCountry(countryName)
{
    await this.countryInput.pressSequentially(countryName.slice(0, 3), { delay: 150 });
    await this.countryDropdownResults.waitFor();

    const options = this.countryDropdownResults.locator("button");
    const optionsCount = await options.count();

    for (let i = 0; i < optionsCount; ++i)
    {
        const text = await options.nth(i).textContent();
        if (text?.trim() === countryName)
        {
            await options.nth(i).focus();
            await options.nth(i).press('Enter');
            break;
        }
    }

    await expect(this.countryInput).toHaveValue(countryName);
}

async verifyEmail(expectedEmail)
{
    const actualEmail = await this.emailField.textContent();
    return actualEmail.trim() === expectedEmail.trim();
}

async placeOrder()
{
    const box = await this.placeOrderButton.boundingBox();
    const viewport = this.page.viewportSize();

    // The practice app's fixed-width checkout can place this link beyond mobile viewports.
    if (box && viewport && (box.x < 0 || box.x + box.width > viewport.width)) {
        await this.placeOrderButton.evaluate(element => element.click());
        return;
    }

    await this.placeOrderButton.click();
}

async getThankYouMessage()
{
    return await this.thankYouMessage.textContent();
}

}

module.exports = { CheckoutPage };