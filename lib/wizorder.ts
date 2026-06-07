// WizDesigner — Layer 3 helpers: default WizOrder simulation, Preview Personas,
// and the pricing resolver that personas + business toggles drive in the preview.

import type { WizOrderSimulation, PersonaId, Product } from './types';
import { money } from './format';

// Sensible "discovered" defaults — a typical wholesale account mid-discovery.
export const DEFAULT_BUSINESS: WizOrderSimulation = {
  pricing: {
    loginGated: true,
    customerSpecificPricing: true,
    volumePricing: true,
    mapPolicyEnabled: false,
    currencyMulti: false,
  },
  catalog: {
    moqEnabled: true,
    moq: 12,
    casePacksEnabled: true,
    casePackSize: 6,
    customModifiersEnabled: false,
    etaForOOSEnabled: false,
    bestSellerTagging: true,
  },
  customerAccounts: {
    leadApproval: 'manual',
    customerGroups: ['Dealer', 'Distributor'],
    dealerLoginSeparate: true,
    creditLimitEnabled: false,
    repAssignmentEnabled: false,
  },
  paymentTerms: { net30: true, net60: false, net90: false, prepaid: true, cod: false },
  payments: {
    creditCard: true,
    cardOnFile: true,
    ach: true,
    surchargeEnabled: false,
    surchargePercent: 3,
    partialPaymentsEnabled: false,
  },
  shipping: {
    flatRate: true,
    flatRateAmount: 15,
    carrierCalculated: false,
    freeShippingEnabled: true,
    freeShippingThreshold: 500,
    pickupEnabled: false,
    freightEnabled: false,
    multiLocationEnabled: false,
  },
  orderWorkflow: { approvalType: 'threshold', approvalThreshold: 5000, erpType: 'NetSuite' },
  aiFeatures: {
    semanticSearchEnabled: true,
    visualSearchEnabled: false,
    similarProductsEnabled: true,
    personalizedRecommendations: false,
    cartAbandonmentSignals: false,
  },
  externalRetail: { amazonLinksEnabled: false, walmartLinksEnabled: false, retailLocatorEnabled: true },
  marketing: {
    emailCaptureEnabled: true,
    emailProvider: 'Klaviyo',
    announcementBarEnabled: true,
    announcementText: 'Trade pricing unlocked at checkout · Net-30 terms available',
    poweredByBadge: true,
  },
  quotes: { quoteManagementEnabled: false, multiCartEnabled: true, wishlistEnabled: true },
  accountFeatures: {
    orderHistoryEnabled: true,
    oneClickReorderEnabled: true,
    invoiceVisibilityEnabled: false,
    shipmentTrackingEnabled: true,
  },
};

// Backfill any missing fields so older persisted state / snapshots stay valid.
export function normalizeBusiness(b: Partial<WizOrderSimulation> | undefined): WizOrderSimulation {
  const d = DEFAULT_BUSINESS;
  const src = b ?? {};
  const merge = <K extends keyof WizOrderSimulation>(k: K): WizOrderSimulation[K] => ({
    ...d[k],
    ...((src as WizOrderSimulation)[k] ?? {}),
  });
  return {
    pricing: merge('pricing'),
    catalog: merge('catalog'),
    customerAccounts: merge('customerAccounts'),
    paymentTerms: merge('paymentTerms'),
    payments: merge('payments'),
    shipping: merge('shipping'),
    orderWorkflow: merge('orderWorkflow'),
    aiFeatures: merge('aiFeatures'),
    externalRetail: merge('externalRetail'),
    marketing: merge('marketing'),
    quotes: merge('quotes'),
    accountFeatures: merge('accountFeatures'),
  };
}

// --- Preview Personas -------------------------------------------------------

export const PERSONA_META: Record<PersonaId, { label: string; group: string; blurb: string }> = {
  guest: { label: 'Guest', group: '', blurb: 'Unauthenticated visitor' },
  dealer: { label: 'Dealer', group: 'Dealer', blurb: 'Approved dealer · best terms' },
  distributor: { label: 'Distributor', group: 'Distributor', blurb: 'Volume distributor' },
  retailer: { label: 'Retailer', group: 'Retail', blurb: 'Retail / boutique account' },
  international: { label: 'International', group: 'International', blurb: 'Cross-border buyer' },
};

const GROUP_TO_PERSONA: Record<string, PersonaId> = {
  dealer: 'dealer',
  distributor: 'distributor',
  retail: 'retailer',
  retailer: 'retailer',
  international: 'international',
};

// Personas available = guest + whichever customer groups are configured.
export function availablePersonas(b: WizOrderSimulation): PersonaId[] {
  const ids: PersonaId[] = ['guest'];
  b.customerAccounts.customerGroups.forEach((g) => {
    const id = GROUP_TO_PERSONA[g.trim().toLowerCase()];
    if (id && !ids.includes(id)) ids.push(id);
  });
  return ids;
}

// --- Pricing resolver -------------------------------------------------------

export type PriceInfo = {
  locked: boolean; // show "Login to see price" instead of a number
  tierLabel: string; // e.g. "Dealer price"
  price: number;
  compareAt?: number; // strike-through reference (MSRP)
  showBreaks: boolean; // volume price-break table on PDP
};

// Tier multiplier applied to the wholesale price for each persona.
const TIER_FACTOR: Record<PersonaId, number> = {
  guest: 1,
  dealer: 1,
  distributor: 0.92,
  retailer: 1.18,
  international: 1.08,
};

export function priceFor(p: Product, persona: PersonaId, b: WizOrderSimulation): PriceInfo {
  const locked = b.pricing.loginGated && persona === 'guest';
  const csp = b.pricing.customerSpecificPricing;
  const factor = csp ? TIER_FACTOR[persona] : 1;
  const price = Math.round(p.wholesalePrice * factor);
  const tierLabel =
    persona === 'guest' ? 'Wholesale' : `${PERSONA_META[persona].label} price`;
  return {
    locked,
    tierLabel,
    price,
    compareAt: p.msrp,
    showBreaks: b.pricing.volumePricing,
  };
}

// Build a small volume price-break ladder for PDP display.
export function priceBreaks(info: PriceInfo): { qty: string; price: string }[] {
  if (info.locked) return [];
  const base = info.price;
  return [
    { qty: '1–11', price: money(base) },
    { qty: '12–47', price: money(Math.round(base * 0.95)) },
    { qty: '48+', price: money(Math.round(base * 0.88)) },
  ];
}

export function termsForPersona(persona: PersonaId, b: WizOrderSimulation): string {
  if (persona === 'distributor' && b.paymentTerms.net60) return 'Net-60 terms';
  if (b.paymentTerms.net30 && persona !== 'guest') return 'Net-30 terms';
  if (b.paymentTerms.prepaid) return 'Prepaid';
  return 'Credit card';
}
