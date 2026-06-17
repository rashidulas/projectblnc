'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface NavMenuContextValue {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
}

const NavMenuContext = createContext<NavMenuContextValue | null>(null);

export function NavMenuProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <NavMenuContext.Provider
      value={{
        menuOpen,
        setMenuOpen,
        toggleMenu: () => setMenuOpen((open) => !open),
      }}
    >
      {children}
    </NavMenuContext.Provider>
  );
}

export function useNavMenu() {
  const context = useContext(NavMenuContext);
  if (!context) {
    throw new Error('useNavMenu must be used within NavMenuProvider');
  }
  return context;
}
