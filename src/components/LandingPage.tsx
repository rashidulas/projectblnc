'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '@/components/Hero';

const MIN_LOADER_MS = 1100;
const FADE_OUT_MS = 1000;

export default function LandingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minMs = reduceMotion ? 350 : MIN_LOADER_MS;
    const timer = setTimeout(() => setMinTimeElapsed(true), minMs);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
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
            if (!cancelled) setVideoReady(true);
          })
          .catch(() => {
            if (!cancelled) setVideoReady(true);
          });
      };

      const onCanPlayThrough = () => markReady();

      video.addEventListener('canplaythrough', onCanPlayThrough);
      video.preload = 'auto';
      video.load();

      if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
        markReady();
      }

      const fallback = setTimeout(() => {
        if (!cancelled) setVideoReady(true);
      }, 10000);

      cleanup = () => {
        video.removeEventListener('canplaythrough', onCanPlayThrough);
        clearTimeout(fallback);
      };
    };

    attach();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    if (videoReady && minTimeElapsed) {
      setLoaderVisible(false);
    }
  }, [videoReady, minTimeElapsed]);

  const handleExitComplete = () => {
    document.body.style.overflow = '';
  };

  return (
    <main className="overflow-x-hidden">
      <Hero videoRef={videoRef} />

      <AnimatePresence onExitComplete={handleExitComplete}>
        {loaderVisible && (
          <motion.div
            key="landing-loader"
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#F2F2F2] pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: FADE_OUT_MS / 1000,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            aria-hidden="true"
          >
            <motion.span
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-neutral-900 select-none lowercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              blanc
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
