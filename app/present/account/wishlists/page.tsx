'use client';

import { usePresentState } from '@/lib/present/usePresentState';
import { getAllProducts } from '@/lib/present/dataLayer';
import { slugify } from '@/lib/present/slugify';
import { createToast } from '@/lib/present/toasts';
import { Img, PLink, money } from '@/components/present/ui';

export default function WishlistsPage() {
  const { state, dispatch } = usePresentState();
  const products = getAllProducts();
  const lists = state.wishlists.length ? state.wishlists : [{ name: 'My Wishlist', productIds: [] }];

  return (
    <div>
      {lists.map((w) => {
        const items = w.productIds.map((id) => products.find((p) => p.sku === id)).filter(Boolean) as typeof products;
        return (
          <div key={w.name} className="mb-8">
            <h2 className="sf-display text-lg font-semibold">{w.name} <span className="text-[13px] font-normal" style={{ color: 'var(--sf-soft)' }}>({items.length})</span></h2>
            {!items.length ? (
              <p className="mt-2 rounded-md border border-dashed p-6 text-center text-[13px]" style={{ borderColor: 'var(--sf-line)', color: 'var(--sf-soft)' }}>No saved items yet. Tap the heart on any product to save it here.</p>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-5 md:grid-cols-4">
                {items.map((p) => (
                  <div key={p.sku} className="relative">
                    <button onClick={() => { dispatch({ type: 'REMOVE_FROM_WISHLIST', productId: p.sku }); dispatch({ type: 'SHOW_TOAST', toast: createToast('Removed from wishlist', 'info') }); }} className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/90 shadow">✕</button>
                    <PLink href={`/product/${slugify(p.name)}`}><Img src={p.imageUrl} alt={p.name} /></PLink>
                    <div className="mt-2 text-[13px] font-medium">{p.name}</div>
                    <div className="text-[12px]" style={{ color: 'var(--sf-brand)' }}>{money(p.wholesalePrice)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
