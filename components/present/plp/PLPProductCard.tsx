'use client';

import type { Product } from '@/lib/types';
import type { ProductCardConfig } from '@/lib/wizsite-spec';
import { usePresentState } from '@/lib/present/usePresentState';
import { getSpec } from '@/lib/present/dataLayer';
import { priceView } from '@/lib/present/pricing';
import { slugify } from '@/lib/present/slugify';
import { createToast } from '@/lib/present/toasts';
import { Img, PLink, money } from '../ui';

export function PLPProductCard({ product, cardConfig, onQuickView }: { product: Product; cardConfig: ProductCardConfig; onQuickView?: (p: Product) => void }) {
  const { state, dispatch } = usePresentState();
  const slug = slugify(product.name);
  const pv = priceView(product, { isLoggedIn: state.auth.isLoggedIn, hidePrices: state.preferences.hidePrices, loginGated: getSpec().business.pricing.loginGated });

  return (
    <div className="group relative">
      {cardConfig.showWishlistIcon && (
        <button
          onClick={() => { dispatch({ type: 'ADD_TO_WISHLIST', productId: product.sku }); dispatch({ type: 'SHOW_TOAST', toast: createToast('Added to wishlist') }); }}
          className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-[var(--sf-ink)] shadow hover:scale-110" aria-label="Wishlist"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" /></svg>
        </button>
      )}
      <PLink href={`/product/${slug}`}><Img src={product.imageUrl} alt={product.name} ratio={cardConfig.imageAspectRatio === '1:1' ? 'aspect-square' : 'aspect-[4/5]'} /></PLink>
      {onQuickView && (
        <button onClick={() => onQuickView(product)} className="absolute inset-x-2 bottom-[28%] z-10 hidden bg-white/95 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--sf-ink)] shadow group-hover:block">Quick View</button>
      )}
      <div className="mt-3">
        {cardConfig.showSKU && <div className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--sf-soft)' }}>{product.sku}</div>}
        <PLink href={`/product/${slug}`}><h3 className="sf-display mt-0.5 text-[15px] font-semibold hover:opacity-70">{product.name}</h3></PLink>
        <div className="mt-1.5 flex items-baseline gap-2 text-[13px]">
          {pv.mode === 'show' ? (
            <>
              <span className="font-semibold" style={{ color: 'var(--sf-ink)' }}>{money(pv.price)}</span>
              {cardConfig.showMSRP && pv.msrp > pv.price && <span className="text-[11px] line-through" style={{ color: 'var(--sf-soft)' }}>{money(pv.msrp)}</span>}
            </>
          ) : pv.mode === 'locked' ? (
            <span className="text-[12px] font-semibold" style={{ color: 'var(--sf-brand)' }}>Login to see price</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
