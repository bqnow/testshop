"use client";

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { checkoutCart } from '@/app/actions';
import { useAuth } from '@/context/AuthContext';
import { ShippingDetails } from '@/types';
import { ROUTES } from '@/lib/routes';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
    const { user } = useAuth();
    const [checkingOut, setCheckingOut] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
    const [voucherCode, setVoucherCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [voucherError, setVoucherError] = useState('');

    const subtotal = total;
    const finalTotal = subtotal - discount;

    const [showCheckoutForm, setShowCheckoutForm] = useState(false);

    const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
        fullName: '',
        address: '',
        city: '',
        zipCode: '',
        email: ''
    });

    const handleApplyVoucher = (e: React.FormEvent) => {
        e.preventDefault();
        setVoucherError('');

        if (voucherCode.toUpperCase() === 'SAVE10') {
            setDiscount(subtotal * 0.10);
        } else if (voucherCode.toUpperCase() === 'TEST20') {
            setDiscount(subtotal * 0.20);
        } else {
            setVoucherError('Invalid voucher code');
            setDiscount(0);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCheckingOut(true);
        try {
            const res = await checkoutCart(cart, shippingDetails);

            if (res.success && res.data) {
                setOrderSuccess(res.data.orderId);
                clearCart();
            } else {
                alert('Checkout failed: ' + res.message);
            }
        } catch (error) {
            console.error(error);
            alert('Checkout error');
        } finally {
            setCheckingOut(false);
        }
    };

    if (orderSuccess) {
        // ... (Anzeige für erfolgreiche Bestellung)
        return (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--success)' }}>
                    Order Confirmed!
                </h1>
                <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
                    Thank you for your purchase. Your order ID is <strong>{orderSuccess}</strong>.
                </p>
                <Link href={ROUTES.HOME} className="btn btn-primary">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    if (cart.length === 0) {
        // ... (Anzeige für leeren Warenkorb)
        return (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your Cart is Empty</h1>
                <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
                    Looks like you haven&apos;t added anything yet.
                </p>
                <Link href={ROUTES.HOME} className="btn btn-primary">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Shopping Cart</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cart.map(item => (
                        <div key={item.id} className="card" style={{ display: 'flex', padding: '1rem', alignItems: 'center', gap: '1rem' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: 600 }}>{item.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>${item.price} each</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>${(item.price * item.quantity).toFixed(2)}</div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '4px',
                                            border: '1px solid var(--border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            color: 'var(--text-main)'
                                        }}
                                        data-testid={`decrease-qty-${item.id}`}
                                    >-</button>
                                    <span style={{ fontSize: '0.9rem', width: '20px', textAlign: 'center' }} data-testid={`quantity-${item.id}`}>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '4px',
                                            border: '1px solid var(--border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            color: 'var(--text-main)'
                                        }}
                                        data-testid={`increase-qty-${item.id}`}
                                    >+</button>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromCart(item.id)}
                                    style={{ color: 'var(--error)', padding: '0' }}
                                    data-testid={`remove-item-${item.id}`}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}

                    {showCheckoutForm && (
                        <div className="card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Shipping Details</h2>
                            <form onSubmit={handleCheckoutSubmit}>
                                <Input
                                    name="fullName"
                                    label="Full Name"
                                    placeholder="Enter full name"
                                    value={shippingDetails.fullName}
                                    onChange={handleInputChange}
                                    required
                                    data-testid="checkout-name"
                                />
                                <Input
                                    name="address"
                                    label="Address"
                                    placeholder="Street address"
                                    value={shippingDetails.address}
                                    onChange={handleInputChange}
                                    required
                                    data-testid="checkout-address"
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <Input
                                        name="city"
                                        label="City"
                                        placeholder="City"
                                        value={shippingDetails.city}
                                        onChange={handleInputChange}
                                        required
                                        data-testid="checkout-city"
                                    />
                                    <Input
                                        name="zipCode"
                                        label="Zip Code"
                                        placeholder="12345"
                                        value={shippingDetails.zipCode}
                                        onChange={handleInputChange}
                                        required
                                        pattern="\d{5}"
                                        title="Zip code must be 5 digits"
                                        data-testid="checkout-zip"
                                    />
                                </div>
                                <Input
                                    name="email"
                                    label="Email"
                                    type="email"
                                    placeholder="Email address"
                                    value={shippingDetails.email}
                                    onChange={handleInputChange}
                                    required
                                    data-testid="checkout-email"
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    style={{ width: '100%', marginTop: '1rem' }}
                                    isLoading={checkingOut}
                                    data-testid="submit-order-btn"
                                >
                                    Place Order
                                </Button>
                            </form>
                        </div>
                    )}
                </div>

                <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Order Summary</h2>
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                        <form onSubmit={handleApplyVoucher} style={{ display: 'flex', gap: '0.5rem' }}>
                            <Input
                                name="voucher"
                                placeholder="Voucher Code"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value)}
                                style={{ marginBottom: 0 }}
                                data-testid="voucher-input"
                            />
                            <Button type="submit" size="sm" variant="outline" data-testid="apply-voucher-btn">Apply</Button>
                        </form>
                        {voucherError && <div style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{voucherError}</div>}
                        {discount > 0 && <div style={{ color: 'var(--success)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Discount applied!</div>}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--success)' }}>
                            <span>Discount</span>
                            <span>-${discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border)', margin: '1rem 0' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontWeight: 700, fontSize: '1.1rem' }}>
                        <span>Total</span>
                        <span data-testid="cart-total">${finalTotal.toFixed(2)}</span>
                    </div>
                    {user ? (
                        !showCheckoutForm ? (
                            <Button
                                onClick={() => setShowCheckoutForm(true)}
                                className="w-full"
                                style={{ width: '100%' }}
                                data-testid="checkout-init-btn"
                            >
                                Proceed to Checkout
                            </Button>
                        ) : (
                            <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Complete the form to place your order.
                            </div>
                        )
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <Link href={ROUTES.LOGIN} className="btn btn-primary" style={{ width: '100%' }}>
                                Login to Checkout
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
