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

  // Scroll indicator dot opacity
  const scrollDotOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
          
          {/* Scroll indicator dot - right side, fades as you scroll */}
          <motion.div
            className="absolute right-6 top-1/2 -translate-y-1/2 z-40 w-2 h-2 rounded-full bg-neutral-400"
            style={{ opacity: scrollDotOpacity }}
          />

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
              src="/hero/bnw.png"
              alt="Hero"
              fill
              priority
              className="object-cover"
              style={{ 
                objectPosition: 'center center',
              }}
              sizes="100vw"
            />
            
            {/* Bottom fade: image fades to white and blends into page (low opacity at bottom) */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(255,255,255,0.25) 55%, rgba(255,255,255,0.6) 72%, rgba(255,255,255,0.92) 88%, #ffffff 100%)',
              }}
            />

            {/* Hero Text - Bottom Left: line 1 then line 2, then paragraph */}
            <motion.div
              className="absolute bottom-14 md:bottom-20 lg:bottom-24 left-8 md:left-14 lg:left-20 max-w-2xl z-10"
              style={{
                opacity: textOpacity,
                y: textY,
              }}
            >
              <h1 className="text-[2.5rem] md:text-5xl lg:text-6xl xl:text-[4rem] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-900">
                Reshaping the Future.
              </h1>
              <h1 className="text-[2.5rem] md:text-5xl lg:text-6xl xl:text-[4rem] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-900 mt-1 whitespace-nowrap">
                Innovating, Disrupting, Redefining.
              </h1>
              <p className="mt-6 text-[15px] md:text-base text-neutral-600 leading-[1.6] max-w-lg font-normal">
                Challenging conventions, breaking limits, and setting new standards through bold ideas and visionary design.
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
    </>
  );
}
