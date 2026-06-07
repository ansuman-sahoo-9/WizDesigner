// migrateV1ToV2 — derive a canonical WizSiteSpecV2 from the app's current V1
// DesignState (+ WizOrderSimulation). Pure: callers pass `now`. Starts from
// defaultWizSiteSpec so any field V1 doesn't track keeps a valid default.

import type { DesignState, WizOrderSimulation, ErpType as V1Erp } from '../types';
import { resolveColors, fontById } from '../themes';
import { resolveBrands } from '../brands';
import { defaultWizSiteSpec } from './defaults';
import type { WizSiteSpecV2, ErpType, BusinessConfig, ThemeConfig, PagesConfig } from './types';

const ERP_MAP: Record<V1Erp, ErpType> = {
  NetSuite: 'netsuite', QuickBooks: 'quickbooks', SAP: 'sap_b1', Dynamics: 'dynamics',
  Acumatica: 'acumatica', Shopify: 'shopify', BigCommerce: 'bigcommerce', Sage: 'custom', Other: 'custom',
};

function mapTheme(state: DesignState): ThemeConfig {
  const c = resolveColors(state.palette, state.customColors);
  const f = fontById(state.font);
  return {
    palette: {
      primary: c.brand, secondary: c.ink, accent: c.accent,
      background: c.bg, surface: c.surface, text: c.ink, textSecondary: '#6b6558',
      border: '#e3ddd0', success: '#047857', warning: '#b45309', error: '#b91c1c',
    },
    typography: { headingFont: f.display, bodyFont: f.body, scale: 'default' },
    density: state.density === 'tight' ? 'compact' : state.density,
    borderRadius: 'none',
    shadows: 'subtle',
  };
}

function mapBusiness(b: WizOrderSimulation): BusinessConfig {
  return {
    pricing: {
      strategy: b.pricing.customerSpecificPricing ? 'customer_group' : b.pricing.volumePricing ? 'tiered' : 'single_price',
      loginGated: b.pricing.loginGated,
      showMSRP: true,
      msrpLabel: 'MSRP',
      tiers: [],
    },
    customerGroups: b.customerAccounts.customerGroups.map((label) => ({
      id: label.toLowerCase().replace(/\s+/g, '-'),
      label,
      priceTier: label.toLowerCase(),
      paymentTerms: b.paymentTerms.net30 ? 'net30' : 'prepaid',
    })),
    paymentTerms: {
      net30: b.paymentTerms.net30, net60: b.paymentTerms.net60, net90: b.paymentTerms.net90,
      prepaid: b.paymentTerms.prepaid, creditCard: b.payments.creditCard, ach: b.payments.ach,
    },
    shipping: {
      flatRate: b.shipping.flatRate, flatRateAmount: b.shipping.flatRateAmount,
      freeShipping: b.shipping.freeShippingEnabled, freeShippingThreshold: b.shipping.freeShippingThreshold,
      carrierCalculated: b.shipping.carrierCalculated, freight: b.shipping.freightEnabled,
      pickup: b.shipping.pickupEnabled, multiLocation: b.shipping.multiLocationEnabled,
    },
    approvalWorkflow: { type: b.orderWorkflow.approvalType, threshold: b.orderWorkflow.approvalThreshold },
    moq: { enabled: b.catalog.moqEnabled, default: b.catalog.moq, enforceOnCart: true, warningMessage: `Minimum order quantity is ${b.catalog.moq} units.` },
    casePacks: { enabled: b.catalog.casePacksEnabled, snapToMultiple: true, showCasePackLabel: true, defaultSize: b.catalog.casePackSize },
    erpIntegration: { type: ERP_MAP[b.orderWorkflow.erpType] ?? 'custom', syncInventory: true, syncPricing: true, syncOrders: true },
  };
}

