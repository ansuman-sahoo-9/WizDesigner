@AGENTS.md

# WizDesigner — project memory

Self-serve design-discovery tool for wholesale B2B storefronts on WizShop. One
screen: pick an industry, configure each storefront section's A/B/C/D variant,
apply branding (palette/font/density/logo), save snapshots, compare, and export
a summary + implementation scope. It is a high-fidelity **prototype** to validate
the concept — not production architecture.

## Stack (as built)
- **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4.** Tailwind v4
  is CSS-config (`@import "tailwindcss"` + `@theme`); there is **no
  `tailwind.config.ts`**.
- **Database: Google Sheets only**, via an Apps Script web-app endpoint. No
  Postgres/Firebase/etc. Set `NEXT_PUBLIC_SHEET_API` in `.env.local`. With it
  empty, the app runs entirely on fallback data — by design.
- **State:** React Context + `useReducer` in `lib/DesignContext.tsx`. No Redux/Zustand.
- **Auth:** none — a UUID in `localStorage` is the session.

## How theming works
The storefront is themed live by CSS custom properties (`--sf-bg`, `--sf-brand`,
`--sf-display`, `--sf-pad`, …) set on the preview wrapper from `lib/cssVars.ts`.
Sections read `var(--sf-*)`, so palette/font/density changes re-render with zero
per-section wiring. Chrome (panels/top bar/modals) uses its own `--chrome-*`
tokens in `app/globals.css`.

## Layer 3 — WizOrder simulation (the "Simulator" half of the product)
`state.business` ([WizOrderSimulation](lib/types.ts)) holds the business rules a CSM
simulates; defaults + the pricing resolver live in [lib/wizorder.ts](lib/wizorder.ts).
- **Business Config tab** ([BusinessConfig.tsx](components/BusinessConfig.tsx)) — toggle
  groups (pricing, catalog, accounts, payments, shipping, workflow, AI, retail,
  marketing, quotes). The left panel is now tabbed (Brand · Business · Catalog/Images
  stubs) in [LeftPanel.tsx](components/LeftPanel.tsx).
- **Preview Personas** ([PersonaSwitcher.tsx](components/PersonaSwitcher.tsx)) — "Preview as"
  guest/dealer/distributor/retailer/international. `priceFor(product, persona, business)`
  decides login-gating vs tier price; sections (Featured, PDP, Cart, Header) read
  `business` + `persona` from `SectionProps`. Available personas derive from
  `business.customerAccounts.customerGroups`.
- **IM Scope** ([lib/exports.ts](lib/exports.ts)) is now a 4-section blueprint: Brand ·
  Storefront · Catalog · **WizOrder Configuration Checklist** (✅/☐ generated from the
  toggles), plus implied integrations + complexity/ACV estimate.
- `normalizeBusiness()` backfills missing fields so older snapshots/localStorage stay valid;
  `clampPersona()` keeps the active persona valid when groups change.

## Wiz Assistant (chat copilot, top-right)
[ChatAssistant.tsx](components/ChatAssistant.tsx) + the pure intent engine
[lib/assistant.ts](lib/assistant.ts). Rule-based (no LLM) but it reads live state and
**executes** actions via DesignContext: set section variants, switch palette/font/persona,
save/load versions, toggle business rules, open compare/present/exports, and answer
questions ("what variants am I using?", "summarize my scope"). `interpret(text, ctx)`
is swappable for a real model later; the component maps the returned action to context
calls. Launcher lives in the top bar; panel floats top-right.

## Versions & Present
- **Unlimited versions** (not the old 3 snapshot slots): `state`-derived `Version[]`
  in [DesignContext](lib/DesignContext.tsx) (`saveVersion/loadVersion/deleteVersion/renameVersion`),
  persisted to `localStorage` (`wizdesigner.versions`) + the `Snapshots` sheet tab.
  UI: [VersionControl.tsx](components/VersionControl.tsx) in the right rail (replaced the
  old Integrations panel) + a quick [VersionBar.tsx](components/VersionBar.tsx) in the top bar.
  [CompareMode](components/CompareMode.tsx) picks any two versions.
