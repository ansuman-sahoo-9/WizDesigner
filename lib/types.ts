// WizDesigner — shared types
// State is intentionally flat + serializable so a Snapshot is just a capture of
// DesignState, and so it stays compatible with the V2 "Decision Engine" model
// where every choice is a Decision.

export type Variant = 'A' | 'B' | 'C' | 'D';
export type Density = 'tight' | 'comfortable' | 'spacious';
export type LogoStyle = 'wordmark' | 'monogram' | 'boxed' | 'icon_wordmark' | 'stacked';
export type BrandSwitcherStyle = 'pill' | 'underline' | 'dropdown' | 'minimal';

// Layer 3 — WizOrder simulation -----------------------------------------------

export type PersonaId = 'guest' | 'dealer' | 'distributor' | 'retailer' | 'international';
export type ErpType =
  | 'NetSuite' | 'SAP' | 'QuickBooks' | 'Sage' | 'Dynamics' | 'Acumatica'
  | 'Shopify' | 'BigCommerce' | 'Other';

// The business rules a CSM simulates in discovery — what the IM will configure
// in WizOrder. Flat-ish + serializable so it lives inside DesignState/Snapshot.
export type WizOrderSimulation = {
  pricing: {
    loginGated: boolean;
    customerSpecificPricing: boolean;
    volumePricing: boolean;
    mapPolicyEnabled: boolean;
    currencyMulti: boolean;
  };
  catalog: {
    moqEnabled: boolean;
    moq: number;
    casePacksEnabled: boolean;
    casePackSize: number;
    customModifiersEnabled: boolean;
    etaForOOSEnabled: boolean;
    bestSellerTagging: boolean;
  };
  customerAccounts: {
    leadApproval: 'auto' | 'manual';
    customerGroups: string[]; // drives Preview Personas
    dealerLoginSeparate: boolean;
    creditLimitEnabled: boolean;
    repAssignmentEnabled: boolean;
  };
  paymentTerms: { net30: boolean; net60: boolean; net90: boolean; prepaid: boolean; cod: boolean };
  payments: {
    creditCard: boolean;
    cardOnFile: boolean;
    ach: boolean;
    surchargeEnabled: boolean;
    surchargePercent: number;
    partialPaymentsEnabled: boolean;
  };
  shipping: {
    flatRate: boolean;
    flatRateAmount: number;
    carrierCalculated: boolean;
    freeShippingEnabled: boolean;
    freeShippingThreshold: number;
    pickupEnabled: boolean;
    freightEnabled: boolean;
    multiLocationEnabled: boolean;
  };
  orderWorkflow: {
    approvalType: 'auto' | 'manual' | 'threshold';
    approvalThreshold: number;
    erpType: ErpType;
  };
  aiFeatures: {
    semanticSearchEnabled: boolean;
    visualSearchEnabled: boolean;
    similarProductsEnabled: boolean;
    personalizedRecommendations: boolean;
    cartAbandonmentSignals: boolean;
  };
  externalRetail: { amazonLinksEnabled: boolean; walmartLinksEnabled: boolean; retailLocatorEnabled: boolean };
  marketing: { emailCaptureEnabled: boolean; emailProvider: string; announcementBarEnabled: boolean; announcementText: string; poweredByBadge: boolean };
  quotes: { quoteManagementEnabled: boolean; multiCartEnabled: boolean; wishlistEnabled: boolean };
  accountFeatures: {
    orderHistoryEnabled: boolean;
    oneClickReorderEnabled: boolean;
    invoiceVisibilityEnabled: boolean;
    shipmentTrackingEnabled: boolean;
  };
};

export type CustomColors = {
  bg: string;
  surface: string;
  ink: string;
  brand: string;
  accent: string;
};

// One brand's visual identity in a (possibly multi-brand) storefront. The first
// brand is the parent; children share auth/cart/catalog but override their style.
export type BrandEntry = {
  id: string;
  name: string;
  palette: string;
  customColors?: CustomColors;
  font: string;
  logoStyle: LogoStyle;
  logoUrl?: string;
  heroVariant: Variant; // this brand's hero style
};

export type DesignState = {
  sessionId: string;
  brandName: string;
  industry: string;
  logoUrl?: string; // uploaded brand logo (data URL); falls back to text logo
  // Multi-brand: the active brand's identity mirrors the top-level fields above;
  // other brands live in `brands`. Undefined/length<=1 = single brand.
  brands?: BrandEntry[];
  activeBrandId?: string;
  brandSwitcherStyle?: BrandSwitcherStyle;
  palette: string; // preset name or 'custom'
  customColors?: CustomColors;
  font: string; // font preset name
  density: Density;
  logoStyle: LogoStyle;
  variants: Record<string, Variant>; // sectionId -> variant
  mockIntegrations: Record<string, boolean>; // 'netsuite' -> true
  business: WizOrderSimulation; // Layer 3 — WizOrder rules being simulated
  persona: PersonaId; // "Preview As" — which customer group sees the storefront
};

// A saved version of the whole design. Unlimited — created on demand.
export type Version = DesignState & {
  id: string;
  name: string;
  createdAt: string; // ISO
};

// --- Sheet-backed reference data --------------------------------------------

export type SectionDef = {
  id: string;
  name: string;
  enabled: boolean;
  defaultVariant: Variant;
  order: number;
};

export type Brand = {
  brandName: string;
  industry: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
};

export type Product = {
  sku: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  msrp: number;
  wholesalePrice: number;
};

export type Category = {
  id: string;
  name: string;
  parent: string;
};

// An uploaded / linked image in the asset library.
export type ImageAsset = {
  id: string;
  name: string;
  url: string; // data URL (uploaded) or remote URL (linked)
  createdAt: string;
};

export type IndustryPreset = {
  industry: string;
  defaultHeroVariant: Variant;
  defaultCategoryVariant: Variant;
  defaultProductVariant: Variant;
  defaultPalette: string;
};

export type Palette = {
  id: string;
  name: string;
  blurb: string;
  colors: CustomColors;
  dark?: boolean;
};

export type FontPreset = {
  id: string;
  name: string;
  display: string; // headings
  body: string;
};
