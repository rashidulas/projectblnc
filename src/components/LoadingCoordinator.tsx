'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ASSET_HEAVY_ROUTES, useLoading } from '@/context/LoadingContext';

/**
 * Shows the loader before page content and reports ready once navigation
 * completes. For asset-heavy routes we still report ready after paint (with
 * a couple of animation frames so the hero has a moment to start), while the
 * context's max-hold timer guarantees dismissal even if something stalls.
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

    // Report ready after the content has had a chance to paint. A short
    // delay on asset-heavy routes lets the hero begin rendering; lightweight
    // routes resolve almost immediately.
    const heavy = ASSET_HEAVY_ROUTES.has(pathname);
    const delay = heavy ? 400 : 0;

    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => reportPageReady());
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [phase, pendingHref, pathname, reportPageReady]);

  return null;
}
