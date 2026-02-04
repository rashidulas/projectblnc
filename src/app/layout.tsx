import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import PermanentNavbar from '@/components/PermanentNavbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Project BLNC - Luxury Streetwear',
  description: 'Reshaping the Future. Innovating, Disrupting, Redefining.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans" suppressHydrationWarning>
        <CartProvider>
          <PermanentNavbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
