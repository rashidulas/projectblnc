'use client';

import { type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PageTransitionProvider as Provider } from '@/context/PageTransitionContext';
import PageTransitionOverlay from '@/components/PageTransitionOverlay';

export default function PageTransitionProvider({ children }: { children: ReactNode }) {
  return (
    <Provider>
      {children}
      <AnimatePresence mode="sync">
        <PageTransitionOverlay />
      </AnimatePresence>
    </Provider>
  );
}
