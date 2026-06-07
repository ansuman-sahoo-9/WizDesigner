'use client';

// Present Mode V2 — context + provider + hook (Steps 7–8).
// Hydrates from sessionStorage on mount; persists on every change.

import { createContext, useContext, useEffect, useReducer, type Dispatch } from 'react';
import { createElement, type ReactNode } from 'react';
import { presentReducer, type PresentAction } from './presentReducer';
import { defaultPresentState, type PresentState } from './presentState';

const STORAGE_KEY = 'present_state';

type Ctx = { state: PresentState; dispatch: Dispatch<PresentAction> };

export const PresentStateContext = createContext<Ctx | null>(null);

export function PresentStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(presentReducer, defaultPresentState, (initial) => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? { ...initial, ...(JSON.parse(raw) as PresentState) } : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota */
    }
  }, [state]);

  return createElement(PresentStateContext.Provider, { value: { state, dispatch } }, children);
}

export function usePresentState(): Ctx {
  const ctx = useContext(PresentStateContext);
  if (!ctx) throw new Error('usePresentState must be used within a PresentStateProvider');
  return ctx;
}