- **Present opens a new browser tab** → the [app/present/page.tsx](app/present/page.tsx)
  route, which reads the design from `localStorage` and live-syncs via `storage` events
  (chrome-free). DesignerShell uses `window.open('/present','_blank')`; there is no longer
  an in-app present overlay.

## UX polish (from product review)
- `<body suppressHydrationWarning>` ([app/layout.tsx](app/layout.tsx)) — stops extension-injected
  attribute (`cz-shortcut-listen`) hydration warnings.
- **Logo upload** in the Brand panel (data-URL → `state.logoUrl`); [Logo](components/sections/_shared.tsx)
  renders the image when set, else the text wordmark/monogram/boxed.
- **Canvas toolbar** ([DesignerShell](components/DesignerShell.tsx)): prominent persona strip +
  desktop/tablet/mobile viewport toggle (constrains preview max-width).
- **ProductImage** has an on-error fallback tile (no more raw broken-image alt text).
- **Business tab**: collapsible Core/Advanced accordions, Pro/Soon badges, Threshold explanation,
  multiline announcement field, and a "Built on WizShop" footer toggle (`marketing.poweredByBadge`).
- **Version Control**: smart suggested name (`Palette · Persona · vN`) + "unsaved changes" indicator.
- Export buttons have icons + tooltips; Density has a live mini-preview; 16 industries; Catalog/Images tabs show a "Soon" pill.
- Still open from the review: variant-thumbnail hover previews, click-to-edit-on-canvas, onboarding wizard, empty-cart preview.

## Catalog & Images tabs (left panel — both live, not stubs)
- **Catalog** ([CatalogPanel.tsx](components/CatalogPanel.tsx)) — catalog-intelligence stats
  (products, categories, avg margin, missing images, dupe SKUs, complexity), **CSV import/export +
  template** ([lib/catalog.ts](lib/catalog.ts), dependency-free parser), and inline product CRUD.
  Edits persist to `localStorage` (`wizdesigner.catalog`) via `setCatalog`, override sheet/fallback,
  and drive the storefront live (PLP/PDP/Featured/Categories read context products).
- **Images** ([ImagesPanel.tsx](components/ImagesPanel.tsx)) — asset library: upload (data URL) or
  link by URL, use-as-logo, copy-URL, rename, delete. Persists to `wizdesigner.images`
  (best-effort; quota failures keep them in-session). Catalog's image field can pick from the library.
- `ProductImage` renders its fallback tile when `src` is empty/broken (no `<img src="">` warnings).
- Context: `setCatalog/resetCatalog`, `addImage/removeImage/renameImage`, `images`, `catalogCustom`.

## Present Mode V2 (in progress — 129-step multi-page shoppable storefront)
Building a full simulated buyer experience under `app/present/` + `lib/present/`, executed
phase by phase (P1 foundation → P2 routing → P3 layout → P4 homepage → P5 PLP → P6 PDP →
P7 cart → P8 checkout → P9 account…). **Adaptations to this repo:** the spec's
`localStorage['wizdesigner_state']` is our `wizdesigner.state`; the rich DesignState it assumes
is our **WizSiteSpec V2**, so [lib/present/dataLayer.ts](lib/present/dataLayer.ts) reads
`loadState()` + `migrateV1ToV2()` (`getSpec()`) + the real catalog (`getPresentCatalog()`).
Present runtime state lives in **sessionStorage** (`present_state`), separate from design state.
Our `Product` is lean (no attributes/inventory/dimensions) so filters/PDP fields degrade gracefully.
**⚠ Phase 2 will replace the current single-page `app/present/page.tsx`** (the chrome-free Present
tab) with the full multi-page app; the Present button will then open the shoppable experience.

