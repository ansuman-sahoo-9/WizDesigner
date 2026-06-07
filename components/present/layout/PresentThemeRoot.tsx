'use client';

// Applies the active brand's design tokens (--sf-*) to the whole Present app,
// re-theming when the shopper switches brands via the header.

import { useMemo, useState, type ReactNode } from 'react';
import { loadState } from '@/lib/storage';
import { storefrontVars } from '@/lib/cssVars';
import { withActiveBrand } from '@/lib/brands';
import type { DesignState } from '@/lib/types';
import { usePresentState } from '@/lib/present/usePresentState';

const FALLBACK = { palette: 'heritage', font: 'heritage-serif', density: 'comfortable', variants: {} } as unknown as DesignState;

export function PresentThemeRoot({ children }: { children: ReactNode }) {
  const { state } = usePresentState();
  const [base] = useState<DesignState | null>(() => loadState());

  const vars = useMemo(() => {
    const ds = base ?? FALLBACK;
    const themed = state.activeBrandId && base?.brands?.length ? withActiveBrand(ds, state.activeBrandId) : ds;
    return storefrontVars(themed);
  }, [base, state.activeBrandId]);

  return (
    <div id="present-root" className="storefront min-h-screen" style={{ ...vars, background: 'var(--sf-bg)', color: 'var(--sf-ink)', fontFamily: 'var(--sf-body)' }}>
      {children}
    </div>
  );
}
