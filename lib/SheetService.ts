// WizDesigner — Google Sheet access via Apps Script web-app endpoint.
// No keys, no OAuth. Set NEXT_PUBLIC_SHEET_API in .env.local to the deployment URL.
// Every reader degrades gracefully: on missing URL or any error it returns null,
// and callers fall back to lib/industries.ts + lib/themes.ts.

import type {
  SectionDef,
  IndustryPreset,
  Product,
  Category,
  Brand,
  Variant,
} from './types';

const SHEET_API =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SHEET_API) || '';

export function sheetConfigured(): boolean {
  return !!SHEET_API;
}

type Row = Record<string, unknown>;

export async function readTab(tab: string): Promise<Row[] | null> {
  if (!SHEET_API) return null;
  try {
    const res = await fetch(`${SHEET_API}?tab=${encodeURIComponent(tab)}`, {
      // GET; Apps Script "Anyone" deployments allow this from the browser.
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.rows as Row[]) ?? [];
  } catch {
    return null;
  }
}

// POST as text/plain to avoid a CORS preflight; Apps Script reads the raw body.
async function post(body: unknown): Promise<boolean> {
  if (!SHEET_API) return false;
  try {
    await fetch(SHEET_API, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
    });
    return true;
  } catch {
    return false;
  }
}

export async function appendRow(tab: string, row: Row): Promise<boolean> {
  return post({ tab, action: 'append', row });
}

export async function replaceRows(tab: string, rows: Row[]): Promise<boolean> {
  return post({ tab, action: 'replace', rows });
}

// --- helpers ---------------------------------------------------------------

const str = (v: unknown): string => (v == null ? '' : String(v)).trim();
const num = (v: unknown): number => {
  const n = parseFloat(String(v ?? '').replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};
const bool = (v: unknown): boolean => {
  const s = String(v ?? '').trim().toLowerCase();
  return s === 'true' || s === 'yes' || s === '1';
};
const variant = (v: unknown): Variant => {
  const s = str(v).toUpperCase();
  return s === 'A' || s === 'B' || s === 'C' || s === 'D' ? (s as Variant) : 'A';
};

// --- typed loaders ---------------------------------------------------------

export async function loadSectionRegistry(): Promise<SectionDef[] | null> {
  const rows = await readTab('Section Registry');
  if (!rows || rows.length === 0) return null;
  return rows
    .map((r, i) => ({
      id: str(r['Section ID']),
      name: str(r['Section Name']),
      enabled: bool(r['Enabled']),
      defaultVariant: variant(r['Default Variant']),
      order: num(r['Order']) || i + 1,
    }))
    .filter((s) => s.id)
    .sort((a, b) => a.order - b.order);
}

export async function loadIndustryPresets(): Promise<IndustryPreset[] | null> {
  const rows = await readTab('Industry Presets');
  if (!rows || rows.length === 0) return null;
  return rows
    .map((r) => ({
      industry: str(r['Industry']),
      defaultHeroVariant: variant(r['Default Hero Variant']),
      defaultCategoryVariant: variant(r['Default Category Variant']),
      defaultProductVariant: variant(r['Default Product Variant']),
      defaultPalette: str(r['Default Palette']).toLowerCase() || 'heritage',
    }))
    .filter((p) => p.industry);
}

export async function loadProducts(): Promise<Product[] | null> {
  const rows = await readTab('Products');
  if (!rows || rows.length === 0) return null;
  return rows
    .map((r) => ({
      sku: str(r['SKU']),
      name: str(r['Product Name']),
      category: str(r['Category']).toLowerCase(),
      description: str(r['Description']),
      imageUrl: str(r['Image URL']),
      msrp: num(r['MSRP']),
      wholesalePrice: num(r['Wholesale Price']),
    }))
    .filter((p) => p.sku || p.name);
}

export async function loadCategories(): Promise<Category[] | null> {
  const rows = await readTab('Categories');
  if (!rows || rows.length === 0) return null;
  return rows
    .map((r) => ({
      id: str(r['Category ID']).toLowerCase(),
      name: str(r['Category Name']),
      parent: str(r['Parent Category']).toLowerCase().replace('—', '').trim(),
    }))
    .filter((c) => c.id);
}

export async function loadBrands(): Promise<Brand[] | null> {
  const rows = await readTab('Brands');
  if (!rows || rows.length === 0) return null;
  return rows
    .map((r) => ({
      brandName: str(r['Brand Name']),
      industry: str(r['Industry']),
      logoUrl: str(r['Logo URL']),
      primaryColor: str(r['Primary Color']),
      secondaryColor: str(r['Secondary Color']),
      accentColor: str(r['Accent Color']),
      fontHeading: str(r['Font Heading']),
      fontBody: str(r['Font Body']),
    }))
    .filter((b) => b.brandName);
}
