import type { SectionProps } from './_shared';
import type { Product, WizOrderSimulation, PersonaId } from '@/lib/types';
import { Eyebrow, SfButton, ProductImage } from './_shared';
import { money } from '@/lib/format';
import { priceFor, termsForPersona } from '@/lib/wizorder';

type Line = { p: Product; qty: number; unit: number };

function Lines({ lines, dense = false }: { lines: Line[]; dense?: boolean }) {
  return (
    <div>
      {lines.map(({ p, qty, unit }) => (
        <div key={p.sku} className="flex items-center gap-4 py-4" style={{ borderBottom: '1px solid var(--sf-line)' }}>
          <div className="w-16 flex-none">
            <ProductImage src={p.imageUrl} alt={p.name} ratio="aspect-square" />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold">{p.name}</div>
            <div className="text-[11px]" style={{ color: 'var(--sf-soft)' }}>{p.sku} · {money(unit)} ea</div>
          </div>
          {!dense && (
            <div className="flex items-center text-[12px]" style={{ border: '1px solid var(--sf-line)' }}>
              <span className="px-2 py-1" style={{ color: 'var(--sf-soft)' }}>–</span>
              <span className="px-2 py-1">{qty}</span>
              <span className="px-2 py-1" style={{ color: 'var(--sf-soft)' }}>+</span>
            </div>
          )}
          <div className="w-20 text-right text-[13px] font-semibold">{money(unit * qty)}</div>
        </div>
      ))}
    </div>
  );
}

function FreeShipBar({ sub, business }: { sub: number; business: WizOrderSimulation }) {
  if (!business.shipping.freeShippingEnabled) return null;
  const threshold = business.shipping.freeShippingThreshold;
  const pct = Math.min(100, Math.round((sub / threshold) * 100));
  const remaining = Math.max(0, threshold - sub);
  return (
    <div className="mb-5">
      <div className="mb-1.5 text-[12px]" style={{ color: 'var(--sf-muted)' }}>
        {remaining > 0 ? <>Add <strong style={{ color: 'var(--sf-ink)' }}>{money(remaining)}</strong> for free freight</> : <strong style={{ color: 'var(--sf-brand)' }}>You&apos;ve unlocked free freight ✓</strong>}
      </div>
      <div className="h-1.5 w-full" style={{ background: 'var(--sf-faint)' }}>
        <div className="h-full" style={{ width: `${pct}%`, background: 'var(--sf-brand)' }} />
      </div>
    </div>
  );
}

function Row({ l, v, bold, accent }: { l: string; v: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: bold ? 'var(--sf-ink)' : 'var(--sf-muted)' }} className={bold ? 'font-semibold' : ''}>{l}</span>
      <span className={bold ? 'sf-display text-base font-semibold' : ''} style={{ color: accent ? 'var(--sf-brand)' : 'var(--sf-ink)' }}>{v}</span>
    </div>
  );
}

function Totals({ lines, business, persona }: { lines: Line[]; business: WizOrderSimulation; persona: PersonaId }) {
  const sub = lines.reduce((s, l) => s + l.unit * l.qty, 0);
  const sh = business.shipping;
  const freeQualified = sh.freeShippingEnabled && sub >= sh.freeShippingThreshold;
  const freight = freeQualified ? 0 : sh.flatRate ? sh.flatRateAmount : sh.carrierCalculated ? 0 : 0;
  const vol = business.pricing.volumePricing ? Math.round(sub * 0.05) : 0;
  const surcharge = business.payments.surchargeEnabled ? Math.round((sub - vol) * (business.payments.surchargePercent / 100)) : 0;
  const total = sub - vol + freight + surcharge;
  return (
    <div className="space-y-2 text-[13px]">
      <Row l="Subtotal" v={money(sub)} />
      {vol > 0 && <Row l="Volume discount" v={'– ' + money(vol)} accent />}
      <Row l={sh.carrierCalculated && !freeQualified ? 'Freight (calculated)' : 'Freight'} v={freight ? money(freight) : 'Free'} />
      {surcharge > 0 && <Row l={`Card surcharge (${business.payments.surchargePercent}%)`} v={money(surcharge)} />}
      <div style={{ borderTop: '1px solid var(--sf-line)' }} className="pt-2">
        <Row l="Total" v={money(total)} bold />
      </div>
      <div className="pt-1 text-[11px]" style={{ color: 'var(--sf-soft)' }}>
        Payment: {termsForPersona(persona, business)}
        {business.payments.cardOnFile ? ' · card on file' : ''}
        {business.payments.ach ? ' · ACH' : ''}
      </div>
    </div>
  );
}

