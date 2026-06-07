// Present Mode V2 — data layer (Steps 9–14).
// Bridges the simulated storefront to the design-time data: it reads the live
// DesignState (our key is `wizdesigner.state`), derives the WizSiteSpec V2 for
// page/config reads, and resolves the catalog (user-edited → fallback).

import type { DesignState, Product, Category } from '../types';
import { loadState, loadCatalog } from '../storage';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES } from '../industries';
import { migrateV1ToV2, defaultWizSiteSpec, type WizSiteSpecV2 } from '../wizsite-spec';
import { slugify } from './slugify';

export type PresentCatalog = { products: Product[]; categories: Category[] };

// Step 9 — the raw design-time state (null when nothing is stored yet).
export function loadDesignState(): DesignState | null {
  return loadState();
}

// The canonical V2 spec drives Present pages (nav, homepage, pdp config, etc.).
export function getSpec(): WizSiteSpecV2 {
  const s = loadState();
  return s ? migrateV1ToV2(s) : defaultWizSiteSpec();
}

export function getIndustryDefaultCatalog(_industry?: string): PresentCatalog {
  void _industry; // per-industry catalogs are a future enhancement
  return { products: DEFAULT_PRODUCTS, categories: DEFAULT_CATEGORIES };
}

// Step 10 — user-edited catalog wins; otherwise industry/fallback default.
export function getPresentCatalog(): PresentCatalog {
  const c = loadCatalog();
  if (c && c.products.length > 0) return { products: c.products, categories: c.categories };
  return getIndustryDefaultCatalog(loadState()?.industry);
}

// Step 11
export function getProductBySlug(slug: string): Product | undefined {
  return getPresentCatalog().products.find((p) => slugify(p.name) === slug || p.sku === slug);
}

// Step 12
export function getCategoryBySlug(slug: string): Category | undefined {
  return getPresentCatalog().categories.find((c) => c.id === slug || slugify(c.name) === slug);
}

// Step 13
export function getProductsByCategory(categorySlug: string): Product[] {
  const cat = getCategoryBySlug(categorySlug);
  const id = cat?.id ?? categorySlug;
  return getPresentCatalog().products.filter((p) => p.category === id);
}

// Step 14
export function getAllProducts(): Product[] {
  return getPresentCatalog().products;
}
