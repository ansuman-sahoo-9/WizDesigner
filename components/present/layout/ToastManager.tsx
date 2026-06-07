'use client';

// Step 68 — bottom-right toasts, auto-dismissing after each toast's duration.

import { useEffect } from 'react';
import { usePresentState } from '@/lib/present/usePresentState';

const TONE: Record<string, string> = {
  success: '#047857', info: '#1c1a16', warning: '#b45309', error: '#b91c1c',
};

export function ToastManager() {
  const { state, dispatch } = usePresentState();

  useEffect(() => {
    const timers = state.toasts.map((t) => setTimeout(() => dispatch({ type: 'DISMISS_TOAST', id: t.id }), t.duration || 3000));
    return () => timers.forEach(clearTimeout);
  }, [state.toasts, dispatch]);

  if (!state.toasts.length) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {state.toasts.map((t) => (
        <div key={t.id} className="flex min-w-[240px] max-w-sm items-start gap-2 rounded-lg bg-white px-3.5 py-3 text-[13px] shadow-xl ring-1 ring-black/10">
          <span className="mt-1 h-2 w-2 flex-none rounded-full" style={{ background: TONE[t.type] ?? '#1c1a16' }} />
          <span className="flex-1 text-zinc-800">{t.message}</span>
          <button onClick={() => dispatch({ type: 'DISMISS_TOAST', id: t.id })} className="text-zinc-400 hover:text-zinc-700">✕</button>
        </div>
      ))}
    </div>
  );
}
