'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Minimal intro loader: a white overlay with the BLANC wordmark that fades
 * in, holds briefly, then fades out and unmounts. Shows on every homepage
 * load. Respects prefers-reduced-motion (skips quickly without big movement).
 */
export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Lock scroll while the loader is up so the page doesn't jump underneath.
    document.body.style.overflow = 'hidden';

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const holdMs = reduceMotion ? 400 : 1400;
    const timer = setTimeout(() => setVisible(false), holdMs);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  // Restore scrolling the moment we start leaving.
  const handleExitStart = () => {
    document.body.style.overflow = '';
  };

  return (
    <AnimatePresence onExitComplete={handleExitStart}>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#F2F2F2]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onAnimationStart={handleExitStart}
          aria-hidden="true"
        >
          <motion.span
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-neutral-900 select-none lowercase"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            blanc
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
