'use client';

// Present Mode V2 root layout — wraps every present page with the shopping-state
// provider, applies the active brand's theme, and mounts the global toast +
// activation modal. (Steps 26–27, 69, 71.)

import type { ReactNode } from 'react';
import { PresentStateProvider } from '@/lib/present/usePresentState';
import { PresentThemeRoot } from '@/components/present/layout/PresentThemeRoot';
import { ToastManager } from '@/components/present/layout/ToastManager';
import { ActivationModal } from '@/components/present/layout/ActivationModal';

export default function PresentLayout({ children }: { children: ReactNode }) {
  return (
    <PresentStateProvider>
      <PresentThemeRoot>
        {children}
        <ToastManager />
        <ActivationModal />
      </PresentThemeRoot>
    </PresentStateProvider>
  );
}
