import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.getByTestId('username-input'); // Assumed based on README guidance
        this.passwordInput = page.getByTestId('password-input');
        this.loginButton = page.getByTestId('login-btn');
    }

    async goto() {
        await super.goto('/login');
    }

    async login(username: string, password: string) { // Corrected parameter name
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
