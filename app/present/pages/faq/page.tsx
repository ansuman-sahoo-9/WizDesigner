'use client';
import { useState } from 'react';
import { ContentShell } from '@/components/present/content/ContentShell';
import { dummyFAQs } from '@/lib/present/dummyData';
export default function Page() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ContentShell title="FAQ" eyebrow="Help">
      <div className="border-t" style={{ borderColor: 'var(--sf-line)' }}>
        {dummyFAQs.map((f, i) => (
          <div key={i} style={{ borderBottom: '1px solid var(--sf-line)' }}>
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between py-3.5 text-left text-[14px] font-semibold" style={{ color: 'var(--sf-ink)' }}>{f.q}<span>{open === i ? '–' : '+'}</span></button>
            {open === i && <p className="pb-4">{f.a}</p>}
          </div>
        ))}
      </div>
    </ContentShell>
  );
}
