'use client';

import { motion } from 'framer-motion';
import { usePageTransition } from '@/context/PageTransitionContext';
import { useEffect, useRef } from 'react';

const COVER_DURATION = 0.22;
const REVEAL_DURATION = 0.2;
const EASE_OUT = [0.33, 1, 0.68, 1];

export default function PageTransitionOverlay() {
  const { state, setRevealing, finishRevealing } = usePageTransition();
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    if (state === null) {
      hasNavigatedRef.current = false;
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [state]);

  if (state === null) return null;

  const isCovering = state === 'covering';

  const handleAnimationComplete = () => {
    if (isCovering && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      setRevealing();
    } else if (state === 'revealing') {
      finishRevealing();
    }
  };

  const duration = isCovering ? COVER_DURATION : REVEAL_DURATION;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-white"
      initial={{ y: '-100%' }}
      animate={{ y: isCovering ? '0%' : '-100%' }}
      transition={{ duration, ease: EASE_OUT }}
      onAnimationComplete={handleAnimationComplete}
      style={{ willChange: 'transform' }}
    />
  );
}