export function migrateV1ToV2(state: DesignState, now = new Date().toISOString()): WizSiteSpecV2 {
  const base = defaultWizSiteSpec({ siteId: state.sessionId, customerName: state.brandName, industry: state.industry, now });
  const theme = mapTheme(state);
  const b = state.business;

  // Homepage section variants from the V1 variant map (keys that line up).
  const homepage = {
    sections: base.brand.homepage.sections.map((s) => {
      const v = state.variants[s.id];
      return v ? { ...s, variant: v } : s;
    }),
  };

  const navigation = {
    ...base.navigation,
    announcementBar: {
      ...base.navigation.announcementBar,
      enabled: b.marketing.announcementBarEnabled,
      text: b.marketing.announcementText,
    },
  };

  const pages: PagesConfig = {
    ...base.pages,
    pdp: {
      ...base.pages.pdp,
      pricing: { ...base.pages.pdp.pricing, loginGated: b.pricing.loginGated, showTierTable: b.pricing.volumePricing },
      fields: { ...base.pages.pdp.fields, showUnitType: true },
      relatedProducts: { ...base.pages.pdp.relatedProducts, enabled: b.aiFeatures.similarProductsEnabled },
      downloadButton: { ...base.pages.pdp.downloadButton, enabled: b.catalog.customModifiersEnabled },
    },
    cart: {
      ...base.pages.cart,
      moqEnforcement: b.catalog.moqEnabled,
      casePackRules: b.catalog.casePacksEnabled,
      showFreeShippingProgress: b.shipping.freeShippingEnabled,
      freeShippingThreshold: b.shipping.freeShippingThreshold,
    },
    plp: {
      ...base.pages.plp,
      productCard: {
        ...base.pages.plp.productCard,
        guestPricingBehavior: b.pricing.loginGated ? 'login_to_see' : 'show_msrp',
        showBadges: b.catalog.bestSellerTagging,
      },
    },
  };

  const footer = { variant: (state.variants.footer ?? 'A') as 'A' | 'B' | 'C' | 'D', showPoweredBy: b.marketing.poweredByBadge };

  const brandList = resolveBrands(state);
  const multiBrand: WizSiteSpecV2['multiBrand'] = {
    enabled: brandList.length > 1,
    parentBrandId: brandList[0]?.id ?? 'brand_1',
    sharedAuth: true,
    sharedCart: true,
    sharedCatalog: true,
    switcher: {
      enabled: brandList.length > 1,
      position: 'header_integrated',
      style: 'outlined_pill',
      brands: brandList.map((bb) => ({ label: bb.name, href: '#', brandId: bb.id })),
    },
    brands: brandList.slice(1).map((bb) => ({
      id: bb.id,
      label: bb.name,
      slug: bb.name.toLowerCase().replace(/\s+/g, '-'),
      inheritsFrom: brandList[0]?.id ?? 'brand_1',
      overrides: { theme: { typography: { headingFont: fontById(bb.font).display, bodyFont: fontById(bb.font).body, scale: 'default' } } },
    })),
  };

  return {
    ...base,
    multiBrand,
    meta: { ...base.meta, erpType: ERP_MAP[b.orderWorkflow.erpType] ?? 'custom' },
    theme,
    navigation,
    pages,
    business: mapBusiness(b),
    ai: {
      semanticSearch: b.aiFeatures.semanticSearchEnabled,
      visualSearch: b.aiFeatures.visualSearchEnabled,
      similarProducts: b.aiFeatures.similarProductsEnabled,
      cartRecommendations: b.aiFeatures.cartAbandonmentSignals,
      copyGeneration: false,
      variantRecommender: b.aiFeatures.personalizedRecommendations,
    },
    infrastructure: {
      ...base.infrastructure,
      activationModal: { ...base.infrastructure.activationModal, enabled: false },
    },
    brand: {
      ...base.brand,
      name: state.brandName,
      logo: { ...base.brand.logo, imageUrl: state.logoUrl ?? '', style: state.logoStyle === 'wordmark' ? 'wordmark' : state.logoStyle === 'monogram' ? 'monogram' : 'icon_with_wordmark' },
      theme,
      navigation,
      homepage,
      footer,
    },
    imScope: { ...base.imScope, projectName: state.brandName, generatedAt: now },
  };
}
