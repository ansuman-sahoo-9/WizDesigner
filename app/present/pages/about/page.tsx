'use client';
import { ContentShell } from '@/components/present/content/ContentShell';
export default function Page() {
  return (
    <ContentShell title="About Us" eyebrow="Our Story">
      <p>We began as a small studio with a simple belief: product should be made well, priced fairly, and built to last. Three decades later we still design in-house and partner directly with the makers who build our pieces.</p>
      <p className="mt-4">Today we supply hundreds of independent retailers and design studios — the same care, now backed by the inventory and logistics serious buyers depend on.</p>
      <div className="mt-8 grid grid-cols-3 gap-6" style={{ borderTop: '1px solid var(--sf-line)', paddingTop: '1.5rem' }}>
        {[['30 yrs','In-house design'],['450+','Stocked SKUs'],['1,200','Trade partners']].map(([n,l]) => (
          <div key={l}><div className="sf-display text-2xl font-semibold" style={{ color: 'var(--sf-brand)' }}>{n}</div><div className="mt-1 text-[12px] uppercase tracking-wide" style={{ color: 'var(--sf-soft)' }}>{l}</div></div>
        ))}
      </div>
    </ContentShell>
  );
}
