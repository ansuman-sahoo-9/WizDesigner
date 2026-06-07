import type { SectionProps } from './_shared';
import { Eyebrow, ProductImage } from './_shared';

const ABOUT_IMG = 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=70';

// Single variant for MVP — heritage story + 3-stat row.
export function About({ brandName, industry }: SectionProps) {
  return (
    <section className="sf-pad-y" style={{ background: 'var(--sf-surface)' }}>
      <div className="sf-container grid items-center gap-12 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <Eyebrow>Our Story</Eyebrow>
          <h2 className="sf-display text-3xl font-semibold tracking-tight md:text-4xl">
            A workshop philosophy, at wholesale scale
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>
            {brandName} began as a small studio with a simple belief: {industry.toLowerCase()} should be
            made well, priced fairly, and built to last. Three decades later we still
            design every piece in-house and partner directly with the makers who build them.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>
            Today we supply hundreds of independent retailers and design studios — the same
            care, now backed by the inventory and logistics serious buyers depend on.
          </p>
          <div className="mt-9 grid grid-cols-3 gap-6" style={{ borderTop: '1px solid var(--sf-line)', paddingTop: '1.75rem' }}>
            {[['30 yrs', 'In-house design'], ['450+', 'Stocked SKUs'], ['1,200', 'Trade partners']].map(([n, l]) => (
              <div key={l}>
                <div className="sf-display text-2xl font-semibold" style={{ color: 'var(--sf-brand)' }}>{n}</div>
                <div className="mt-1 text-[12px] uppercase tracking-[0.1em]" style={{ color: 'var(--sf-soft)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="order-1 md:order-2">
          <ProductImage src={ABOUT_IMG} alt={`About ${brandName}`} ratio="aspect-[4/5]" />
        </div>
      </div>
    </section>
  );
}
