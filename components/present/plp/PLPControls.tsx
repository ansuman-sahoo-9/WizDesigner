'use client';

// Present Mode V2 — PLP controls (Steps 92–97, consolidated): filter bar +
// drawer, sort dropdown, pagination, collection banner, category description.

import { useState } from 'react';
import type { Category } from '@/lib/types';
import type { FilterDefinition, PLPConfig, SortOption } from '@/lib/wizsite-spec';
import { usePresentState } from '@/lib/present/usePresentState';
import { getPresentCatalog } from '@/lib/present/dataLayer';
import { slugify } from '@/lib/present/slugify';
import { Img } from '../ui';

const PRICE_RANGES = [['Under $100', '0-100'], ['$100–$300', '100-300'], ['$300–$1000', '300-1000'], ['$1000+', '1000-']];
const AVAIL = [['In stock', 'in_stock'], ['Out of stock', 'out_of_stock']];

function optionsFor(f: FilterDefinition): [string, string][] {
  if (f.type === 'category') return getPresentCatalog().categories.map((c) => [c.name, c.id]);
  if (f.type === 'price_range') return PRICE_RANGES as [string, string][];
  if (f.type === 'availability') return AVAIL as [string, string][];
  return [];
}

const SORT_LABELS: Record<SortOption, string> = {
  featured: 'Featured', new_arrivals: 'New Arrivals', price_asc: 'Price: Low to High', price_desc: 'Price: High to Low',
  name_az: 'Name: A–Z', name_za: 'Name: Z–A', sku_asc: 'SKU: Asc', sku_desc: 'SKU: Desc',
};

export function PLPFilterBar({ plp, categorySlug }: { plp: PLPConfig; categorySlug: string }) {
  const { state, dispatch } = usePresentState();
  const active = state.activeFilters[categorySlug] ?? {};
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const inline = plp.filters.filters.slice(0, plp.filters.maxInlinePills);

  const toggle = (f: FilterDefinition, val: string) => {
    const key = f.type === 'price_range' ? 'price' : f.type === 'availability' ? 'availability' : f.type === 'category' ? 'category' : f.id;
    const cur = active[key] ?? [];
    const next = cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val];
    dispatch({ type: 'SET_FILTER', categorySlug, filterKey: key, values: next });
  };

  const Pill = ({ f }: { f: FilterDefinition }) => {
    const key = f.type === 'price_range' ? 'price' : f.type === 'availability' ? 'availability' : f.type === 'category' ? 'category' : f.id;
    const count = (active[key] ?? []).length;
    return (
      <div className="relative">
        <button onClick={() => setOpen(open === f.id ? null : f.id)} className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px]" style={{ borderColor: 'var(--sf-line)' }}>
          {f.label}{count > 0 && <span className="rounded-full px-1.5 text-[10px] font-bold" style={{ background: 'var(--sf-accent)', color: '#111' }}>{count}</span>}
          <span className="text-[var(--sf-soft)]">▾</span>
        </button>
        {open === f.id && (
          <div className="absolute left-0 top-full z-20 mt-1 w-52 rounded-md p-2 shadow-xl ring-1 ring-black/10" style={{ background: 'var(--sf-surface)' }}>
            {optionsFor(f).map(([label, val]) => (
              <label key={val} className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-[12px] hover:bg-[var(--sf-faint)]">
                <input type="checkbox" checked={(active[key] ?? []).includes(val)} onChange={() => toggle(f, val)} />{label}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {inline.map((f) => <Pill key={f.id} f={f} />)}
      <button onClick={() => setDrawer(true)} className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px]" style={{ borderColor: 'var(--sf-line)' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 5h18M6 12h12M10 19h4" /></svg> All Filters
      </button>
      {drawer && (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <div className="absolute right-0 top-0 flex h-full w-80 flex-col p-5" style={{ background: 'var(--sf-surface)' }}>
            <div className="mb-4 flex items-center justify-between"><span className="sf-display text-lg font-semibold">Filters</span><button onClick={() => setDrawer(false)} className="text-[var(--sf-soft)]">✕</button></div>
            <div className="flex-1 space-y-4 overflow-y-auto">
              {plp.filters.filters.map((f) => (
                <div key={f.id}>
                  <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide" style={{ color: 'var(--sf-soft)' }}>{f.label}</div>
                  {optionsFor(f).map(([label, val]) => { const key = f.type === 'price_range' ? 'price' : f.type === 'availability' ? 'availability' : f.type === 'category' ? 'category' : f.id; return (
                    <label key={val} className="flex cursor-pointer items-center gap-2 py-1 text-[13px]"><input type="checkbox" checked={(active[key] ?? []).includes(val)} onChange={() => toggle(f, val)} />{label}</label>
                  ); })}
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-3">
              <button onClick={() => dispatch({ type: 'CLEAR_FILTERS', categorySlug })} className="flex-1 rounded-md border py-2 text-[12px]" style={{ borderColor: 'var(--sf-line)' }}>Clear All</button>
              <button onClick={() => setDrawer(false)} className="flex-1 py-2 text-[12px] font-semibold uppercase" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>Show Results</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PLPSortDropdown({ categorySlug, allowed, value }: { categorySlug: string; allowed: SortOption[]; value: SortOption }) {
  const { dispatch } = usePresentState();
  return (
    <select value={value} onChange={(e) => dispatch({ type: 'SET_SORT', categorySlug, sort: e.target.value })} className="rounded-md border px-3 py-1.5 text-[12px] outline-none" style={{ borderColor: 'var(--sf-line)', background: 'var(--sf-surface)' }}>
      {allowed.map((s) => <option key={s} value={s}>{SORT_LABELS[s]}</option>)}
    </select>
  );
}

export function PLPPagination({ total, perPage, page, onPage }: { total: number; perPage: number; page: number; onPage: (p: number) => void }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => Math.abs(n - page) <= 2 || n === 1 || n === pages);
  const Btn = ({ children, to, disabled }: { children: React.ReactNode; to: number; disabled?: boolean }) => (
    <button disabled={disabled} onClick={() => onPage(to)} className="grid h-8 min-w-8 place-items-center rounded border px-2 text-[12px] disabled:opacity-30" style={{ borderColor: 'var(--sf-line)' }}>{children}</button>
  );
  return (
    <div className="mt-10 flex items-center justify-center gap-1.5">
      <Btn to={1} disabled={page === 1}>«</Btn><Btn to={page - 1} disabled={page === 1}>‹</Btn>
      {nums.map((n) => <button key={n} onClick={() => onPage(n)} className="grid h-8 min-w-8 place-items-center rounded border px-2 text-[12px]" style={n === page ? { background: 'var(--sf-ink)', color: '#fff', borderColor: 'var(--sf-ink)' } : { borderColor: 'var(--sf-line)' }}>{n}</button>)}
      <Btn to={page + 1} disabled={page === pages}>›</Btn><Btn to={pages} disabled={page === pages}>»</Btn>
    </div>
  );
}

export function PLPCollectionBanner({ plp, category }: { plp: PLPConfig; category?: Category }) {
  if (!plp.collectionBanner.enabled || !category) return null;
  const products = getPresentCatalog().products.find((p) => p.category === category.id);
  return (
    <div className="relative mb-6 h-48 overflow-hidden">
      <Img src={products?.imageUrl ?? ''} alt={category.name} ratio="" className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 grid place-items-center" style={{ background: 'rgba(0,0,0,.4)' }}><span className="sf-display text-4xl font-semibold text-white">{category.name}</span></div>
    </div>
  );
}

export { slugify };
