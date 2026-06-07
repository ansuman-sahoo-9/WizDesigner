// WizSiteSpec V2 — the canonical, single source of truth for a WizDesigner site.
// Every panel writes to it, the preview reads from it, the IM Scope export
// serializes it. Built additively in Sprint 1: the live app still runs on the
// existing DesignState; `migrateV1ToV2` derives a V2 spec from it, and panels
// will move onto it incrementally in later sprints.

export type IndustryType = string;

export type ErpType =
  | 'netsuite' | 'quickbooks' | 'sap_b1' | 'dynamics' | 'acumatica'
  | 'shopify' | 'bigcommerce' | 'custom' | 'none';

// ─── META ───
export interface SiteMeta {
  siteId: string;
  customerName: string;
  erpType: ErpType;
  industry: IndustryType;
  createdAt: string;
  updatedAt: string;
  schemaVersion: 'v2';
  wizshopUrl?: string;
}

// ─── THEME ───
export interface PaletteConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}
export interface TypographyConfig {
  headingFont: string;
  bodyFont: string;
  scale: 'compact' | 'default' | 'large';
}
export interface ThemeConfig {
  palette: PaletteConfig;
  typography: TypographyConfig;
  density: 'compact' | 'comfortable' | 'spacious';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadows: 'none' | 'subtle' | 'medium' | 'strong';
}

// ─── BRAND ───
export interface LogoConfig {
  imageUrl: string;
  subtitleText?: string;
  subtitleFont?: string;
  subtitleColor?: string;
  layout: 'logo_only' | 'stacked_with_subtitle' | 'inline_with_subtitle';
  parentBrandText?: string;
  parentBrandPosition?: 'above' | 'below' | 'inline';
  style: 'wordmark' | 'monogram' | 'icon_with_wordmark';
}

// ─── NAVIGATION ───
export interface AnnouncementBarConfig {
  enabled: boolean;
  text: string;
  bgColor?: string;
  textColor?: string;
  mode: 'static' | 'dynamic_erp' | 'rotating';
  rotatingMessages?: string[];
}
export interface UtilityLink { label: string; href: string; }
export interface MegaMenuConfig {
  columns: { heading?: string; links: { label: string; href: string }[] }[];
  featuredCards?: { image: string; headline: string; ctaLabel: string; ctaHref: string }[];
}
export interface NavItem {
  label: string;
  href?: string;
  badge?: string;
  type: 'link' | 'mega_menu' | 'dropdown';
  megaMenu?: MegaMenuConfig;
  dropdownItems?: { label: string; href: string }[];
}
export interface SearchConfig {
  enabled: boolean;
  scopes: ('all' | 'sku' | 'name' | 'attributes' | 'images')[];
  visualSearch: boolean;
  placeholder: string;
  panelPosition: 'slide_right' | 'overlay_center' | 'expand_header';
}
export interface BrandSwitcherConfig {
  enabled: boolean;
  position: 'top_left' | 'top_center' | 'header_integrated';
  style: 'outlined_pill' | 'tab_underline' | 'dropdown';
  brands: { label: string; href: string; brandId: string }[];
}
export interface HeaderConfig {
  authStyle: 'icon' | 'text_link';
  signInLabel: string;
  registerLabel: string;
  unauthCTAItem?: { label: string; href: string };
  utilityLinks: UtilityLink[];
  brandSwitcher?: BrandSwitcherConfig;
  search: SearchConfig;
  showWishlistIcon: boolean;
  cartBadgeStyle: 'count' | 'dot' | 'none';
  accountDropdownItems: { label: string; href: string }[];
  guestNavItems: NavItem[];
  authNavItems: NavItem[];
}
export interface NavigationConfig {
  announcementBar: AnnouncementBarConfig;
  header: HeaderConfig;
  breadcrumb: { enabled: boolean };
}

// ─── HOMEPAGE ───
export type HomepageSectionType =
  | 'hero' | 'categoryTileGrid' | 'editorialBanner' | 'tabbedShop'
  | 'featuredCollection' | 'valuePillars' | 'pressLogoCarousel'
  | 'tradeShowGrid' | 'tradeAccountCTA' | 'virtualShowroom'
  | 'dealerLocator' | 'testimonials' | 'newsletter' | 'customHtml';
export interface HomepageSection {
  id: string;
  type: HomepageSectionType;
  enabled: boolean;
  variant: 'A' | 'B' | 'C' | 'D';
  order: number;
  config: Record<string, unknown>;
}
export interface HomepageConfig {
  sections: HomepageSection[];
}
export interface FooterConfig {
  variant: 'A' | 'B' | 'C' | 'D';
  showPoweredBy: boolean;
}

// ─── PLP ───
export type SortOption =
  | 'featured' | 'new_arrivals' | 'price_asc' | 'price_desc'
  | 'name_az' | 'name_za' | 'sku_asc' | 'sku_desc';
