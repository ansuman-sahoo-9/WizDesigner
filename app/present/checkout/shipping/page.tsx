'use client';

import { useRouter } from 'next/navigation';
import { Container, PLink, px } from '@/components/present/ui';

const F = ({ label, value = '', wide = false }: { label: string; value?: string; wide?: boolean }) => (
  <label className={wide ? 'sm:col-span-2' : ''}>
    <span className="mb-1 block text-[11px] uppercase tracking-wide" style={{ color: 'var(--sf-soft)' }}>{label}</span>
    <input defaultValue={value} className="w-full rounded-md border px-3 py-2 text-[14px] outline-none focus:border-[var(--sf-ink)]" style={{ borderColor: 'var(--sf-line)', background: 'var(--sf-surface)' }} />
  </label>
);

export default function ShippingPage() {
  const router = useRouter();
  return (
    <Container className="max-w-2xl">
      <h1 className="sf-display text-2xl font-semibold">Shipping information</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <F label="First name" value="Jordan" /><F label="Last name" value="Avery" />
        <F label="Company" value="Foothill Mercantile" wide />
        <F label="Address line 1" value="240 Market St" wide /><F label="Address line 2" wide />
        <F label="City" value="Portland" /><F label="State" value="OR" />
        <F label="ZIP" value="97204" /><F label="Country" value="United States" />
      </div>
      <div className="mt-8 flex items-center justify-between">
        <PLink href="/cart" className="text-[13px] underline" style={{ color: 'var(--sf-muted)' }}>← Back to Cart</PLink>
        <button onClick={() => router.push(px('/checkout/payment'))} className="px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>Continue to Payment</button>
      </div>
    </Container>
  );
}
