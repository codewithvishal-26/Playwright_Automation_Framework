const { test, expect } = require('@playwright/test')

test("Popup validations", async ({ page }, testInfo) => {

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    // await page.goto("https://google.com");
    // await page.goBack();
    // await page.goForward();

    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").focus();
    await page.locator("#hide-textbox").press("Enter");
    await expect(page.locator("#displayed-text")).toBeHidden();
    // await page.pause();
    page.on('dialog', dialog => dialog.accept());
    await page.locator("#confirmbtn").focus();
    await page.locator("#confirmbtn").press("Enter");
    if (testInfo.project.name !== 'Mobile Chrome') {
        await page.locator("#mousehover").hover();
        await page.locator("#mousehover").hover();
        const framesPage = page.frameLocator("#courses-iframe");
        await framesPage.locator("li a[href*='lifetime-access']:visible").click();
        const textCheck = await framesPage.locator(".text h2").textContent();
        console.log(textCheck.split(" ")[1]);
    }


})