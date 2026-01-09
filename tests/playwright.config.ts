import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Read environment variables from file.
 * We use `dotenv` to load vars. The RULE is: "First one wins".
 *
 * Load Priority (Hierarchy):
 * 1. Shell/CLI (e.g. `TEST_ENV=qa npm run test`) -> Highest Priority
 * 2. .env.{TEST_ENV} (e.g. `.env.qa`) -> Environment specific
 * 3. .env.local -> Local developer overrides (ignored by git)
 * 4. .env -> Default values for everyone
 */
const configDir = path.resolve(__dirname, 'config');

if (process.env.TEST_ENV) {
    dotenv.config({ path: path.resolve(configDir, `.env.${process.env.TEST_ENV}`) });
}
dotenv.config({ path: path.resolve(configDir, '.env.local') });
dotenv.config({ path: path.resolve(configDir, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: '.', // Tests are now relative to this config file
    outputDir: './test-results', // Store artifacts here
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 2 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [['html', { outputFolder: 'playwright-report' }]],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: process.env.BASE_URL || 'http://localhost:3000',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        /* Run headless in CI, headed locally for better DX */
        headless: process.env.CI ? true : false,
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },

        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],

    /* Run local dev server only when testing against localhost */
    webServer: (process.env.BASE_URL && !process.env.BASE_URL.includes('localhost'))
        ? undefined
        : {
            command: process.env.CI ? 'npm run start' : 'npm run dev',
            url: 'http://localhost:3000',
            reuseExistingServer: !process.env.CI,
            cwd: '..', // Execute npm command from project root
        },
});
