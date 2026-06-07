'use client';

import { useState } from 'react';
import { useDesign } from '@/lib/DesignContext';
import { PALETTES, FONTS, DENSITY, resolveColors } from '@/lib/themes';
import type { Density, LogoStyle, CustomColors } from '@/lib/types';
import { BusinessConfig } from './BusinessConfig';
import { CatalogPanel } from './CatalogPanel';
import { ImagesPanel } from './ImagesPanel';
import { BrandManagement } from './BrandManagement';

type Tab = 'brand' | 'business' | 'catalog' | 'images';

export function LeftPanel() {
  const [tab, setTab] = useState<Tab>('brand');
  const tabs: { id: Tab; label: string; soon?: boolean }[] = [
    { id: 'brand', label: 'Brand' },
    { id: 'business', label: 'Business' },
    { id: 'catalog', label: 'Catalog' },
    { id: 'images', label: 'Images' },
  ];
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none border-b border-[var(--chrome-line)] bg-[var(--chrome-panel)] px-2 pt-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => !t.soon && setTab(t.id)}
            disabled={t.soon}
            title={t.soon ? 'Coming with the catalog / image pipeline' : undefined}
            className={`relative flex-1 rounded-t-md px-2 py-2 text-[11.5px] font-semibold transition-colors ${
              tab === t.id
                ? 'text-[var(--chrome-ink)]'
                : t.soon
                  ? 'cursor-not-allowed text-[var(--chrome-line)]'
                  : 'text-[var(--chrome-muted)] hover:text-[var(--chrome-ink)]'
            }`}
          >
            <span className="inline-flex items-center gap-1">
              {t.label}
              {t.soon && (
                <span className="rounded-full bg-[var(--chrome-bg)] px-1 py-0.5 text-[8px] font-bold uppercase leading-none tracking-wide text-[var(--chrome-muted)]">
                  Soon
                </span>
              )}
            </span>
            {tab === t.id && <span className="absolute inset-x-2 -bottom-px h-0.5 bg-[var(--chrome-ink)]" />}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1">
        {tab === 'brand' && <BrandPanel />}
        {tab === 'business' && <BusinessConfig />}
        {tab === 'catalog' && <CatalogPanel />}
        {tab === 'images' && <ImagesPanel />}
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[var(--chrome-line)] px-5 py-5">
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--chrome-muted)]">
        {title}
      </div>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-md bg-[var(--chrome-bg)] p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded px-2 py-1.5 text-[11px] font-medium transition-colors ${
            value === o.value ? 'bg-white text-[var(--chrome-ink)] shadow-sm' : 'text-[var(--chrome-muted)] hover:text-[var(--chrome-ink)]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function BrandPanel() {
  const { state, industries, setField, applyIndustry, setCustomColors, brands } = useDesign();
  const multiBrand = brands.length > 1;
  const [showCustom, setShowCustom] = useState(state.palette === 'custom');

  const current = resolveColors(state.palette, state.customColors);

  const updateCustom = (key: keyof CustomColors, val: string) => {
    setCustomColors({ ...current, [key]: val });
  };

  const onLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setField('logoUrl', String(reader.result));
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto wd-scroll">
      <BrandManagement />

      <Group title={multiBrand ? `Brand — styling “${state.brandName}”` : 'Brand'}>
        {!multiBrand && (
          <input
            value={state.brandName}
            onChange={(e) => setField('brandName', e.target.value)}
            placeholder="Brand name"
            className="w-full rounded-md border border-[var(--chrome-line)] bg-white px-3 py-2 text-[14px] outline-none focus:border-[var(--chrome-ink)]"
          />
        )}
        <div className={multiBrand ? '' : 'mt-3'}>
          <div className="mb-1.5 text-[11px] text-[var(--chrome-muted)]">Logo</div>
          {state.logoUrl ? (
            <div className="flex items-center gap-3 rounded-md border border-[var(--chrome-line)] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={state.logoUrl} alt="logo" className="h-9 w-auto max-w-[120px] object-contain" />
              <div className="ml-auto flex items-center gap-2">
                <label className="cursor-pointer text-[11px] font-medium text-[var(--chrome-ink)] hover:underline">
                  Replace
                  <input type="file" accept="image/*" className="hidden" onChange={onLogo} />
                </label>
                <button onClick={() => setField('logoUrl', '')} className="text-[11px] font-medium text-[var(--chrome-muted)] hover:text-red-600">
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-[var(--chrome-line)] py-4 text-center hover:border-[var(--chrome-muted)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-[var(--chrome-muted)]">
                <path d="M12 16V4M8 8l4-4 4 4M4 20h16" />
              </svg>
              <span className="text-[11px] font-medium text-[var(--chrome-muted)]">Upload logo (PNG/SVG)</span>
              <input type="file" accept="image/*" className="hidden" onChange={onLogo} />
            </label>
          )}
          <p className="mt-1.5 text-[10.5px] leading-snug text-[var(--chrome-muted)]">
            Used across header & footer. With no logo, the text style below is used.
          </p>
        </div>
      </Group>

      <Group title="Industry">
        <select
          value={state.industry}
          onChange={(e) => applyIndustry(e.target.value)}
          className="w-full rounded-md border border-[var(--chrome-line)] bg-white px-3 py-2 text-[14px] outline-none focus:border-[var(--chrome-ink)]"
        >
          {industries.map((p) => (
            <option key={p.industry} value={p.industry}>
              {p.industry}
            </option>
          ))}
        </select>
        <p className="mt-2 text-[11px] leading-snug text-[var(--chrome-muted)]">
          Applies the industry preset (hero / category / product variants + palette).
        </p>
      </Group>

      <Group title="Palette">
        <div className="grid grid-cols-3 gap-2">
          {PALETTES.map((p) => {
            const active = state.palette === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setShowCustom(false);
                  setField('palette', p.id);
                }}
                className={`group flex flex-col gap-1.5 rounded-md border p-2 text-left transition-colors ${
                  active ? 'border-[var(--chrome-ink)]' : 'border-[var(--chrome-line)] hover:border-[var(--chrome-muted)]'
                }`}
              >
                <div className="flex h-6 overflow-hidden rounded">
                  {[p.colors.bg, p.colors.brand, p.colors.accent, p.colors.ink].map((c, i) => (
                    <span key={i} className="flex-1" style={{ background: c }} />
                  ))}
                </div>
                <span className="text-[11px] font-medium leading-none">{p.name}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => {
            setShowCustom((v) => !v);
            if (state.palette !== 'custom') setCustomColors(current);
          }}
          className={`mt-2 w-full rounded-md border px-3 py-2 text-[12px] font-medium transition-colors ${
            state.palette === 'custom' ? 'border-[var(--chrome-ink)]' : 'border-[var(--chrome-line)] hover:border-[var(--chrome-muted)]'
          }`}
        >
          {showCustom ? 'Custom colors ▾' : 'Custom colors ▸'}
        </button>
        {showCustom && (
          <div className="mt-3 grid grid-cols-1 gap-2 rounded-md bg-[var(--chrome-bg)] p-3">
            {(
              [
                ['bg', 'Background'],
                ['surface', 'Surface'],
                ['ink', 'Ink / text'],
                ['brand', 'Brand'],
                ['accent', 'Accent'],
              ] as [keyof CustomColors, string][]
            ).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between gap-2 text-[12px]">
                <span className="text-[var(--chrome-muted)]">{label}</span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-[var(--chrome-muted)]">{current[key]}</span>
                  <input
                    type="color"
                    value={current[key]}
                    onChange={(e) => updateCustom(key, e.target.value)}
                    className="h-7 w-9 cursor-pointer rounded border border-[var(--chrome-line)] bg-white p-0.5"
                  />
                </span>
              </label>
            ))}
          </div>
        )}
      </Group>

      <Group title="Font Pairing">
        <div className="grid grid-cols-2 gap-2">
          {FONTS.map((f) => {
            const active = state.font === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setField('font', f.id)}
                className={`rounded-md border px-3 py-2.5 text-left transition-colors ${
                  active ? 'border-[var(--chrome-ink)]' : 'border-[var(--chrome-line)] hover:border-[var(--chrome-muted)]'
                }`}
              >
                <div className="text-[14px] leading-none" style={{ fontFamily: `"${f.display}", serif` }}>
                  {f.name}
                </div>
                <div className="mt-1 text-[10px] text-[var(--chrome-muted)]">
                  {f.display} · {f.body}
                </div>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Density">
        <Segmented<Density>
          value={state.density}
          onChange={(v) => setField('density', v)}
          options={(Object.keys(DENSITY) as Density[]).map((d) => ({ value: d, label: DENSITY[d].label }))}
        />
        {/* live mini-preview: bar spacing reflects the chosen density */}
        <div className="mt-2 flex flex-col rounded-md border border-[var(--chrome-line)] bg-white px-3" style={{ paddingTop: 8 * DENSITY[state.density].scale + 4, paddingBottom: 8 * DENSITY[state.density].scale + 4, gap: 5 * DENSITY[state.density].scale + 2 }}>
          <span className="h-2 w-1/2 rounded-sm bg-[var(--chrome-ink)]" />
          <span className="h-1.5 w-full rounded-sm bg-[var(--chrome-line)]" />
          <span className="h-1.5 w-5/6 rounded-sm bg-[var(--chrome-line)]" />
        </div>
        <p className="mt-1.5 text-[10.5px] text-[var(--chrome-muted)]">Controls vertical spacing inside every storefront section.</p>
      </Group>

      <Group title="Logo Style">
        <Segmented<LogoStyle>
          value={state.logoStyle}
          onChange={(v) => setField('logoStyle', v)}
          options={[
            { value: 'wordmark', label: 'Wordmark' },
            { value: 'monogram', label: 'Monogram' },
            { value: 'boxed', label: 'Boxed' },
          ]}
        />
      </Group>
    </div>
  );
}
