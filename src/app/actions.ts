"use server";

import { users } from '@/lib/data';
import { ApiResponse, CartItem, ShippingDetails } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loginUser(prevState: any, formData: FormData): Promise<ApiResponse<{ token: string; user: { id: number; username: string } }>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        return {
            success: true,
            data: {
                token: "mock-jwt-token-123456",
                user: { id: user.id, username: user.username }
            }
        };
    }

    return {
        success: false,
        message: "Invalid credentials"
    };
}

export async function checkoutCart(cart: CartItem[], shippingDetails: ShippingDetails): Promise<ApiResponse<{ orderId: string }>> {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!cart || cart.length === 0) {
        return { success: false, message: "Cart is empty" };
    }

    // Simulate "Buggy" Product Scenario
    const hasBuggyProduct = cart.some(item => item.id === 999);
    if (hasBuggyProduct) {
        return { success: false, message: "Internal Server Error: processing failed for item 999." };
    }

    // Validate Shipping Details (Server-Side)
    if (!shippingDetails.fullName || shippingDetails.fullName.length < 3) {
        return { success: false, message: "Invalid Full Name (min 3 chars)" };
    }
    if (!shippingDetails.address || shippingDetails.address.length < 5) {
        return { success: false, message: "Invalid Address (min 5 chars)" };
    }
    if (!shippingDetails.zipCode || !/^\d{5}$/.test(shippingDetails.zipCode)) {
        return { success: false, message: "Invalid Zip Code (must be 5 digits)" };
    }
    if (!shippingDetails.email || !shippingDetails.email.includes('@')) {
        return { success: false, message: "Invalid Email Address" };
    }

    return {
        success: true,
        data: { orderId: `ORDER-${Date.now()}` },
        message: "Order placed successfully"
    };
}
