Feature: Ecommerce order placement

  @Regression
  Scenario: Placing the order
    Given I log in with the valid client account
    When I search for "ZARA COAT 3" and add it to the cart
    And I open the cart
    Then I should see "ZARA COAT 3" in the cart
    When I proceed to checkout and select "India" as the country
    Then the checkout email should match the logged-in account
    When I place the order
    Then I should see the order confirmation message "Thankyou for the order."

  @Validation
  Scenario Outline: Login fails with invalid credentials
    Given I log in with email "<username>" and password "<password>"
    Then I should see the error message "Incorrect email or password."

    Examples:
      | username                       | password      |
      | wrong.user@example.com         | WrongPass@123 |
      | nouser.invalid@test.com        | Invalid@123   |
      | wrong.email@test.com           | Random@456    |