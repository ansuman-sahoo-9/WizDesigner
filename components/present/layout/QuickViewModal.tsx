'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { usePresentState } from '@/lib/present/usePresentState';
import { getSpec } from '@/lib/present/dataLayer';
import { priceView } from '@/lib/present/pricing';
import { slugify } from '@/lib/present/slugify';
import { createToast } from '@/lib/present/toasts';
import { Img, PLink, money } from '../ui';

export function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { state, dispatch } = usePresentState();
  const spec = getSpec();
  const [qty, setQty] = useState(spec.business.moq.enabled ? spec.business.moq.default : 1);
  const pv = priceView(product, { isLoggedIn: state.auth.isLoggedIn, hidePrices: state.preferences.hidePrices, loginGated: spec.business.pricing.loginGated });
  const slug = slugify(product.name);

  const add = () => {
    dispatch({ type: 'ADD_TO_CART', item: { productId: product.sku, productName: product.name, sku: product.sku, imageUrl: product.imageUrl, selectedVariants: {}, qty, unitPrice: product.wholesalePrice, msrp: product.msrp, slug } });
    dispatch({ type: 'SHOW_TOAST', toast: createToast('Added to cart') });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[85] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative grid w-full max-w-2xl gap-6 rounded-xl p-6 md:grid-cols-2" style={{ background: 'var(--sf-surface)', color: 'var(--sf-ink)' }}>
        <button onClick={onClose} className="absolute right-4 top-4 text-[var(--sf-soft)]">✕</button>
        <Img src={product.imageUrl} alt={product.name} ratio="aspect-square" />
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--sf-soft)' }}>{product.sku}</div>
          <h3 className="sf-display mt-1 text-2xl font-semibold">{product.name}</h3>
          <div className="mt-3 text-[15px] font-semibold" style={{ color: 'var(--sf-brand)' }}>
            {pv.mode === 'show' ? money(pv.price) : pv.mode === 'locked' ? 'Login to see price' : '—'}
          </div>
          <p className="mt-3 text-[13px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>{product.description}</p>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center" style={{ border: '1px solid var(--sf-line)' }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2">–</button>
              <span className="px-3 py-2 text-[14px]">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2">+</button>
            </div>
            <button onClick={add} className="px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>Add to Cart</button>
          </div>
          <PLink href={`/product/${slug}`} className="mt-4 inline-block text-[12px] font-medium underline" >View full details →</PLink>
        </div>
      </div>
    </div>
  );
}
