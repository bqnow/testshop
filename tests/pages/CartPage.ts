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
        // Looking for "Order Confirmed!" h1
        this.orderSuccessMessage = page.getByRole('heading', { name: 'Order Confirmed!' });
    }

    async goto() {
        await super.goto('/cart');
    }

    async increaseQuantity(productId: string) {
        await this.page.getByTestId(`increase-qty-${productId}`).click();
    }

    async checkTotal(expectedTotal: string) {
        await expect(this.page.getByTestId('cart-total')).toHaveText(expectedTotal);
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
        // Setup the event listener before the action
        const dialogPromise = this.page.waitForEvent('dialog');

        await this.submitOrderButton.click();

        const dialog = await dialogPromise;
        expect(dialog.message()).toContain(expectedMessageSubstring);
        await dialog.accept();
    }

    async verifyOrderSuccess() {
        await expect(this.orderSuccessMessage).toBeVisible();
    }
}