export interface CollectionBannerConfig {
  enabled: boolean;
  variant: 'full_bleed_image' | 'color_block' | 'editorial_split';
}
export interface FilterDefinition {
  id: string;
  label: string;
  type: 'attribute' | 'availability' | 'collection' | 'category' | 'price_range' | 'inventory' | 'pattern' | 'material' | 'custom';
  attributeKey?: string;
  uiType: 'dropdown_pill' | 'checkbox_panel' | 'color_swatch' | 'size_button' | 'range_slider';
  defaultOpen: boolean;
}
export interface FilterBarConfig {
  filters: FilterDefinition[];
  maxInlinePills: number;
  overflowDrawer: boolean;
}
export interface ProductCardConfig {
  showSKU: boolean;
  showMSRP: boolean;
  showOptionsCount: boolean;
  showBadges: boolean;
  showWishlistIcon: boolean;
  showCategoryTag: boolean;
  guestPricingBehavior: 'hide' | 'show_msrp' | 'show_range' | 'login_to_see';
  imageAspectRatio: '1:1' | '3:4' | '4:3' | '4:5' | 'auto';
  hoverAction: 'quick_view' | 'view_similar' | 'none';
}
export interface PLPConfig {
  collectionBanner: CollectionBannerConfig;
  categoryDescription: { enabled: boolean };
  filters: FilterBarConfig;
  productCard: ProductCardConfig;
  grid: { columns: 2 | 3 | 4 };
  pagination: { mode: 'paginated' | 'infinite_scroll' | 'load_more'; perPage: number };
  defaultSort: SortOption;
  allowedSorts: SortOption[];
}

// ─── PDP ───
export interface GalleryConfig {
  mode: 'single' | 'left_sidebar' | 'bottom_row' | 'right_sidebar' | 'grid' | 'filmstrip';
  showFullscreenButton: boolean;
  showZoom: boolean;
  thumbnailCount: number;
}
export interface PDPPricingConfig {
  showWholesalePrice: boolean;
  showMSRP: boolean;
  msrpLabel: string;
  showTierTable: boolean;
  loginGated: boolean;
  loginGatedLabel: string;
  unitPricing: boolean;
  casePricing: boolean;
}
export interface VariantSelectorConfig {
  style: 'pill' | 'image_swatch' | 'color_dot' | 'dropdown' | 'hybrid';
}
export interface InventoryConfig {
  displayMode: 'hidden' | 'count' | 'status_only';
  states: {
    inStock: { label: string };
    lowStock: { label: string; threshold: number };
    outOfStock: { label: string; showAddToCart: boolean };
    preorder: { label: string; showNextAvailableDate: boolean };
    discontinued: { label: string };
  };
}
export interface DownloadButtonConfig {
  enabled: boolean;
  label: string;
  type: 'product_pdf' | 'image_pack' | 'spec_sheet' | 'all';
  position: 'top_right' | 'below_price' | 'in_actions';
}
export interface PDPFieldsConfig {
  showUPC: boolean;
  upcLabel: string;
  showUnitType: boolean;
  unitType: 'each' | 'pair' | 'set_of_2' | 'case_of_6' | 'dozen' | 'custom';
  unitTypeLabel?: string;
  showMaterialIcons: boolean;
  attributeIconSet?: { attribute: string; icon: string }[];
}
export interface AccordionConfig {
  id: string;
  label: string;
  type: 'details_care' | 'dimensions' | 'materials' | 'specifications' | 'shipping' | 'custom';
  defaultOpen: boolean;
  fields?: { key: string; label: string }[];
}
export interface RelatedProductsConfig {
  enabled: boolean;
  label: string;
  source: 'ai_recommendation' | 'same_collection' | 'manual';
  layout: 'horizontal_scroll' | 'grid_2col' | 'grid_4col';
  maxCount: number;
}
export interface PDPConfig {
  gallery: GalleryConfig;
  pricing: PDPPricingConfig;
  variantSelector: VariantSelectorConfig;
  inventory: InventoryConfig;
  downloadButton: DownloadButtonConfig;
  fields: PDPFieldsConfig;
  accordions: AccordionConfig[];
  relatedProducts: RelatedProductsConfig;
}

// ─── CART ───
export interface CartConfig {
  showDownloadButton: boolean;
  showItemNotes: boolean;
  showViewSimilar: boolean;
  showVariantSwitcher: boolean;
  allowInCartProductSearch: boolean;
  showFreeShippingProgress: boolean;
  freeShippingThreshold?: number;
  moqEnforcement: boolean;
  casePackRules: boolean;
}

