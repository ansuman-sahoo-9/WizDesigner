'use client';
import { ContentShell } from '@/components/present/content/ContentShell';
import { PLink } from '@/components/present/ui';
export default function Page() {
  return (
    <ContentShell title="Trade Program" eyebrow="Wholesale">
      <p>Open a wholesale account and unlock trade pricing up to 50% off MSRP, net terms, tiered volume discounts, and a dedicated rep.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3 text-[13px]">
        {[['Net Terms','Net-30 / Net-60 by tier'],['Low MOQ','Open with a $500 order'],['Dedicated Rep','A partner who knows your store']].map(([t,d]) => (
          <div key={t} className="rounded-md border p-4" style={{ borderColor: 'var(--sf-line)' }}><div className="font-semibold" style={{ color: 'var(--sf-ink)' }}>{t}</div><div className="mt-1">{d}</div></div>
        ))}
      </div>
      <PLink href="/signup" className="mt-7 inline-block px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>Apply for a Trade Account</PLink>
    </ContentShell>
  );
}
