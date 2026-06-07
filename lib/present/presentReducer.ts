// Present Mode V2 — reducer (Steps 5–6).

import type { PersonaId } from '../types';
import type { PresentState, CartItem, Toast } from './presentState';
import { generateId } from './slugify';

export type PresentAction =
  | { type: 'SET_AUTH'; isLoggedIn: boolean; persona: PersonaId; userName?: string; companyName?: string }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TO_CART'; item: Omit<CartItem, 'id'>; }
  | { type: 'REMOVE_FROM_CART'; id: string }
  | { type: 'UPDATE_QTY'; id: string; qty: number }
  | { type: 'ADD_CART_NOTE'; itemId: string; note: string }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; productId: string; wishlist?: string }
  | { type: 'REMOVE_FROM_WISHLIST'; productId: string; wishlist?: string }
  | { type: 'SET_FILTER'; categorySlug: string; filterKey: string; values: string[] }
  | { type: 'CLEAR_FILTERS'; categorySlug: string }
  | { type: 'SET_SORT'; categorySlug: string; sort: string }
  | { type: 'SET_SEARCH'; query: string; results?: string[] }
  | { type: 'SET_PREFERENCES'; patch: Partial<PresentState['preferences']> }
  | { type: 'SET_ACTIVE_BRAND'; id: string }
  | { type: 'PLACE_ORDER' }
  | { type: 'SHOW_TOAST'; toast: Omit<Toast, 'id'> }
  | { type: 'DISMISS_TOAST'; id: string };

const sameLine = (a: CartItem, productId: string, variants: Record<string, string>) =>
  a.productId === productId && JSON.stringify(a.selectedVariants) === JSON.stringify(variants);

export function presentReducer(state: PresentState, action: PresentAction): PresentState {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        auth: {
          isLoggedIn: action.isLoggedIn,
          persona: action.persona,
          userName: action.userName ?? state.auth.userName,
          companyName: action.companyName ?? state.auth.companyName,
        },
      };

    case 'LOGOUT':
      return { ...state, auth: { isLoggedIn: false, persona: 'guest', userName: '', companyName: '' } };

    case 'ADD_TO_CART': {
      const existing = state.cart.items.find((i) => sameLine(i, action.item.productId, action.item.selectedVariants));
      const items = existing
        ? state.cart.items.map((i) => (i.id === existing.id ? { ...i, qty: i.qty + action.item.qty } : i))
        : [...state.cart.items, { ...action.item, id: generateId() }];
      return { ...state, cart: { ...state.cart, items } };
    }

    case 'REMOVE_FROM_CART': {
      const notes = { ...state.cart.notes };
      delete notes[action.id];
      return { ...state, cart: { items: state.cart.items.filter((i) => i.id !== action.id), notes } };
    }

    case 'UPDATE_QTY':
      return {
        ...state,
        cart: { ...state.cart, items: state.cart.items.map((i) => (i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i)) },
      };

    case 'ADD_CART_NOTE':
      return { ...state, cart: { ...state.cart, notes: { ...state.cart.notes, [action.itemId]: action.note } } };

    case 'CLEAR_CART':
      return { ...state, cart: { items: [], notes: {} } };

    case 'ADD_TO_WISHLIST': {
      const name = action.wishlist ?? state.wishlists[0]?.name ?? 'My Wishlist';
      const wishlists = state.wishlists.length ? state.wishlists : [{ name, productIds: [] }];
      return {
        ...state,
        wishlists: wishlists.map((w) =>
          w.name === name && !w.productIds.includes(action.productId)
            ? { ...w, productIds: [...w.productIds, action.productId] }
            : w,
        ),
      };
    }

    case 'REMOVE_FROM_WISHLIST': {
      const name = action.wishlist ?? state.wishlists[0]?.name;
      return {
        ...state,
        wishlists: state.wishlists.map((w) =>
          w.name === name ? { ...w, productIds: w.productIds.filter((p) => p !== action.productId) } : w,
        ),
      };
    }

    case 'SET_FILTER':
      return {
        ...state,
        activeFilters: {
          ...state.activeFilters,
          [action.categorySlug]: { ...(state.activeFilters[action.categorySlug] ?? {}), [action.filterKey]: action.values },
        },
      };

    case 'CLEAR_FILTERS':
      return { ...state, activeFilters: { ...state.activeFilters, [action.categorySlug]: {} } };

    case 'SET_SORT':
      return { ...state, activeSort: { ...state.activeSort, [action.categorySlug]: action.sort } };

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query, searchResults: action.results ?? state.searchResults };

    case 'SET_PREFERENCES':
      return { ...state, preferences: { ...state.preferences, ...action.patch } };

    case 'SET_ACTIVE_BRAND':
      return { ...state, activeBrandId: action.id };

    case 'PLACE_ORDER':
      return { ...state, cart: { items: [], notes: {} } };

    case 'SHOW_TOAST':
      return { ...state, toasts: [...state.toasts, { ...action.toast, id: generateId() }] };

    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };

    default:
      return state;
  }
}
