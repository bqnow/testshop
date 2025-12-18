"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/routes';

export default function Navbar() {
    const pathname = usePathname();
    const { cart, clearCart } = useCart();
    const { user, logout } = useAuth();

    const isActive = (path: string) => pathname === path;
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav style={{
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '64px'
            }}>
                <Link href={ROUTES.HOME} style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    TestShop
                </Link>

                <div style={{ display: 'flex', gap: '2rem' }}>
                    <Link
                        href={ROUTES.HOME}
                        style={{
                            color: isActive(ROUTES.HOME) ? 'var(--accent)' : 'var(--text-main)',
                            fontWeight: isActive(ROUTES.HOME) ? 600 : 400
                        }}
                        data-testid="nav-products"
                    >
                        Products
                    </Link>
                    <Link
                        href={ROUTES.CART}
                        style={{
                            color: isActive(ROUTES.CART) ? 'var(--accent)' : 'var(--text-main)',
                            fontWeight: isActive(ROUTES.CART) ? 600 : 400
                        }}
                        data-testid="nav-cart"
                    >
                        Cart <span style={{
                            backgroundColor: 'var(--accent)',
                            color: 'var(--accent-foreground)',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            marginLeft: '0.25rem'
                        }} data-testid="nav-cart-count">{cartItemCount}</span>
                    </Link>
                    {user ? (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }} data-testid="nav-user-menu">
                                {user.username}
                            </span>
                            <button
                                onClick={() => {
                                    clearCart();
                                    logout();
                                }}
                                style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.9rem',
                                    fontWeight: 400
                                }}
                                data-testid="nav-logout"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            href={ROUTES.LOGIN}
                            style={{
                                color: isActive(ROUTES.LOGIN) ? 'var(--accent)' : 'var(--text-main)',
                                fontWeight: isActive(ROUTES.LOGIN) ? 600 : 400
                            }}
                            data-testid="nav-login"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
