// WizDesigner — fallback reference data.
// Mirrors the Google Sheet tabs (Section Registry, Industry Presets, Brands,
// Products, Categories) so the app renders fully even with no network / no sheet.
// When SheetService succeeds, sheet rows replace these.

import type {
  SectionDef,
  IndustryPreset,
  Product,
  Category,
  Brand,
  Variant,
} from './types';

// ⭐ Section Registry — the master list. Boot reads this to decide what renders,
// in what order, and each section's starting variant.
export const SECTION_REGISTRY: SectionDef[] = [
  { id: 'header', name: 'Header', enabled: true, defaultVariant: 'A', order: 1 },
  { id: 'hero', name: 'Hero', enabled: true, defaultVariant: 'B', order: 2 },
  { id: 'categories', name: 'Category Grid', enabled: true, defaultVariant: 'A', order: 3 },
  { id: 'featured', name: 'Featured Products', enabled: true, defaultVariant: 'C', order: 4 },
  { id: 'trade', name: 'Trade Program', enabled: true, defaultVariant: 'A', order: 5 },
  { id: 'testimonials', name: 'Testimonials', enabled: true, defaultVariant: 'B', order: 6 },
  { id: 'about', name: 'About Brand', enabled: true, defaultVariant: 'A', order: 7 },
  { id: 'pdp', name: 'Product Detail Preview', enabled: true, defaultVariant: 'A', order: 8 },
  { id: 'cart', name: 'Cart Preview', enabled: true, defaultVariant: 'B', order: 9 },
  { id: 'footer', name: 'Footer', enabled: true, defaultVariant: 'A', order: 10 },
];

// Human-readable label for each variant, per section. Used in summaries + UI.
export const VARIANT_LABELS: Record<string, Partial<Record<Variant, string>>> = {
  header: { A: 'Centered editorial', B: 'Inline classic', C: 'Dark mega-menu', D: 'Stacked utility' },
  hero: { A: 'Editorial', B: 'Split', C: 'Cinematic', D: 'Image grid' },
  categories: { A: 'Big image cards', B: 'Icon grid', C: 'Staggered bento', D: 'Horizontal scroll' },
  featured: { A: '4-col spacious', B: '6-col bulk add', C: '3-col editorial', D: 'Horizontal carousel' },
  trade: { A: 'Side-by-side', B: 'Promo banner', C: '3-tier pricing cards', D: 'Dark story' },
  testimonials: { A: 'Hero quote', B: '3-up grid', C: 'Aggregated rating', D: 'Carousel' },
  about: { A: 'Heritage story', B: 'Heritage story', C: 'Heritage story', D: 'Heritage story' },
  pdp: { A: 'Classic 2-col', B: 'Sticky info', C: 'Full-bleed', D: 'Editorial' },
  cart: { A: 'Single cart', B: 'Multi-cart tabs', C: 'Drawer', D: 'Full-width' },
  footer: { A: 'Big 5-col', B: 'Minimal centered', C: 'Newsletter-led', D: 'Wide row' },
};

export function variantLabel(sectionId: string, v: Variant): string {
  return VARIANT_LABELS[sectionId]?.[v] ?? `Variant ${v}`;
}

export const INDUSTRY_PRESETS: IndustryPreset[] = [
  { industry: 'Furniture', defaultHeroVariant: 'B', defaultCategoryVariant: 'A', defaultProductVariant: 'C', defaultPalette: 'heritage' },
  { industry: 'Lighting', defaultHeroVariant: 'C', defaultCategoryVariant: 'B', defaultProductVariant: 'A', defaultPalette: 'industrial' },
  { industry: 'Home Decor', defaultHeroVariant: 'A', defaultCategoryVariant: 'C', defaultProductVariant: 'A', defaultPalette: 'botanical' },
  { industry: 'Apparel', defaultHeroVariant: 'D', defaultCategoryVariant: 'A', defaultProductVariant: 'B', defaultPalette: 'editorial' },
  { industry: 'Beauty & Wellness', defaultHeroVariant: 'A', defaultCategoryVariant: 'B', defaultProductVariant: 'C', defaultPalette: 'luxe' },
  { industry: 'Food & Beverage', defaultHeroVariant: 'C', defaultCategoryVariant: 'D', defaultProductVariant: 'A', defaultPalette: 'modern' },
  { industry: 'Sporting Goods', defaultHeroVariant: 'C', defaultCategoryVariant: 'A', defaultProductVariant: 'B', defaultPalette: 'industrial' },
  { industry: 'Stationery & Paper', defaultHeroVariant: 'A', defaultCategoryVariant: 'C', defaultProductVariant: 'C', defaultPalette: 'editorial' },
  { industry: 'Pet Supplies', defaultHeroVariant: 'B', defaultCategoryVariant: 'B', defaultProductVariant: 'A', defaultPalette: 'modern' },
  { industry: 'Electronics Accessories', defaultHeroVariant: 'C', defaultCategoryVariant: 'B', defaultProductVariant: 'B', defaultPalette: 'industrial' },
  { industry: 'Jewelry & Accessories', defaultHeroVariant: 'A', defaultCategoryVariant: 'C', defaultProductVariant: 'C', defaultPalette: 'luxe' },
  { industry: 'Toys & Games', defaultHeroVariant: 'D', defaultCategoryVariant: 'A', defaultProductVariant: 'A', defaultPalette: 'modern' },
  { industry: 'Health & Supplements', defaultHeroVariant: 'A', defaultCategoryVariant: 'B', defaultProductVariant: 'A', defaultPalette: 'botanical' },
  { industry: 'Coffee & Tea', defaultHeroVariant: 'C', defaultCategoryVariant: 'A', defaultProductVariant: 'C', defaultPalette: 'heritage' },
];