export interface PagesConfig {
  plp: PLPConfig;
  pdp: PDPConfig;
  cart: CartConfig;
  contentPages: ContentPage[];
}
export interface ContentPage {
  type: 'rep_locator' | 'trade_show_grid' | 'designer_trade_program' | 'virtual_showroom' | 'dealer_locator' | 'activation_landing';
  enabled: boolean;
  headline?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

// ─── BUSINESS CONFIG (WizOrder Simulator) ───
export interface PricingConfig {
  strategy: 'single_price' | 'tiered' | 'customer_group' | 'price_list';
  loginGated: boolean;
  showMSRP: boolean;
  msrpLabel: string;
  tiers?: { label: string; discount: number }[];
}
export interface CustomerGroupConfig {
  id: string;
  label: string;
  priceTier?: string;
  paymentTerms?: string;
  badge?: string;
}
export interface PaymentTermsConfig {
  net30: boolean; net60: boolean; net90: boolean; prepaid: boolean;
  creditCard: boolean; ach: boolean;
}
export interface ShippingConfig {
  flatRate: boolean;
  flatRateAmount?: number;
  freeShipping: boolean;
  freeShippingThreshold?: number;
  carrierCalculated: boolean;
  freight: boolean;
  pickup: boolean;
  multiLocation: boolean;
}
export interface ApprovalWorkflowConfig {
  type: 'auto' | 'manual' | 'threshold';
  threshold?: number;
}
export interface MOQConfig {
  enabled: boolean;
  default: number;
  enforceOnCart: boolean;
  warningMessage: string;
}
export interface CasePackConfig {
  enabled: boolean;
  snapToMultiple: boolean;
  showCasePackLabel: boolean;
  defaultSize: number;
}
export interface ERPConfig {
  type: ErpType;
  syncInventory: boolean;
  syncPricing: boolean;
  syncOrders: boolean;
}
export interface BusinessConfig {
  pricing: PricingConfig;
  customerGroups: CustomerGroupConfig[];
  paymentTerms: PaymentTermsConfig;
  shipping: ShippingConfig;
  approvalWorkflow: ApprovalWorkflowConfig;
  moq: MOQConfig;
  casePacks: CasePackConfig;
  erpIntegration: ERPConfig;
}

// ─── AI ───
export interface AIConfig {
  semanticSearch: boolean;
  visualSearch: boolean;
  similarProducts: boolean;
  cartRecommendations: boolean;
  copyGeneration: boolean;
  variantRecommender: boolean;
}

// ─── INFRASTRUCTURE ───
export interface ActivationModalConfig {
  enabled: boolean;
  headline: string;
  body: string;
  ctaLabel: string;
  triggerBehavior: 'on_page_load' | 'after_delay' | 'on_exit_intent';
  triggerDelay?: number;
}
export interface ActivationFlowConfig {
  enabled: boolean;
  headline: string;
  steps: { label: string; fieldType: 'text' | 'email' | 'phone' | 'select' | 'file' }[];
}
export interface InfrastructureConfig {
  liveChat: { enabled: boolean; provider: 'intercom' | 'zendesk' | 'hubspot' | 'crisp' | 'custom'; position: 'bottom_right' | 'bottom_left' };
  activationModal: ActivationModalConfig;
  activationFlow: ActivationFlowConfig;
  errorPages: { custom404: boolean; customMaintenance: boolean };
}

// ─── MULTI-BRAND ───
export interface BrandOverrides {
  logo?: LogoConfig;
  theme?: Partial<ThemeConfig>;
  homepage?: Partial<HomepageConfig>;
  navigation?: Partial<NavigationConfig>;
  footer?: Partial<FooterConfig>;
  categories?: string[];
  collections?: string[];
}
export interface ChildBrandConfig {
  id: string;
  label: string;
  slug: string;
  inheritsFrom: string;
  overrides: BrandOverrides;
}
export interface MultiBrandConfig {
  enabled: boolean;
  parentBrandId: string;
  sharedAuth: boolean;
  sharedCart: boolean;
  sharedCatalog: boolean;
  switcher: BrandSwitcherConfig;
  brands: ChildBrandConfig[];
}

export interface BrandConfig {
  id: string;
  name: string;
  logo: LogoConfig;
  theme: ThemeConfig;
  navigation: NavigationConfig;
  homepage: HomepageConfig;
  footer: FooterConfig;
}

// ─── IM SCOPE ───
export interface IMScopeConfig {
  projectName: string;
  generatedAt: string;
  estimatedComplexity: 'low' | 'medium' | 'high' | 'enterprise';
  estimatedDaysToLaunch: number;
}

// ─── ROOT ───
export interface WizSiteSpecV2 {
  meta: SiteMeta;
  brand: BrandConfig;
  multiBrand: MultiBrandConfig;
  theme: ThemeConfig;
  navigation: NavigationConfig;
  pages: PagesConfig;
  business: BusinessConfig;
  ai: AIConfig;
  infrastructure: InfrastructureConfig;
  imScope: IMScopeConfig;
}
