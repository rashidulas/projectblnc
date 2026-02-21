'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Video: smooth scale down and slight move up as user scrolls (scale always > 1 to prevent seam)
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.02]);
  const videoY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  // Text: smooth fade out and slide up
  const textOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 0.5, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <div ref={containerRef} className="relative w-full bg-white -mb-px" style={{ height: '150vh' }}>
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
              src="/hero/freepik_create-a-detailed-scene-featuring-this-model-image_kling_1080p_16-9_24fps_5576.mp4"
              autoPlay
              loop
              muted
              playsInline
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
            Reshaping the Future.
          </h1>
          <h1 className="text-4xl sm:text-[2.5rem] md:text-5xl lg:text-6xl xl:text-[4rem] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-900 mt-1 whitespace-nowrap break-words sm:break-normal">
            Innovating, Disrupting, Redefining.
          </h1>
          <p className="font-description mt-4 sm:mt-6 text-base sm:text-[15px] md:text-base text-neutral-600 leading-[1.6] max-w-lg font-normal">
            Challenging conventions, breaking limits, and setting new standards through bold ideas and visionary design.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
