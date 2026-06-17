'use client';

import { type ReactNode } from 'react';
import { LoadingProvider } from '@/context/LoadingContext';
import GlobalLoadingScreen from '@/components/GlobalLoadingScreen';
import LoadingCoordinator from '@/components/LoadingCoordinator';

export default function PageTransitionProvider({ children }: { children: ReactNode }) {
  return (
    <LoadingProvider>
      <LoadingCoordinator />
      {children}
      <GlobalLoadingScreen />
    </LoadingProvider>
  );
}
