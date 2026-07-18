import type { Metadata } from 'next';
import './globals.css';
import PermanentNavbar from '@/components/PermanentNavbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { NavMenuProvider } from '@/context/NavMenuContext';
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

// Ties the "Project BLNC" / "BLNC" / "BLANC" name variants used across the
// site to a single entity so Google resolves brand-name searches correctly.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Project BLNC',
  alternateName: ['BLNC', 'BLANC', 'Project BLANC', 'blanc'],
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Project BLNC',
  alternateName: ['BLNC', 'BLANC'],
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <CartProvider>
          <NavMenuProvider>
            <PageTransitionProvider>
              <PermanentNavbar />
              <main>{children}</main>
              <Footer />
            </PageTransitionProvider>
          </NavMenuProvider>
        </CartProvider>
      </body>
    </html>
  );
}
