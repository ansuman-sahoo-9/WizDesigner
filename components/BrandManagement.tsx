'use client';

import { useState } from 'react';
import { useDesign } from '@/lib/DesignContext';
import { PALETTES, FONTS, resolveColors } from '@/lib/themes';
import type { LogoStyle, Variant, BrandSwitcherStyle } from '@/lib/types';

const LOGO_STYLES: { v: LogoStyle; label: string }[] = [
  { v: 'wordmark', label: 'Wordmark' },
  { v: 'monogram', label: 'Monogram' },
  { v: 'boxed', label: 'Boxed' },
  { v: 'icon_wordmark', label: 'Icon + Wordmark' },
  { v: 'stacked', label: 'Stacked' },
];
const HERO_STYLES: { v: Variant; label: string }[] = [
  { v: 'A', label: 'Editorial' },
  { v: 'B', label: 'Split' },
  { v: 'C', label: 'Cinematic' },
  { v: 'D', label: 'Image grid' },
];
const SWITCHER_STYLES: { v: BrandSwitcherStyle; label: string }[] = [
  { v: 'pill', label: 'Pills' },
  { v: 'underline', label: 'Tabs' },
  { v: 'dropdown', label: 'Dropdown' },
  { v: 'minimal', label: 'Minimal' },
];
const COUNTS = [1, 2, 3, 4, 5, 6];

function Select<T extends string>({ value, options, onChange }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full rounded-md border border-[var(--chrome-line)] bg-white px-2 py-1.5 text-[12px] outline-none focus:border-[var(--chrome-ink)]"
    >
      {options.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
    </select>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--chrome-muted)]">{children}</div>;
}

