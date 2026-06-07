'use client';

import { useState } from 'react';
import { usePresentState } from '@/lib/present/usePresentState';
import { createToast } from '@/lib/present/toasts';
import { getSpec } from '@/lib/present/dataLayer';
import { PLink, Container } from '../ui';

const COLS: [string, [string, string][]][] = [
  ['Shop', [['New Arrivals', '/category/seating'], ['Collections', '/collection/seating'], ['Trade Program', '/pages/trade-program']]],
  ['Company', [['About', '/pages/about'], ['Contact', '/pages/contact'], ['Trade Shows', '/pages/trade-shows']]],
  ['Support', [['FAQ', '/pages/faq'], ['Shipping & Returns', '/pages/shipping-returns'], ['Rep Locator', '/pages/rep-locator']]],
  ['Legal', [['Terms', '/pages/terms'], ['Privacy', '/pages/privacy']]],
];

export function PresentFooter() {
  const { dispatch } = usePresentState();
  const spec = getSpec();
  const [email, setEmail] = useState('');

  return (
    <footer style={{ background: 'var(--sf-surface)', borderTop: '1px solid var(--sf-line)' }}>
      <Container className="grid gap-10 py-14 md:grid-cols-5">
        <div className="md:col-span-1">
          <div className="sf-display text-lg font-semibold">{spec.brand.name}</div>
          <p className="mt-3 text-[13px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>Wholesale, made considered. Trade pricing, net terms, reliable freight.</p>
        </div>
        {COLS.map(([h, links]) => (
          <div key={h}>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em]">{h}</div>
            <ul className="space-y-2">{links.map(([l, href]) => <li key={href}><PLink href={href} className="text-[13px] hover:opacity-60" style={{ color: 'var(--sf-muted)' }}>{l}</PLink></li>)}</ul>
          </div>
        ))}
        <div>
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em]">Newsletter</div>
          <div className="flex">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@store.com" className="min-w-0 flex-1 border px-2.5 py-2 text-[12px] outline-none" style={{ borderColor: 'var(--sf-line)', background: 'var(--sf-bg)' }} />
            <button onClick={() => { setEmail(''); dispatch({ type: 'SHOW_TOAST', toast: createToast('Thanks for subscribing!') }); }} className="px-3 py-2 text-[11px] font-semibold uppercase" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>Join</button>
          </div>
        </div>
      </Container>
      <Container className="flex items-center justify-between border-t py-5 text-[12px]" >
        <span style={{ color: 'var(--sf-soft)' }}>© {spec.brand.name}</span>
        <span style={{ color: 'var(--sf-soft)' }}>Powered by WizCommerce</span>
      </Container>
    </footer>
  );
}
