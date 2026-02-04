'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { usePageTransition } from '@/context/PageTransitionContext';
import type { ComponentProps } from 'react';

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

/**
 * A Link that triggers the page transition overlay. Navigates immediately on click
 * so the new page loads while the overlay animates, then overlay slides up to reveal.
 */
export default function TransitionLink({ href, onClick, children, ...rest }: TransitionLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
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
    router.push(href);
    startTransition(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
