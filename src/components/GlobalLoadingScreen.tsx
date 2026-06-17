'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '@/context/LoadingContext';

const FADE_OUT_S = 0.65;

export default function GlobalLoadingScreen() {
  const { phase, pendingHref, finishExit } = useLoading();
  const isActive = phase === 'visible' || phase === 'exiting';

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key={pendingHref ?? 'initial'}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F2F2F2]"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'exiting' ? 0 : 1 }}
          transition={{ duration: FADE_OUT_S, ease: [0.25, 0.1, 0.25, 1] }}
          onAnimationComplete={() => {
            if (phase === 'exiting') finishExit();
          }}
          aria-hidden="true"
          aria-busy={phase === 'visible'}
        >
          <motion.span
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-neutral-900 select-none lowercase"
            initial={{ opacity: 0, scale: 0.82 }}
            animate={
              phase === 'exiting'
                ? { opacity: 0, scale: 1.04 }
                : { opacity: 1, scale: 1 }
            }
            transition={
              phase === 'exiting'
                ? { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
                : {
                    type: 'spring',
                    stiffness: 420,
                    damping: 18,
                    mass: 0.85,
                  }
            }
          >
            blanc
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
