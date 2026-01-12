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
    password?: string; // Optional, da wir es evtl. nicht in UI-Typen anzeigen wollen
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
