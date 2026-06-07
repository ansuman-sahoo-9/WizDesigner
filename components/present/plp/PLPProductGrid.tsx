'use client';

import type { Product } from '@/lib/types';
import type { ProductCardConfig } from '@/lib/wizsite-spec';
import { PLPProductCard } from './PLPProductCard';

const COLS: Record<number, string> = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' };

export function PLPProductGrid({ products, cardConfig, columns = 4, onQuickView }: { products: Product[]; cardConfig: ProductCardConfig; columns?: number; onQuickView?: (p: Product) => void }) {
  if (!products.length) {
    return <div className="grid place-items-center py-20 text-[14px]" style={{ color: 'var(--sf-soft)' }}>No products found.</div>;
  }
  return (
    <div className={`grid grid-cols-2 gap-x-5 gap-y-8 ${COLS[columns] ?? COLS[4]}`}>
      {products.map((p) => <PLPProductCard key={p.sku} product={p} cardConfig={cardConfig} onQuickView={onQuickView} />)}
    </div>
  );
}
