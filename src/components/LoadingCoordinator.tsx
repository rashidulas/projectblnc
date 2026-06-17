'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ASSET_HEAVY_ROUTES, useLoading } from '@/context/LoadingContext';

/**
 * Shows the loader before page content and auto-reports ready for
 * lightweight routes once navigation completes.
 */
export default function LoadingCoordinator() {
  const pathname = usePathname();
  const { phase, pendingHref, reportPageReady, beginInitialLoad, beginNavigation } =
    useLoading();
  const startedHeavyRoutes = useRef<Set<string>>(new Set());

  useLayoutEffect(() => {
    if (!ASSET_HEAVY_ROUTES.has(pathname)) return;
    if (startedHeavyRoutes.current.has(pathname)) return;
    if (phase !== 'hidden' || pendingHref) return;

    startedHeavyRoutes.current.add(pathname);
    if (pathname === '/') {
      beginInitialLoad();
    } else {
      beginNavigation(pathname);
    }
  }, [pathname, phase, pendingHref, beginInitialLoad, beginNavigation]);

  useEffect(() => {
    if (phase !== 'visible' || !pendingHref) return;
    if (pathname !== pendingHref) return;
    if (ASSET_HEAVY_ROUTES.has(pathname)) return;

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => reportPageReady());
    });

    return () => cancelAnimationFrame(frame);
  }, [phase, pendingHref, pathname, reportPageReady]);

  return null;
}
