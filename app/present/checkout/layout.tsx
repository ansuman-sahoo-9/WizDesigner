'use client';

import type { ReactNode } from 'react';
import { PresentHeader } from '@/components/present/layout/PresentHeader';
import { CheckoutProgressBar } from '@/components/present/checkout/CheckoutProgressBar';
import { Container } from '@/components/present/ui';

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PresentHeader />
      <CheckoutProgressBar />
      <main className="pb-20">{children}</main>
      <Container className="border-t py-5 text-center text-[12px]" >
        <span style={{ color: 'var(--sf-soft)' }}>Secure checkout · Powered by WizCommerce</span>
      </Container>
    </>
  );
}
