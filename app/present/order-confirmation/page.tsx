'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PresentHeader } from '@/components/present/layout/PresentHeader';
import { PresentFooter } from '@/components/present/layout/PresentFooter';
import { Container, PLink } from '@/components/present/ui';

function Inner() {
  const id = useSearchParams().get('id') ?? 'WC_00000';
  return (
    <Container className="grid place-items-center py-24 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12l5 5L20 6" /></svg>
      </span>
      <h1 className="sf-display mt-5 text-3xl font-semibold">Order placed successfully!</h1>
      <p className="mt-2 text-[14px]" style={{ color: 'var(--sf-muted)' }}>Your order <strong style={{ color: 'var(--sf-ink)' }}>{id}</strong> is being processed. A confirmation has been sent to your account.</p>
      <div className="mt-7 flex gap-3">
        <PLink href="/category/seating" className="px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ border: '1px solid var(--sf-ink)' }}>Continue Shopping</PLink>
        <PLink href="/account/orders" className="px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>View My Orders</PLink>
      </div>
    </Container>
  );
}

export default function OrderConfirmationPage() {
  return (
    <>
      <PresentHeader />
      <Suspense fallback={null}><Inner /></Suspense>
      <PresentFooter />
    </>
  );
}
