'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import TransitionLink from '@/components/TransitionLink';
import { useCart } from '@/context/CartContext';
import { useNavMenu } from '@/context/NavMenuContext';
import { motion, AnimatePresence } from 'framer-motion';
import CartDrawer from './CartDrawer';

const NAV_TEXT =
  'text-sm sm:text-base lowercase tracking-normal text-neutral-900 hover:opacity-60 transition-opacity';

const MENU_LINKS = [
  { label: 'Home', href: '/home' },
  { label: 'Shop', href: '/products' },
  { label: 'About BLANC', href: '/about' },
  { label: 'Customer Login', href: '/customer/login' },
  { label: 'Admin', href: '/admin' },
] as const;

export default function PermanentNavbar() {
  const { menuOpen, setMenuOpen, toggleMenu } = useNavMenu();
  const { openCart, cartItemsCount } = useCart();
  const pathname = usePathname();
  const isSaleLanding = pathname === '/';

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[100]">
        <nav
          className={`relative flex items-center justify-between px-5 sm:px-8 h-12 sm:h-14 bg-[#F2F2F2] ${
            isSaleLanding && !menuOpen ? 'backdrop-blur-[2px]' : ''
          }`}
        >
          <div className="min-w-[44px]" aria-hidden="true" />

          {isSaleLanding ? (
            <button
              type="button"
              onClick={toggleMenu}
              className={`absolute left-1/2 -translate-x-1/2 ${NAV_TEXT}`}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              blanc
            </button>
          ) : (
            <TransitionLink
              href="/"
              className={`absolute left-1/2 -translate-x-1/2 ${NAV_TEXT}`}
            >
              blanc
            </TransitionLink>
          )}

          <button
            type="button"
            onClick={openCart}
            className={`${NAV_TEXT} min-w-[44px] text-right`}
            aria-label="Open cart"
          >
            bag ({cartItemsCount})
          </button>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden bg-[#F2F2F2]"
            >
              <nav className="py-8 sm:py-12 md:py-16 flex flex-col items-center justify-center min-h-[50vh]">
                <ul className="space-y-2 sm:space-y-4 md:space-y-6 text-center">
                  {MENU_LINKS.map((item) => (
                    <li key={item.label}>
                      <TransitionLink
                        href={item.href}
                        onClick={closeMenu}
                        className="text-lg md:text-xl text-neutral-900 hover:text-neutral-600 active:opacity-80 transition-colors block font-medium tracking-tight py-3 sm:py-2 min-h-[48px] sm:min-h-0 flex items-center justify-center"
                      >
                        {item.label}
                      </TransitionLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer />
    </>
  );
}
