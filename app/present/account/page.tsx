'use client';

import { usePresentState } from '@/lib/present/usePresentState';
import { createToast } from '@/lib/present/toasts';

function Toggle({ label, hint, on, onChange }: { label: string; hint: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start justify-between gap-3 border-b py-3" style={{ borderColor: 'var(--sf-line)' }}>
      <span><span className="text-[14px] font-medium">{label}</span><span className="mt-0.5 block text-[12px]" style={{ color: 'var(--sf-soft)' }}>{hint}</span></span>
      <button onClick={() => onChange(!on)} role="switch" aria-checked={on} className="mt-1 flex h-5 w-9 flex-none items-center rounded-full p-0.5" style={{ background: on ? 'var(--sf-brand)' : 'var(--sf-line)' }}>
        <span className="h-4 w-4 rounded-full bg-white transition-transform" style={{ transform: on ? 'translateX(16px)' : 'none' }} />
      </button>
    </label>
  );
}

export default function ProfilePage() {
  const { state, dispatch } = usePresentState();
  return (
    <div className="max-w-2xl">
      <h2 className="sf-display text-lg font-semibold">Preferences</h2>
      <div className="mt-2">
        <Toggle label="Hide prices" hint="Hide all pricing across the storefront (useful for showroom mode)." on={state.preferences.hidePrices} onChange={(v) => dispatch({ type: 'SET_PREFERENCES', patch: { hidePrices: v } })} />
        <Toggle label="Show price in PDF" hint="Include wholesale pricing on exported PDFs." on={state.preferences.showPriceInPdf} onChange={(v) => dispatch({ type: 'SET_PREFERENCES', patch: { showPriceInPdf: v } })} />
      </div>

      <h2 className="sf-display mt-8 text-lg font-semibold">Account</h2>
      <div className="mt-2 grid gap-1 text-[14px]">
        <div><span style={{ color: 'var(--sf-soft)' }}>Company: </span>{state.auth.companyName || 'Foothill Mercantile'}</div>
        <div><span style={{ color: 'var(--sf-soft)' }}>Email: </span>{state.auth.userName ? state.auth.userName + '@store.com' : 'buyer@store.com'}</div>
        <div><span style={{ color: 'var(--sf-soft)' }}>Phone: </span>(503) 555-0142</div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="sf-display text-lg font-semibold">Contacts</h2>
        <button onClick={() => dispatch({ type: 'SHOW_TOAST', toast: createToast('Contact management available in live site', 'info') })} className="text-[12px] font-medium underline">Manage</button>
      </div>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {[['Jordan Avery', 'Owner'], ['Sam Wells', 'Buyer']].map(([n, r]) => (
          <div key={n} className="rounded-md border p-4 text-[13px]" style={{ borderColor: 'var(--sf-line)' }}>
            <div className="font-semibold">{n}</div><div style={{ color: 'var(--sf-soft)' }}>{r}</div>
            <div className="mt-1">{n.toLowerCase().split(' ')[0]}@store.com · (503) 555-0142</div>
          </div>
        ))}
      </div>
    </div>
  );
}
