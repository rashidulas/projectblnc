'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type TransitionState = 'covering' | 'revealing' | null;

type PageTransitionContextValue = {
  state: TransitionState;
  pendingHref: string | null;
  startTransition: (href: string) => void;
  setRevealing: () => void;
  finishRevealing: () => void;
  setPendingHref: (href: string | null) => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TransitionState>(null);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const startTransition = useCallback((href: string) => {
    setPendingHref(href);
    setState('covering');
  }, []);

  const setRevealing = useCallback(() => {
    setState('revealing');
    setPendingHref(null);
  }, []);

  const finishRevealing = useCallback(() => {
    setState(null);
  }, []);

  return (
    <PageTransitionContext.Provider
      value={{
        state,
        pendingHref,
        startTransition,
        setRevealing,
        finishRevealing,
        setPendingHref,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) {
    throw new Error('usePageTransition must be used within PageTransitionProvider');
  }
  return ctx;
}
