import { productService } from '@/services/productService';
import ProductDetailView from '@/components/ProductDetailView';

export default async function ProductDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const product = await productService.getById(id);

    if (!product) {
        return <div style={{ textAlign: 'center', padding: '2rem' }}>Product not found</div>;
    }

    return <ProductDetailView product={product} />;
}
