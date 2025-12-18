"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/routes';

type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
};

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="card" data-testid={`product-card-${product.id}`}>
            <div style={{ height: '200px', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <div style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {product.category}
                </div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }} data-testid={`product-name-${product.id}`}>
                    {product.name}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5, height: '40px', overflow: 'hidden' }}>
                    {product.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }} data-testid={`product-price-${product.id}`}>${product.price}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link href={ROUTES.PRODUCT_DETAIL(product.id)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                            View
                        </Link>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleAddToCart}
                            style={{
                                backgroundColor: isAdded ? 'var(--success)' : undefined,
                                transition: 'background-color 0.3s ease'
                            }}
                            data-testid={`add-to-cart-${product.id}`}
                        >
                            {isAdded ? 'Added!' : 'Add'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
