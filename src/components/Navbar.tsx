'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';
import { ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const { openCart, cartItemsCount } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-sm border-b border-neutral-200'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              className={`text-base font-semibold tracking-tight hover:opacity-70 transition-all ${
                scrolled ? 'text-neutral-900' : 'text-neutral-800'
              }`}
            >
              Project BLNC
            </Link>

            {/* Center Navigation - Desktop Only */}
            <div className="hidden md:flex items-center space-x-10">
              <Link
                href="/products"
                className={`text-sm tracking-wide hover:opacity-70 transition-all ${
                  scrolled ? 'text-neutral-900' : 'text-neutral-800'
                }`}
              >
                Product
              </Link>
              <Link
                href="/news"
                className={`text-sm tracking-wide hover:opacity-70 transition-all ${
                  scrolled ? 'text-neutral-900' : 'text-neutral-800'
                }`}
              >
                News
              </Link>
              <Link
                href="/about"
                className={`text-sm tracking-wide hover:opacity-70 transition-all ${
                  scrolled ? 'text-neutral-900' : 'text-neutral-800'
                }`}
              >
                About
              </Link>
            </div>

            {/* Cart Icon */}
            <button
              onClick={openCart}
              className={`relative p-2 hover:opacity-70 transition-all ${
                scrolled ? 'text-neutral-900' : 'text-neutral-800'
              }`}
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-center space-x-8 pb-3 border-t border-neutral-200/50 pt-3">
            <Link
              href="/products"
              className={`text-xs tracking-wide hover:opacity-70 transition-all ${
                scrolled ? 'text-neutral-900' : 'text-neutral-800'
              }`}
            >
              Product
            </Link>
            <Link
              href="/news"
              className={`text-xs tracking-wide hover:opacity-70 transition-all ${
                scrolled ? 'text-neutral-900' : 'text-neutral-800'
              }`}
            >
              News
            </Link>
            <Link
              href="/about"
              className={`text-xs tracking-wide hover:opacity-70 transition-all ${
                scrolled ? 'text-neutral-900' : 'text-neutral-800'
              }`}
            >
              About
            </Link>
          </div>
        </div>
      </nav>
      <CartDrawer />
    </>
  );
}
