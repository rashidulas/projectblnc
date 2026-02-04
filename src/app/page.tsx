import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import { getProductsByCategory } from '@/data/products';
import Image from 'next/image';

export default function Home() {
  const hoodies = getProductsByCategory('Hoodies');

  return (
    <main className="bg-white overflow-x-hidden">
      <Hero />

      {/* HOODIES // DROP 001 - pull up so no gap after hero scroll */}
      <section className="bg-white max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 md:pt-20 pb-20 sm:pb-24 -mt-[45vh] sm:-mt-[50vh]">
        <h2 className="text-left text-base sm:text-lg md:text-xl font-semibold tracking-tight text-neutral-900 mb-8 sm:mb-10 md:mb-12">
          HOODIES // DROP 001
        </h2>
        <ProductGrid products={hoodies} showcase />
      </section>

      {/* Beyond Fashion - heading, paragraph, large image */}
      <section className="bg-white max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-20 sm:pb-24">
        <h2 className="text-left text-base sm:text-lg md:text-xl font-semibold tracking-tight text-neutral-900 uppercase mb-4 sm:mb-6 md:mb-8">
          Beyond Fashion
        </h2>
        <p className="text-sm md:text-base text-neutral-600 leading-relaxed w-full mb-8 sm:mb-10 md:mb-14">
          Materials engineered for longevity. Silhouettes crafted for motion. Every stitch, every detail, stripped of excess, built with intent. This is not about seasons—it&apos;s about permanence. Designed to outlast, created to redefine. We don&apos;t follow trends. We dismantle them. Each piece is designed with precision, built for movement, and crafted for those who shape the future. This is not fashion. This is evolution.
        </p>
        <div className="relative w-full aspect-[4/3] md:aspect-[16/10] max-h-[60vh] sm:max-h-[70vh] overflow-hidden">
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

      <div className="h-24 md:h-32 bg-white" />
    </main>
  );
}
