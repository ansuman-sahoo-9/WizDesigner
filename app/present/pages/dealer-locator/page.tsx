'use client';
import { useState } from 'react';
import { ContentShell } from '@/components/present/content/ContentShell';
export default function Page() {
  const [zip, setZip] = useState('');
  return (
    <ContentShell title="Find a Dealer" eyebrow="Where to buy">
      <p>Enter your ZIP or region to find authorized stockists near you.</p>
      <div className="mt-4 flex max-w-sm gap-2">
        <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="ZIP or city" className="flex-1 rounded-md border px-3 py-2 text-[14px] outline-none" style={{ borderColor: 'var(--sf-line)', background: 'var(--sf-surface)' }} />
        <button className="px-4 py-2 text-[12px] font-semibold uppercase" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>Search</button>
      </div>
      <div className="mt-6 grid aspect-[16/9] place-items-center rounded-lg" style={{ background: 'var(--sf-faint)', color: 'var(--sf-soft)' }}>Interactive dealer map loads in the live site</div>
    </ContentShell>
  );
}
