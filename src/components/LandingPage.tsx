'use client';

import { useEffect, useRef } from 'react';
import TransitionLink from '@/components/TransitionLink';
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
          .then(() => { if (!cancelled) reportPageReady(); })
          .catch(() => { if (!cancelled) reportPageReady(); });
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
    <main className="relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        src="/hero/sea.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Single shop button centered */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <TransitionLink
          href="/home"
          className="px-8 py-2.5 rounded-full border border-white/80 text-white text-sm tracking-widest hover:bg-white hover:text-black transition-colors duration-200"
        >
          shop
        </TransitionLink>
      </div>
    </main>
  );
}
