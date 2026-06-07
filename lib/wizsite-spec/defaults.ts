// Baseline (valid) WizSiteSpec V2 factory. migrate.ts overlays mapped V1 values
// on top of this, so any field the app doesn't track yet still has a sane value.

import type { WizSiteSpecV2, ThemeConfig, NavigationConfig, PagesConfig, BusinessConfig, AIConfig, InfrastructureConfig, HomepageConfig, FooterConfig, LogoConfig } from './types';

const STAMP = '1970-01-01T00:00:00.000Z'; // overwritten by callers with a real time

export function defaultTheme(): ThemeConfig {
  return {
    palette: {
      primary: '#6B4423', secondary: '#1A1410', accent: '#C9A45A',
      background: '#F7F2E9', surface: '#FFFFFF', text: '#1A1410', textSecondary: '#6b6558',
      border: '#e3ddd0', success: '#047857', warning: '#b45309', error: '#b91c1c',
    },
    typography: { headingFont: 'Fraunces', bodyFont: 'Inter', scale: 'default' },
    density: 'comfortable',
    borderRadius: 'none',
    shadows: 'subtle',
  };
}

export function defaultLogo(name = 'Brand'): LogoConfig {
  return { imageUrl: '', layout: 'logo_only', style: 'wordmark', subtitleText: undefined, parentBrandText: undefined };
}

export function defaultNavigation(): NavigationConfig {
  return {
    announcementBar: { enabled: true, text: 'Trade pricing unlocked at checkout · Net-30 terms available', mode: 'static' },
    header: {
      authStyle: 'text_link',
      signInLabel: 'Trade Login',
      registerLabel: 'Apply for Account',
      utilityLinks: [],
      search: { enabled: true, scopes: ['all'], visualSearch: false, placeholder: 'Search the catalog…', panelPosition: 'slide_right' },
      showWishlistIcon: true,
      cartBadgeStyle: 'count',
      accountDropdownItems: [],
      guestNavItems: [
        { label: 'Shop', type: 'link', href: '/shop' },
        { label: 'Collections', type: 'link', href: '/collections' },
        { label: 'Trade', type: 'link', href: '/trade' },
        { label: 'About', type: 'link', href: '/about' },
        { label: 'Contact', type: 'link', href: '/contact' },
      ],
      authNavItems: [],
    },
    breadcrumb: { enabled: true },
  };
}

export function defaultPages(): PagesConfig {
  return {
    plp: {
      collectionBanner: { enabled: false, variant: 'full_bleed_image' },
      categoryDescription: { enabled: false },
      filters: {
        filters: [
          { id: 'category', label: 'Category', type: 'category', uiType: 'dropdown_pill', defaultOpen: false },
          { id: 'price', label: 'Price', type: 'price_range', uiType: 'range_slider', defaultOpen: false },
          { id: 'availability', label: 'Availability', type: 'availability', uiType: 'dropdown_pill', defaultOpen: false },
        ],
        maxInlinePills: 4,
        overflowDrawer: true,
      },
      productCard: {
        showSKU: true, showMSRP: true, showOptionsCount: false, showBadges: true,
        showWishlistIcon: true, showCategoryTag: false,
        guestPricingBehavior: 'login_to_see', imageAspectRatio: '4:5', hoverAction: 'quick_view',
      },
      grid: { columns: 4 },
      pagination: { mode: 'paginated', perPage: 24 },
      defaultSort: 'featured',
      allowedSorts: ['featured', 'new_arrivals', 'price_asc', 'price_desc', 'name_az', 'sku_asc'],
    },
    pdp: {
      gallery: { mode: 'left_sidebar', showFullscreenButton: true, showZoom: true, thumbnailCount: 4 },
      pricing: { showWholesalePrice: true, showMSRP: true, msrpLabel: 'MSRP', showTierTable: true, loginGated: true, loginGatedLabel: 'Login to see price', unitPricing: true, casePricing: true },
      variantSelector: { style: 'pill' },
      inventory: {
        displayMode: 'count',
        states: {
          inStock: { label: 'In stock' },
          lowStock: { label: 'Low stock', threshold: 10 },
          outOfStock: { label: 'Out of stock', showAddToCart: false },
          preorder: { label: 'Pre-order', showNextAvailableDate: true },
          discontinued: { label: 'Discontinued' },
        },
      },
      downloadButton: { enabled: false, label: 'Download', type: 'all', position: 'top_right' },
      fields: { showUPC: false, upcLabel: 'UPC', showUnitType: true, unitType: 'each', showMaterialIcons: false },
      accordions: [
        { id: 'details', label: 'Product Details', type: 'details_care', defaultOpen: true },
        { id: 'dimensions', label: 'Dimensions', type: 'dimensions', defaultOpen: false },
      ],
      relatedProducts: { enabled: true, label: 'Similar products', source: 'ai_recommendation', layout: 'grid_4col', maxCount: 4 },
    },
    cart: {
      showDownloadButton: false, showItemNotes: false, showViewSimilar: false, showVariantSwitcher: false,
      allowInCartProductSearch: false, showFreeShippingProgress: true, freeShippingThreshold: 500,
      moqEnforcement: true, casePackRules: true,
    },
    contentPages: [],
  };
}

