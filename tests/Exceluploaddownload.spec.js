const { test, expect } = require('@playwright/test');
const { writeExcelTest } = require('./utils/Excelutils');

test('Upload download excel validation', async ({ page }, testInfo) => {
  const textSearch = 'Mango';
  const updateValue = '350';

  await page.goto('https://rahulshettyacademy.com/upload-download-test/index.html');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();
  const download = await downloadPromise;

  const filePath = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(filePath);
  console.log('Downloaded file saved at:', filePath);

  // Edit the downloaded file: find "Mango", update the cell 2 columns to the right (price)
  await writeExcelTest(textSearch, updateValue, { rowChange: 0, colChange: 2 }, filePath);

  // Upload the modified file back into the page
  await page.locator('#fileinput').setInputFiles(filePath);

  // Verify the page now shows the updated value
  const desiredRow = page.getByRole('row').filter({ has: page.getByText(textSearch) });
  await expect(desiredRow).toContainText(updateValue);
});