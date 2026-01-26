import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import { products } from '@/data/products';

export default function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <main className="bg-white">
      <Hero />

      {/* Handoff whitespace AFTER hero finishes revealing */}
      <div className="h-24 md:h-32 bg-white" />

      {/* GENESIS // DROP 001 Section */}
      <section className="bg-white max-w-7xl mx-auto px-6 pb-24">
        <div className="mb-16 md:mb-20">
          <h2 className="text-sm md:text-base tracking-[0.2em] text-neutral-900 font-medium uppercase">
            GENESIS // DROP 001
          </h2>
        </div>

        <ProductGrid products={featuredProducts} editorial />
      </section>

      <div className="h-24 md:h-32 bg-white" />
    </main>
  );
}
