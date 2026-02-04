'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Image: smooth scale down and slight move up as user scrolls
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  // Text: smooth fade out and slide up
  const textOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 0.5, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <div ref={containerRef} className="relative w-full bg-white" style={{ height: '150vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
        {/* Hero Image - transforms on scroll */}
        <motion.div
          className="absolute inset-0"
          style={{
            scale: imageScale,
            y: imageY,
          }}
        >
          <div className="absolute inset-0">
            <Image
              src="/hero/bnw.png"
              alt="Hero"
              fill
              priority
              className="object-cover"
              style={{ objectPosition: 'center center' }}
              sizes="100vw"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(255,255,255,0.25) 55%, rgba(255,255,255,0.6) 72%, rgba(255,255,255,0.92) 88%, #ffffff 100%)',
              }}
            />
          </div>
        </motion.div>

        {/* Hero Text - fades and slides up on scroll */}
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
      </div>
    </div>
  );
}
