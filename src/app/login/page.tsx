"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { loginUser } from '@/app/actions';
import { ROUTES } from '@/lib/routes';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const res = await loginUser(null, formData);

            if (res.success && res.data) {
                login(res.data.token, res.data.user);
                router.push(ROUTES.HOME);
            } else {
                setError(res.message || 'Login failed');
            }
        } catch {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <div className="card" style={{ padding: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600, textAlign: 'center', marginBottom: '2rem' }}>
                    Login to Account
                </h1>

                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius)',
                        marginBottom: '1rem',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        name="username"
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        required
                        data-testid="username-input"
                    />

                    <Input
                        name="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        data-testid="password-input"
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        style={{ width: '100%' }}
                        isLoading={loading}
                        data-testid="login-btn"
                    >
                        Sign In
                    </Button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Hint: Use <strong>consultant</strong> / <strong>pwd</strong>
                </div>
            </div>
        </div>
    );
}
