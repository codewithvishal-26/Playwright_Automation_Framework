const { test, expect } = require('@playwright/test');
require('dotenv').config();

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';

// ---- Credentials (loaded from .env — never hardcode these) ----
const EMAIL = process.env.EVENTHUB_EMAIL;
const PASSWORD = process.env.EVENTHUB_PASSWORD;

/**
 * Reusable helper — logs into EventHub and confirms success by checking
 * the "Browse Events →" link is visible.
 */
async function loginAndGoToBooking(page) {
  await page.goto(`${BASE_URL}/login`);

  await page.getByPlaceholder('you@email.com').fill(EMAIL);
  await page.getByLabel('Password').fill(PASSWORD);

  await page.locator('#login-btn').click();

  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

/**
 * Fills the booking form fields (Full Name, Email, Phone) and confirms.
 */
async function fillAndConfirmBookingForm(page) {
  await page.getByLabel('Full Name').fill('John Doe');
  await page.locator('#customer-email').fill(EMAIL);
  await page.getByPlaceholder('+91 98765 43210').fill('+91 98765 43210');

  await page.locator('.confirm-booking-btn').click();
}

/**
 * Navigates from the booking confirmation to the booking detail page
 * and validates that Booking Information is visible.
 */
async function goToBookingDetail(page) {
  await page.getByRole('link', { name: 'View My Bookings' }).click();

  await expect(page).toHaveURL(`${BASE_URL}/bookings`);

  await page.getByRole('link', { name: 'View Details' }).first().click();

  await expect(page.getByText('Booking Information')).toBeVisible();
}

async function findEventCardWithSeats(page, minimumSeats) {
  const eventCards = page.locator('[data-testid="event-card"]');
  await expect(eventCards.first()).toBeVisible();

  let selectedCard;
  let maxAvailableSeats = minimumSeats - 1;

  for (let i = 0; i < await eventCards.count(); i++) {
    const card = eventCards.nth(i);
    const seatText = await card.locator('text=/seat/i').innerText();
    const availableSeats = Number(seatText.replace(/\D/g, ''));

    if (availableSeats > maxAvailableSeats) {
      maxAvailableSeats = availableSeats;
      selectedCard = card;
    }
  }

  if (!selectedCard) {
    throw new Error(`No event has at least ${minimumSeats} available seats`);
  }

  return selectedCard;
}

/**
 * Reads booking ref and event title, then validates their first characters match.
 */
async function validateBookingRefMatchesEventTitle(page) {
  const bookingRef = (await page.getByText(/^[A-Z]-[A-Z0-9]+$/).first().innerText()).trim();
  const eventTitle = (await page.locator('h1').innerText()).trim();

  expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));
}

/**
 * Clicks "Check Refund Eligibility", validates the spinner appears and
 * disappears, then returns the #refund-result locator for assertions.
 */
async function checkRefundEligibility(page) {
  await page.getByRole('button', { name: 'Check eligibility for refund?' }).click();

  const spinner = page.locator('#refund-spinner');
  await expect(spinner).toBeVisible();
  await expect(spinner).not.toBeVisible({ timeout: 6000 });

  const result = page.locator('#refund-result');
  await expect(result).toBeVisible();

  return result;
}

test.describe('Refund eligibility based on ticket quantity', () => {

  test('Single ticket booking is eligible for refund', async ({ page }) => {
    // ---------------- Step 1: Login ----------------
    await loginAndGoToBooking(page);

    // ---------------- Step 2: Book first event with 1 ticket (default) ----------------
    await page.goto(`${BASE_URL}/events`);

    const availableEventCard = await findEventCardWithSeats(page, 1);
    await availableEventCard.locator('[data-testid="book-now-btn"]').click();

    await fillAndConfirmBookingForm(page);

    // ---------------- Step 3: Navigate to booking detail ----------------
    await goToBookingDetail(page);

    // ---------------- Step 4: Validate booking ref ----------------
    await validateBookingRefMatchesEventTitle(page);

    // ---------------- Step 5: Check refund eligibility ----------------
    const result = await checkRefundEligibility(page);

    // ---------------- Step 6: Validate result ----------------
    await expect(result).toContainText('Eligible for refund');
    await expect(result).toContainText('Single-ticket bookings qualify for a full refund');
  });

  test('Group ticket booking (3 tickets) is NOT eligible for refund', async ({ page }) => {
    // ---------------- Step 1: Login ----------------
    await loginAndGoToBooking(page);

    // ---------------- Step 2: Book first event, increase quantity to 3 ----------------
    await page.goto(`${BASE_URL}/events`);

    const availableEventCard = await findEventCardWithSeats(page, 3);
    await availableEventCard.locator('[data-testid="book-now-btn"]').click();

    const incrementButton = page.locator('button:has-text("+")');
    await incrementButton.click();
    await expect(page.locator('#ticket-count')).toHaveText('2');
    await incrementButton.click();
    await expect(page.locator('#ticket-count')).toHaveText('3');

    await fillAndConfirmBookingForm(page);

    // ---------------- Step 3: Navigate to booking detail ----------------
    await goToBookingDetail(page);

    // ---------------- Step 4: Validate booking ref ----------------
    await validateBookingRefMatchesEventTitle(page);

    // ---------------- Step 5: Check refund eligibility ----------------
    const result = await checkRefundEligibility(page);

    // ---------------- Step 6: Validate result ----------------
    await expect(result).toContainText('Not eligible for refund');
    await expect(result).toContainText('Group bookings (3 tickets) are non-refundable');
  });

});