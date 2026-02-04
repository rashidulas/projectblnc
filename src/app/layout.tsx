import type { Metadata } from 'next';
import './globals.css';
import PermanentNavbar from '@/components/PermanentNavbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import PageTransitionProvider from '@/components/PageTransitionProvider';

export const metadata: Metadata = {
  title: 'Project BLNC - Luxury Streetwear',
  description: 'Reshaping the Future. Innovating, Disrupting, Redefining.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased" suppressHydrationWarning>
        <CartProvider>
          <PageTransitionProvider>
            <PermanentNavbar />
            <main className="pt-16 sm:pt-20">{children}</main>
            <Footer />
          </PageTransitionProvider>
        </CartProvider>
      </body>
    </html>
  );
}
