'use client';

// Step 70 — first-load activation interstitial (once per session).

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSpec } from '@/lib/present/dataLayer';
import { px } from '../ui';

export function ActivationModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cfg, setCfg] = useState<{ headline: string; body: string; ctaLabel: string } | null>(null);

  useEffect(() => {
    const a = getSpec().infrastructure.activationModal;
    if (!a.enabled) return;
    if (sessionStorage.getItem('present_activation_shown')) return;
    sessionStorage.setItem('present_activation_shown', '1');
    setCfg({ headline: a.headline, body: a.body, ctaLabel: a.ctaLabel });
    const t = setTimeout(() => setOpen(true), a.triggerBehavior === 'after_delay' ? a.triggerDelay ?? 1500 : 200);
    return () => clearTimeout(t);
  }, []);

  if (!open || !cfg) return null;
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-md rounded-xl p-8 text-center" style={{ background: 'var(--sf-surface)', color: 'var(--sf-ink)' }}>
        <button onClick={() => setOpen(false)} className="absolute right-4 top-4 text-[var(--sf-soft)] hover:opacity-70">✕</button>
        <h2 className="sf-display text-2xl font-semibold">{cfg.headline}</h2>
        <p className="mt-3 text-[14px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>{cfg.body}</p>
        <button
          onClick={() => { setOpen(false); router.push(px('/activation')); }}
          className="mt-6 w-full px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em]"
          style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}
        >
          {cfg.ctaLabel}
        </button>
      </div>
    </div>
  );
}
