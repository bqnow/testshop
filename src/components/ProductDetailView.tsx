"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';

export default function ProductDetailView({ product }: { product: Product }) {
    const [isAdded, setIsAdded] = useState(false);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            </div>
            <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {product.category}
                </div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.2 }}>
                    {product.name}
                </h1>
                <p style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>
                    ${product.price}
                </p>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem', fontSize: '1.1rem' }}>
                    {product.description}
                </p>
                <Button
                    onClick={handleAddToCart}
                    size="lg"
                    style={{
                        backgroundColor: isAdded ? 'var(--success)' : undefined,
                        transition: 'background-color 0.3s ease'
                    }}
                    data-testid="add-to-cart-large"
                >
                    {isAdded ? 'Added to Cart!' : 'Add to Cart'}
                </Button>
            </div>
        </div>
    );
}
