'use client';

import { useEffect, useState } from 'react';
import TransitionLink from '@/components/TransitionLink';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import CartDrawer from './CartDrawer';

export default function PermanentNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openCart, cartItemsCount } = useCart();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#e7ebea]" style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}>
        {/* Top bar */}
        <div className="relative flex items-center justify-center w-full px-6 h-12">
          {/* Centre: blanc as menu toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="font-mono text-[16px] tracking-widest text-neutral-700 hover:opacity-60 transition-opacity lowercase"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            blanc
          </button>

          {/* Right: bag */}
          <button
            onClick={openCart}
            className="absolute right-6 font-mono text-[16px] tracking-widest text-neutral-700 hover:opacity-60 transition-opacity lowercase"
            aria-label="Open cart"
          >
            bag{cartItemsCount > 0 ? ` (${cartItemsCount})` : ''}
          </button>
        </div>

        {/* Dropdown menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden bg-[#e7ebea]"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
            >
              <ul className="py-10 flex flex-col items-center gap-6 text-center">
                <li>
                  <TransitionLink
                    href="/home"
                    onClick={() => setMenuOpen(false)}
                    className="font-mono text-[16px] text-neutral-400 hover:text-neutral-900 transition-colors tracking-wide"
                  >
                    Home
                  </TransitionLink>
                </li>
                <li>
                  <TransitionLink
                    href="/products"
                    onClick={() => setMenuOpen(false)}
                    className="font-mono text-[16px] text-neutral-700 hover:text-neutral-900 transition-colors tracking-wide"
                  >
                    Shop
                  </TransitionLink>
                </li>
                <li>
                  <TransitionLink
                    href="/about"
                    onClick={() => setMenuOpen(false)}
                    className="font-mono text-[16px] text-neutral-700 hover:text-neutral-900 transition-colors tracking-wide"
                  >
                    About BLANC
                  </TransitionLink>
                </li>
                <li>
                  <TransitionLink
                    href="/customer/login"
                    onClick={() => setMenuOpen(false)}
                    className="font-mono text-[16px] text-neutral-700 hover:text-neutral-900 transition-colors tracking-wide"
                  >
                    Customer Login
                  </TransitionLink>
                </li>
                <li>
                  <TransitionLink
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="font-mono text-[16px] text-neutral-700 hover:text-neutral-900 transition-colors tracking-wide"
                  >
                    Admin
                  </TransitionLink>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Click-outside backdrop to dismiss the menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/10 z-[90]"
          />
        )}
      </AnimatePresence>

      <CartDrawer />
    </>
  );
}
