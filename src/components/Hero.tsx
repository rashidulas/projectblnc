'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  const [vpH, setVpH] = useState(0);
  const [imgH, setImgH] = useState(0); // actual rendered height in px

  // viewport height
  useEffect(() => {
    const onResize = () => setVpH(window.innerHeight);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // measure the wrapper height AFTER image layout
  const measure = () => {
    requestAnimationFrame(() => {
      const h = imgWrapRef.current?.getBoundingClientRect().height ?? 0;
      setImgH(h);
    });
  };

  const maxShift = Math.max(0, imgH - vpH);
  const sectionHeight = vpH + maxShift;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Move image up exactly until the bottom is visible
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -maxShift]);

  // Subtle premium effect (optional)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.55]);

  return (
    <section
      ref={heroRef}
      className="relative w-full bg-white overflow-hidden"
      style={{ height: sectionHeight ? `${sectionHeight}px` : '100vh' }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Image wrapper: width=100vw, height auto based on intrinsic ratio */}
        <motion.div
          style={{ y: imageY, scale }}
          className="relative w-full"
        >
          <div ref={imgWrapRef} className="relative w-full">
            {/* IMPORTANT: use width/height so the element has a real aspect ratio/height */}
            <Image
              src="/hero/bg.jpeg"
              alt="Hero"
              width={1200}
              height={2000}
              priority
              quality={95}
              className="w-full h-auto object-cover object-top"
              onLoad={measure}
            />
          </div>
        </motion.div>

        {/* Fog overlay */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 via-35% to-transparent"
        />

        {/* Text */}
        <div className="relative h-screen flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-28 md:pb-40 w-full">
            <div className="max-w-3xl">
              <h1 className="text-[44px] md:text-[72px] leading-[1.05] font-semibold tracking-tight text-neutral-900">
                Reshaping the Future.
                <br />
                Innovating, Disrupting, Redefining.
              </h1>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed max-w-md mt-6">
                A new era of luxury streetwear — minimal, bold, and built to feel timeless.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
