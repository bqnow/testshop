import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ShopPage } from '../pages/ShopPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { TEST_USERS } from '../data/test-data';

// Declare the types of your fixtures.
type MyFixtures = {
    loginPage: LoginPage;
    shopPage: ShopPage;
    productDetailPage: ProductDetailPage;
    cartPage: CartPage;
    loggedInPage: void; // Worker-scoped authentication could be done, here we do test-scoped
};

// Extend base test by providing "myPage" and "settingsPage".
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
        await loginPage.login(TEST_USERS.standard.username, TEST_USERS.standard.password);
        await use();
    },
});

export { expect } from '@playwright/test';
