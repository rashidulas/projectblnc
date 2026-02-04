'use client';

import { useEffect, useState } from 'react';
import TransitionLink from '@/components/TransitionLink';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import CartDrawer from './CartDrawer';

// Custom hamburger: three lines, horizontal when closed, vertical when open
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-6 h-6 flex items-center justify-center">
      <div
        className={`flex gap-[6px] transition-transform duration-300 ease-out ${
          open ? 'flex-row' : 'flex-col'
        }`}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="bg-neutral-700 rounded-full"
            initial={false}
            animate={{
              width: open ? 3.5 : 24,
              height: open ? 16 : 2.5,
            }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  );
}

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

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  return (
    <>
      {/* Fixed Navbar - full width, white, subtle shadow underneath */}
      <nav 
        className="fixed top-0 left-0 w-full z-[100] bg-white"
        style={{
          boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
        }}
      >
        {/* Top bar - full width, longer feel with generous padding */}
        <div className="flex items-center justify-between w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 h-16 sm:h-20 min-h-[3.5rem] sm:min-h-0">
          {/* Left: BLANC Logo - touch-friendly */}
          <TransitionLink 
            href="/" 
            className="text-xl sm:text-2xl font-bold tracking-tighter text-neutral-800 hover:opacity-70 active:opacity-80 transition-opacity py-2 -my-2 min-h-[44px] flex items-center"
          >
            BLANC
          </TransitionLink>

          {/* Right: Clock (hidden on very small), Hamburger, Cart - 44px min touch targets */}
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden sm:block text-xs sm:text-sm font-mono tracking-wider text-neutral-600 min-h-[44px] flex items-center">
              {currentTime}
            </div>
            
            <button 
              onClick={() => setMenuOpen((o) => !o)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-1 hover:opacity-70 active:opacity-80 transition-opacity text-neutral-800 rounded-md"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
            
            <button
              onClick={openCart}
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center -mr-1 hover:opacity-70 active:opacity-80 transition-opacity text-neutral-800 rounded-md"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 sm:top-0.5 sm:right-0.5 bg-black text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-medium px-1">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Full-width dropdown menu - light grey, shadow under */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden bg-neutral-100/95"
              style={{
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
            >
              <nav className="py-8 sm:py-12 md:py-16 flex flex-col items-center justify-center">
                <ul className="space-y-2 sm:space-y-4 md:space-y-6 text-center">
                  <li>
                    <TransitionLink
                      href="/"
                      onClick={() => setMenuOpen(false)}
                      className="text-lg md:text-xl text-neutral-500 hover:text-neutral-900 active:opacity-80 transition-colors block font-medium tracking-tight py-4 sm:py-3 min-h-[48px] sm:min-h-0 flex items-center justify-center"
                    >
                      Home
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink
                      href="/products"
                      onClick={() => setMenuOpen(false)}
                      className="text-lg md:text-xl text-neutral-900 hover:text-neutral-600 active:opacity-80 transition-colors block font-medium tracking-tight py-4 sm:py-3 min-h-[48px] sm:min-h-0 flex items-center justify-center"
                    >
                      Shop
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink
                      href="/about"
                      onClick={() => setMenuOpen(false)}
                      className="text-lg md:text-xl text-neutral-900 hover:text-neutral-600 active:opacity-80 transition-colors block font-medium tracking-tight py-4 sm:py-3 min-h-[48px] sm:min-h-0 flex items-center justify-center"
                    >
                      About BLANC
                    </TransitionLink>
                  </li>
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Backdrop when menu is open - click outside to close */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/10 z-[99]"
          />
        )}
      </AnimatePresence>

      <CartDrawer />
    </>
  );
}
