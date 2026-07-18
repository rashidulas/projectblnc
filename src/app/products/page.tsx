import type { Metadata } from 'next';
import ProductGrid from '@/components/ProductGrid';
import { getProducts } from '@/lib/products-store';

export const metadata: Metadata = {
  title: 'Shop All — Hoodies, Pants & Tees',
  description:
    'Browse the full Project BLNC (BLANC) collection: premium hoodies, pants, and tees designed with a refined monochrome aesthetic.',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    type: 'website',
    title: 'Shop All — Project BLNC',
    description:
      'Browse the full Project BLNC collection: premium hoodies, pants, and tees.',
    url: '/products',
  },
};

export default async function ProductsPage() {
  const products = await getProducts();

  // Shuffle all products so the collection feels fresh on each visit
  const shuffled = [...products];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return (
    <div className="min-h-screen bg-[#e7ebea]">
      {/* Hero section - left-aligned title and subtitle */}
      <section className="w-full px-4 sm:px-8 pt-16 sm:pt-24 md:pt-28 pb-6 sm:pb-8 md:pb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-neutral-900 mb-4 sm:mb-6">
          Essentials Designed for Everyone.
        </h1>
        <p className="font-description text-base sm:text-lg md:text-xl text-neutral-600 leading-relaxed max-w-2xl">
          Essentials Designed for Everywhere.
        </p>
      </section>

      {/* Horizontal line - full width */}
      <section className="w-full px-4 sm:px-8">
        <div className="h-px w-full bg-neutral-200" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }} />
      </section>

      {/* Product grid - full-bleed, large frames */}
      <section className="w-full px-4 sm:px-8 pt-8 sm:pt-12 md:pt-16 pb-20 sm:pb-24">
        <ProductGrid products={shuffled} showcase />
      </section>

      {/* Results count - minimal */}
      <div className="font-mono w-full px-4 sm:px-8 pb-12 sm:pb-16 text-center text-[13px] text-neutral-400 tracking-wide">
        {products.length} {products.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
      </div>
    </div>
  );
}