**ALL PHASES DONE (Steps 1–129).** Full multi-page shoppable storefront under `app/present/`
(29 routes) + `components/present/` + `lib/present/`.
- P1 foundation: state/reducer/context (sessionStorage `present_state`), dataLayer, filters, search, dummyData, toasts.
- P2 routing: `app/present/layout.tsx` (PresentStateProvider + `PresentThemeRoot` applies brand `--sf-*` + ToastManager + ActivationModal) + all route stubs.
- P3 global layout: `PresentHeader` (announcement, brand switcher, nav incl. mega-menu, search/account/cart, mobile drawer), `PresentFooter`, `PresentBreadcrumb`, `ToastManager`, `ActivationModal`, `SearchPanel`, `QuickViewModal`.
- P4 homepage: `HomeSections.tsx` dispatcher (hero/category/featured/tradeCTA/valuePillars/tradeShows/testimonials/newsletter/editorial…) driven by `getSpec().brand.homepage.sections`.
- P5 PLP: `PLPProductCard`/`PLPProductGrid`/`PLPControls` (filter bar+drawer, sort, pagination, banner) + shared `PLPView` → category / collection / search pages.
- P6 PDP: `PDPView` (gallery+lightbox, login-gated price, MOQ qty, accordions, related) + product page.
- P7 cart: `CartView` (line items, notes, add-products modal, free-ship bar, totals) + cart page.
- P8 checkout: `CheckoutProgressBar` + layout + shipping/payment/review + order-confirmation (writes session order).
- P9 account: layout (tabs) + profile (hide-price/PDF prefs) / orders (re-order) / wishlists / invoices.
- Auth: login/signup/activation (`AuthScreen`). Content: about/contact/faq/shipping-returns/terms/privacy/rep-locator/trade-shows/trade-program/virtual-showroom/dealer-locator (`ContentShell`).
**Implementation note:** several spec steps that called for one-file-per-component were consolidated into
dispatcher modules (HomeSections, PLPControls, PDPView, CartView) for delivery — same behavior, fewer files.
Type-clean + production build (29 routes) passes; flow verified live (home→PLP→PDP→cart→checkout).
**⚠ Dev gotcha:** newly-added dynamic routes can 404 on a long-running `next dev` until the server is
restarted (stale route manifest) — the production build always has them.

## Phase 3 — WizSiteSpec V2 program (in progress)
Executing the 8-sprint plan that turns the app into: Storefront Designer → WizOrder
Simulator → Multi-Brand Manager → IM Scope Generator. Build order: 1) schema, 2) scraper,
3) business config, 4) multi-brand, 5) component registry, 6) state-driven preview,
7) Sheets engine, 8) IM Scope v2.

**Sprint 4 (Multi-Brand) — DONE (full Brand Management).** State carries `brands: BrandEntry[]`
(each: name, palette, font, logoStyle, logoUrl, **heroVariant**) + `activeBrandId` +
`brandSwitcherStyle`. The active brand mirrors the top-level fields (incl. `variants.hero`) so the
render pipeline is untouched. Helpers in [lib/brands.ts](lib/brands.ts): `resolveBrands`,
`withActiveBrand`, `resizeBrands`, `updateBrandIn`, `reorderBrand`, `removeBrandFrom`.
[BrandManagement.tsx](components/BrandManagement.tsx) in the Brand tab: count pills (1–6+),
per-brand **cards** (name, logo style, hero style, palette, font, logo upload, reorder ▲▼, remove,
set-active), **brand-switcher style** selector (pill / underline tabs / dropdown / minimal), and
shared-infra (🔒 catalog/auth/cart/checkout) indicators. The storefront **switcher strip**
([StorefrontPreview](components/StorefrontPreview.tsx)) renders in the chosen style and re-themes
live on switch (active in the Present tab too). Surfaced in the Decision Summary, the
Export Scope **MULTI-BRAND CONFIGURATION** section, and `migrateV1ToV2().multiBrand`.
LogoStyle gained `icon_wordmark` + `stacked`.

