'use client';

import { useState } from 'react';
import { useDesign } from '@/lib/DesignContext';
import type { Product } from '@/lib/types';
import { money } from '@/lib/format';
import {
  parseCsv,
  productsFromRows,
  categoriesFromProducts,
  productsToCsv,
  catalogTemplateCsv,
  catalogIntelligence,
} from '@/lib/catalog';
import { downloadText } from '@/lib/download';

function Stat({ label, value, tone }: { label: string; value: string | number; tone?: 'warn' | 'ok' }) {
  return (
    <div className="rounded-md border border-[var(--chrome-line)] px-2.5 py-2">
      <div
        className="text-[15px] font-semibold"
        style={{ color: tone === 'warn' ? '#b45309' : tone === 'ok' ? '#047857' : 'var(--chrome-ink)' }}
      >
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wide text-[var(--chrome-muted)]">{label}</div>
    </div>
  );
}

export function CatalogPanel() {
  const { products, categories, images, setCatalog, resetCatalog, catalogCustom } = useDesign();
  const [openId, setOpenId] = useState<string | null>(null);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const stats = catalogIntelligence(products, categories);

  const update = (idx: number, patch: Partial<Product>) => {
    setCatalog(products.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };
  const remove = (idx: number) => setCatalog(products.filter((_, i) => i !== idx));
  const add = () => {
    const p: Product = { sku: '', name: 'New product', category: categories[0]?.id ?? 'uncategorized', description: '', imageUrl: '', msrp: 0, wholesalePrice: 0 };
    setCatalog([p, ...products]);
    setOpenId('idx-0');
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rows = parseCsv(String(reader.result));
      const next = productsFromRows(rows);
      if (next.length) {
        setCatalog(next, categoriesFromProducts(next));
        setImportMsg(`Imported ${next.length} products.`);
      } else {
        setImportMsg('No rows found — check the column headers.');
      }
      setTimeout(() => setImportMsg(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto wd-scroll px-5 py-5">
      {/* Intelligence */}
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--chrome-muted)]">Catalog Intelligence</div>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={
            stats.complexity === 'High'
              ? { background: '#fef2f2', color: '#b91c1c' }
              : stats.complexity === 'Medium'
                ? { background: '#fffbeb', color: '#b45309' }
                : { background: '#ecfdf5', color: '#047857' }
          }
        >
          {stats.complexity} complexity
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Products" value={stats.products} />
        <Stat label="Categories" value={stats.categories} />
        <Stat label="Avg margin" value={`${stats.avgMargin}%`} tone="ok" />
        <Stat label="Missing img" value={stats.missingImages} tone={stats.missingImages ? 'warn' : undefined} />
        <Stat label="Dupe SKUs" value={stats.duplicateSkus} tone={stats.duplicateSkus ? 'warn' : undefined} />
        <Stat label="No price" value={stats.withoutPrice} tone={stats.withoutPrice ? 'warn' : undefined} />
      </div>

      {/* Import / export */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-md bg-[var(--chrome-ink)] py-2 text-[12px] font-semibold text-white hover:opacity-90">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 16V4M8 8l4-4 4 4M4 20h16" /></svg>
          Import CSV
          <input type="file" accept=".csv,text/csv" className="hidden" onChange={onImport} />
        </label>
        <button
          onClick={() => downloadText('catalog.csv', productsToCsv(products), 'text/csv')}
          className="flex items-center justify-center gap-1.5 rounded-md border border-[var(--chrome-line)] py-2 text-[12px] font-medium hover:border-[var(--chrome-muted)]"
        >
          Export CSV
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px]">
        <button onClick={() => downloadText('catalog-template.csv', catalogTemplateCsv(), 'text/csv')} className="font-medium text-[var(--chrome-ink)] hover:underline">
          Download template
        </button>
        {catalogCustom && (
          <button onClick={resetCatalog} className="font-medium text-[var(--chrome-muted)] hover:text-red-600">
            Reset to demo catalog
          </button>
        )}
      </div>
      {importMsg && <div className="mt-2 rounded-md bg-[var(--chrome-bg)] px-2.5 py-1.5 text-[11px] text-[var(--chrome-ink)]">{importMsg}</div>}

      {/* Product list */}
      <div className="mt-4 mb-2 flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--chrome-muted)]">Products ({products.length})</div>
        <button onClick={add} className="text-[11px] font-semibold text-[var(--chrome-ink)] hover:underline">+ Add product</button>
      </div>

      <div className="space-y-1.5">
        {products.map((p, idx) => {
          const id = `idx-${idx}`;
          const open = openId === id;
          return (
            <div key={id} className="rounded-md border border-[var(--chrome-line)]">
              <button onClick={() => setOpenId(open ? null : id)} className="flex w-full items-center gap-2.5 px-2 py-2 text-left">
                <span className="grid h-9 w-9 flex-none place-items-center overflow-hidden rounded bg-[var(--chrome-bg)]">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-[var(--chrome-muted)]"><rect x="3" y="3" width="18" height="18" rx="1" /><path d="M21 15l-5-5L5 21" /></svg>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-semibold">{p.name || '(untitled)'}</span>
                  <span className="block truncate text-[10.5px] text-[var(--chrome-muted)]">{p.sku || 'no SKU'} · {money(p.wholesalePrice)}</span>
                </span>
                <span className="text-[var(--chrome-muted)]">{open ? '▾' : '▸'}</span>
              </button>
              {open && (
                <div className="space-y-2 border-t border-[var(--chrome-line)] px-2.5 py-2.5">
                  <Field label="Name" value={p.name} onChange={(v) => update(idx, { name: v })} />
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="SKU" value={p.sku} onChange={(v) => update(idx, { sku: v })} />
                    <Field label="Category" value={p.category} onChange={(v) => update(idx, { category: v })} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="MSRP" value={String(p.msrp)} onChange={(v) => update(idx, { msrp: Number(v) || 0 })} />
                    <Field label="Wholesale" value={String(p.wholesalePrice)} onChange={(v) => update(idx, { wholesalePrice: Number(v) || 0 })} />
                  </div>
                  <Field label="Image URL" value={p.imageUrl} onChange={(v) => update(idx, { imageUrl: v })} />
                  {images.length > 0 && (
                    <label className="flex items-center gap-2 text-[11px] text-[var(--chrome-muted)]">
                      From library
                      <select
                        value=""
                        onChange={(e) => e.target.value && update(idx, { imageUrl: e.target.value })}
                        className="min-w-0 flex-1 rounded border border-[var(--chrome-line)] bg-white px-1.5 py-1 text-[11px] outline-none"
                      >
                        <option value="">Choose an image…</option>
                        {images.map((im) => <option key={im.id} value={im.url}>{im.name}</option>)}
                      </select>
                    </label>
                  )}
                  <Field label="Description" value={p.description} onChange={(v) => update(idx, { description: v })} />
                  <button onClick={() => remove(idx)} className="text-[11px] font-medium text-[var(--chrome-muted)] hover:text-red-600">Delete product</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-0.5 block text-[10px] uppercase tracking-wide text-[var(--chrome-muted)]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-[var(--chrome-line)] bg-white px-2 py-1 text-[12px] outline-none focus:border-[var(--chrome-ink)]"
      />
    </label>
  );
}
