# GreenKart Selenium Practise Test Plan

## Application Overview

Browser-based test plan for the GreenKart produce storefront at https://rahulshettyacademy.com/seleniumPractise/#/. The explored application is a client-routed shopping SPA with a produce catalog, product quantity controls, search, cart and checkout, promo-code validation, country/terms order completion, and a Top Deals table with search, sorting, page size, pagination, and a delivery-date control. The plan focuses on observable UI behavior; there is no login flow. Start each test from the direct home URL in a fresh browser context with an empty cart unless the scenario says otherwise. Avoid asserting database persistence; verify cart and order state across the app's route transitions instead.

## Test Scenarios

### 1. Catalog and Product Selection

**Seed:** `tests/seed.spec.ts`

#### 1.1. Search for a product and restore the catalog

**File:** `tests/catalog-and-product-selection/catalog-search.spec.ts`

**Steps:**
  1. Open https://rahulshettyacademy.com/seleniumPractise/#/ in a fresh browser context.
    - expect: The GreenKart home page loads with the product catalog, search box, Cart summary, and Top Deals link.
    - expect: The cart summary starts at Items: 0 and Price: 0.
  2. Enter a distinctive product name such as Brocolli in the catalog search box.
    - expect: The matching product card is shown.
    - expect: Non-matching product cards are filtered out.
  3. Clear the search input.
    - expect: The full product catalog is restored.

#### 1.2. Add a product with an adjusted quantity and verify cart totals

**File:** `tests/catalog-and-product-selection/product-quantity-and-cart.spec.ts`

**Steps:**
  1. Open the home page in a fresh browser context and locate the Brocolli - 1 Kg product card.
    - expect: The product card shows its unit price and a quantity initialized to 1.
  2. Increase the quantity twice, then decrease it once.
    - expect: The displayed quantity is 2.
  3. Click ADD TO CART for that product.
    - expect: The header item count updates to 1 product.
    - expect: The header price total is twice the displayed unit price.
  4. Open Cart and click PROCEED TO CHECKOUT.
    - expect: The checkout table contains one Brocolli row with quantity 2.
    - expect: The row total and order total equal the unit price multiplied by 2.

#### 1.3. Calculate cart totals across different products

**File:** `tests/catalog-and-product-selection/multi-product-totals.spec.ts`

**Steps:**
  1. Open the home page in a fresh browser context. Add one Brocolli and one Cucumber to the cart.
    - expect: The header item count is 2.
    - expect: The header price equals the sum of the two product unit prices.
  2. Open Cart, then proceed to checkout.
    - expect: The checkout table has one row per selected product.
    - expect: Each row shows the correct quantity, unit price, and line total.
    - expect: The order item count and total amount match the selected products.

### 2. Cart and Checkout

**Seed:** `tests/seed.spec.ts`

#### 2.1. Reject an invalid promo code without changing the order total

**File:** `tests/cart-and-checkout/promo-code-validation.spec.ts`

**Steps:**
  1. Start from a fresh home page, add one Brocolli, open Cart, and proceed to checkout.
    - expect: The order has one item and the expected subtotal.
  2. Enter INVALID123 in the promo code field and click Apply.
    - expect: An invalid-code message is displayed after validation completes.
    - expect: The discount remains 0% and the total after discount remains equal to the subtotal.
    - expect: The cart item and quantity remain unchanged.

#### 2.2. Complete checkout by choosing a country and accepting terms

**File:** `tests/cart-and-checkout/place-order.spec.ts`

**Steps:**
  1. Start from a fresh home page, add one product to the cart, open Cart, proceed to checkout, and click Place Order.
    - expect: The Choose Country page is displayed with a country selector, terms checkbox, and Proceed button.
  2. Select India, check Agree to the Terms & Conditions, then click Proceed.
    - expect: A successful order confirmation message appears.
    - expect: The confirmation provides a Home link back to the catalog.
  3. Click Home.
    - expect: The GreenKart home page is displayed.

#### 2.3. Require country and terms before checkout can complete

**File:** `tests/cart-and-checkout/required-checkout-fields.spec.ts`

**Steps:**
  1. Start from a fresh home page, add one product, open Cart, proceed to checkout, and click Place Order.
    - expect: The Choose Country page is displayed with the country selector at its default Select value and the terms checkbox unchecked.
  2. Leave the country unselected and terms unchecked, then click Proceed.
    - expect: The app remains on the Choose Country page.
    - expect: No order-success confirmation is shown.

### 3. Top Deals

**Seed:** `tests/seed.spec.ts`

#### 3.1. Filter offers and change the visible page size

**File:** `tests/top-deals/offers-search-and-page-size.spec.ts`

**Steps:**
  1. Open https://rahulshettyacademy.com/seleniumPractise/#/offers.
    - expect: The offers table is displayed with Veg/fruit name, Price, and Discount price columns.
    - expect: The page-size selector and Search field are visible.
  2. Enter Wheat in the offers Search field.
    - expect: The table filters to the Wheat offer.
    - expect: Non-matching offer rows are not shown.
  3. Clear the search and select page size 10.
    - expect: The search filter is removed.
    - expect: The table displays up to 10 offer rows on the current page when enough rows are available.

#### 3.2. Sort offers and navigate between pages

**File:** `tests/top-deals/offers-sorting-and-pagination.spec.ts`

**Steps:**
  1. Open the Top Deals offers page in a fresh browser context.
    - expect: The offer table and pagination controls are visible.
  2. Click the Price column header once.
    - expect: The rows are sorted by Price in ascending order, indicated by the header state or visible row values.
  3. Click Next, then Previous.
    - expect: Next moves to the next offer page and Previous returns to the prior page.
    - expect: Pagination controls correctly reflect the current page and disabled states at boundaries.
