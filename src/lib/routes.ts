export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    CART: '/cart',
    PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,
    CATEGORY: (category: string) => `/?category=${category}`,
    PAGINATION: (page: number, query: string = '') => `/?page=${page}${query ? `&query=${query}` : ''}`,
} as const;
