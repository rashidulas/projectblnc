'use client';

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="bg-white text-neutral-900"
      style={{ boxShadow: '0 -2px 10px rgba(0,0,0,0.04)' }}
    >
      {/* Top line with shade */}
      <div className="h-px w-full bg-neutral-200" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }} />
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        {/* Top */}
        <div className="grid grid-cols-1 gap-12 pt-12 md:grid-cols-2 md:gap-8 md:pt-16">
          {/* Left: Newsletter */}
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl">
              Join Our Newsletter!
            </h2>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 max-w-2xl"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>

              <input
                id="newsletter-email"
                type="email"
                placeholder="newsletter@vaertemplate.com"
                className="w-full bg-transparent pb-3 text-base outline-none placeholder:text-neutral-500 border-b border-neutral-300 focus:border-neutral-600"
              />

              <button
                type="submit"
                className="mt-6 w-full max-w-2xl bg-neutral-900 py-3 text-center text-base font-medium text-white rounded-md hover:bg-neutral-800 active:bg-neutral-950"
              >
                Join
              </button>
            </form>
          </div>

          {/* Right: Nav */}
          <nav className="md:justify-self-end">
            <ul className="space-y-4 text-base font-medium text-neutral-800 md:text-lg">
              <li>
                <Link href="/" className="hover:opacity-70">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:opacity-70">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:opacity-70">
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-neutral-200" />

        {/* Bottom */}
        <div className="py-8 text-center text-sm text-neutral-600">
          © {new Date().getFullYear()} VAER. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