**Sprint 1 — DONE.** Canonical schema in [lib/wizsite-spec/](lib/wizsite-spec/):
`types.ts` (full `WizSiteSpecV2` tree), `defaults.ts` (`defaultWizSiteSpec`),
`migrate.ts` (`migrateV1ToV2` — pure, maps the live DesignState→V2), `validate.ts`
(dependency-free `validateWizSiteSpec`, swappable for zod). [lib/useWizSiteSpec.ts](lib/useWizSiteSpec.ts)
is the read-only adapter (app still runs on DesignContext; panels migrate onto the spec
incrementally). Export Scope modal has a **SPEC V2** tab (validated + downloadable) — verified
the live state produces a valid 12 KB V2 spec. Schema is locked; later sprints extend it.

## Not yet built (from the v2 architecture doc)
The 5-stage site scraper, version analytics (stability scores), .xlsx import (CSV is supported today),
approval workflow, and the expanded 19-section registry. Layers 1–2 + Layer 3 (Business
Config + Personas) + unlimited version history are done.

## Section Registry is the source of truth
`StorefrontPreview` renders `sections.filter(s => s.enabled)` ordered by `order`,
each at `state.variants[id]`. The registry loads from the `Section Registry`
sheet tab on boot, falling back to `SECTION_REGISTRY` in `lib/industries.ts`.
Add/remove/reorder sections in the sheet — no code change. `components/sections/registry.tsx`
maps a section id to its component; unknown ids render nothing (harmless).

## Persistence
1. React state updates instantly. 2. `localStorage` write immediately. 3. Debounced
500ms diff-based append to the `Design Decisions` sheet tab. Boot order: hydrate
localStorage → load sheet (registry first) → fall back to localStorage if the
sheet is unavailable. Initial reducer state is deterministic (no localStorage) to
avoid SSR hydration mismatch; persisted state is applied in a mount effect (`HYDRATE`).

## Layout of what matters
- `lib/` — `types`, `themes` (palettes/fonts/density), `industries` (fallback
  registry + presets + products/categories), `SheetService`, `DesignContext`,
  `cssVars`, `exports` (summary + scope logic), `download`, `storage`, `format`.
- `components/sections/*` — the 10 sections (each takes `variant` A–D; About is
  single-variant). `_shared.tsx` has Logo/Eyebrow/SfButton/ProductImage.
- `components/` — `DesignerShell` (top bar + 3 panels), `LeftPanel`, `RightPanel`,
  `StorefrontPreview`, `VariantSwitcher`, `SnapshotBar`, `PresentMode`,
  `CompareMode`, `ExportSummary`, `ExportScope`, `MockIntegrations`, `AIPlaceholders`.
- Mock integrations + all AI panels are **mocked** (hardcoded) for MVP.

## ⚠ Environment gotchas (this machine)
Node was **not installed**; a local toolchain lives at `~/.local/node20`. The
harness shell does **not** pick it up from profiles, so prefix Node commands:
`export PATH="$HOME/.local/node20/bin:$PATH"` before `node`/`npm`/`npx`.

**Dev server must use webpack, not Turbopack.** Turbopack spawns a `node`
PostCSS worker by bare name and the server's PATH has no `node`, so it panics on
`globals.css`. The launch config (in the **Downloads-root** `.claude/launch.json`,
not the project's) runs `next dev --webpack` via the absolute node binary. Same
for builds: `next build --webpack`.

## To go live on the sheet
Deploy the Apps Script from `BUILD_PROMPT.md` (Sheet → Extensions → Apps Script →
Deploy → Web app → Execute as Me → Anyone), paste the URL into `.env.local` as
`NEXT_PUBLIC_SHEET_API`, restart dev. The top-bar badge flips to "Sheet live".
