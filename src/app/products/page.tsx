'use client';

import ProductGrid from '@/components/ProductGrid';
import { products } from '@/data/products';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero section - left-aligned title and subtitle */}
      <section className="max-w-7xl mx-auto px-6 pt-24 md:pt-32 pb-8 md:pb-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-neutral-900 mb-6">
          Designed for the Future
        </h1>
        <p className="text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl">
          A selection of statement pieces that redefine style, precision, and innovation.
        </p>
      </section>

      {/* Horizontal line - full width, matches footer and other pages */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="h-px w-full bg-neutral-200" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }} />
      </section>

      {/* Product grid - showcase style, monochrome images */}
      <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-16 pb-24">
        <ProductGrid products={products} showcase />
      </section>

      {/* Results count - minimal */}
      <div className="max-w-7xl mx-auto px-6 pb-16 text-center text-xs text-neutral-400 tracking-wide">
        {products.length} {products.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
      </div>
    </div>
  );
}
