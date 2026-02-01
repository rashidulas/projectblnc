'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on homepage - Hero component has its own
  if (pathname === '/') {
    return null;
  }
  
  return <Navbar />;
}
