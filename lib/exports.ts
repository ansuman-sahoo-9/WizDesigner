// WizDesigner — Export Summary (recap) + Export Scope (implementation blueprint).
// Scope now has 4 sections: Brand · Storefront · Catalog · WizOrder Configuration
// Checklist — the IM's exact to-do list, derived from the Layer-3 business config.

import type { DesignState, SectionDef, WizOrderSimulation } from './types';
import { variantLabel } from './industries';
import { fontById, paletteById } from './themes';
import { PERSONA_META } from './wizorder';
import { resolveBrands } from './brands';

function stamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

const mark = (on: boolean) => (on ? '✅' : '☐');

function enabledSections(state: DesignState, sections: SectionDef[]) {
  return sections.filter((s) => s.enabled);
}

type CatalogStats = { products: number; categories: number };

// --- Summary ---------------------------------------------------------------

export function buildSummaryText(state: DesignState, sections: SectionDef[]): string {
  const f = fontById(state.font);
  const pal = state.palette === 'custom' ? 'Custom' : paletteById(state.palette).name;
  const palBlurb = state.palette === 'custom' ? '' : ` (${paletteById(state.palette).blurb})`;
  const rows = enabledSections(state, sections).map((s) => {
    const v = state.variants[s.id] ?? s.defaultVariant;
    const label = s.id === 'about' ? 'default' : `Variant ${v} (${variantLabel(s.id, v)})`;
    return `  ${s.name.padEnd(20)} → ${label}`;
  });
  const b = state.business;

  return [
    'WIZDESIGNER · DESIGN SUMMARY',
    '────────────────────────────',
    `BRAND: ${state.brandName}`,
    `INDUSTRY: ${state.industry}`,
    `PALETTE: ${pal}${palBlurb}`,
    `FONT: ${f.display} + ${f.body}`,
    `DENSITY: ${state.density[0].toUpperCase()}${state.density.slice(1)}`,
    `LOGO STYLE: ${state.logoStyle[0].toUpperCase()}${state.logoStyle.slice(1)}`,
    `PREVIEWING AS: ${PERSONA_META[state.persona].label}`,
    'SECTIONS:',
    ...rows,
    '',
    'BUSINESS RULES (simulated):',
    `  Pricing: ${b.pricing.loginGated ? 'login-gated' : 'public'}${b.pricing.volumePricing ? ' · volume tiers' : ''}${b.pricing.customerSpecificPricing ? ' · per-group' : ''}`,
    `  Customer groups: ${b.customerAccounts.customerGroups.join(', ') || 'none'} · ${b.customerAccounts.leadApproval} approval`,
    `  Terms: ${[b.paymentTerms.net30 && 'Net-30', b.paymentTerms.net60 && 'Net-60', b.paymentTerms.net90 && 'Net-90'].filter(Boolean).join(', ') || 'prepaid'}`,
    `  ERP: ${b.orderWorkflow.erpType}`,
    '',
    `Generated: ${stamp()}`,
  ].join('\n');
}

// --- Scope -----------------------------------------------------------------

export type Scope = {
  brand: { name: string; industry: string; palette: string; fonts: string };
  sections: { id: string; variant: string; name: string }[];
  catalog: CatalogStats;
  integrations: string[];
  features: string[];
  complexity: 'Low' | 'Medium' | 'High';
  estimated_days: number;
  estimated_acv: number;
  business: WizOrderSimulation;
};

