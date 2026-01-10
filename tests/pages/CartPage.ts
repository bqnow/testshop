import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    readonly proceedToCheckoutButton: Locator;
    readonly submitOrderButton: Locator;
    readonly orderSuccessMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.proceedToCheckoutButton = page.getByTestId('checkout-init-btn');
        this.submitOrderButton = page.getByTestId('submit-order-btn');
        this.orderSuccessMessage = page.getByRole('heading', { name: 'Order Confirmed!' });
    }

    async goto() {
        // Use 'domcontentloaded' to tolerate potential redirects in WebKit
        await this.page.goto('/cart', { waitUntil: 'domcontentloaded' });
    }

    async increaseQuantity(productId: string) {
        await this.page.getByTestId(`increase-qty-${productId}`).click();
    }

    async checkTotal(productId: string, unitPrice: string) {
        const quantityElement = this.page.getByTestId(`quantity-${productId}`);
        const quantity = await quantityElement.textContent();

        const expectedTotal = (parseFloat(unitPrice) * parseInt(quantity!)).toFixed(2);

        await expect(this.page.getByTestId('cart-total')).toContainText(`$${expectedTotal}`);
    }

    async proceedToCheckout() {
        await this.proceedToCheckoutButton.click();
    }

    async fillShippingDetails(details: {
        fullName: string;
        address: string;
        city: string;
        zip: string;
        email: string;
    }) {
        await this.page.getByTestId('checkout-name').fill(details.fullName);
        await this.page.getByTestId('checkout-address').fill(details.address);
        await this.page.getByTestId('checkout-city').fill(details.city);
        await this.page.getByTestId('checkout-zip').fill(details.zip);
        await this.page.getByTestId('checkout-email').fill(details.email);
    }

    async submitOrder() {
        await this.submitOrderButton.click();
    }

    async submitOrderExpectingError(expectedMessageSubstring: string) {
        const dialogPromise = this.page.waitForEvent('dialog');
        await this.submitOrderButton.click();
        const dialog = await dialogPromise;
        expect(dialog.message()).toContain(expectedMessageSubstring);
        await dialog.accept();
    }

    async expectFieldToBeInvalid(testId: string) {
        const locator = this.page.getByTestId(testId);
        const isValid = await locator.evaluate((node) => (node as HTMLInputElement).checkValidity());
        expect(isValid).toBe(false);
    }

    async verifyOrderSuccess() {
        await expect(this.orderSuccessMessage).toBeVisible();
    }
}
