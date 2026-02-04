'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePageTransition } from '@/context/PageTransitionContext';
import type { ComponentProps } from 'react';

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

/**
 * A Link that triggers the page transition overlay (slide down → navigate → slide up)
 * before navigating. Use instead of next/link for in-app navigation when you want
 * the transition effect.
 */
export default function TransitionLink({ href, onClick, children, ...rest }: TransitionLinkProps) {
  const pathname = usePathname();
  const { startTransition } = usePageTransition();

  const isCurrentPage = pathname === href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isCurrentPage) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
    if (e.defaultPrevented) return;
    e.preventDefault();
    startTransition(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
