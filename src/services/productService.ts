import { products } from '@/lib/data';
import { Product } from '@/types';

export type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
};

export type GetAllParams = {
    page?: number;
    limit?: number;
    query?: string;
    category?: string;
};

export const productService = {
    getAll: async ({ page = 1, limit = 9, query = '', category = '' }: GetAllParams = {}): Promise<PaginatedResponse<Product>> => {
        // Simulate DB delay
        await new Promise(resolve => setTimeout(resolve, 50));

        let filtered = products;

        if (category) {
            filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }

        if (query) {
            const lowerQuery = query.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery) ||
                p.category.toLowerCase().includes(lowerQuery)
            );
        }

        const total = filtered.length;
        const totalPages = Math.ceil(total / limit);
        const offset = (page - 1) * limit;
        const paginated = filtered.slice(offset, offset + limit);

        return {
            data: paginated,
            total,
            page,
            totalPages
        };
    },

    getById: async (id: number): Promise<Product | undefined> => {
        await new Promise(resolve => setTimeout(resolve, 50));
        return products.find(p => p.id === id);
    }
};
