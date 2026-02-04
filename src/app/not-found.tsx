'use client';

import TransitionLink from '@/components/TransitionLink';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="text-center max-w-md">
        <h1 className="text-5xl sm:text-6xl font-bold mb-3 sm:mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Page Not Found</h2>
        <p className="font-description text-sm sm:text-base text-neutral-600 mb-6 sm:mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <TransitionLink
          href="/"
          className="inline-block px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] bg-black text-white rounded-md hover:opacity-90 active:opacity-95 transition-opacity font-medium"
        >
          Return Home
        </TransitionLink>
      </div>
    </div>
  );
}