export function computeScope(state: DesignState, sections: SectionDef[], catalog: CatalogStats = { products: 0, categories: 0 }): Scope {
  const enabled = enabledSections(state, sections);
  const b = state.business;
  const f = fontById(state.font);

  const integrations = new Set<string>();
  integrations.add(`${b.orderWorkflow.erpType} (ERP connector)`);
  if (b.payments.creditCard || b.payments.ach || b.payments.cardOnFile) integrations.add('WizPay');
  if (b.pricing.customerSpecificPricing || b.pricing.volumePricing) integrations.add('Tier Pricing engine');
  if (b.quotes.multiCartEnabled) integrations.add('Multi-cart by project');
  if (b.aiFeatures.semanticSearchEnabled || b.aiFeatures.visualSearchEnabled || b.aiFeatures.similarProductsEnabled) integrations.add('WizOrder AI search/recs');
  if (b.aiFeatures.cartAbandonmentSignals) integrations.add('WizOrder AI Copilot');
  if (b.marketing.emailCaptureEnabled && b.marketing.emailProvider) integrations.add(`${b.marketing.emailProvider} (email)`);

  const features = new Set<string>();
  if (b.pricing.loginGated) features.add('Login-Gated Pricing');
  if (b.pricing.customerSpecificPricing) features.add('Customer-Specific Price Lists');
  if (b.pricing.volumePricing) features.add('Volume / Tier Pricing');
  if (b.pricing.mapPolicyEnabled) features.add('MAP/IMAP Enforcement');
  if (b.catalog.moqEnabled) features.add(`MOQ (${b.catalog.moq} units)`);
  if (b.catalog.casePacksEnabled) features.add(`Case Packs (${b.catalog.casePackSize})`);
  if (b.catalog.customModifiersEnabled) features.add('Custom Imprint Modifiers');
  if (b.customerAccounts.dealerLoginSeparate) features.add('Separate Dealer Login');
  features.add(`Lead Approval: ${b.customerAccounts.leadApproval}`);
  if (b.customerAccounts.repAssignmentEnabled) features.add('Rep Assignment');

  // Complexity scales with sections + how many heavy capabilities are on.
  const heavy =
    integrations.size +
    (b.pricing.customerSpecificPricing ? 1 : 0) +
    (b.customerAccounts.customerGroups.length) +
    (b.shipping.freightEnabled || b.shipping.multiLocationEnabled ? 1 : 0) +
    (b.aiFeatures.cartAbandonmentSignals ? 1 : 0);
  const multiVariant = enabled.filter((s) => s.id !== 'about').length;
  const score = multiVariant + heavy * 1.5;
  const complexity: Scope['complexity'] = score > 24 ? 'High' : score > 15 ? 'Medium' : 'Low';

  const estimated_days = Math.round(8 + multiVariant * 0.5 + integrations.size * 3 + b.customerAccounts.customerGroups.length * 1.5);
  const estimated_acv = 6000 + integrations.size * 3500 + b.customerAccounts.customerGroups.length * 2500 + (b.aiFeatures.cartAbandonmentSignals ? 6000 : 0);

  return {
    brand: { name: state.brandName, industry: state.industry, palette: state.palette === 'custom' ? 'Custom' : paletteById(state.palette).name, fonts: `${f.display} / ${f.body}` },
    sections: enabled.map((s) => ({ id: s.id, variant: state.variants[s.id] ?? s.defaultVariant, name: s.name })),
    catalog,
    integrations: [...integrations],
    features: [...features],
    complexity,
    estimated_days,
    estimated_acv,
    business: b,
  };
}

