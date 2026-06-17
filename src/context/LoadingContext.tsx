'use client';

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type LoadingPhase = 'hidden' | 'visible' | 'exiting';

type LoadingContextValue = {
  phase: LoadingPhase;
  pendingHref: string | null;
  beginNavigation: (href: string) => void;
  beginInitialLoad: () => void;
  reportPageReady: () => void;
  finishExit: () => void;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

/** Routes that must preload hero video before the loader can dismiss. */
export const ASSET_HEAVY_ROUTES = new Set(['/', '/home']);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<LoadingPhase>('hidden');
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const phaseRef = useRef<LoadingPhase>('hidden');
  const pageReadyRef = useRef(false);
  const minHoldDoneRef = useRef(false);
  const minHoldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setPhaseSafe = useCallback((next: LoadingPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const clearMinHoldTimer = () => {
    if (minHoldTimerRef.current) {
      clearTimeout(minHoldTimerRef.current);
      minHoldTimerRef.current = null;
    }
  };

  const tryExit = useCallback(() => {
    if (pageReadyRef.current && minHoldDoneRef.current && phaseRef.current === 'visible') {
      setPhaseSafe('exiting');
    }
  }, [setPhaseSafe]);

  const startMinHold = useCallback(() => {
    clearMinHoldTimer();
    minHoldDoneRef.current = false;
    minHoldTimerRef.current = setTimeout(() => {
      minHoldDoneRef.current = true;
      tryExit();
    }, 550);
  }, [tryExit]);

  const beginNavigation = useCallback(
    (href: string) => {
      pageReadyRef.current = !ASSET_HEAVY_ROUTES.has(href);
      setPendingHref(href);
      setPhaseSafe('visible');
      document.body.style.overflow = 'hidden';
      startMinHold();
    },
    [setPhaseSafe, startMinHold]
  );

  const beginInitialLoad = useCallback(() => {
    pageReadyRef.current = false;
    setPendingHref('/');
    setPhaseSafe('visible');
    document.body.style.overflow = 'hidden';
    startMinHold();
  }, [setPhaseSafe, startMinHold]);

  const reportPageReady = useCallback(() => {
    pageReadyRef.current = true;
    tryExit();
  }, [tryExit]);

  const finishExit = useCallback(() => {
    if (phaseRef.current === 'hidden') return;
    setPhaseSafe('hidden');
    setPendingHref(null);
    pageReadyRef.current = false;
    minHoldDoneRef.current = false;
    clearMinHoldTimer();
    document.body.style.overflow = '';
  }, [setPhaseSafe]);

  return (
    <LoadingContext.Provider
      value={{
        phase,
        pendingHref,
        beginNavigation,
        beginInitialLoad,
        reportPageReady,
        finishExit,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return ctx;
}
