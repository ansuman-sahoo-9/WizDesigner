'use client';
import { ContentShell } from '@/components/present/content/ContentShell';
import { dummyTradeShows } from '@/lib/present/dummyData';
export default function Page() {
  return (
    <ContentShell title="Trade Shows" eyebrow="See us in person">
      <div className="grid gap-3 sm:grid-cols-2">
        {dummyTradeShows.map((s) => (
          <div key={s.name} className="rounded-md border p-4 text-[13px]" style={{ borderColor: 'var(--sf-line)' }}>
            <div className="sf-display text-lg font-semibold" style={{ color: 'var(--sf-ink)' }}>{s.name}</div>
            <div className="mt-1">{s.venue}</div>
            <div className="mt-1" style={{ color: 'var(--sf-soft)' }}>Booth {s.booth} · {s.startDate} – {s.endDate}</div>
          </div>
        ))}
      </div>
    </ContentShell>
  );
}
