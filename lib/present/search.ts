// Present Mode V2 — product search (Step 19). Case-insensitive substring match
// across name, SKU and description.

import type { Product } from '../types';

export function searchProducts(query: string, products: Product[]): Product[] {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return products.filter((p) => {
    const hay = `${p.name} ${p.sku} ${p.description} ${p.category}`.toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}
