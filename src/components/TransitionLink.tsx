'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ASSET_HEAVY_ROUTES, useLoading } from '@/context/LoadingContext';
import type { ComponentProps } from 'react';

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

export default function TransitionLink({ href, onClick, children, ...rest }: TransitionLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { beginNavigation } = useLoading();

  const isCurrentPage = pathname === href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isCurrentPage) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
    if (e.defaultPrevented) return;
    e.preventDefault();
    // Only show the loading screen for the landing and home routes.
    if (ASSET_HEAVY_ROUTES.has(href)) {
      beginNavigation(href);
    }
    router.push(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
