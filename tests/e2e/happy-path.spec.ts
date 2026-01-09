import { test } from '../fixtures/base-test';
import { PRODUCTS } from '../data/test-data';
import { faker } from '@faker-js/faker';

test.describe('E2E Checkout Flow', () => {

    // We use our custom 'test' which has fixtures injected automatically.
    // notice 'loggedInPage' fixture -> it runs the login logic BEFORE the test body starts!
    test('Standard Customer Journey (Happy Path)', async ({
        shopPage,
        productDetailPage,
        cartPage,
        loggedInPage
    }) => {

        // 1. Search and Find Product
        await test.step('Search and select product', async () => {
            await shopPage.filterByCategory(PRODUCTS.laptop.category);
            await shopPage.openProductDetails(PRODUCTS.laptop.id);
        });

        // 2. Add to Cart
        await test.step('Add product to cart', async () => {
            await productDetailPage.addToCart();
        });

        // 3. Checkout with Dynamic Data
        await test.step('Checkout with dynamic user data', async () => {
            await cartPage.goto();
            await cartPage.increaseQuantity(PRODUCTS.laptop.id);

            await cartPage.proceedToCheckout();

            // Generate valid fake data for every run! 
            const fakeUser = {
                fullName: faker.person.fullName(),
                address: faker.location.streetAddress(),
                city: faker.location.city(),
                zip: faker.location.zipCode('#####'), // Ensure 5 digits
                email: faker.internet.email()
            };

            await cartPage.fillShippingDetails(fakeUser);
            await cartPage.submitOrder();
            await cartPage.verifyOrderSuccess();
        });
    });
});
