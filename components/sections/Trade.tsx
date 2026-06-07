import type { SectionProps } from './_shared';
import { Eyebrow, SfButton, ProductImage } from './_shared';

const BENEFITS = [
  ['Net-30 Terms', 'Approved accounts ship now and pay in 30 days.'],
  ['Tiered Pricing', 'Discounts deepen automatically as volume grows.'],
  ['Dedicated Rep', 'A real person who knows your store and orders.'],
  ['Low MOQ', 'Open an account with a $500 first order.'],
];

const TIERS = [
  { name: 'Stockist', price: '0–$5k / yr', off: '30% off MSRP', perks: ['Net-15 terms', 'Standard catalog', 'Email support'] },
  { name: 'Trade', price: '$5k–$25k / yr', off: '40% off MSRP', perks: ['Net-30 terms', 'Early access drops', 'Dedicated rep'], featured: true },
  { name: 'Volume', price: '$25k+ / yr', off: '50% off MSRP', perks: ['Net-45 terms', 'Custom price lists', 'Free freight'] },
];

const TRADE_IMG = 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1000&q=70';

export function Trade({ variant, brandName }: SectionProps) {
  // A — Side-by-side
  if (variant === 'A') {
    return (
      <section className="grid items-stretch md:grid-cols-2" style={{ background: 'var(--sf-bg)' }}>
        <div className="min-h-[360px]">
          <ProductImage src={TRADE_IMG} alt="Trade program" ratio="h-full" className="h-full" />
        </div>
        <div className="flex flex-col justify-center px-8 py-16 md:px-14">
          <Eyebrow>Trade Program</Eyebrow>
          <h2 className="sf-display text-3xl font-semibold tracking-tight md:text-4xl">Built for the way you buy</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {BENEFITS.map(([t, d]) => (
              <div key={t}>
                <div className="text-[13px] font-semibold">{t}</div>
                <p className="mt-1 text-[13px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8"><SfButton>Apply for a Trade Account</SfButton></div>
        </div>
      </section>
    );
  }

  // B — Promo banner
  if (variant === 'B') {
    return (
      <section style={{ background: 'var(--sf-brand)' }}>
        <div className="sf-container flex flex-col items-center justify-between gap-6 py-12 text-center md:flex-row md:text-left" style={{ color: 'var(--sf-on-brand)' }}>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-80">Trade Program</div>
            <h2 className="sf-display mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Open a wholesale account — up to 50% off MSRP
            </h2>
            <p className="mt-2 text-[14px] opacity-85">Net terms, tiered pricing, and a rep who knows {brandName}.</p>
          </div>
          <span className="inline-flex flex-none items-center justify-center px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ background: 'var(--sf-accent)', color: '#111' }}>
            Apply Now
          </span>
        </div>
      </section>
    );
  }

  // C — 3-tier pricing cards
  if (variant === 'C') {
    return (
      <section className="sf-pad-y" style={{ background: 'var(--sf-bg)' }}>
        <div className="sf-container mb-10 text-center">
          <Eyebrow className="mx-auto">Trade Program</Eyebrow>
          <h2 className="sf-display text-3xl font-semibold tracking-tight md:text-4xl">Pricing that scales with you</h2>
        </div>
        <div className="sf-container grid gap-5 md:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col p-7"
              style={{
                background: t.featured ? 'var(--sf-ink)' : 'var(--sf-surface)',
                color: t.featured ? 'var(--sf-on-brand)' : 'var(--sf-ink)',
                border: '1px solid var(--sf-line)',
              }}
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: t.featured ? 'var(--sf-accent)' : 'var(--sf-brand)' }}>
                {t.name}
              </div>
              <div className="sf-display mt-3 text-2xl font-semibold">{t.off}</div>
              <div className="mt-1 text-[12px]" style={{ opacity: 0.7 }}>{t.price}</div>
              <ul className="mt-5 space-y-2 text-[13px]">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-center gap-2" style={{ opacity: 0.9 }}>
                    <span style={{ color: t.featured ? 'var(--sf-accent)' : 'var(--sf-brand)' }}>✓</span>
                    {p}
                  </li>
                ))}
              </ul>
              <div
                className="mt-7 py-3 text-center text-[12px] font-semibold uppercase tracking-[0.14em]"
                style={t.featured ? { background: 'var(--sf-accent)', color: '#111' } : { border: '1px solid var(--sf-ink)' }}
              >
                Choose {t.name}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // D — Dark story
  return (
    <section className="relative overflow-hidden" style={{ background: 'var(--sf-ink)' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={TRADE_IMG} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="sf-container relative grid gap-10 py-20 md:grid-cols-2" style={{ color: 'var(--sf-on-brand)' }}>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--sf-accent)' }}>The Trade Program</div>
          <h2 className="sf-display mt-3 text-4xl font-semibold tracking-tight">Partner with {brandName}</h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
            We work with independent retailers, interior designers, and hospitality buyers — supplying considered product, reliable freight, and pricing that rewards loyalty.
          </p>
          <div className="mt-8"><SfButton>Become a Partner</SfButton></div>
        </div>
        <div className="grid grid-cols-2 gap-y-8 self-center">
          {[['1,200+', 'Active trade accounts'], ['98%', 'On-time fulfilment'], ['30 day', 'Standard net terms'], ['$500', 'First-order minimum']].map(([n, l]) => (
            <div key={l}>
              <div className="sf-display text-3xl font-semibold" style={{ color: 'var(--sf-accent)' }}>{n}</div>
              <div className="mt-1 text-[12px] uppercase tracking-[0.12em] text-white/60">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