export function defaultBusiness(): BusinessConfig {
  return {
    pricing: { strategy: 'customer_group', loginGated: true, showMSRP: true, msrpLabel: 'MSRP', tiers: [] },
    customerGroups: [
      { id: 'dealer', label: 'Dealer', priceTier: 'dealer', paymentTerms: 'net30' },
      { id: 'distributor', label: 'Distributor', priceTier: 'distributor', paymentTerms: 'net60' },
    ],
    paymentTerms: { net30: true, net60: false, net90: false, prepaid: true, creditCard: true, ach: true },
    shipping: { flatRate: true, flatRateAmount: 15, freeShipping: true, freeShippingThreshold: 500, carrierCalculated: false, freight: false, pickup: false, multiLocation: false },
    approvalWorkflow: { type: 'threshold', threshold: 5000 },
    moq: { enabled: true, default: 12, enforceOnCart: true, warningMessage: 'Minimum order quantity is {moq} units.' },
    casePacks: { enabled: true, snapToMultiple: true, showCasePackLabel: true, defaultSize: 6 },
    erpIntegration: { type: 'netsuite', syncInventory: true, syncPricing: true, syncOrders: true },
  };
}

export function defaultAI(): AIConfig {
  return { semanticSearch: true, visualSearch: false, similarProducts: true, cartRecommendations: false, copyGeneration: false, variantRecommender: false };
}

export function defaultInfrastructure(): InfrastructureConfig {
  return {
    liveChat: { enabled: false, provider: 'intercom', position: 'bottom_right' },
    activationModal: { enabled: false, headline: 'Activate your account', body: 'Your wholesale account has moved. Claim it to see pricing and place orders.', ctaLabel: 'Activate now', triggerBehavior: 'on_page_load' },
    activationFlow: { enabled: false, headline: 'Claim your account', steps: [{ label: 'Account email', fieldType: 'email' }, { label: 'Company name', fieldType: 'text' }] },
    errorPages: { custom404: false, customMaintenance: false },
  };
}

function defaultHomepage(): HomepageConfig {
  const s = (id: string, type: HomepageConfig['sections'][number]['type'], variant: 'A' | 'B' | 'C' | 'D', order: number): HomepageConfig['sections'][number] =>
    ({ id, type, enabled: true, variant, order, config: {} });
  return {
    sections: [
      s('hero', 'hero', 'B', 1),
      s('categories', 'categoryTileGrid', 'A', 2),
      s('featured', 'featuredCollection', 'C', 3),
      s('trade', 'tradeAccountCTA', 'A', 4),
      s('testimonials', 'testimonials', 'B', 5),
      s('newsletter', 'newsletter', 'A', 6),
    ],
  };
}

function defaultFooter(): FooterConfig {
  return { variant: 'A', showPoweredBy: true };
}

export function defaultWizSiteSpec(opts?: { siteId?: string; customerName?: string; industry?: string; now?: string }): WizSiteSpecV2 {
  const now = opts?.now ?? STAMP;
  const theme = defaultTheme();
  const navigation = defaultNavigation();
  const name = opts?.customerName ?? 'BLANCA & CO.';
  return {
    meta: { siteId: opts?.siteId ?? 'site_default', customerName: name, erpType: 'netsuite', industry: opts?.industry ?? 'Furniture', createdAt: now, updatedAt: now, schemaVersion: 'v2' },
    brand: { id: 'parent', name, logo: defaultLogo(name), theme, navigation, homepage: defaultHomepage(), footer: defaultFooter() },
    multiBrand: { enabled: false, parentBrandId: 'parent', sharedAuth: true, sharedCart: true, sharedCatalog: true, switcher: { enabled: false, position: 'top_left', style: 'outlined_pill', brands: [] }, brands: [] },
    theme,
    navigation,
    pages: defaultPages(),
    business: defaultBusiness(),
    ai: defaultAI(),
    infrastructure: defaultInfrastructure(),
    imScope: { projectName: name, generatedAt: now, estimatedComplexity: 'medium', estimatedDaysToLaunch: 14 },
  };
}
