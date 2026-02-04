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
    <div className="w-5 h-5 flex items-center justify-center">
      <div
        className={`flex gap-[5px] transition-transform duration-300 ease-out ${
          open ? 'flex-row' : 'flex-col'
        }`}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="bg-neutral-700 rounded-full"
            initial={false}
            animate={{
              width: open ? 3 : 20,
              height: open ? 14 : 2,
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
        <div className="flex items-center justify-between w-full px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 h-16">
          {/* Left: VAER Logo */}
          <TransitionLink 
            href="/" 
            className="text-xl font-bold tracking-tighter text-neutral-800 hover:opacity-70 transition-opacity"
          >
            VAER
          </TransitionLink>

          {/* Right: Clock, Hamburger, Cart */}
          <div className="flex items-center gap-6">
            <div className="text-xs font-mono tracking-wider text-neutral-600">
              {currentTime}
            </div>
            
            <button 
              onClick={() => setMenuOpen((o) => !o)}
              className="p-2 -mr-2 hover:opacity-70 transition-opacity text-neutral-800"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
            
            <button
              onClick={openCart}
              className="relative p-2 -mr-2 hover:opacity-70 transition-opacity text-neutral-800"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-medium">
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
              <nav className="py-12 md:py-16 flex flex-col items-center justify-center">
                <ul className="space-y-4 md:space-y-6 text-center">
                  <li>
                    <TransitionLink
                      href="/"
                      onClick={() => setMenuOpen(false)}
                      className="text-lg md:text-xl text-neutral-500 hover:text-neutral-900 transition-colors block font-medium tracking-tight"
                    >
                      Home
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink
                      href="/products"
                      onClick={() => setMenuOpen(false)}
                      className="text-lg md:text-xl text-neutral-900 hover:text-neutral-600 transition-colors block font-medium tracking-tight"
                    >
                      Shop
                    </TransitionLink>
                  </li>
                  <li>
                    <TransitionLink
                      href="/about"
                      onClick={() => setMenuOpen(false)}
                      className="text-lg md:text-xl text-neutral-900 hover:text-neutral-600 transition-colors block font-medium tracking-tight"
                    >
                      About VAER
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
