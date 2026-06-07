'use client';

// Present Mode V2 — Cart (Steps 113–119, consolidated).

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePresentState } from '@/lib/present/usePresentState';
import { getSpec, getAllProducts } from '@/lib/present/dataLayer';
import { searchProducts } from '@/lib/present/search';
import { slugify } from '@/lib/present/slugify';
import { createToast } from '@/lib/present/toasts';
import { PresentHeader } from '../layout/PresentHeader';
import { PresentFooter } from '../layout/PresentFooter';
import { Container, Img, PLink, money, px } from '../ui';

export function CartView() {
  const router = useRouter();
  const { state, dispatch } = usePresentState();
  const spec = getSpec();
  const items = state.cart.items;
  const sub = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const moq = spec.business.moq;
  const ship = spec.business.shipping;
  const freeOver = ship.freeShippingThreshold ?? 0;
  const freight = ship.freeShipping && sub >= freeOver ? 0 : ship.flatRate ? (ship.flatRateAmount ?? 0) : 0;
  const hide = state.preferences.hidePrices;

  const [addOpen, setAddOpen] = useState(false);
  const [q, setQ] = useState('');
  const [noteFor, setNoteFor] = useState<string | null>(null);

  if (!items.length) {
    return (
      <>
        <PresentHeader />
        <Container className="grid place-items-center py-28 text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--sf-soft)" strokeWidth="1.4"><path d="M6 6h15l-1.5 9h-12zM6 6L5 3H2" /></svg>
          <h1 className="sf-display mt-4 text-2xl font-semibold">Your cart is empty</h1>
          <PLink href="/category/seating" className="mt-5 inline-block px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>Start Shopping</PLink>
        </Container>
        <PresentFooter />
      </>
    );
  }

  const results = q.trim() ? searchProducts(q, getAllProducts()).slice(0, 8) : [];

  return (
    <>
      <PresentHeader />
      <Container className="py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--sf-line)' }}>
          <h1 className="sf-display text-2xl font-semibold">{items.length} {items.length === 1 ? 'product' : 'products'} in cart</h1>
          <div className="flex items-center gap-3 text-[12px] font-medium">
            <button onClick={() => setAddOpen(true)} className="hover:opacity-70">+ Add Products</button>
            <button onClick={() => { if (confirm('Remove all items?')) dispatch({ type: 'CLEAR_CART' }); }} className="hover:text-red-600">Delete All</button>
            <button onClick={() => dispatch({ type: 'SHOW_TOAST', toast: createToast('Cart export ready (connects to live in production)') })} className="hover:opacity-70">Download ↓</button>
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <div>
            {items.map((it) => (
              <div key={it.id} className="flex gap-4 border-b py-5" style={{ borderColor: 'var(--sf-line)' }}>
                <PLink href={`/product/${it.slug}`} className="w-20 flex-none"><Img src={it.imageUrl} alt={it.productName} ratio="aspect-square" /></PLink>
                <div className="flex-1">
                  <PLink href={`/product/${it.slug}`} className="text-[14px] font-semibold hover:opacity-70">{it.productName}</PLink>
                  <div className="text-[11px]" style={{ color: 'var(--sf-soft)' }}>{it.sku}{!hide && <> · {money(it.unitPrice)} ea</>}</div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center" style={{ border: '1px solid var(--sf-line)' }}>
                      <button onClick={() => it.qty > 1 ? dispatch({ type: 'UPDATE_QTY', id: it.id, qty: it.qty - 1 }) : dispatch({ type: 'REMOVE_FROM_CART', id: it.id })} className="px-2.5 py-1.5">–</button>
                      <input value={it.qty} onChange={(e) => dispatch({ type: 'UPDATE_QTY', id: it.id, qty: Math.max(1, Number(e.target.value) || 1) })} className="w-10 bg-transparent py-1.5 text-center text-[13px] outline-none" />
                      <button onClick={() => dispatch({ type: 'UPDATE_QTY', id: it.id, qty: it.qty + 1 })} className="px-2.5 py-1.5">+</button>
                    </div>
                    <button onClick={() => setNoteFor(noteFor === it.id ? null : it.id)} className="text-[12px]" style={{ color: 'var(--sf-muted)' }}>Add note</button>
                    <button onClick={() => dispatch({ type: 'REMOVE_FROM_CART', id: it.id })} className="text-[12px]" style={{ color: 'var(--sf-muted)' }}>Remove</button>
                  </div>
                  {moq.enabled && it.qty < moq.default && <div className="mt-1.5 text-[11px]" style={{ color: '#b45309' }}>Below MOQ of {moq.default} units.</div>}
                  {noteFor === it.id && (
                    <textarea value={state.cart.notes[it.id] ?? ''} onChange={(e) => dispatch({ type: 'ADD_CART_NOTE', itemId: it.id, note: e.target.value })} placeholder="Add a note for this item…" className="mt-2 w-full rounded border p-2 text-[12px] outline-none" style={{ borderColor: 'var(--sf-line)', background: 'var(--sf-bg)' }} rows={2} />
                  )}
                </div>
                {!hide && <div className="w-20 text-right text-[14px] font-semibold">{money(it.unitPrice * it.qty)}</div>}
              </div>
            ))}
          </div>

          <div className="h-max p-6" style={{ background: 'var(--sf-surface)', border: '1px solid var(--sf-line)' }}>
            {ship.freeShipping && freeOver > 0 && (
              <div className="mb-4">
                <div className="mb-1.5 text-[12px]" style={{ color: 'var(--sf-muted)' }}>{sub >= freeOver ? <strong style={{ color: 'var(--sf-brand)' }}>Free freight unlocked ✓</strong> : <>Add <strong style={{ color: 'var(--sf-ink)' }}>{money(freeOver - sub)}</strong> for free freight</>}</div>
                <div className="h-1.5 w-full" style={{ background: 'var(--sf-faint)' }}><div className="h-full" style={{ width: `${Math.min(100, (sub / freeOver) * 100)}%`, background: 'var(--sf-brand)' }} /></div>
              </div>
            )}
            {!hide ? (
              <div className="space-y-2 text-[13px]">
                <Row l="Subtotal" v={money(sub)} />
                <Row l="Freight" v={freight ? money(freight) : 'Free'} />
                <div className="border-t pt-2" style={{ borderColor: 'var(--sf-line)' }}><Row l="Total" v={money(sub + freight)} bold /></div>
              </div>
            ) : <div className="text-[13px]" style={{ color: 'var(--sf-muted)' }}>Prices hidden</div>}
            <button onClick={() => router.push(px('/checkout/shipping'))} className="mt-5 w-full py-3 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>Proceed to Checkout</button>
            <PLink href="/category/seating" className="mt-2 block text-center text-[12px] hover:opacity-70" style={{ color: 'var(--sf-muted)' }}>Continue Shopping</PLink>
          </div>
        </div>
      </Container>
      <PresentFooter />

      {addOpen && (
        <div className="fixed inset-0 z-[85] grid place-items-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAddOpen(false)} />
          <div className="relative flex max-h-[80vh] w-full max-w-lg flex-col rounded-xl p-5" style={{ background: 'var(--sf-surface)', color: 'var(--sf-ink)' }}>
            <div className="mb-3 flex items-center justify-between"><span className="sf-display text-lg font-semibold">Add products</span><button onClick={() => setAddOpen(false)} className="text-[var(--sf-soft)]">✕</button></div>
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="mb-3 w-full rounded border px-3 py-2 text-[13px] outline-none" style={{ borderColor: 'var(--sf-line)' }} />
            <div className="flex-1 overflow-y-auto">
              {results.map((p) => (
                <div key={p.sku} className="flex items-center gap-3 border-b py-2" style={{ borderColor: 'var(--sf-line)' }}>
                  <div className="w-10 flex-none"><Img src={p.imageUrl} alt="" ratio="aspect-square" /></div>
                  <div className="flex-1 text-[13px]"><div className="font-medium">{p.name}</div><div className="text-[11px]" style={{ color: 'var(--sf-soft)' }}>{p.sku}{!hide && ` · ${money(p.wholesalePrice)}`}</div></div>
                  <button onClick={() => { dispatch({ type: 'ADD_TO_CART', item: { productId: p.sku, productName: p.name, sku: p.sku, imageUrl: p.imageUrl, selectedVariants: {}, qty: 1, unitPrice: p.wholesalePrice, msrp: p.msrp, slug: slugify(p.name) } }); dispatch({ type: 'SHOW_TOAST', toast: createToast('Added to cart') }); }} className="rounded border px-3 py-1 text-[12px]" style={{ borderColor: 'var(--sf-line)' }}>Add</button>
                </div>
              ))}
              {q.trim() && !results.length && <div className="py-6 text-center text-[13px]" style={{ color: 'var(--sf-soft)' }}>No matches.</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ l, v, bold }: { l: string; v: string; bold?: boolean }) {
  return <div className="flex justify-between"><span style={{ color: bold ? 'var(--sf-ink)' : 'var(--sf-muted)' }} className={bold ? 'font-semibold' : ''}>{l}</span><span className={bold ? 'sf-display text-base font-semibold' : ''}>{v}</span></div>;
}
