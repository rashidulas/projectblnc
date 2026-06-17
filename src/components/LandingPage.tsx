'use client';

import { useEffect, useRef } from 'react';
import Hero from '@/components/Hero';
import { useLoading } from '@/context/LoadingContext';

export default function LandingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { reportPageReady } = useLoading();

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const attach = () => {
      const video = videoRef.current;
      if (!video) {
        requestAnimationFrame(attach);
        return;
      }

      const markReady = () => {
        if (cancelled) return;
        video
          .play()
          .then(() => {
            if (!cancelled) reportPageReady();
          })
          .catch(() => {
            if (!cancelled) reportPageReady();
          });
      };

      video.addEventListener('canplaythrough', markReady, { once: true });
      video.preload = 'auto';
      video.load();

      if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
        markReady();
      }

      const fallback = setTimeout(() => {
        if (!cancelled) reportPageReady();
      }, 10000);

      cleanup = () => clearTimeout(fallback);
    };

    attach();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reportPageReady]);

  return (
    <main className="overflow-x-hidden">
      <Hero videoRef={videoRef} />
    </main>
  );
}
