'use client';

import TransitionLink from '@/components/TransitionLink';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-neutral-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <TransitionLink
          href="/"
          className="inline-block px-8 py-4 bg-black text-white rounded-md hover:opacity-90 transition-opacity font-medium"
        >
          Return Home
        </TransitionLink>
      </div>
    </div>
  );
}
