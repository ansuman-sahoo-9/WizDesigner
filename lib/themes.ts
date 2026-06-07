// WizDesigner — palette + font presets and density tokens.
// These are the FALLBACK design system. When the Theme Tokens / Brands sheet
// tabs are available they can override, but these always work offline.

import type { Palette, FontPreset, Density } from './types';

export const PALETTES: Palette[] = [
  {
    id: 'heritage',
    name: 'Heritage',
    blurb: 'cream / brown / gold',
    colors: { bg: '#F7F2E9', surface: '#FFFFFF', ink: '#1A1410', brand: '#6B4423', accent: '#C9A45A' },
  },
  {
    id: 'industrial',
    name: 'Industrial',
    blurb: 'graphite / ember',
    dark: true,
    colors: { bg: '#0F1115', surface: '#181B22', ink: '#F4F4F6', brand: '#FF5F1F', accent: '#E8B14A' },
  },
  {
    id: 'modern',
    name: 'Modern',
    blurb: 'white / navy / orange',
    colors: { bg: '#FAFAFA', surface: '#FFFFFF', ink: '#0A0A0F', brand: '#0F2444', accent: '#FF5F1F' },
  },
  {
    id: 'botanical',
    name: 'Botanical',
    blurb: 'linen / forest / sage',
    colors: { bg: '#F4F0E6', surface: '#FFFFFF', ink: '#1A1410', brand: '#2E5240', accent: '#4A6B4A' },
  },
  {
    id: 'luxe',
    name: 'Luxe',
    blurb: 'midnight / champagne',
    dark: true,
    colors: { bg: '#0E0B1F', surface: '#1A1530', ink: '#F4F0E6', brand: '#C9B47C', accent: '#E8C988' },
  },
  {
    id: 'editorial',
    name: 'Editorial',
    blurb: 'paper / ink / citron',
    colors: { bg: '#FAF7F0', surface: '#FFFFFF', ink: '#181B22', brand: '#0E0B1F', accent: '#FFE251' },
  },
];

export const FONTS: FontPreset[] = [
  { id: 'heritage-serif', name: 'Heritage Serif', display: 'Fraunces', body: 'Inter' },
  { id: 'modern-sans', name: 'Modern Sans', display: 'Space Grotesk', body: 'Inter' },
  { id: 'editorial-italic', name: 'Editorial Italic', display: 'Instrument Serif', body: 'Inter' },
  { id: 'luxe-display', name: 'Luxe Display', display: 'DM Serif Display', body: 'Manrope' },
  { id: 'geometric', name: 'Geometric', display: 'Bricolage Grotesque', body: 'Manrope' },
  { id: 'tech-mono', name: 'Tech / Mono', display: 'Space Grotesk', body: 'JetBrains Mono' },
];

// All Google Font families we need loaded (used by layout.tsx).
export const GOOGLE_FONT_FAMILIES = [
  'Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400',
  'Inter:wght@400;500;600;700',
  'Space+Grotesk:wght@400;500;700',
  'Instrument+Serif:ital@0;1',
  'DM+Serif+Display:ital@0;1',
  'Manrope:wght@400;500;600;700',
  'Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800',
  'JetBrains+Mono:wght@400;500;700',
  'Playfair+Display:wght@400;600;700',
  'Crimson+Pro:wght@400;600',
];

// Density scales the vertical rhythm of every storefront section.
export const DENSITY: Record<Density, { label: string; scale: number; pad: string; gap: string }> = {
  tight: { label: 'Tight', scale: 0.7, pad: '2.5rem', gap: '1rem' },
  comfortable: { label: 'Comfortable', scale: 1, pad: '4.5rem', gap: '1.75rem' },
  spacious: { label: 'Spacious', scale: 1.45, pad: '7rem', gap: '2.75rem' },
};

export function paletteById(id: string): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}

export function fontById(id: string): FontPreset {
  return FONTS.find((f) => f.id === id) ?? FONTS[0];
}

// Resolve the active color set: a named palette, or the user's custom colors.
export function resolveColors(palette: string, custom?: import('./types').CustomColors) {
  if (palette === 'custom' && custom) return custom;
  return paletteById(palette).colors;
}

export function isDarkPalette(palette: string): boolean {
  if (palette === 'custom') return false;
  return !!paletteById(palette).dark;
}
