// WizDesigner — turn DesignState into the CSS custom properties that theme the
// storefront preview. Sections read these via `var(--sf-*)` so palette / font /
// density changes re-render live with zero per-section wiring.

import type { CSSProperties } from 'react';
import type { DesignState } from './types';
import { resolveColors, fontById, DENSITY } from './themes';

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h || '000000', 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgba(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function storefrontVars(state: DesignState): CSSProperties {
  const c = resolveColors(state.palette, state.customColors);
  const f = fontById(state.font);
  const d = DENSITY[state.density];

  return {
    '--sf-bg': c.bg,
    '--sf-surface': c.surface,
    '--sf-ink': c.ink,
    '--sf-brand': c.brand,
    '--sf-accent': c.accent,
    '--sf-muted': rgba(c.ink, 0.6),
    '--sf-soft': rgba(c.ink, 0.42),
    '--sf-line': rgba(c.ink, 0.14),
    '--sf-faint': rgba(c.ink, 0.05),
    '--sf-on-brand': '#ffffff',
    '--sf-display': `"${f.display}", Georgia, serif`,
    '--sf-body': `"${f.body}", system-ui, sans-serif`,
    '--sf-pad': d.pad,
    '--sf-gap': d.gap,
  } as CSSProperties;
}
