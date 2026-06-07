'use client';

// Present Mode V2 — PDP (Steps 101–112, consolidated): gallery + lightbox,
// product info (price/inventory/MOQ/download/UPC/unit), accordions, related.

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { usePresentState } from '@/lib/present/usePresentState';
import { getSpec, getProductsByCategory } from '@/lib/present/dataLayer';
import { priceView } from '@/lib/present/pricing';
import { slugify } from '@/lib/present/slugify';
import { createToast } from '@/lib/present/toasts';
import { PresentHeader } from '../layout/PresentHeader';
import { PresentFooter } from '../layout/PresentFooter';
import { PresentBreadcrumb } from '../layout/PresentBreadcrumb';
import { Container, Img, PLink, money } from '../ui';
import { PLPProductCard } from '../plp/PLPProductCard';

export function PDPView({ product }: { product: Product }) {
  const { state, dispatch } = usePresentState();
  const spec = getSpec();
  const pdp = spec.pages.pdp;
  const moq = spec.business.moq;
  const [qty, setQty] = useState(moq.enabled ? moq.default : 1);
  const [open, setOpen] = useState<Record<string, boolean>>(Object.fromEntries(pdp.accordions.map((a) => [a.id, a.defaultOpen])));
  const [lightbox, setLightbox] = useState<number | null>(null);

  const related = getProductsByCategory(product.category).filter((p) => p.sku !== product.sku);
  const gallery = [product.imageUrl, ...related.slice(0, 3).map((p) => p.imageUrl)].filter(Boolean);
  const [active, setActive] = useState(0);
  const pv = priceView(product, { isLoggedIn: state.auth.isLoggedIn, hidePrices: state.preferences.hidePrices, loginGated: pdp.pricing.loginGated });

  const add = () => {
    dispatch({ type: 'ADD_TO_CART', item: { productId: product.sku, productName: product.name, sku: product.sku, imageUrl: product.imageUrl, selectedVariants: {}, qty, unitPrice: product.wholesalePrice, msrp: product.msrp, slug: slugify(product.name) } });
    dispatch({ type: 'SHOW_TOAST', toast: createToast('Added to cart') });
  };
  const download = () => {
    dispatch({ type: 'SHOW_TOAST', toast: createToast('Preparing download…', 'info', 1400) });
    setTimeout(() => dispatch({ type: 'SHOW_TOAST', toast: createToast('Download ready (connects to live assets in production)') }), 1500);
  };

  return (
    <>
      <PresentHeader />
      <PresentBreadcrumb segments={[{ label: product.category, href: `/category/${product.category}` }, { label: product.name }]} />
      <main className="pb-16">
        <Container className="grid gap-10 md:grid-cols-2">
          {/* Gallery */}
          <div className="flex gap-3">
            {gallery.length > 1 && pdp.gallery.mode !== 'single' && (
              <div className="flex flex-col gap-2">
                {gallery.slice(0, pdp.gallery.thumbnailCount).map((src, i) => (
                  <button key={i} onClick={() => setActive(i)} className="w-16 overflow-hidden" style={{ outline: i === active ? '2px solid var(--sf-brand)' : 'none' }}><Img src={src} alt="" ratio="aspect-square" /></button>
                ))}
              </div>
            )}
            <div className="relative flex-1">
              <Img src={gallery[active]} alt={product.name} ratio="aspect-[4/5]" />
              {pdp.gallery.showFullscreenButton && <button onClick={() => setLightbox(active)} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[var(--sf-ink)]" aria-label="Fullscreen">⤢</button>}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between">
              <div className="text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--sf-soft)' }}>{product.sku}</div>
              {pdp.downloadButton.enabled && <button onClick={download} className="text-[12px] font-medium underline">{pdp.downloadButton.label}</button>}
            </div>
            <h1 className="sf-display mt-2 text-3xl font-semibold tracking-tight">{product.name}</h1>

            {pv.mode === 'locked' ? (
              <PLink href="/login" className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold" style={{ border: '1px solid var(--sf-brand)', color: 'var(--sf-brand)' }}>🔒 Login to see price</PLink>
            ) : pv.mode === 'show' ? (
              <div className="mt-4 flex items-baseline gap-3">
                <span className="sf-display text-2xl font-semibold" style={{ color: 'var(--sf-brand)' }}>{money(pv.price)}</span>
                {pdp.pricing.showMSRP && pv.msrp > pv.price && <span className="text-[14px] line-through" style={{ color: 'var(--sf-soft)' }}>{money(pv.msrp)} {pdp.pricing.msrpLabel}</span>}
              </div>
            ) : null}

            <div className="mt-2 text-[13px] font-medium" style={{ color: 'var(--sf-brand)' }}>In stock · ships in 2–3 weeks</div>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>{product.description}</p>

            <div className="mt-3 space-y-1 text-[12px]" style={{ color: 'var(--sf-muted)' }}>
              {pdp.fields.showUnitType && <div>Sold As {pdp.fields.unitType}</div>}
              {pdp.fields.showUPC && <div>UPC {product.sku}-000</div>}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center" style={{ border: '1px solid var(--sf-line)' }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-3">–</button>
                <input value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="w-12 bg-transparent py-3 text-center text-[14px] outline-none" />
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-3">+</button>
              </div>
              <button onClick={add} className="px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>Add to Order</button>
            </div>
            {moq.enabled && qty < moq.default && <div className="mt-2 text-[12px]" style={{ color: '#b45309' }}>Minimum order quantity is {moq.default} units.</div>}

            {/* Accordions */}
            <div className="mt-8 border-t" style={{ borderColor: 'var(--sf-line)' }}>
              {pdp.accordions.map((a) => (
                <div key={a.id} style={{ borderBottom: '1px solid var(--sf-line)' }}>
                  <button onClick={() => setOpen((o) => ({ ...o, [a.id]: !o[a.id] }))} className="flex w-full items-center justify-between py-3 text-[13px] font-semibold uppercase tracking-[0.08em]">
                    {a.label}<span>{open[a.id] ? '–' : '+'}</span>
                  </button>
                  {open[a.id] && (
                    <div className="pb-4 text-[13px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>
                      {a.type === 'details_care' && product.description}
                      {a.type === 'dimensions' && 'Dimensions available on request. Contact your rep for full specs.'}
                      {a.type === 'materials' && 'Solid hardwood, natural finishes.'}
                      {a.type === 'specifications' && `SKU ${product.sku} · Category ${product.category}`}
                      {a.type === 'shipping' && 'Ships via LTL freight. Free freight over $500.'}
                      {a.type === 'custom' && '—'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>

        {/* Related */}
        {pdp.relatedProducts.enabled && related.length > 0 && (
          <Container className="mt-14">
            <h2 className="sf-display mb-5 text-2xl font-semibold">{pdp.relatedProducts.label}</h2>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">{related.slice(0, pdp.relatedProducts.maxCount).map((p) => <PLPProductCard key={p.sku} product={p} cardConfig={spec.pages.plp.productCard} />)}</div>
          </Container>
        )}
      </main>
      <PresentFooter />

      {lightbox !== null && (
        <div className="fixed inset-0 z-[95] grid place-items-center bg-black/90 p-6" onClick={() => setLightbox(null)}>
          <button className="absolute right-5 top-5 text-2xl text-white" onClick={() => setLightbox(null)}>✕</button>
          <button className="absolute left-5 text-3xl text-white" onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! - 1 + gallery.length) % gallery.length); }}>‹</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={gallery[lightbox]} alt="" className="max-h-[85vh] max-w-[85vw] object-contain" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-5 text-3xl text-white" onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! + 1) % gallery.length); }}>›</button>
          <div className="absolute bottom-5 text-[13px] text-white/70">{lightbox + 1} / {gallery.length}</div>
        </div>
      )}
    </>
  );
}
