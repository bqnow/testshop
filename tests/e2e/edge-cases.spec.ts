import { test, expect } from '../fixtures/base-test';
import { PRODUCTS } from '../data/test-data';
import { faker } from '@faker-js/faker';

test.describe('E2E Edge Cases & Error Handling', () => {

    test('Checkout fails gracefully when purchasing buggy product (ID 999)', async ({
        shopPage,
        cartPage,
        loggedInPage
    }) => {

        // 1. Add Buggy Product to Cart
        await test.step('Add buggy product', async () => {
            await shopPage.searchProduct('Glitchy');
            await shopPage.addProductDirectlyToCart(PRODUCTS.buggyValues.id);
        });

        // 2. Checkout
        await test.step('Attempt checkout', async () => {
            await cartPage.goto();
            await cartPage.proceedToCheckout();

            const fakeUser = {
                fullName: faker.person.fullName(),
                address: faker.location.streetAddress(),
                city: faker.location.city(),
                zip: faker.location.zipCode('#####'),
                email: faker.internet.email()
            };

            await cartPage.fillShippingDetails(fakeUser);

            // Expect the specific server error from actions.ts
            await cartPage.submitOrderExpectingError('Internal Server Error');
        });

        // 3. Verify App Stability
        await test.step('Verify app is still usable', async () => {
            // Should still be on cart page (or wherever the logic keeps us)
            await expect(cartPage.submitOrderButton).toBeVisible();

            // Or verify we can navigate back home
            await shopPage.goto();
            await expect(shopPage.page).toHaveURL(/\/$/); // Ends with /
        });
    });
});