export const DEFAULT_BRANDS: Brand[] = [
  {
    brandName: 'BLANCA & CO.',
    industry: 'Furniture',
    logoUrl: '',
    primaryColor: '#6B4423',
    secondaryColor: '#1A1410',
    accentColor: '#C9A45A',
    fontHeading: 'Fraunces',
    fontBody: 'Inter',
  },
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'seating', name: 'Seating', parent: '' },
  { id: 'tables', name: 'Tables', parent: '' },
  { id: 'lighting', name: 'Lighting', parent: '' },
  { id: 'storage', name: 'Storage', parent: '' },
  { id: 'textiles', name: 'Textiles', parent: '' },
  { id: 'decor', name: 'Decor & Objects', parent: '' },
];

// Stable Unsplash imagery so the preview looks real without local assets.
const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`;

export const DEFAULT_PRODUCTS: Product[] = [
  { sku: 'BLA-2041', name: 'Mara Lounge Chair', category: 'seating', description: 'Solid oak frame with hand-tied bouclé upholstery.', imageUrl: img('1567538096630-e0c55bd6374c'), msrp: 395, wholesalePrice: 268 },
  { sku: 'BLA-2042', name: 'Hadley Sofa', category: 'seating', description: 'Three-seat sofa, kiln-dried hardwood, feather-down cushions.', imageUrl: img('1555041469-a586c61ea9bc'), msrp: 1290, wholesalePrice: 845 },
  { sku: 'BLA-3010', name: 'Linnea Dining Table', category: 'tables', description: 'Live-edge walnut top on blackened steel base.', imageUrl: img('1577140917170-285929fb55b7'), msrp: 1650, wholesalePrice: 1110 },
  { sku: 'BLA-3011', name: 'Pell Side Table', category: 'tables', description: 'Turned ash pedestal with travertine top.', imageUrl: img('1532372320572-cda25653a26d'), msrp: 320, wholesalePrice: 205 },
  { sku: 'BLA-4001', name: 'Orbit Pendant', category: 'lighting', description: 'Hand-blown smoked glass globe, brushed brass.', imageUrl: img('1513506003901-1e6a229e2d15'), msrp: 285, wholesalePrice: 178 },
  { sku: 'BLA-4002', name: 'Column Floor Lamp', category: 'lighting', description: 'Fluted alabaster column, dimmable warm LED.', imageUrl: img('1530603907829-659ab1f7e6c5'), msrp: 440, wholesalePrice: 290 },
  { sku: 'BLA-5005', name: 'Vesta Sideboard', category: 'storage', description: 'Cane-front credenza in white oak with soft-close doors.', imageUrl: img('1538688525198-9b88f6f53126'), msrp: 1180, wholesalePrice: 760 },
  { sku: 'BLA-5006', name: 'Atlas Bookcase', category: 'storage', description: 'Modular blackened-steel and oak shelving.', imageUrl: img('1594224457860-23f2eea1e827'), msrp: 980, wholesalePrice: 640 },
  { sku: 'BLA-6002', name: 'Loom Throw', category: 'textiles', description: 'Heavyweight handwoven wool throw, fringed edge.', imageUrl: img('1600369671236-e74521d4b6ad'), msrp: 145, wholesalePrice: 88 },
  { sku: 'BLA-6003', name: 'Field Cushion Set', category: 'textiles', description: 'Set of two linen cushions, feather insert.', imageUrl: img('1584100936595-c0654b55a2e6'), msrp: 95, wholesalePrice: 56 },
  { sku: 'BLA-7001', name: 'Cairn Vase', category: 'decor', description: 'Wheel-thrown stoneware vase, matte oatmeal glaze.', imageUrl: img('1578500494198-246f612d3b3d'), msrp: 78, wholesalePrice: 44 },
  { sku: 'BLA-7002', name: 'Ember Candle Trio', category: 'decor', description: 'Soy candles in amber glass, cedar + smoke.', imageUrl: img('1602874801006-e26d3d17d3a7'), msrp: 62, wholesalePrice: 34 },
];

export function presetForIndustry(industry: string): IndustryPreset | undefined {
  return INDUSTRY_PRESETS.find((p) => p.industry === industry);
}
