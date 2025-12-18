import { NextResponse } from 'next/server';
import { productService } from '@/services/productService';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const product = await productService.getById(id);

    if (product) {
        return NextResponse.json(product);
    }

    return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
    );
}
