// WizDesigner — catalog helpers: CSV import/export, category derivation, and
// the "catalog intelligence" summary shown in the Catalog tab.

import type { Product, Category } from './types';

// --- CSV parsing (quoted fields, embedded commas/newlines) -----------------

export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;
  const s = text.replace(/\r\n?/g, '\n');

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }

  const nonEmpty = rows.filter((r) => r.some((c) => c.trim() !== ''));
  if (nonEmpty.length < 1) return [];
  const headers = nonEmpty[0].map((h) => h.trim());
  return nonEmpty.slice(1).map((r) => {
    const o: Record<string, string> = {};
    headers.forEach((h, i) => (o[h] = (r[i] ?? '').trim()));
    return o;
  });
}

const pick = (o: Record<string, string>, keys: string[]): string => {
  const lower: Record<string, string> = {};
  Object.keys(o).forEach((k) => (lower[k.toLowerCase().trim()] = o[k]));
  for (const k of keys) if (lower[k] != null && lower[k] !== '') return lower[k];
  return '';
};

const toNum = (v: string): number => {
  const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function productsFromRows(rows: Record<string, string>[]): Product[] {
  return rows
    .map((r) => {
      const name = pick(r, ['product name', 'name', 'title']);
      const categoryRaw = pick(r, ['category', 'department', 'collection']);
      return {
        sku: pick(r, ['sku', 'item', 'item #', 'item number']) || slug(name).toUpperCase().slice(0, 12),
        name,
        category: slug(categoryRaw) || 'uncategorized',
        description: pick(r, ['description', 'desc', 'details']),
        imageUrl: pick(r, ['image url', 'image', 'imageurl', 'image_url', 'photo']),
        msrp: toNum(pick(r, ['msrp', 'retail', 'retail price', 'rrp'])),
        wholesalePrice: toNum(pick(r, ['wholesale price', 'wholesale', 'price', 'cost'])),
      };
    })
    .filter((p) => p.name || p.sku);
}

// Build the category list from the categories actually used by products,
// preserving any incoming category display names where possible.
export function categoriesFromProducts(products: Product[], existing: Category[] = []): Category[] {
  const nameById = new Map(existing.map((c) => [c.id, c.name]));
  const ids = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  return ids.map((id) => ({
    id,
    name: nameById.get(id) ?? id.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()),
    parent: '',
  }));
}

export function productsToCsv(products: Product[]): string {
  const headers = ['SKU', 'Product Name', 'Category', 'Description', 'Image URL', 'MSRP', 'Wholesale Price'];
  const esc = (v: string | number) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(',')];
  products.forEach((p) =>
    lines.push([p.sku, p.name, p.category, p.description, p.imageUrl, p.msrp, p.wholesalePrice].map(esc).join(',')),
  );
  return lines.join('\n');
}

export function catalogTemplateCsv(): string {
  return [
    'SKU,Product Name,Category,Description,Image URL,MSRP,Wholesale Price',
    'BLA-1001,Example Lounge Chair,Seating,Solid oak frame with bouclé,https://images.unsplash.com/photo-1567538096630-e0c55bd6374c,395,268',
    'BLA-1002,Example Side Table,Tables,Travertine top on ash base,,320,205',
  ].join('\n');
}

// --- Catalog intelligence ---------------------------------------------------

export type CatalogStats = {
  products: number;
  categories: number;
  missingImages: number;
  duplicateSkus: number;
  avgMargin: number; // %
  withoutPrice: number;
  complexity: 'Low' | 'Medium' | 'High';
};

export function catalogIntelligence(products: Product[], categories: Category[]): CatalogStats {
  const missingImages = products.filter((p) => !p.imageUrl).length;
  const seen = new Map<string, number>();
  products.forEach((p) => seen.set(p.sku, (seen.get(p.sku) ?? 0) + 1));
  const duplicateSkus = Array.from(seen.values()).filter((n) => n > 1).length;
  const withMargin = products.filter((p) => p.msrp > 0);
  const avgMargin = withMargin.length
    ? Math.round(withMargin.reduce((s, p) => s + (p.msrp - p.wholesalePrice) / p.msrp, 0) / withMargin.length * 100)
    : 0;
  const withoutPrice = products.filter((p) => !p.wholesalePrice).length;

  const issues = missingImages + duplicateSkus * 2 + withoutPrice;
  const complexity: CatalogStats['complexity'] =
    products.length > 500 || issues > 40 ? 'High' : products.length > 80 || issues > 12 ? 'Medium' : 'Low';

  return {
    products: products.length,
    categories: categories.length,
    missingImages,
    duplicateSkus,
    avgMargin,
    withoutPrice,
    complexity,
  };
}