function wizOrderChecklist(b: WizOrderSimulation): string[] {
  const groups = b.customerAccounts.customerGroups;
  const out: string[] = [];
  out.push('PRICING & ACCESS');
  out.push(`  ${mark(b.pricing.loginGated)} Login-Gated Pricing → hide prices for unauthenticated buyers`);
  out.push(`  ${mark(b.pricing.customerSpecificPricing)} Customer-Specific Pricing → create price lists: ${groups.join(', ') || '—'}`);
  out.push(`  ${mark(b.pricing.volumePricing)} Volume Pricing → configure quantity breaks per product`);
  out.push(`  ${mark(b.pricing.mapPolicyEnabled)} MAP/IMAP Policy → enforce price floors`);
  out.push('');
  out.push('CATALOG SETUP');
  out.push(`  ${mark(b.catalog.moqEnabled)} MOQ → minimum order qty per product${b.catalog.moqEnabled ? ` (${b.catalog.moq} units)` : ''}`);
  out.push(`  ${mark(b.catalog.casePacksEnabled)} Case Packs → multiples per SKU${b.catalog.casePacksEnabled ? ` (${b.catalog.casePackSize})` : ''}`);
  out.push(`  ${mark(b.catalog.customModifiersEnabled)} Custom Modifiers → imprint option fields`);
  out.push(`  ${mark(b.catalog.etaForOOSEnabled)} ETA for OOS → restock dates on out-of-stock SKUs`);
  out.push(`  ${mark(b.catalog.bestSellerTagging)} Best-Seller Tagging`);
  out.push('');
  out.push('CUSTOMER ACCOUNTS');
  out.push(`  ${mark(true)} Lead Approval → set to ${b.customerAccounts.leadApproval.toUpperCase()}`);
  out.push(`  ${mark(groups.length > 0)} Customer Groups → ${groups.join(', ') || '—'}`);
  out.push(`  ${mark(b.customerAccounts.dealerLoginSeparate)} Dealer Login → separate entry point`);
  out.push(`  ${mark(b.customerAccounts.repAssignmentEnabled)} Rep Assignment → assign reps to groups`);
  out.push(`  ${mark(b.customerAccounts.creditLimitEnabled)} Credit Limits`);
  out.push('');
  out.push('PAYMENTS (WizPay)');
  out.push(`  ${mark(b.paymentTerms.net30)} Net-30 Terms`);
  out.push(`  ${mark(b.paymentTerms.net60)} Net-60 Terms`);
  out.push(`  ${mark(b.paymentTerms.net90)} Net-90 Terms`);
  out.push(`  ${mark(b.payments.creditCard)} Credit Card    ${mark(b.payments.cardOnFile)} Card on File    ${mark(b.payments.ach)} ACH`);
  out.push(`  ${mark(b.payments.partialPaymentsEnabled)} Partial Payments    ${mark(b.payments.surchargeEnabled)} CC Surcharge${b.payments.surchargeEnabled ? ` (${b.payments.surchargePercent}%)` : ''}`);
  out.push('');
  out.push('SHIPPING');
  out.push(`  ${mark(b.shipping.flatRate)} Flat Rate${b.shipping.flatRate ? ` → $${b.shipping.flatRateAmount}` : ''}`);
  out.push(`  ${mark(b.shipping.freeShippingEnabled)} Free Shipping${b.shipping.freeShippingEnabled ? ` → over $${b.shipping.freeShippingThreshold}` : ''}`);
  out.push(`  ${mark(b.shipping.carrierCalculated)} Carrier-Calculated    ${mark(b.shipping.freightEnabled)} Freight    ${mark(b.shipping.pickupEnabled)} Pickup`);
  out.push(`  ${mark(b.shipping.multiLocationEnabled)} Multi-Location Shipping`);
  out.push('');
  out.push('ORDER WORKFLOW');
  out.push(`  ${mark(true)} Order Approval → ${b.orderWorkflow.approvalType}${b.orderWorkflow.approvalType === 'threshold' ? ` above $${b.orderWorkflow.approvalThreshold}` : ''}`);
  out.push(`  ${mark(true)} ERP Integration → ${b.orderWorkflow.erpType} (connector setup)`);
  out.push('');
  out.push('AI FEATURES (WizOrder AI layer)');
  out.push(`  ${mark(b.aiFeatures.semanticSearchEnabled)} Semantic Search`);
  out.push(`  ${mark(b.aiFeatures.visualSearchEnabled)} Visual Search`);
  out.push(`  ${mark(b.aiFeatures.similarProductsEnabled)} Similar Products`);
  out.push(`  ${mark(b.aiFeatures.personalizedRecommendations)} Personalized Recommendations`);
  out.push(`  ${mark(b.aiFeatures.cartAbandonmentSignals)} AI Copilot → cart-abandonment alerts to reps`);
  out.push('');
  out.push('EXTERNAL RETAIL & MARKETING');
  out.push(`  ${mark(b.externalRetail.amazonLinksEnabled)} Amazon Links    ${mark(b.externalRetail.walmartLinksEnabled)} Walmart Links    ${mark(b.externalRetail.retailLocatorEnabled)} Retail Locator`);
  out.push(`  ${mark(b.marketing.emailCaptureEnabled)} Email Capture${b.marketing.emailCaptureEnabled && b.marketing.emailProvider ? ` (${b.marketing.emailProvider})` : ''}    ${mark(b.marketing.announcementBarEnabled)} Announcement Bar`);
  return out;
}

