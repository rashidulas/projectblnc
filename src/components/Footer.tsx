'use client';

import TransitionLink from '@/components/TransitionLink';

export default function Footer() {
  return (
    <footer
      className="bg-white text-neutral-900"
      style={{ boxShadow: '0 -2px 10px rgba(0,0,0,0.04)' }}
    >
      {/* Top line with shade */}
      <div className="h-px w-full bg-neutral-200" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-12">
        {/* Top */}
        <div className="grid grid-cols-1 gap-10 sm:gap-12 pt-10 sm:pt-12 md:grid-cols-2 md:gap-8 md:pt-16">
          {/* Left: Newsletter */}
          <div className="max-w-2xl">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl">
              Join Our Newsletter!
            </h2>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 sm:mt-6 max-w-2xl"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>

              <input
                id="newsletter-email"
                type="email"
                placeholder="newsletter@blanctemplate.com"
                className="w-full bg-transparent pb-3 text-base outline-none placeholder:text-neutral-500 border-b border-neutral-300 focus:border-neutral-600 min-h-[48px] sm:min-h-0"
              />

              <button
                type="submit"
                className="mt-4 sm:mt-6 w-full max-w-2xl bg-neutral-900 py-3.5 sm:py-3 text-center text-base font-medium text-white rounded-md hover:bg-neutral-800 active:bg-neutral-950 min-h-[48px] sm:min-h-0"
              >
                Join
              </button>
            </form>
          </div>

          {/* Right: Nav */}
          <nav className="md:justify-self-end">
            <ul className="space-y-2 sm:space-y-4 text-base font-medium text-neutral-800 md:text-lg">
              <li>
                <TransitionLink href="/" className="hover:opacity-70 active:opacity-80 block py-3 sm:py-0 sm:inline">
                  Home
                </TransitionLink>
              </li>
              <li>
                <TransitionLink href="/products" className="hover:opacity-70 active:opacity-80 block py-3 sm:py-0 sm:inline">
                  Shop
                </TransitionLink>
              </li>
              <li>
                <TransitionLink href="/about" className="hover:opacity-70 active:opacity-80 block py-3 sm:py-0 sm:inline">
                  About
                </TransitionLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="mt-8 sm:mt-12 border-t border-neutral-200" />

        {/* Bottom */}
        <div className="py-6 sm:py-8 text-center text-xs sm:text-sm text-neutral-600 px-2">
          © {new Date().getFullYear()} BLANC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
