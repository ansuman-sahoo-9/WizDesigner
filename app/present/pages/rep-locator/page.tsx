'use client';
import { ContentShell } from '@/components/present/content/ContentShell';
import { dummyReps } from '@/lib/present/dummyData';
export default function Page() {
  return (
    <ContentShell title="Find Your Rep" eyebrow="Sales Team">
      <div className="grid gap-3 sm:grid-cols-2">
        {dummyReps.map((r) => (
          <div key={r.name} className="rounded-md border p-4 text-[13px]" style={{ borderColor: 'var(--sf-line)' }}>
            <div className="font-semibold" style={{ color: 'var(--sf-ink)' }}>{r.name}</div>
            <div className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--sf-brand)' }}>{r.region}</div>
            <div className="mt-1">{r.email}<br/>{r.phone}</div>
          </div>
        ))}
      </div>
    </ContentShell>
  );
}