function multiBrandSection(state: DesignState): string[] {
  const brands = resolveBrands(state);
  if (brands.length <= 1) return [];
  const lines: string[] = ['MULTI-BRAND CONFIGURATION', '──────────────────────────', `Total Brands: ${brands.length}`, 'Shared Infrastructure: Auth ✓ | Cart ✓ | Catalog ✓ | Checkout ✓', ''];
  brands.forEach((b, i) => {
    const pal = b.palette === 'custom' ? 'Custom' : paletteById(b.palette).name;
    const f = fontById(b.font);
    lines.push(`Brand ${i + 1}: ${b.name || `Brand ${i + 1}`}${i === 0 ? ' (primary)' : ''}`);
    lines.push(`  Logo: ${b.logoStyle.replace('_', ' ')} · Palette: ${pal} · Font: ${f.display} + ${f.body} · Hero: ${variantLabel('hero', b.heroVariant)}`);
  });
  lines.push('');
  lines.push('WizOrder notes:');
  lines.push(`  • ${brands.length} brand configurations in WizShop admin (shared customer accounts + catalog with brand-tag filtering)`);
  lines.push(`  • Enable brand switcher (style: ${state.brandSwitcherStyle ?? 'pill'}) in header settings`);
  lines.push('');
  return lines;
}

export function buildScopeText(state: DesignState, sections: SectionDef[], scope: Scope): string {
  const multi = scope.sections.filter((s) => s.id !== 'about').length;
  const sectionRows = scope.sections.map(
    (s) => `  ${s.name.padEnd(22)} ${s.id === 'about' ? 'default' : `Variant ${s.variant} (${variantLabel(s.id, s.variant as 'A')})`}`,
  );

  return [
    '═══════════════════════════════════════',
    'WIZSITE IMPLEMENTATION SCOPE DOCUMENT',
    '═══════════════════════════════════════',
    '',
    'SECTION 1 — BRAND',
    `  Brand: ${scope.brand.name}`,
    `  Industry: ${scope.brand.industry}`,
    `  Palette: ${scope.brand.palette}   Fonts: ${scope.brand.fonts}`,
    '',
    'SECTION 2 — STOREFRONT DESIGN',
    ...sectionRows,
    '',
    'SECTION 3 — CATALOG',
    `  Products: ${scope.catalog.products}   Categories: ${scope.catalog.categories}`,
    `  Sections requiring multi-variant rendering: ${multi}`,
    '',
    ...multiBrandSection(state),
    'SECTION 4 — WIZORDER CONFIGURATION CHECKLIST',
    '  (IM: configure each of these in WizOrder before go-live)',
    '',
    ...wizOrderChecklist(scope.business),
    '',
    'IMPLIED INTEGRATIONS',
    ...scope.integrations.map((i) => `  • ${i}`),
    '',
    `ESTIMATED COMPLEXITY: ${scope.complexity}`,
    `ESTIMATED IM HOURS: ${scope.estimated_days * 8}–${(scope.estimated_days + 4) * 8} hrs (~${scope.estimated_days}–${scope.estimated_days + 4} days)`,
    `ESTIMATED ACV ADD-ON: $${scope.estimated_acv.toLocaleString('en-US')}`,
    '',
    `Generated: ${stamp()}`,
  ].join('\n');
}

export function buildScopeJson(scope: Scope): string {
  return JSON.stringify(
    {
      brand: scope.brand,
      sections: scope.sections,
      catalog: scope.catalog,
      integrations: scope.integrations,
      features: scope.features,
      wizOrderConfig: scope.business,
      complexity: scope.complexity.toLowerCase(),
      estimated_days: scope.estimated_days,
      estimated_acv: scope.estimated_acv,
    },
    null,
    2,
  );
}