export function CartPreview({ variant, products, business, persona }: SectionProps) {
  const baseQty = business.catalog.moqEnabled ? business.catalog.moq : 12;
  const lines: Line[] = products.slice(0, 3).map((p, i) => ({
    p,
    qty: [baseQty * 2, baseQty, baseQty * 3][i] ?? baseQty,
    unit: priceFor(p, persona === 'guest' ? 'dealer' : persona, business).price,
  }));

  // A — Single cart (full page)
  if (variant === 'A') {
    return (
      <section className="sf-pad-y" style={{ background: 'var(--sf-bg)' }}>
        <div className="sf-container mb-6"><Eyebrow>Cart · Preview</Eyebrow><h2 className="sf-display text-3xl font-semibold">Your order</h2></div>
        <div className="sf-container grid gap-10 md:grid-cols-[1.6fr_1fr]">
          <Lines lines={lines} />
          <div className="p-7" style={{ background: 'var(--sf-surface)', border: '1px solid var(--sf-line)' }}>
            <FreeShipBar sub={lines.reduce((s, l) => s + l.unit * l.qty, 0)} business={business} />
            <Totals lines={lines} business={business} persona={persona} />
            <div className="mt-6"><SfButton className="w-full">Proceed to Checkout</SfButton></div>
          </div>
        </div>
      </section>
    );
  }

  // B — Multi-cart tabs (by project)
  if (variant === 'B') {
    const tabs = ['Showroom Floor', 'Q3 Restock', 'Client: Lumen Hotel'];
    return (
      <section className="sf-pad-y" style={{ background: 'var(--sf-bg)' }}>
        <div className="sf-container mb-5"><Eyebrow>Cart · Multi-cart by project</Eyebrow><h2 className="sf-display text-3xl font-semibold">Your projects</h2></div>
        <div className="sf-container">
          <div className="flex gap-1">
            {tabs.map((t, i) => (
              <span key={t} className="px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.1em]" style={i === 0 ? { background: 'var(--sf-surface)', borderTop: '2px solid var(--sf-brand)', color: 'var(--sf-ink)' } : { color: 'var(--sf-soft)' }}>
                {t}
              </span>
            ))}
            <span className="px-4 py-3 text-[12px]" style={{ color: 'var(--sf-brand)' }}>+ New cart</span>
          </div>
          <div className="grid gap-10 p-7 md:grid-cols-[1.6fr_1fr]" style={{ background: 'var(--sf-surface)', border: '1px solid var(--sf-line)' }}>
            <Lines lines={lines} />
            <div>
              <FreeShipBar sub={lines.reduce((s, l) => s + l.unit * l.qty, 0)} business={business} />
              <Totals lines={lines} business={business} persona={persona} />
              <div className="mt-6"><SfButton className="w-full">Submit Project Order</SfButton></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // C — Drawer (slide-over mock on a faux page)
  if (variant === 'C') {
    return (
      <section className="relative sf-pad-y" style={{ background: 'var(--sf-bg)' }}>
        <div className="sf-container"><Eyebrow>Cart · Slide-over drawer</Eyebrow></div>
        <div className="sf-container mt-4 grid gap-4 opacity-40 md:grid-cols-4">
          {products.slice(0, 4).map((p) => <ProductImage key={p.sku} src={p.imageUrl} alt="" ratio="aspect-[4/5]" />)}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-full max-w-md p-4">
          <div className="ml-auto flex h-full max-w-md flex-col p-6 shadow-2xl" style={{ background: 'var(--sf-surface)', border: '1px solid var(--sf-line)' }}>
            <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid var(--sf-line)' }}>
              <span className="sf-display text-lg font-semibold">Your cart (3)</span>
              <span style={{ color: 'var(--sf-soft)' }}>✕</span>
            </div>
            <div className="flex-1 overflow-hidden"><Lines lines={lines} dense /></div>
            <div className="pt-4">
              <Totals lines={lines} business={business} persona={persona} />
              <div className="mt-5"><SfButton className="w-full">Checkout</SfButton></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // D — Full-width table
  return (
    <section className="sf-pad-y" style={{ background: 'var(--sf-bg)' }}>
      <div className="sf-container">
        <Eyebrow>Cart · Full-width</Eyebrow>
        <h2 className="sf-display mb-6 text-3xl font-semibold">Order summary</h2>
        <div style={{ border: '1px solid var(--sf-line)' }}>
          <div className="grid grid-cols-[3fr_1fr_1fr_1fr] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ background: 'var(--sf-faint)', color: 'var(--sf-soft)' }}>
            <span>Product</span><span>Unit</span><span>Qty</span><span className="text-right">Total</span>
          </div>
          {lines.map(({ p, qty, unit }) => (
            <div key={p.sku} className="grid grid-cols-[3fr_1fr_1fr_1fr] items-center px-5 py-4 text-[13px]" style={{ borderTop: '1px solid var(--sf-line)' }}>
              <span className="font-semibold">{p.name}</span>
              <span>{money(unit)}</span>
              <span>{qty}</span>
              <span className="text-right font-semibold">{money(unit * qty)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-xs">
            <FreeShipBar sub={lines.reduce((s, l) => s + l.unit * l.qty, 0)} business={business} />
            <Totals lines={lines} business={business} persona={persona} />
            <div className="mt-5"><SfButton className="w-full">Checkout</SfButton></div>
          </div>
        </div>
      </div>
    </section>
  );
}
