'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

// Product images for the reveal section
const FEATURED_PRODUCTS = [
  '/models/hoodies/hoodie-01/DSC02487.JPG',
  '/models/hoodies/hoodie-02/DSC02519.JPG',
  '/models/tshirts/tshirt-01/DSC02494.JPG',
  '/models/hoodies/hoodie-03/DSC02554.JPG',
  '/models/tshirts/tshirt-02/DSC02500.JPG',
  '/models/hoodies/hoodie-01/DSC02488.JPG',
];

export default function Hero() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the entire scroll wrapper
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ['start start', 'end start'],
  });

  // Image transformations
  // Width: 100vw → 90vw
  const imageWidth = useTransform(scrollYProgress, [0, 1], ['100vw', '90vw']);
  
  // Height: 100vh → 60vh
  const imageHeight = useTransform(scrollYProgress, [0, 1], ['100vh', '60vh']);
  
  // Border radius: 0px → 24px
  const imageBorderRadius = useTransform(scrollYProgress, [0, 1], ['0px', '24px']);

  // Hero text animations - fade out and slide up
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 0.5, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  // Genesis section reveal
  const genesisOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const genesisY = useTransform(scrollYProgress, [0.4, 0.6], [40, 0]);

  // Product grid reveal
  const gridOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);
  const gridY = useTransform(scrollYProgress, [0.5, 0.8], [100, 0]);

  return (
    <>
      {/* Scroll Wrapper - h-[200vh] creates scroll room */}
      <div 
        ref={scrollContainerRef} 
        className="relative w-full bg-white" 
        style={{ height: '200vh' }}
      >
        {/* Sticky Container - Stays pinned while content scrolls */}
        <div className="sticky top-0 h-screen w-screen overflow-hidden flex items-center justify-center bg-white">
          
          {/* Hero Image - Shrinks from full-screen to contained */}
          <motion.div
            className="relative overflow-hidden"
            style={{
              width: imageWidth,
              height: imageHeight,
              borderRadius: imageBorderRadius,
            }}
          >
            {/* Image with object-fit: cover */}
            <Image
              src="/hero/color.png"
              alt="Hero"
              fill
              priority
              className="object-cover"
              style={{ 
                objectPosition: 'center center',
              }}
              sizes="100vw"
            />
            
            {/* Gradient overlay for smooth fade to white */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30 pointer-events-none" />

            {/* Hero Text - Bottom Left, Fades Out on Scroll */}
            <motion.div
              className="absolute bottom-12 md:bottom-16 lg:bottom-20 left-6 md:left-10 lg:left-16 max-w-2xl z-10"
              style={{
                opacity: textOpacity,
                y: textY,
              }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.95] tracking-tighter text-white drop-shadow-2xl mb-6">
                Reshaping the Future.
                <br />
                <span className="text-white/95">
                  Innovating, Disrupting,
                  <br />
                  Redefining.
                </span>
              </h1>
              <p className="text-sm md:text-base text-white/90 drop-shadow-lg leading-relaxed max-w-md">
                A new era of luxury streetwear — minimal, bold, and built to feel timeless.
              </p>
            </motion.div>
          </motion.div>

          {/* Genesis Section - Reveals in Center */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center pointer-events-none"
            style={{
              opacity: genesisOpacity,
              y: genesisY,
            }}
          >
            <div className="space-y-1">
              <div className="text-xs tracking-[0.3em] text-neutral-500 font-light uppercase">
                Genesis
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black">
                // DROP 001
              </div>
              <div className="text-xs tracking-widest text-neutral-600 mt-4 uppercase">
                Available Now
              </div>
            </div>
          </motion.div>

          {/* Product Grid - Slides Up from Bottom */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 px-6 pb-12 md:pb-16 z-30"
            style={{
              opacity: gridOpacity,
              y: gridY,
            }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                {FEATURED_PRODUCTS.map((src, idx) => (
                  <motion.div
                    key={idx}
                    className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      delay: idx * 0.05,
                      duration: 0.4,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  >
                    <Image
                      src={src}
                      alt={`Product ${idx + 1}`}
                      fill
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* GENESIS Section - Starts Immediately After Sticky Container */}
      <section className="bg-white max-w-7xl mx-auto px-6 pt-8 pb-24 -mt-8">
        <div className="mb-16 md:mb-20">
          <h2 className="text-sm md:text-base tracking-[0.2em] text-neutral-900 font-medium uppercase">
            GENESIS // DROP 001
          </h2>
        </div>

        {/* This will be filled by the ProductGrid from page.tsx */}
      </section>
    </>
  );
}
