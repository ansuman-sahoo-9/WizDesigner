import type { SectionProps } from './_shared';
import type { Product, WizOrderSimulation, PersonaId } from '@/lib/types';
import { Eyebrow, ProductImage } from './_shared';
import { money } from '@/lib/format';
import { priceFor, type PriceInfo } from '@/lib/wizorder';

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="sf-container mb-8 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
      <div>
        <Eyebrow>{sub}</Eyebrow>
        <h2 className="sf-display text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      </div>
      <span className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--sf-brand)' }}>
        View all →
      </span>
    </div>
  );
}

function Price({ info }: { info: PriceInfo }) {
  if (info.locked) {
    return (
      <div className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: 'var(--sf-brand)' }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="11" width="16" height="9" rx="1" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        Login to see price
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="text-[14px] font-semibold" style={{ color: 'var(--sf-ink)' }}>{money(info.price)}</span>
      {info.compareAt && info.compareAt > info.price && (
        <span className="text-[12px] line-through" style={{ color: 'var(--sf-soft)' }}>{money(info.compareAt)}</span>
      )}
      <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--sf-brand)' }}>{info.tierLabel}</span>
    </div>
  );
}

function BestSeller() {
  return (
    <span className="absolute left-3 top-3 z-10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider" style={{ background: 'var(--sf-accent)', color: '#111' }}>
      Best Seller
    </span>
  );
}

export function Featured({ variant, products, business, persona }: SectionProps) {
  const info = (p: Product) => priceFor(p, persona, business);
  const tag = business.catalog.bestSellerTagging;

  // A — 4-col spacious
  if (variant === 'A') {
    return (
      <section className="sf-pad-y" style={{ background: 'var(--sf-surface)' }}>
        <Heading title="Featured this season" sub="New & Restocked" />
        <div className="sf-container grid grid-cols-2 gap-6 md:grid-cols-4">
          {products.slice(0, 4).map((p, i) => (
            <div key={p.sku} className="group relative">
              {tag && i === 0 && <BestSeller />}
              <ProductImage src={p.imageUrl} alt={p.name} />
              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--sf-soft)' }}>{p.sku}</div>
                <h3 className="sf-display mt-1 text-[16px] font-semibold">{p.name}</h3>
                <div className="mt-2"><Price info={info(p)} /></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // B — 6-col bulk add (dense, with qty + add)
  if (variant === 'B') {
    return (
      <section className="sf-pad-y" style={{ background: 'var(--sf-surface)' }}>
        <Heading title="Quick bulk order" sub="Volume Buying" />
        <div className="sf-container grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {products.slice(0, 6).map((p, i) => {
            const pi = info(p);
            return (
              <div key={p.sku} className="relative flex flex-col" style={{ border: '1px solid var(--sf-line)' }}>
                {tag && i === 0 && <BestSeller />}
                <ProductImage src={p.imageUrl} alt={p.name} ratio="aspect-square" />
                <div className="flex flex-1 flex-col p-3">
                  <h3 className="text-[12px] font-semibold leading-snug">{p.name}</h3>
                  <div className="mt-1 text-[12px] font-semibold" style={{ color: 'var(--sf-brand)' }}>
                    {pi.locked ? 'Login to see price' : money(pi.price)}
                  </div>
                  <div className="mt-auto flex items-stretch gap-2 pt-3">
                    {pi.locked ? (
                      <span className="flex flex-1 items-center justify-center py-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ border: '1px solid var(--sf-ink)' }}>
                        Login to order
                      </span>
                    ) : (
                      <>
                        <div className="flex items-center" style={{ border: '1px solid var(--sf-line)' }}>
                          <span className="px-2 py-1 text-[12px]" style={{ color: 'var(--sf-soft)' }}>–</span>
                          <span className="px-2 py-1 text-[12px]">{business.catalog.moqEnabled ? business.catalog.moq : 1}</span>
                          <span className="px-2 py-1 text-[12px]" style={{ color: 'var(--sf-soft)' }}>+</span>
                        </div>
                        <span className="flex flex-1 items-center justify-center text-[11px] font-semibold uppercase tracking-wide" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>
                          Add
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // C — 3-col editorial (large, with description)
  if (variant === 'C') {
    return (
      <section className="sf-pad-y" style={{ background: 'var(--sf-surface)' }}>
        <Heading title="The editorial edit" sub="Designer Picks" />
        <div className="sf-container grid gap-8 md:grid-cols-3">
          {products.slice(0, 3).map((p, i) => (
            <div key={p.sku} className="group relative">
              {tag && i === 0 && <BestSeller />}
              <ProductImage src={p.imageUrl} alt={p.name} ratio="aspect-[3/4]" />
              <div className="mt-5">
                <h3 className="sf-display text-xl font-semibold">{p.name}</h3>
                <p className="mt-2 text-[13px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>{p.description}</p>
                <div className="mt-3"><Price info={info(p)} /></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // D — Horizontal carousel
  return (
    <section className="sf-pad-y" style={{ background: 'var(--sf-surface)' }}>
      <Heading title="Best sellers" sub="Reorder Favourites" />
      <div className="no-bar flex gap-5 overflow-x-auto px-8 pb-2">
        {products.map((p) => (
          <div key={p.sku} className="w-[240px] flex-none">
            <ProductImage src={p.imageUrl} alt={p.name} />
            <div className="mt-3">
              <h3 className="sf-display text-[15px] font-semibold">{p.name}</h3>
              <div className="mt-1"><Price info={info(p)} /></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
