'use client';

import { useEffect, useState } from 'react';

/**
 * Minimal intro loader: a white overlay with the BLANC wordmark.
 * Plain React + CSS (no animation library) so it can never get "stuck":
 *   - mounts visible
 *   - after a hold, starts a CSS opacity fade
 *   - after the fade, fully unmounts and restores scrolling
 */
export default function LoadingScreen() {
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const holdMs = reduceMotion ? 300 : 1400;
    const fadeMs = reduceMotion ? 0 : 600;

    // Start the fade after the hold.
    const fadeTimer = setTimeout(() => setFading(true), holdMs);
    // Fully remove + restore scroll after the fade finishes.
    const doneTimer = setTimeout(() => {
      setGone(true);
      document.body.style.overflow = '';
    }, holdMs + fadeMs);

    // Safety net: no matter what, remove the overlay and restore scroll
    // after 3 seconds so the page is never permanently blocked.
    const safety = setTimeout(() => {
      setGone(true);
      document.body.style.overflow = '';
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
      clearTimeout(safety);
      document.body.style.overflow = '';
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        opacity: fading ? 0 : 1,
        transition: 'opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <span className="text-4xl sm:text-5xl font-bold tracking-tighter text-neutral-900 select-none">
        BLANC
      </span>
    </div>
  );
}
