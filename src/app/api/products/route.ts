import { NextResponse } from 'next/server';
import { productService } from '@/services/productService';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const query = searchParams.get('query') || '';

    const category = searchParams.get('category') || '';

    const result = await productService.getAll({ page, limit, query, category });

    return NextResponse.json(result, {
        headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
    });
}
