'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { usePageTransition } from '@/context/PageTransitionContext';
import { useEffect, useRef } from 'react';

const DURATION = 0.4;
const EASE = [0.25, 0.1, 0.25, 1];

export default function PageTransitionOverlay() {
  const router = useRouter();
  const { state, pendingHref, setRevealing, finishRevealing } = usePageTransition();
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
    if (isCovering && pendingHref && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      router.push(pendingHref);
      setRevealing();
    } else if (state === 'revealing') {
      finishRevealing();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-white"
      initial={{ y: '-100%' }}
      animate={{ y: isCovering ? '0%' : '-100%' }}
      transition={{ duration: DURATION, ease: EASE }}
      onAnimationComplete={handleAnimationComplete}
      style={{ willChange: 'transform' }}
    />
  );
}
