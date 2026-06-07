'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSpec } from '@/lib/present/dataLayer';
import { Container, PLink, px } from '@/components/present/ui';

export default function PaymentPage() {
  const router = useRouter();
  const terms = getSpec().business.paymentTerms;
  const options = [
    ['card', 'Credit Card', terms.creditCard],
    ['net30', 'Net-30 Terms', terms.net30],
    ['net60', 'Net-60 Terms', terms.net60],
    ['ach', 'ACH Bank Transfer', terms.ach],
  ].filter(([, , on]) => on) as [string, string, boolean][];
  const [method, setMethod] = useState(options[0]?.[0] ?? 'card');

  return (
    <Container className="max-w-2xl">
      <h1 className="sf-display text-2xl font-semibold">Payment method</h1>
      <div className="mt-6 space-y-2">
        {options.map(([k, label]) => (
          <label key={k} className="flex cursor-pointer items-center gap-3 rounded-md border p-3 text-[14px]" style={{ borderColor: method === k ? 'var(--sf-ink)' : 'var(--sf-line)' }}>
            <input type="radio" name="pay" checked={method === k} onChange={() => setMethod(k)} />{label}
          </label>
        ))}
      </div>
      {method === 'card' && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className="mb-1 block text-[11px] uppercase tracking-wide" style={{ color: 'var(--sf-soft)' }}>Card number</span><input defaultValue="4242 4242 4242 4242" className="w-full rounded-md border px-3 py-2 text-[14px] outline-none" style={{ borderColor: 'var(--sf-line)', background: 'var(--sf-surface)' }} /></label>
          <label><span className="mb-1 block text-[11px] uppercase tracking-wide" style={{ color: 'var(--sf-soft)' }}>Expiry</span><input defaultValue="04 / 28" className="w-full rounded-md border px-3 py-2 text-[14px] outline-none" style={{ borderColor: 'var(--sf-line)', background: 'var(--sf-surface)' }} /></label>
          <label><span className="mb-1 block text-[11px] uppercase tracking-wide" style={{ color: 'var(--sf-soft)' }}>CVV</span><input defaultValue="123" className="w-full rounded-md border px-3 py-2 text-[14px] outline-none" style={{ borderColor: 'var(--sf-line)', background: 'var(--sf-surface)' }} /></label>
        </div>
      )}
      <div className="mt-8 flex items-center justify-between">
        <PLink href="/checkout/shipping" className="text-[13px] underline" style={{ color: 'var(--sf-muted)' }}>← Back</PLink>
        <button onClick={() => router.push(px('/checkout/review'))} className="px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>Continue to Review</button>
      </div>
    </Container>
  );
}
