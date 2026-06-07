// Present Mode V2 — price visibility resolver (shared by cards, PDP, cart).

import type { Product } from '../types';

export type PriceView =
  | { mode: 'hidden' }
  | { mode: 'locked' }
  | { mode: 'show'; price: number; msrp: number };

export function priceView(
  product: Product,
  opts: { isLoggedIn: boolean; hidePrices: boolean; loginGated: boolean },
): PriceView {
  if (opts.hidePrices) return { mode: 'hidden' };
  if (opts.loginGated && !opts.isLoggedIn) return { mode: 'locked' };
  return { mode: 'show', price: product.wholesalePrice, msrp: product.msrp };
}
