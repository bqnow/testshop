export type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
};

export type CartItem = Product & {
    quantity: number;
};

export type User = {
    id: number;
    username: string;
    password?: string; // Optional because we might not want to expose it in UI types
};

export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
};

export type ShippingDetails = {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    email: string;
};
