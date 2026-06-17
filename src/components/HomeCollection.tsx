'use client';

import { motion, type Variants } from 'framer-motion';
import type { Product } from '@/data/products';
import ProductCard from './ProductCard';

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 80, scale: 0.94, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE },
  },
};

export default function HomeCollection({ products }: { products: Product[] }) {
  return (
    <section className="relative z-20 bg-[#e7ebea] w-full px-4 sm:px-8 pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-20 md:pb-24 md:-mt-[50vh]">
      {/* Heading wipes in from the left as you reach it */}
      <motion.h2
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="text-left text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-900 mb-10 md:mb-14"
      >
        COLLECTION // DROP 001
      </motion.h2>

      {/* Cards cascade in with a blur-to-sharp, rise, and settle */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-12"
      >
        {products.map((product, i) => (
          <motion.div key={product.id} variants={card}>
            <ProductCard product={product} priority={i < 4} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
