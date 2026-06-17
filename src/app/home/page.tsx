import HomeHero from '@/components/HomeHero';
import ProductGrid from '@/components/ProductGrid';
import { getProducts } from '@/lib/products-store';
import Image from 'next/image';

export default async function HomePage() {
  const all = await getProducts();

  const shuffledProducts = [...all];
  for (let i = shuffledProducts.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledProducts[i], shuffledProducts[j]] = [shuffledProducts[j], shuffledProducts[i]];
  }

  const featuredProducts = shuffledProducts.slice(0, 3);

  return (
    <>
      <link rel="preload" href="/hero/g1.mp4" as="video" type="video/mp4" />
      <main className="bg-neutral-50 overflow-x-hidden">
      <HomeHero />

      <section className="bg-neutral-50 max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-20 md:pb-24 md:-mt-[50vh]">
        <h2 className="text-left text-lg md:text-xl font-semibold tracking-tight text-neutral-900 mb-10 md:mb-12">
          COLLECTION // DROP 001
        </h2>
        <ProductGrid products={featuredProducts} showcase />
      </section>

      <section className="bg-neutral-50 max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16 sm:pb-20 md:pb-24">
        <h2 className="text-left text-lg md:text-xl font-semibold tracking-tight text-neutral-900 uppercase mb-6 md:mb-8">
          About Blanc
        </h2>
        <p className="font-description text-base text-neutral-600 leading-relaxed w-full mb-10 md:mb-14">
          Materials engineered for longevity. Silhouettes crafted for motion. Every stitch, every detail, stripped of excess, built with intent. This is not about seasons—it&apos;s about permanence. Designed to outlast, created to redefine. We don&apos;t follow trends. We dismantle them. Each piece is designed with precision, built for movement, and crafted for those who shape the future. This is not fashion. This is evolution.
        </p>
        <div className="relative w-full aspect-[16/10] max-h-[70vh] overflow-hidden">
          <Image
            src="/hod.webp"
            alt="Beyond Fashion"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1280px"
            priority={false}
          />
        </div>
      </section>

      <div className="h-32 bg-neutral-50" />
    </main>
    </>
  );
}
