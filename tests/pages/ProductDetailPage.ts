import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
    readonly addToCartButton: Locator;

    constructor(page: Page) {
        super(page);
        this.addToCartButton = page.getByTestId('add-to-cart-large');
    }

    async addToCart() {
        await this.addToCartButton.click();
    }
}
