'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePresentState } from '@/lib/present/usePresentState';
import { getSpec } from '@/lib/present/dataLayer';
import { createToast } from '@/lib/present/toasts';
import { px } from '../ui';

export function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { dispatch } = usePresentState();
  const search = getSpec().navigation.header.search;
  const [q, setQ] = useState('');
  const center = search.panelPosition === 'overlay_center';

  const submit = () => {
    if (!q.trim()) return;
    dispatch({ type: 'SET_SEARCH', query: q.trim() });
    onClose();
    router.push(px(`/search?q=${encodeURIComponent(q.trim())}`));
  };

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`absolute ${center ? 'left-1/2 top-24 w-full max-w-xl -translate-x-1/2 rounded-xl' : 'right-0 top-0 h-full w-full max-w-md'} p-6 shadow-2xl`} style={{ background: 'var(--sf-surface)', color: 'var(--sf-ink)' }}>
        <div className="flex items-center gap-2">
          <input
            autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder={search.placeholder} className="flex-1 border-b bg-transparent py-2 text-[16px] outline-none" style={{ borderColor: 'var(--sf-line)' }}
          />
          {search.visualSearch && (
            <button onClick={() => dispatch({ type: 'SHOW_TOAST', toast: createToast('Visual search available in the live site', 'info') })} aria-label="Visual search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 7h3l2-2h6l2 2h3v12H4zM12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" /></svg>
            </button>
          )}
          <button onClick={submit} className="px-3 py-2 text-[12px] font-semibold uppercase" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>Go</button>
          <button onClick={onClose} className="pl-2 text-[var(--sf-soft)]">✕</button>
        </div>
        {search.scopes.length > 1 && (
          <div className="mt-3 flex gap-1.5">
            {search.scopes.map((s) => <span key={s} className="rounded-full px-2.5 py-1 text-[11px] capitalize" style={{ border: '1px solid var(--sf-line)', color: 'var(--sf-muted)' }}>{s}</span>)}
          </div>
        )}
        {!q && <p className="mt-4 text-[13px]" style={{ color: 'var(--sf-soft)' }}>No recent searches.</p>}
      </div>
    </div>
  );
}
