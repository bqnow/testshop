import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ShopPage extends BasePage {
    readonly searchInput: Locator;
    readonly searchButton: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.getByTestId('search-input');
        this.searchButton = page.getByTestId('search-submit');
    }

    async goto() {
        await super.goto('/');
    }

    async searchProduct(term: string) {
        await this.searchInput.fill(term);
        await this.searchButton.click();
        // Wait for the URL to update or results to load (optional but good practice)
        await this.page.waitForURL(/query=/);
    }

    async filterByCategory(category: string) {
        await this.page.getByTestId(`category-${category.toLowerCase()}`).click();
    }

    /**
     * Clicks on a product card to navigate to its detail page.
     */
    async openProductDetails(productId: string) {
        const card = this.page.getByTestId(`product-card-${productId}`);
        await card.getByRole('link', { name: 'View' }).click();
    }

    /**
     * Adds a product directly from the list view (if supported) 
     * OR assumes clicking the card.
     * Based on the component, there is a direct 'add-to-cart-{id}' button.
     */
    async addProductDirectlyToCart(productId: string) {
        await this.page.getByTestId(`add-to-cart-${productId}`).click();
    }
}
