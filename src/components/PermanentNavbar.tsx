'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import CartDrawer from './CartDrawer';

export default function PermanentNavbar() {
  const [currentTime, setCurrentTime] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { openCart, cartItemsCount } = useCart();

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  return (
    <>
      {/* Fixed Navbar - z-[100] to stay above everything */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-white/95 backdrop-blur-sm border-b-[0.5px] border-black/5">
        {/* Navbar Content */}
        <div className="flex items-center justify-between px-6 h-16">
          {/* Left: Hamburger Menu */}
          <button 
            onClick={() => setMenuOpen(true)}
            className="p-2 hover:opacity-70 transition-opacity text-black"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Center: VAER Logo */}
          <Link 
            href="/" 
            className="absolute left-1/2 -translate-x-1/2 text-xl font-bold tracking-tighter text-black hover:opacity-70 transition-opacity"
          >
            VAER
          </Link>

          {/* Right: Clock & Cart */}
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono tracking-wider text-black/70">
              {currentTime}
            </div>
            
            <button
              onClick={openCart}
              className="relative p-2 hover:opacity-70 transition-opacity text-black"
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
        </div>
      </nav>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-80 bg-white z-[120] shadow-2xl"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-neutral-200">
                <span className="text-lg font-bold tracking-tight">Menu</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 hover:opacity-70 transition-opacity"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Links */}
              <nav className="p-6">
                <ul className="space-y-6">
                  <li>
                    <Link
                      href="/products"
                      onClick={() => setMenuOpen(false)}
                      className="text-2xl font-medium tracking-tight hover:opacity-70 transition-opacity block"
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/news"
                      onClick={() => setMenuOpen(false)}
                      className="text-2xl font-medium tracking-tight hover:opacity-70 transition-opacity block"
                    >
                      News
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      onClick={() => setMenuOpen(false)}
                      className="text-2xl font-medium tracking-tight hover:opacity-70 transition-opacity block"
                    >
                      About
                    </Link>
                  </li>
                </ul>

                {/* Divider */}
                <div className="my-8 border-t border-neutral-200" />

                {/* Secondary Links */}
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/account"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm text-neutral-600 hover:text-black transition-colors block"
                    >
                      Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/support"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm text-neutral-600 hover:text-black transition-colors block"
                    >
                      Support
                    </Link>
                  </li>
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer />
    </>
  );
}
