import type { SectionProps } from './_shared';
import type { Product, WizOrderSimulation, PersonaId } from '@/lib/types';
import { Eyebrow, SfButton, ProductImage } from './_shared';
import { money, marginPct } from '@/lib/format';
import { priceFor, priceBreaks } from '@/lib/wizorder';

function PriceBlock({ p, persona, business }: { p: Product; persona: PersonaId; business: WizOrderSimulation }) {
  const info = priceFor(p, persona, business);
  if (info.locked) {
    return (
      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold" style={{ border: '1px solid var(--sf-brand)', color: 'var(--sf-brand)' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="11" width="16" height="9" rx="1" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        Login to see {persona === 'guest' ? 'trade' : ''} price
      </div>
    );
  }
  return (
    <>
      <div className="mt-4 flex items-baseline gap-3">
        <span className="sf-display text-2xl font-semibold" style={{ color: 'var(--sf-brand)' }}>{money(info.price)}</span>
        {info.compareAt && <span className="text-[14px] line-through" style={{ color: 'var(--sf-soft)' }}>{money(info.compareAt)} MSRP</span>}
        <span className="px-2 py-0.5 text-[11px] font-semibold" style={{ background: 'var(--sf-accent)', color: '#111' }}>
          {marginPct(p.msrp, info.price)}% margin
        </span>
      </div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--sf-soft)' }}>{info.tierLabel}</div>
      {info.showBreaks && (
        <div className="mt-4 inline-grid grid-cols-3 gap-px text-center text-[12px]" style={{ background: 'var(--sf-line)', border: '1px solid var(--sf-line)' }}>
          {priceBreaks(info).map((b) => (
            <div key={b.qty} className="px-4 py-2" style={{ background: 'var(--sf-surface)' }}>
              <div style={{ color: 'var(--sf-soft)' }}>{b.qty}</div>
              <div className="font-semibold">{b.price}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Specs({ business }: { business: WizOrderSimulation }) {
  const c = business.catalog;
  const items: [string, string][] = [];
  if (c.casePacksEnabled) items.push(['Case pack', String(c.casePackSize)]);
  if (c.moqEnabled) items.push(['MOQ', `${c.moq} units`]);
  items.push(['Lead time', '2–3 wks']);
  if (c.etaForOOSEnabled) items.push(['Restock ETA', 'Apr 18']);
  else items.push(['In stock', '340']);
  return (
    <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2 text-[12px]" style={{ color: 'var(--sf-muted)' }}>
      {items.map(([k, v]) => (
        <span key={k}>
          {k}: <span style={{ color: 'var(--sf-ink)' }}>{v}</span>
        </span>
      ))}
    </div>
  );
}

function Extras({ business }: { business: WizOrderSimulation }) {
  const { externalRetail, catalog } = business;
  const hasExternal = externalRetail.amazonLinksEnabled || externalRetail.walmartLinksEnabled;
  if (!hasExternal && !catalog.customModifiersEnabled) return null;
  return (
    <div className="mt-6 space-y-3">
      {catalog.customModifiersEnabled && (
        <div className="p-4" style={{ border: '1px solid var(--sf-line)' }}>
          <div className="flex items-center justify-between text-[12px] font-semibold uppercase tracking-[0.1em]">
            <span>Custom Imprint Details</span><span style={{ color: 'var(--sf-soft)' }}>+</span>
          </div>
          <div className="mt-2 h-9" style={{ background: 'var(--sf-faint)' }} />
          <div className="mt-2 text-[11px]" style={{ color: 'var(--sf-soft)' }}>Add your logo / imprint copy — priced per unit.</div>
        </div>
      )}
      {hasExternal && (
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <span style={{ color: 'var(--sf-soft)' }}>Also available at:</span>
          {externalRetail.amazonLinksEnabled && (
            <span className="px-3 py-1.5 font-semibold" style={{ border: '1px solid var(--sf-line)' }}>Buy on Amazon</span>
          )}
          {externalRetail.walmartLinksEnabled && (
            <span className="px-3 py-1.5 font-semibold" style={{ border: '1px solid var(--sf-line)' }}>Buy at Walmart</span>
          )}
        </div>
      )}
    </div>
  );
}

function Info({ p, persona, business }: { p: Product; persona: PersonaId; business: WizOrderSimulation }) {
  const locked = priceFor(p, persona, business).locked;
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--sf-soft)' }}>{p.sku}</div>
      <h2 className="sf-display mt-2 text-3xl font-semibold tracking-tight">{p.name}</h2>
      <PriceBlock p={p} persona={persona} business={business} />
      <p className="mt-4 max-w-md text-[14px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>{p.description}</p>
      <div className="mt-6 flex items-center gap-3">
        {locked ? (
          <SfButton>Login to order</SfButton>
        ) : (
          <>
            <div className="flex items-center" style={{ border: '1px solid var(--sf-line)' }}>
              <span className="px-3 py-3 text-[14px]" style={{ color: 'var(--sf-soft)' }}>–</span>
              <span className="px-4 py-3 text-[14px]">{business.catalog.moqEnabled ? business.catalog.moq : 24}</span>
              <span className="px-3 py-3 text-[14px]" style={{ color: 'var(--sf-soft)' }}>+</span>
            </div>
            <SfButton>Add to Order</SfButton>
          </>
        )}
      </div>
      <Specs business={business} />
      <Extras business={business} />
    </div>
  );
}

function SimilarProducts({ products }: { products: Product[] }) {
  return (
    <div className="sf-container mt-12">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-5 w-5 place-items-center rounded text-[9px] font-bold" style={{ background: 'var(--sf-accent)', color: '#111' }}>AI</span>
        <h3 className="sf-display text-lg font-semibold">Similar products</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.slice(1, 5).map((p) => (
          <div key={p.sku}>
            <ProductImage src={p.imageUrl} alt={p.name} ratio="aspect-square" />
            <div className="mt-2 text-[13px] font-medium">{p.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PDPPreview({ variant, products, business, persona }: SectionProps) {
  const p = products[0];
  const gallery = products.slice(0, 4).map((x) => x.imageUrl);
  if (!p) return null;
  const similar = business.aiFeatures.similarProductsEnabled ? <SimilarProducts products={products} /> : null;

  // A — Classic 2-col
  if (variant === 'A') {
    return (
      <section className="sf-pad-y" style={{ background: 'var(--sf-bg)' }}>
        <div className="sf-container mb-6"><Eyebrow>Product Detail · Preview</Eyebrow></div>
        <div className="sf-container grid gap-10 md:grid-cols-2">
          <div className="grid grid-cols-2 gap-3">
            {gallery.map((src, i) => (
              <ProductImage key={i} src={src} alt={`${p.name} ${i}`} ratio={i === 0 ? 'aspect-square col-span-2' : 'aspect-square'} />
            ))}
          </div>
          <Info p={p} persona={persona} business={business} />
        </div>
        {similar}
      </section>
    );
  }

  // B — Sticky info (gallery left, persistent buy box right)
  if (variant === 'B') {
    return (
      <section className="sf-pad-y" style={{ background: 'var(--sf-bg)' }}>
        <div className="sf-container mb-6"><Eyebrow>Product Detail · Sticky Buy Box</Eyebrow></div>
        <div className="sf-container grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            <ProductImage src={gallery[0]} alt={p.name} ratio="aspect-[4/3]" />
            <div className="grid grid-cols-2 gap-3">
              {gallery.slice(1, 3).map((src, i) => <ProductImage key={i} src={src} alt="" ratio="aspect-[4/3]" />)}
            </div>
          </div>
          <div>
            <div className="p-7" style={{ background: 'var(--sf-surface)', border: '1px solid var(--sf-line)' }}>
              <Info p={p} persona={persona} business={business} />
            </div>
          </div>
        </div>
        {similar}
      </section>
    );
  }

  // C — Full-bleed
  if (variant === 'C') {
    const pi = priceFor(p, persona, business);
    return (
      <section style={{ background: 'var(--sf-ink)' }}>
        <div className="grid md:grid-cols-2">
          <div className="min-h-[480px]">
            <ProductImage src={gallery[0]} alt={p.name} ratio="h-full" className="h-full" />
          </div>
          <div className="flex items-center px-8 py-16 md:px-14" style={{ color: 'var(--sf-on-brand)' }}>
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--sf-accent)' }}>{p.sku}</div>
              <h2 className="sf-display mt-2 text-4xl font-semibold tracking-tight">{p.name}</h2>
              <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/70">{p.description}</p>
              <div className="sf-display mt-6 text-3xl font-semibold" style={{ color: 'var(--sf-accent)' }}>
                {pi.locked ? 'Login to see price' : money(pi.price)}
              </div>
              <div className="mt-7"><SfButton>{pi.locked ? 'Login to order' : 'Add to Order'}</SfButton></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // D — Editorial
  const pi = priceFor(p, persona, business);
  return (
    <section className="sf-pad-y" style={{ background: 'var(--sf-bg)' }}>
      <div className="sf-container max-w-4xl">
        <div className="text-center">
          <Eyebrow className="mx-auto">Featured Product</Eyebrow>
          <h2 className="sf-display text-4xl font-semibold tracking-tight md:text-5xl">{p.name}</h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>{p.description}</p>
        </div>
        <ProductImage src={gallery[0]} alt={p.name} ratio="aspect-[16/9]" className="mt-9" />
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="sf-display text-2xl font-semibold" style={{ color: 'var(--sf-brand)' }}>
            {pi.locked ? 'Login to see price' : (
              <>{money(pi.price)} <span className="text-[14px] font-normal line-through" style={{ color: 'var(--sf-soft)' }}>{money(p.msrp)}</span></>
            )}
          </div>
          <SfButton>{pi.locked ? 'Login to order' : 'Add to Order'}</SfButton>
        </div>
      </div>
      {similar}
    </section>
  );
}
