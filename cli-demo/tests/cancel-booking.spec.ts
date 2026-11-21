import { test, expect } from '@playwright/test';

const baseURL = 'https://eventhub.rahulshettyacademy.com';
const username = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASSWORD;

test('cancel a confirmed booking and verify it is removed from the list', async ({ page }) => {
  test.skip(!username || !password, 'Set TEST_USER_EMAIL and TEST_USER_PASSWORD to run the booking cancellation flow.');

  await page.goto(`${baseURL}/login`);
  await page.getByPlaceholder(/email/i).or(page.getByLabel(/email/i)).first().fill(username ?? '');
  await page.getByPlaceholder(/password/i).or(page.getByLabel(/password/i)).first().fill(password ?? '');
  await page.getByRole('button', { name: /log\s*in|sign\s*in/i }).click();
  await expect(page).not.toHaveURL(/login/);

  // Precondition: the account must already contain at least one confirmed booking.
  await page.goto(`${baseURL}/bookings`);
  const bookingLinks = page.locator('a[href^="/bookings/"]');
  await expect(bookingLinks.first(), 'Create a confirmed booking before running this destructive test.').toBeVisible();

  const href = await bookingLinks.first().getAttribute('href');
  const bookingId = href?.split('/').pop();
  expect(bookingId, 'A booking link should contain a booking ID.').toBeTruthy();

  await page.goto(`${baseURL}/bookings/${bookingId}`);
  await expect(page).toHaveURL(new RegExp(`/bookings/${bookingId}$`));

  await page.getByRole('button', { name: 'Cancel Booking' }).click();
  await page.getByRole('button', { name: 'Yes, cancel it' }).click();

  await expect(page.getByText('Booking cancelled successfully')).toBeVisible();
  await expect(page).toHaveURL(`${baseURL}/bookings`);
  await expect(page.locator(`a[href="/bookings/${bookingId}"]`)).toHaveCount(0);
});
