'use client';

import type { RefObject } from 'react';
import TransitionLink from '@/components/TransitionLink';
import { useNavMenu } from '@/context/NavMenuContext';

interface HeroProps {
  videoRef?: RefObject<HTMLVideoElement | null>;
}

export default function Hero({ videoRef }: HeroProps) {
  const { menuOpen } = useNavMenu();

  return (
    <section className="relative h-screen w-full overflow-hidden bg-neutral-900">
      <div className="absolute inset-0">
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
      </div>

      <div
        className={`absolute inset-x-0 z-10 flex flex-col items-center justify-center px-6 text-center transition-all duration-300 ${
          menuOpen ? 'top-1/2 bottom-0' : 'inset-y-0'
        }`}
      >
        <div className="min-h-[4rem] sm:min-h-[5rem]" aria-hidden="true" />

        <TransitionLink
          href="/home"
          className="inline-flex items-center justify-center rounded-full border border-white px-8 sm:px-10 py-3 text-sm sm:text-base lowercase text-white tracking-normal hover:bg-white/10 transition-colors"
        >
          shop
        </TransitionLink>
      </div>
    </section>
  );
}
