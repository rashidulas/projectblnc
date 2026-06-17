import ProductGrid from '@/components/ProductGrid';
import { getProducts } from '@/lib/products-store';

export default async function ProductsPage() {
  const products = await getProducts();

  // Shuffle all products so the collection feels fresh on each visit
  const shuffled = [...products];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return (
    <div className="min-h-screen bg-neutral-50 pt-11 sm:pt-12">
      {/* Hero section - left-aligned title and subtitle */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 md:pt-20 pb-6 sm:pb-8 md:pb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-neutral-900 mb-4 sm:mb-6">
          Essentials Designed for Everyone.
        </h1>
        <p className="font-description text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl">
          Essentials Designed for Everywhere.
        </p>
      </section>

      {/* Horizontal line - full width, matches footer and other pages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-px w-full bg-neutral-200" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }} />
      </section>

      {/* Product grid - showcase style, monochrome images */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 md:pt-16 pb-20 sm:pb-24">
        <ProductGrid products={shuffled} showcase />
      </section>

      {/* Results count - minimal */}
      <div className="font-description max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 text-center text-xs text-neutral-400 tracking-wide">
        {products.length} {products.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
      </div>
    </div>
  );
}