export function BrandManagement() {
  const { state, brands, activeBrandId, setBrandCount, setActiveBrand, setBrandName, setBrandStyle, reorderBrand, removeBrand, setField } = useDesign();
  const multi = brands.length > 1;
  const [expanded, setExpanded] = useState<string | null>(activeBrandId);

  const onLogo = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setBrandStyle(id, { logoUrl: String(r.result) });
    r.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="border-b border-[var(--chrome-line)] px-5 py-4">
      <div className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--chrome-muted)]">Brand Management</div>

      {/* Count selector */}
      <FieldLabel>How many brands?</FieldLabel>
      <div className="flex gap-1">
        {COUNTS.map((n) => {
          const active = brands.length === n;
          return (
            <button
              key={n}
              onClick={() => {
                if (n < brands.length && !window.confirm(`Reduce to ${n} brand${n > 1 ? 's' : ''}? This removes the extra brand configuration(s).`)) return;
                setBrandCount(n);
              }}
              className={`h-8 flex-1 rounded-md border text-[12px] font-semibold transition-colors ${
                active ? 'border-[var(--chrome-ink)] bg-[var(--chrome-ink)] text-white' : 'border-[var(--chrome-line)] text-[var(--chrome-muted)] hover:border-[var(--chrome-muted)]'
              }`}
            >
              {n === 6 ? '6+' : n}
            </button>
          );
        })}
      </div>

      {!multi && (
        <p className="mt-2 text-[10.5px] leading-snug text-[var(--chrome-muted)]">
          Single brand. Pick 2+ for a multi-brand storefront (Sagebrook / Elevarre style) with a brand switcher.
        </p>
      )}

      {multi && (
        <>
          {/* Brand cards */}
          <div className="mt-3 space-y-1.5">
            {brands.map((b, i) => {
              const active = b.id === activeBrandId;
              const open = expanded === b.id;
              const c = resolveColors(b.palette, b.customColors);
              return (
                <div key={b.id} className={`rounded-md border ${active ? 'border-[var(--chrome-ink)]' : 'border-[var(--chrome-line)]'}`}>
                  {/* header */}
                  <div className="flex items-center gap-1.5 px-2 py-1.5">
                    <button
                      onClick={() => setActiveBrand(b.id)}
                      title={active ? 'Active brand' : 'Set as active'}
                      className="grid h-4 w-4 flex-none place-items-center rounded-full border"
                      style={{ borderColor: active ? 'var(--chrome-ink)' : 'var(--chrome-line)' }}
                    >
                      {active && <span className="h-2 w-2 rounded-full bg-[var(--chrome-ink)]" />}
                    </button>
                    <button onClick={() => setExpanded(open ? null : b.id)} className="flex min-w-0 flex-1 items-center gap-1.5 text-left">
                      <span className="truncate text-[12.5px] font-semibold">{b.name || `Brand ${i + 1}`}</span>
                      {i === 0 && <span className="flex-none rounded bg-[var(--chrome-bg)] px-1 text-[8px] font-bold uppercase tracking-wide text-[var(--chrome-muted)]">Primary</span>}
                      <span className="ml-auto flex h-3.5 w-10 flex-none overflow-hidden rounded">
                        {[c.bg, c.brand, c.accent, c.ink].map((col, k) => <span key={k} className="flex-1" style={{ background: col }} />)}
                      </span>
                    </button>
                    <div className="flex flex-none items-center">
                      <button onClick={() => reorderBrand(b.id, 'up')} disabled={i === 0} className="grid h-5 w-4 place-items-center text-[var(--chrome-muted)] disabled:opacity-25 hover:text-[var(--chrome-ink)]">▲</button>
                      <button onClick={() => reorderBrand(b.id, 'down')} disabled={i === brands.length - 1} className="grid h-5 w-4 place-items-center text-[var(--chrome-muted)] disabled:opacity-25 hover:text-[var(--chrome-ink)]">▼</button>
                      {i !== 0 && (
                        <button
                          onClick={() => window.confirm(`Remove “${b.name || `Brand ${i + 1}`}”?`) && removeBrand(b.id)}
                          className="grid h-5 w-5 place-items-center text-[var(--chrome-muted)] hover:text-red-600"
                          title="Remove brand"
                        >
                          ✕
                        </button>
                      )}
                      <button onClick={() => setExpanded(open ? null : b.id)} className="grid h-5 w-4 place-items-center text-[var(--chrome-muted)]">{open ? '▾' : '▸'}</button>
                    </div>
                  </div>

                  {/* body */}
                  {open && (
                    <div className="space-y-2.5 border-t border-[var(--chrome-line)] px-2.5 py-2.5">
                      <div>
                        <FieldLabel>Brand name</FieldLabel>
                        <input
                          value={b.name}
                          maxLength={50}
                          onChange={(e) => setBrandName(b.id, e.target.value)}
                          placeholder={`Brand ${i + 1}`}
                          className="w-full rounded-md border border-[var(--chrome-line)] bg-white px-2.5 py-1.5 text-[13px] outline-none focus:border-[var(--chrome-ink)]"
                        />
                        {b.name.length >= 40 && <div className="mt-0.5 text-right text-[10px] text-[var(--chrome-muted)]">{b.name.length}/50</div>}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><FieldLabel>Logo style</FieldLabel><Select value={b.logoStyle} options={LOGO_STYLES} onChange={(v) => setBrandStyle(b.id, { logoStyle: v })} /></div>
                        <div><FieldLabel>Hero style</FieldLabel><Select value={b.heroVariant} options={HERO_STYLES} onChange={(v) => setBrandStyle(b.id, { heroVariant: v })} /></div>
                      </div>
                      <div>
                        <FieldLabel>Palette</FieldLabel>
                        <div className="grid grid-cols-6 gap-1">
                          {PALETTES.map((p) => {
                            const on = b.palette === p.id;
                            return (
                              <button
                                key={p.id}
                                onClick={() => setBrandStyle(b.id, { palette: p.id })}
                                title={p.name}
                                className={`flex h-6 overflow-hidden rounded ${on ? 'ring-2 ring-[var(--chrome-ink)] ring-offset-1' : ''}`}
                              >
                                {[p.colors.bg, p.colors.brand, p.colors.accent].map((col, k) => <span key={k} className="flex-1" style={{ background: col }} />)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div><FieldLabel>Font pairing</FieldLabel><Select value={b.font} options={FONTS.map((f) => ({ v: f.id, label: f.name }))} onChange={(v) => setBrandStyle(b.id, { font: v })} /></div>
                      <div className="flex items-center gap-2">
                        {b.logoUrl ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={b.logoUrl} alt="" className="h-6 w-auto max-w-[90px] object-contain" />
                            <button onClick={() => setBrandStyle(b.id, { logoUrl: '' })} className="text-[10px] font-medium text-[var(--chrome-muted)] hover:text-red-600">Remove logo</button>
                          </>
                        ) : (
                          <label className="cursor-pointer text-[11px] font-medium text-[var(--chrome-ink)] hover:underline">
                            Upload logo
                            <input type="file" accept="image/*" className="hidden" onChange={onLogo(b.id)} />
                          </label>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Brand switcher style */}
          <div className="mt-3">
            <FieldLabel>Brand switcher style</FieldLabel>
            <div className="flex rounded-md bg-[var(--chrome-bg)] p-0.5">
              {SWITCHER_STYLES.map((s) => (
                <button
                  key={s.v}
                  onClick={() => setField('brandSwitcherStyle', s.v)}
                  className={`flex-1 rounded px-1 py-1 text-[11px] font-medium transition-colors ${
                    (state.brandSwitcherStyle ?? 'pill') === s.v ? 'bg-white text-[var(--chrome-ink)] shadow-sm' : 'text-[var(--chrome-muted)]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Shared infra */}
          <div className="mt-3 rounded-md bg-[var(--chrome-bg)] px-3 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--chrome-muted)]">Shared across all brands</div>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[var(--chrome-muted)]">
              {['Catalog', 'Auth', 'Cart', 'Checkout'].map((x) => (
                <span key={x} className="flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="11" width="16" height="9" rx="1" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                  {x}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
