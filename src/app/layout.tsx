import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import PermanentNavbar from '@/components/PermanentNavbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import PageTransitionProvider from '@/components/PageTransitionProvider';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

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
    <html lang="en" className={plusJakarta.variable}>
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
