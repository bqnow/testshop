import { test, expect } from '../fixtures/base-test';
import { TEST_USERS } from '../data/test-data';

test.describe('Smoke Tests', () => {

    // Now using our custom 'test' fixture!
    test('User can log in', async ({ loginPage, page }) => {
        await loginPage.goto();
        // Use central credentials
        await loginPage.login(TEST_USERS.standard.username, TEST_USERS.standard.password);

        // Validate login success
        await expect(page).toHaveURL(/\/$/); // Robust regex for root URL
    });
});
