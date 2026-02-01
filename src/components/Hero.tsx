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
  const { openCart, cartItemsCount } = useCart();

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

  // Scroll progress tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Image transformations - scale down from 1 to 0.3, move to top center
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);
  const imageY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -20, -350]);
  const imageBorderRadius = useTransform(scrollYProgress, [0, 0.5, 1], [0, 12, 24]);
  
  // Text animations - fade out completely
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 0.5, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -100]);

  // Genesis section reveal
  const genesisOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 1]);
  const genesisY = useTransform(scrollYProgress, [0.3, 0.6], [100, 0]);

  // Product grid reveal - slide up from bottom
  const gridOpacity = useTransform(scrollYProgress, [0.5, 0.7, 0.9], [0, 0.5, 1]);
  const gridY = useTransform(scrollYProgress, [0.5, 0.8], [200, 0]);

  return (
    <>
      {/* Minimalist Sticky Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm">
        {/* Thin Progress Bar */}
        <motion.div
          className="h-[1px] bg-black origin-left"
          style={{ scaleX: scrollYProgress }}
        />
        
        {/* Main Navbar Content */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-neutral-200/50">
          {/* Hamburger Menu */}
          <button 
            className="p-2 hover:opacity-70 transition-opacity"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Center Logo */}
          <Link 
            href="/" 
            className="absolute left-1/2 -translate-x-1/2 text-xl font-bold tracking-tighter"
          >
            VAER
          </Link>

          {/* Right Side: Clock & Cart */}
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono tracking-wider text-neutral-600">
              {currentTime}
            </div>
            
            <button
              onClick={openCart}
              className="relative p-2 hover:opacity-70 transition-opacity"
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
      </nav>
      
      <CartDrawer />

      {/* Hero Section */}
      <div ref={containerRef} className="relative" style={{ height: '300vh' }}>
        {/* Sticky Container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Hero Image Container */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-full h-full"
            style={{
              scale: imageScale,
              y: imageY,
              top: '0',
            }}
          >
            <motion.div
              className="relative w-full h-full overflow-hidden"
              style={{
                borderRadius: imageBorderRadius,
              }}
            >
              <Image
                src="/hero/bg.jpeg"
                alt="Hero"
                fill
                priority
                className="object-cover grayscale"
                sizes="100vw"
              />
              
              {/* Subtle overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </motion.div>
          </motion.div>

          {/* Hero Text - Bottom Left */}
          <motion.div
            className="absolute bottom-20 left-8 md:left-16 max-w-2xl z-10"
            style={{
              opacity: textOpacity,
              y: textY,
            }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tighter text-white mb-6">
              Reshaping the Future.
              <br />
              <span className="text-neutral-300">
                Innovating, Disrupting,
                <br />
                Redefining.
              </span>
            </h1>
            <p className="text-sm md:text-base text-neutral-400 leading-relaxed max-w-md">
              A new era of luxury streetwear — minimal, bold, and built to feel timeless.
            </p>
          </motion.div>

          {/* Genesis Section - Reveals as image shrinks */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center"
            style={{
              opacity: genesisOpacity,
              y: genesisY,
            }}
          >
            <div className="space-y-1">
              <div className="text-xs tracking-[0.3em] text-neutral-500 font-light">
                GENESIS
              </div>
              <div className="text-4xl md:text-6xl font-bold tracking-tighter">
                // DROP 001
              </div>
              <div className="text-xs tracking-widest text-neutral-600 mt-4">
                AVAILABLE NOW
              </div>
            </div>
          </motion.div>

          {/* Product Grid - Slides up from bottom */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 px-6 pb-16 z-30"
            style={{
              opacity: gridOpacity,
              y: gridY,
            }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {FEATURED_PRODUCTS.map((src, idx) => (
                  <motion.div
                    key={idx}
                    className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: idx * 0.1,
                      duration: 0.6,
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
