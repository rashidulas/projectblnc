'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLoading } from '@/context/LoadingContext';

export default function HomeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { reportPageReady } = useLoading();

  useEffect(() => {
    const updateIsMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };

    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  useEffect(() => {
    if (pathname !== '/home') return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const attach = () => {
      const video = videoRef.current;
      if (!video) {
        requestAnimationFrame(attach);
        return;
      }

      const markReady = () => {
        if (cancelled) return;
        video
          .play()
          .then(() => {
            if (!cancelled) reportPageReady();
          })
          .catch(() => {
            if (!cancelled) reportPageReady();
          });
      };

      video.addEventListener('canplaythrough', markReady, { once: true });
      video.preload = 'auto';
      video.load();

      if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
        markReady();
      }

      const fallback = setTimeout(() => {
        if (!cancelled) reportPageReady();
      }, 10000);

      cleanup = () => clearTimeout(fallback);
    };

    attach();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pathname, reportPageReady]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

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
      className="relative w-full bg-neutral-50 -mb-px min-h-screen md:min-h-[150vh]"
    >
      <div className="relative md:sticky top-0 h-screen w-full overflow-hidden bg-neutral-50 isolate">
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
              ref={videoRef}
              src="/hero/g1.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center center' }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(244,244,242,0.25) 55%, rgba(244,244,242,0.6) 72%, rgba(244,244,242,0.92) 88%, #F4F4F2 100%)',
              }}
            />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-12 sm:bottom-14 md:bottom-20 lg:bottom-24 left-4 sm:left-8 md:left-14 lg:left-20 right-4 sm:right-auto max-w-2xl z-10"
          style={{ opacity: textOpacity, y: textY }}
        >
          <h1 className="text-4xl sm:text-[2.5rem] md:text-5xl lg:text-6xl xl:text-[4rem] font-bold leading-[1.05] tracking-[-0.02em] text-neutral-900">
            Redefining Essentials.
          </h1>
          <h1 className="text-4xl sm:text-[2.5rem] md:text-5xl lg:text-6xl xl:text-[4rem] font-bold leading-[1.05] tracking-[-0.02em] text-neutral-900 mt-1 break-words">
            Redefining Essentials.
          </h1>
          <p className="font-description mt-4 sm:mt-6 text-base sm:text-[15px] md:text-base text-neutral-600 leading-[1.6] max-w-lg font-normal">
            Redefining Essentials.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
