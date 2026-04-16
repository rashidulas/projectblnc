import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import { getProducts } from '@/lib/products-store';
import Image from 'next/image';

export default async function Home() {
  const all = await getProducts();

  // Randomize the entire collection (hoodies, pants, tees) on the homepage
  const shuffledProducts = [...all];
  for (let i = shuffledProducts.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledProducts[i], shuffledProducts[j]] = [shuffledProducts[j], shuffledProducts[i]];
  }

  // Only show three random featured products in the hero collection
  const featuredProducts = shuffledProducts.slice(0, 3);

  return (
    <main className="bg-white overflow-x-hidden">
      <Hero />

      {/* COLLECTION // DROP 001 - pull up so no gap after hero scroll */}
      <section className="bg-white max-w-7xl mx-auto px-6 pt-16 md:pt-20 pb-20 sm:pb-24 -mt-[50vh]">
        <h2 className="text-left text-lg md:text-xl font-semibold tracking-tight text-neutral-900 mb-10 md:mb-12">
          COLLECTION // DROP 001
        </h2>
        <ProductGrid products={featuredProducts} showcase />
      </section>

      {/* Beyond Fashion - heading, paragraph, large image */}
      <section className="bg-white max-w-7xl mx-auto px-6 pt-8 pb-20 sm:pb-24">
        <h2 className="text-left text-lg md:text-xl font-semibold tracking-tight text-neutral-900 uppercase mb-6 md:mb-8">
          About Blanc
        </h2>
        <p className="font-description text-base text-neutral-600 leading-relaxed w-full mb-10 md:mb-14">
          Materials engineered for longevity. Silhouettes crafted for motion. Every stitch, every detail, stripped of excess, built with intent. This is not about seasons—it&apos;s about permanence. Designed to outlast, created to redefine. We don&apos;t follow trends. We dismantle them. Each piece is designed with precision, built for movement, and crafted for those who shape the future. This is not fashion. This is evolution.
        </p>
        <div className="relative w-full aspect-[16/10] max-h-[70vh] overflow-hidden">
          <Image
            src="/hod.jpg"
            alt="Beyond Fashion"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1280px"
            priority={false}
          />
        </div>
      </section>

      <div className="h-32 bg-white" />
    </main>
  );
}
