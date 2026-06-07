import type { SectionProps } from './_shared';
import { Eyebrow } from './_shared';

const QUOTES = [
  { q: 'Reordering is effortless and the margins actually work for an independent shop. Our customers ask for these pieces by name.', a: 'Marin Ellsworth', r: 'Owner, Foothill Mercantile' },
  { q: 'The trade portal cut our purchasing time in half. Net-30 terms let us stock deeper without the cash-flow squeeze.', a: 'Devon Park', r: 'Buyer, North & Oak' },
  { q: 'Best wholesale partner we have. Freight is predictable, the rep is responsive, and the catalog photographs beautifully.', a: 'Priya Raman', r: 'Founder, Studio Verde' },
];

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-0.5" style={{ color: 'var(--sf-accent)' }}>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

export function Testimonials({ variant }: SectionProps) {
  // A — Hero quote
  if (variant === 'A') {
    return (
      <section className="sf-pad-y" style={{ background: 'var(--sf-bg)' }}>
        <div className="sf-container max-w-3xl text-center">
          <Stars />
          <blockquote className="sf-display mt-5 text-2xl font-medium leading-snug md:text-3xl">
            “{QUOTES[0].q}”
          </blockquote>
          <div className="mt-6 text-[13px]">
            <span className="font-semibold">{QUOTES[0].a}</span>
            <span style={{ color: 'var(--sf-muted)' }}> — {QUOTES[0].r}</span>
          </div>
        </div>
      </section>
    );
  }

  // B — 3-up grid
  if (variant === 'B') {
    return (
      <section className="sf-pad-y" style={{ background: 'var(--sf-bg)' }}>
        <div className="sf-container mb-8 text-center">
          <Eyebrow className="mx-auto">Loved by buyers</Eyebrow>
          <h2 className="sf-display text-3xl font-semibold tracking-tight md:text-4xl">What stockists say</h2>
        </div>
        <div className="sf-container grid gap-5 md:grid-cols-3">
          {QUOTES.map((t) => (
            <div key={t.a} className="flex flex-col p-7" style={{ background: 'var(--sf-surface)', border: '1px solid var(--sf-line)' }}>
              <Stars />
              <p className="mt-4 flex-1 text-[14px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>“{t.q}”</p>
              <div className="mt-5 text-[12px]">
                <div className="font-semibold">{t.a}</div>
                <div style={{ color: 'var(--sf-soft)' }}>{t.r}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // C — Aggregated rating
  if (variant === 'C') {
    return (
      <section className="sf-pad-y" style={{ background: 'var(--sf-ink)' }}>
        <div className="sf-container grid items-center gap-10 md:grid-cols-[auto_1fr]" style={{ color: 'var(--sf-on-brand)' }}>
          <div className="text-center md:border-r md:pr-12" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
            <div className="sf-display text-6xl font-semibold" style={{ color: 'var(--sf-accent)' }}>4.9</div>
            <Stars />
            <div className="mt-2 text-[12px] text-white/60">from 840+ trade reviews</div>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {QUOTES.map((t) => (
              <div key={t.a}>
                <p className="text-[13px] leading-relaxed text-white/80">“{t.q.slice(0, 96)}…”</p>
                <div className="mt-3 text-[12px] font-semibold">{t.a}</div>
                <div className="text-[11px] text-white/50">{t.r}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // D — Carousel (static peek of 2, with rail dots)
  return (
    <section className="sf-pad-y" style={{ background: 'var(--sf-bg)' }}>
      <div className="sf-container mb-8 flex items-end justify-between">
        <div>
          <Eyebrow>Testimonials</Eyebrow>
          <h2 className="sf-display text-3xl font-semibold tracking-tight md:text-4xl">From the trade floor</h2>
        </div>
        <div className="flex gap-2 text-[12px]" style={{ color: 'var(--sf-muted)' }}>
          <span className="grid h-9 w-9 place-items-center" style={{ border: '1px solid var(--sf-line)' }}>‹</span>
          <span className="grid h-9 w-9 place-items-center" style={{ border: '1px solid var(--sf-line)' }}>›</span>
        </div>
      </div>
      <div className="no-bar flex gap-5 overflow-x-auto px-8 pb-2">
        {QUOTES.concat(QUOTES.slice(0, 1)).map((t, i) => (
          <div key={i} className="w-[420px] max-w-[80vw] flex-none p-8" style={{ background: 'var(--sf-surface)', border: '1px solid var(--sf-line)' }}>
            <Stars />
            <p className="sf-display mt-4 text-lg leading-snug">“{t.q}”</p>
            <div className="mt-5 text-[12px]">
              <span className="font-semibold">{t.a}</span> <span style={{ color: 'var(--sf-soft)' }}>· {t.r}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
