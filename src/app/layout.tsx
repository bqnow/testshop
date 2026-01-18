import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { FaroWebSdk } from '@/components/FaroWebSdk';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TestShop | Premium Testing App',
  description: 'A playground for learning UI and API testing.',
};

import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FaroWebSdk />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="container" style={{ minHeight: '80vh', padding: '2rem 1rem' }}>
              {children}
            </main>
            <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <p>&copy; 2026 TestShop by <strong>BQ now</strong> - Testing Playground</p>
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
