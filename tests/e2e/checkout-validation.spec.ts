import { test } from '../fixtures/base-test';
import { PRODUCTS } from '../data/test-data';
import { faker } from '@faker-js/faker';

// define test data as object
const validationScenarios = [
    // Scenario 1: ZIP must be 5 digits (HTML pattern="\d{5}")
    {
        testName: 'Invalid Zip Code (Pattern)',
        data: {
            fullName: faker.person.fullName(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            zip: '123', // Too short
            email: faker.internet.email()
        },
        fieldToValidate: 'checkout-zip'
    },
    // Scenario 2: Email must contain @ (HTML type="email")
    {
        testName: 'Invalid Email Format',
        data: {
            fullName: faker.person.fullName(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            zip: '12345',
            email: 'not-an-email' // Missing @
        },
        fieldToValidate: 'checkout-email'
    }
];

test.describe('Checkout Form Validation (Frontend)', () => {

    // Loop through test data object
    for (const scenario of validationScenarios) {

        test(`Ensure browser blocks: ${scenario.testName}`, async ({ shopPage, cartPage, loggedInPage }) => {

            // 1. Prepare Cart
            await shopPage.filterByCategory(PRODUCTS.laptop.category);
            await shopPage.addProductDirectlyToCart(PRODUCTS.laptop.id);

            await cartPage.goto();
            await cartPage.proceedToCheckout();

            // 2. Fill Form with specific invalid data
            await cartPage.fillShippingDetails(scenario.data);

            // 3. Try to submit
            await cartPage.submitOrder();

            // 4. Verify that the specific field is invalid (HTML5 validation)
            await cartPage.expectFieldToBeInvalid(scenario.fieldToValidate);
        });
    }
});
