'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState('');

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const { openCart, cartItemsCount } = useCart();

  // Scroll progress tracking for the hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Navbar background opacity - transparent to semi-transparent white
  const navBgOpacity = useTransform(scrollYProgress, [0, 0.1, 0.3], [0, 0.5, 0.95]);

  // Image width transformation: 100vw → 80vw → max 1200px
  const imageWidth = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['100vw', '85vw', '1200px']
  );
  
  // Image height transformation: 100vh → 500px
  const imageHeight = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['100vh', '70vh', '500px']
  );
  
  // Border radius transformation: 0px → 24px
  const imageBorderRadius = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['0px', '16px', '24px']
  );

  // Vertical position - slight upward movement as it shrinks
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  // Hero text opacity fade: 1 → 0
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 0.6, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  // Genesis section reveal
  const genesisOpacity = useTransform(scrollYProgress, [0.4, 0.6, 0.8], [0, 1, 1]);
  const genesisY = useTransform(scrollYProgress, [0.4, 0.7], [60, 0]);

  // Product grid reveal
  const gridOpacity = useTransform(scrollYProgress, [0.6, 0.8, 1], [0, 0.5, 1]);
  const gridY = useTransform(scrollYProgress, [0.6, 0.9], [150, 0]);

  return (
    <>
      {/* Permanent Sticky Navbar - Fixed at Top */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        {/* Dynamic background that fades in on scroll */}
        <motion.div
          className="absolute inset-0 bg-white backdrop-blur-md"
          style={{ opacity: navBgOpacity }}
        />
        
        {/* Thin Progress Bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px] bg-black origin-left"
          style={{ scaleX: scrollYProgress }}
        />
        
        {/* Navbar Content */}
        <div className="relative flex items-center justify-between px-6 h-16">
          {/* Left: Hamburger Menu */}
          <button 
            className="p-2 hover:opacity-70 transition-opacity text-black"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Center: VAER Logo */}
          <Link 
            href="/" 
            className="absolute left-1/2 -translate-x-1/2 text-xl font-bold tracking-tighter text-black"
          >
            VAER
          </Link>

          {/* Right: Clock & Cart */}
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono tracking-wider text-black">
              {currentTime}
            </div>
            
            <button
              onClick={openCart}
              className="relative p-2 hover:opacity-70 transition-opacity text-black"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Subtle border that fades in */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-neutral-200"
          style={{ opacity: navBgOpacity }}
        />
      </nav>
      
      <CartDrawer />

      {/* Hero Section - Full Viewport, No Container Constraints */}
      <div 
        ref={containerRef} 
        className="relative w-screen bg-white" 
        style={{ height: '300vh', marginLeft: 'calc(-50vw + 50%)', width: '100vw' }}
      >
        {/* Sticky Container - Centers the shrinking image */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-white">
          
          {/* Hero Image Container with Scroll Transformations */}
          <motion.div
            className="relative overflow-hidden"
            style={{
              width: imageWidth,
              height: imageHeight,
              borderRadius: imageBorderRadius,
              y: imageY,
            }}
          >
            {/* Next.js Image with Cover Fit */}
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
            
            {/* Gradient Mask at Bottom for Smooth Fade to White */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/40 pointer-events-none" />

            {/* Hero Text - Bottom Left, Fades Out on Scroll */}
            <motion.div
              className="absolute bottom-12 md:bottom-16 lg:bottom-20 left-6 md:left-10 lg:left-16 max-w-2xl z-10"
              style={{
                opacity: textOpacity,
                y: textY,
              }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.95] tracking-tighter text-white drop-shadow-lg mb-6">
                Reshaping the Future.
                <br />
                <span className="text-white/90">
                  Innovating, Disrupting,
                  <br />
                  Redefining.
                </span>
              </h1>
              <p className="text-sm md:text-base text-white/80 drop-shadow leading-relaxed max-w-md">
                A new era of luxury streetwear — minimal, bold, and built to feel timeless.
              </p>
            </motion.div>
          </motion.div>

          {/* Genesis Section - Reveals as Image Shrinks */}
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
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ 
                      delay: idx * 0.08,
                      duration: 0.5,
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
