'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep scroll effects lighter / more stable on small screens
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };

    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);

    return () => {
      window.removeEventListener('resize', updateIsMobile);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Video: slightly softer transforms on mobile for smoother, less "jumpy" behavior
  const videoScale = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [1.03, 1.01] : [1.08, 1.02]
  );
  const videoY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [0, -10] : [0, -30]
  );

  // Text: lighter motion on mobile so it stays legible and more stable
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6],
    isMobile ? [1, 0.7, 0.15] : [1, 0.5, 0]
  );
  const textY = useTransform(
    scrollYProgress,
    [0, 0.5],
    isMobile ? [0, -24] : [0, -60]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-white -mb-px min-h-[120vh] md:min-h-[150vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-white isolate">
        {/* Hero Video - transforms on scroll (extends beyond edges to prevent seam) */}
        <motion.div
          className="absolute -inset-[3%] overflow-hidden"
          style={{
            scale: videoScale,
            y: videoY,
            backfaceVisibility: 'hidden',
            willChange: 'transform',
          }}
        >
          <div className="absolute inset-0 w-full h-full">
            <video
              src="/hero/g1.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center center' }}
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
          className="absolute bottom-14 sm:bottom-14 md:bottom-20 lg:bottom-24 left-6 sm:left-8 md:left-14 lg:left-20 right-6 sm:right-auto max-w-2xl z-10"
          style={{
            opacity: textOpacity,
            y: textY,
          }}
        >
          <h1 className="text-4xl sm:text-[2.5rem] md:text-5xl lg:text-6xl xl:text-[4rem] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-900">
            Redefining Essentials.
          </h1>
          <h1 className="text-4xl sm:text-[2.5rem] md:text-5xl lg:text-6xl xl:text-[4rem] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-900 mt-1 whitespace-nowrap break-words sm:break-normal">
            Silhouettes Built for Movement
          </h1>
          <p className="font-description mt-4 sm:mt-6 text-base sm:text-[15px] md:text-base text-neutral-600 leading-[1.6] max-w-lg font-normal">
            Essentials Designed for Everywhere.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
