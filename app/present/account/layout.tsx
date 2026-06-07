'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { usePresentState } from '@/lib/present/usePresentState';
import { createToast } from '@/lib/present/toasts';
import { PresentHeader } from '@/components/present/layout/PresentHeader';
import { PresentFooter } from '@/components/present/layout/PresentFooter';
import { Container, PLink } from '@/components/present/ui';

const TABS = [['My Profile', '/account'], ['My Orders', '/account/orders'], ['Wishlists', '/account/wishlists'], ['Invoices', '/account/invoices']];

export default function AccountLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { state, dispatch } = usePresentState();
  return (
    <>
      <PresentHeader />
      <Container className="py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="sf-display text-2xl font-semibold">{state.auth.companyName || 'Your Account'}</h1>
          <button onClick={() => dispatch({ type: 'SHOW_TOAST', toast: createToast('This feature is available in your live site', 'info') })} className="rounded-md border px-3 py-1.5 text-[12px] font-medium" style={{ borderColor: 'var(--sf-line)' }}>Change Password</button>
        </div>
        <div className="mt-5 flex gap-1 border-b" style={{ borderColor: 'var(--sf-line)' }}>
          {TABS.map(([label, href]) => {
            const active = href === '/account' ? path === '/present/account' : path.startsWith('/present' + href);
            return <PLink key={href} href={href} className="px-4 py-2.5 text-[13px] font-medium" style={{ borderBottom: `2px solid ${active ? 'var(--sf-brand)' : 'transparent'}`, color: active ? 'var(--sf-ink)' : 'var(--sf-soft)' }}>{label}</PLink>;
          })}
        </div>
        <div className="py-6">{children}</div>
      </Container>
      <PresentFooter />
    </>
  );
}
