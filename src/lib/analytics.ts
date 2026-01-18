'use client';

import { faro } from '@grafana/faro-web-sdk';

/**
 * Track custom events in Grafana Faro
 */
export const trackEvent = (name: string, attributes?: Record<string, string>) => {
    try {
        if (faro.api) {
            faro.api.pushEvent(name, attributes);
            console.log(`[Faro] Event: ${name}`, attributes);
        }
    } catch (error) {
        console.warn('[Faro] Failed to track event:', error);
    }
};

/**
 * Track Add to Cart event
 */
export const trackAddToCart = (productId: number, productName: string, price: number) => {
    trackEvent('add_to_cart', {
        product_id: String(productId),
        product_name: productName,
        price: String(price),
    });
};

/**
 * Track Remove from Cart event
 */
export const trackRemoveFromCart = (productId: number, productName: string) => {
    trackEvent('remove_from_cart', {
        product_id: String(productId),
        product_name: productName,
    });
};

/**
 * Track Checkout Started event
 */
export const trackCheckoutStarted = (cartTotal: number, itemCount: number) => {
    trackEvent('checkout_started', {
        cart_total: String(cartTotal),
        item_count: String(itemCount),
    });
};

/**
 * Track Order Completed event
 */
export const trackOrderCompleted = (orderId: string, total: number, itemCount: number) => {
    trackEvent('order_completed', {
        order_id: orderId,
        total: String(total),
        item_count: String(itemCount),
    });
};

/**
 * Track Order Failed event
 */
export const trackOrderFailed = (error: string, cartTotal: number) => {
    trackEvent('order_failed', {
        error: error,
        cart_total: String(cartTotal),
    });
};

