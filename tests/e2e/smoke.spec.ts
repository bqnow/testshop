import { test, expect } from '../fixtures/base-test';
import { TEST_CONFIG } from '../config/test-config';

test.describe('Smoke Tests', () => {

    test('User can log in', async ({ loginPage, page }) => {
        await loginPage.goto();
        // Use central credentials from config
        await loginPage.login(TEST_CONFIG.auth.username, TEST_CONFIG.auth.password);

        // Validate login success
        await expect(page).toHaveURL(/\/$/); // Robust regex for root URL
    });
});
