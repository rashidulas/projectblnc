import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import { products } from '@/data/products';

export default function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <main className="bg-white overflow-x-hidden">
      <Hero />

      {/* Featured Products - No gap needed, Hero section handles spacing */}
      <section className="bg-white max-w-7xl mx-auto px-6 pb-24">
        <ProductGrid products={featuredProducts} editorial />
      </section>

      <div className="h-24 md:h-32 bg-white" />
    </main>
  );
}
