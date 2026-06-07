// Present Mode V2 — filtering, sorting, pagination (Steps 16–18).
// Defensive against our lean Product shape: unknown filter keys / missing fields
// pass through rather than excluding everything.

import type { Product } from '../types';

export type SortOption =
  | 'featured' | 'new_arrivals' | 'price_asc' | 'price_desc'
  | 'name_az' | 'name_za' | 'sku_asc' | 'sku_desc';

type ProductLike = Product & {
  attributes?: Record<string, string | string[]>;
  inventory?: number;
  materials?: string[];
};

function inAnyRange(value: number, ranges: string[]): boolean {
  return ranges.some((r) => {
    const [min, max] = r.split('-').map((n) => parseFloat(n));
    const lo = Number.isFinite(min) ? min : -Infinity;
    const hi = Number.isFinite(max) ? max : Infinity;
    return value >= lo && value <= hi;
  });
}

// Step 16 — AND every active filter group.
export function applyFilters(products: Product[], activeFilters: Record<string, string[]>): Product[] {
  const groups = Object.entries(activeFilters || {}).filter(([, v]) => Array.isArray(v) && v.length > 0);
  if (!groups.length) return products;

  return products.filter((p) => {
    const prod = p as ProductLike;
    return groups.every(([key, values]) => {
      switch (key) {
        case 'category':
          return values.includes(prod.category);
        case 'price':
        case 'price_range':
          return inAnyRange(prod.wholesalePrice, values);
        case 'availability': {
          const inStock = prod.inventory === undefined ? true : prod.inventory > 0;
          if (values.includes('in_stock') && values.includes('out_of_stock')) return true;
          if (values.includes('in_stock')) return inStock;
          if (values.includes('out_of_stock')) return !inStock;
          return true;
        }
        case 'material': {
          const mats = prod.materials ?? [];
          return mats.length ? values.some((v) => mats.includes(v)) : true;
        }
        default: {
          // attribute-style match if the product happens to have it; else pass.
          const attr = prod.attributes?.[key];
          if (attr === undefined) return true;
          const arr = Array.isArray(attr) ? attr : [attr];
          return values.some((v) => arr.includes(v));
        }
      }
    });
  });
}

// Step 17
export function applySort(products: Product[], sort: SortOption): Product[] {
  const out = [...products];
  switch (sort) {
    case 'price_asc': return out.sort((a, b) => a.wholesalePrice - b.wholesalePrice);
    case 'price_desc': return out.sort((a, b) => b.wholesalePrice - a.wholesalePrice);
    case 'name_az': return out.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_za': return out.sort((a, b) => b.name.localeCompare(a.name));
    case 'sku_asc': return out.sort((a, b) => a.sku.localeCompare(b.sku));
    case 'sku_desc': return out.sort((a, b) => b.sku.localeCompare(a.sku));
    case 'new_arrivals': return out.reverse();
    case 'featured':
    default:
      return out;
  }
}

// Step 18
export function applyPagination<T>(items: T[], page: number, perPage: number): T[] {
  const start = Math.max(0, (page - 1) * perPage);
  return items.slice(start, start + perPage);
}
