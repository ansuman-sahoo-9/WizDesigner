// Present Mode V2 — runtime shopping state (Steps 1–4).
// This is SESSION state for the simulated buyer experience, separate from the
// design-time DesignState. Persisted to sessionStorage (per tab session).

import type { PersonaId } from '../types';

// Step 2 — a line in the cart.
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  imageUrl: string;
  selectedVariants: Record<string, string>;
  qty: number;
  unitPrice: number;
  msrp: number;
  slug: string;
}

// Step 3 — transient notification.
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration: number;
}

export interface Wishlist {
  name: string;
  productIds: string[];
}

// Step 1 — the full present runtime state.
export interface PresentState {
  auth: {
    isLoggedIn: boolean;
    persona: PersonaId;
    userName: string;
    companyName: string;
  };
  cart: {
    items: CartItem[];
    notes: Record<string, string>; // itemId -> note
  };
  wishlists: Wishlist[];
  searchQuery: string;
  searchResults: string[]; // product ids
  activeFilters: Record<string, Record<string, string[]>>; // categorySlug -> filterKey -> values
  activeSort: Record<string, string>; // categorySlug -> sort option
  preferences: {
    hidePrices: boolean;
    showPriceInPdf: boolean;
  };
  activeBrandId: string;
  toasts: Toast[];
}

// Step 4 — initial empty state.
export const defaultPresentState: PresentState = {
  auth: { isLoggedIn: false, persona: 'guest', userName: '', companyName: '' },
  cart: { items: [], notes: {} },
  wishlists: [{ name: 'My Wishlist', productIds: [] }],
  searchQuery: '',
  searchResults: [],
  activeFilters: {},
  activeSort: {},
  preferences: { hidePrices: false, showPriceInPdf: false },
  activeBrandId: '',
  toasts: [],
};
