import type { Metadata } from 'next';
import './globals.css';
import PermanentNavbar from '@/components/PermanentNavbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import PageTransitionProvider from '@/components/PageTransitionProvider';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://projectblnc.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Project BLNC — Luxury Streetwear',
    template: '%s — Project BLNC',
  },
  description:
    'Project BLNC is a luxury streetwear label redefining everyday essentials. Premium hoodies, pants, and tees in a refined monochrome aesthetic.',
  keywords: [
    'luxury streetwear',
    'premium hoodies',
    'designer streetwear',
    'minimal fashion',
    'Project BLNC',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'Project BLNC',
    title: 'Project BLNC — Luxury Streetwear',
    description:
      'Premium hoodies, pants, and tees in a refined monochrome aesthetic. Redefining everyday essentials.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Project BLNC — Luxury Streetwear',
    description:
      'Premium hoodies, pants, and tees in a refined monochrome aesthetic.',
  },
  robots: {
    index: true,
    follow: true,
  },
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
