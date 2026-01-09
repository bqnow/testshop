import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ShopPage } from '../pages/ShopPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { TEST_CONFIG } from '../config/test-config';

// Declare the types of your fixtures.
type MyFixtures = {
    loginPage: LoginPage;
    shopPage: ShopPage;
    productDetailPage: ProductDetailPage;
    cartPage: CartPage;
    loggedInPage: void;
};

// Extend base test
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    shopPage: async ({ page }, use) => {
        await use(new ShopPage(page));
    },

    productDetailPage: async ({ page }, use) => {
        await use(new ProductDetailPage(page));
    },

    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },

    // A fixture that provides a pre-logged-in state
    loggedInPage: async ({ loginPage }, use) => {
        await loginPage.goto();
        // Use credentials from loaded environment config
        await loginPage.login(TEST_CONFIG.auth.username, TEST_CONFIG.auth.password);
        await use();
    },
});

export { expect } from '@playwright/test';
