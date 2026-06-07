// WizDesigner — multi-brand helpers.
// The active brand's identity is mirrored in the top-level DesignState fields
// (so the existing render pipeline stays unchanged); other brands live in
// `state.brands`. resolveBrands() overlays the active entry from the live
// top-level fields, so callers always see a fresh, correct list.

import type { DesignState, BrandEntry, Variant } from './types';
import { PALETTES } from './themes';

const HERO_ROTATION: Variant[] = ['B', 'C', 'A', 'D'];

export function brandFromState(state: DesignState): BrandEntry {
  return {
    id: state.activeBrandId ?? 'brand_1',
    name: state.brandName,
    palette: state.palette,
    customColors: state.customColors,
    font: state.font,
    logoStyle: state.logoStyle,
    logoUrl: state.logoUrl,
    heroVariant: state.variants?.hero ?? 'B',
  };
}

export function resolveBrands(state: DesignState): BrandEntry[] {
  const base = state.brands && state.brands.length ? state.brands : [brandFromState(state)];
  const activeId = state.activeBrandId ?? base[0].id;
  return base.map((b) => (b.id === activeId ? { ...brandFromState(state), id: b.id } : { ...b, heroVariant: b.heroVariant ?? 'B' }));
}

export function activeBrandId(state: DesignState): string {
  return state.activeBrandId ?? resolveBrands(state)[0].id;
}

// Load a target brand's identity into the top-level fields (incl. its hero
// variant), committing the currently-active brand back into the list first.
export function withActiveBrand(state: DesignState, id: string): DesignState {
  const brands = resolveBrands(state);
  const target = brands.find((b) => b.id === id) ?? brands[0];
  return {
    ...state,
    brands,
    activeBrandId: target.id,
    brandName: target.name,
    palette: target.palette,
    customColors: target.customColors,
    font: target.font,
    logoStyle: target.logoStyle,
    logoUrl: target.logoUrl,
    variants: { ...state.variants, hero: target.heroVariant ?? state.variants?.hero ?? 'B' },
  };
}

export function resizeBrands(state: DesignState, count: number, newId: () => string): DesignState {
  const n = Math.max(1, Math.min(8, Math.round(count)));
  const current = resolveBrands(state);
  const primary = current[0];
  let brands = current.slice(0, n);
  for (let i = current.length; i < n; i++) {
    const palette = PALETTES[i % PALETTES.length]?.id ?? primary.palette;
    brands = [
      ...brands,
      { id: newId(), name: `Brand ${i + 1}`, palette, font: primary.font, logoStyle: primary.logoStyle, logoUrl: '', heroVariant: HERO_ROTATION[i % HERO_ROTATION.length] },
    ];
  }
  const wantActive = brands.some((b) => b.id === state.activeBrandId) ? state.activeBrandId! : brands[0].id;
  return withActiveBrand({ ...state, brands }, wantActive);
}

export function setBrandNameIn(state: DesignState, id: string, name: string): DesignState {
  return updateBrandIn(state, id, { name });
}

// Patch any brand. If it's the active one, mirror the change to the top-level
// fields (+ hero variant) so the live preview updates immediately.
export function updateBrandIn(state: DesignState, id: string, patch: Partial<BrandEntry>): DesignState {
  const brands = resolveBrands(state).map((b) => (b.id === id ? { ...b, ...patch } : b));
  if (id !== activeBrandId(state)) return { ...state, brands };
  const top: Partial<DesignState> = {};
  if (patch.name !== undefined) top.brandName = patch.name;
  if (patch.palette !== undefined) top.palette = patch.palette;
  if (patch.customColors !== undefined) top.customColors = patch.customColors;
  if (patch.font !== undefined) top.font = patch.font;
  if (patch.logoStyle !== undefined) top.logoStyle = patch.logoStyle;
  if (patch.logoUrl !== undefined) top.logoUrl = patch.logoUrl;
  const variants = patch.heroVariant !== undefined ? { ...state.variants, hero: patch.heroVariant } : state.variants;
  return { ...state, brands, ...top, variants };
}

export function reorderBrand(state: DesignState, id: string, dir: 'up' | 'down'): DesignState {
  const brands = resolveBrands(state);
  const i = brands.findIndex((b) => b.id === id);
  const j = dir === 'up' ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= brands.length) return state;
  const next = [...brands];
  [next[i], next[j]] = [next[j], next[i]];
  return { ...state, brands: next };
}

export function removeBrandFrom(state: DesignState, id: string): DesignState {
  const brands = resolveBrands(state).filter((b) => b.id !== id);
  if (!brands.length) return state;
  const wantActive = brands.some((b) => b.id === state.activeBrandId) ? state.activeBrandId! : brands[0].id;
  return withActiveBrand({ ...state, brands }, wantActive);
}

export function brandCount(state: DesignState): number {
  return resolveBrands(state).length;
}
