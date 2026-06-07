# WizDesigner — Architecture Document

Technical reference: stack, structure, state, data, theming, routing, persistence, build, and environment notes.

---

## 1. Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) · React 19 · TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS `@import`/`@theme`, **no** `tailwind.config.ts`) + runtime `--sf-*` design tokens |
| Data source | Google Sheets via Apps Script web app (`fetch`), with in-code fallback |
| Design state | React Context + `useReducer` |
| Present state | React Context + `useReducer` (sessionStorage) |
| Persistence | `localStorage` + `sessionStorage` + Google Sheet |
| Bundler | **webpack** for `dev`/`build` (Turbopack disabled — see §9) |
| Images | plain `<img>` to remote/CDN/data URLs (no `next/image` domain config) |

## 2. High-level system

```
┌───────────────────────────── Browser ──────────────────────────────┐
│                                                                     │
│  /  (Designer)                         /present/*  (Present V2)     │
│  ┌───────────────────────────┐         ┌────────────────────────┐  │
│  │ DesignProvider (Context)  │         │ PresentStateProvider   │  │
│  │  ├ LeftPanel (Brand/Biz/  │         │  + PresentThemeRoot    │  │
│  │  │   Catalog/Images)      │         │  (applies --sf-* from  │  │
│  │  ├ StorefrontPreview      │         │   design state/brand)  │  │
│  │  │   (registry → sections)│         │  Header/Footer/...     │  │
│  │  ├ RightPanel (summary)   │         │  Home/PLP/PDP/Cart/    │  │
│  │  ├ Versions/Compare/Export│         │  Checkout/Account      │  │
│  │  └ ChatAssistant          │         └─────────┬──────────────┘  │
│  └────────────┬──────────────┘                   │                 │
│               │ reads/writes                      │ reads           │
│        ┌──────▼───────────────── lib ─────────────▼─────────┐       │
│        │ DesignContext · cssVars · themes · industries      │       │
│        │ brands · wizorder · exports · wizsite-spec         │       │
│        │ present/{dataLayer,filters,search,state,...}       │       │
│        │ SheetService · storage(local) · storage(session)   │       │
│        └──────┬─────────────────────────────────────────────┘       │
└───────────────┼─────────────────────────────────────────────────────┘
                │ fetch (no-auth)            │ localStorage / sessionStorage
        ┌───────▼────────┐          (design, versions, catalog, images, present)
        │ Google Apps    │
        │ Script web app │── Google Sheet tabs: Section Registry, Brands,
        └────────────────┘   Products, Categories, Industry Presets,
                             Design Decisions, Snapshots, Theme Tokens
```

## 3. Directory map

```
app/
  layout.tsx                 # root: Google Fonts <link> + <DesignProvider>
  page.tsx                   # DesignerShell (the 3-panel editor)
  present/                   # PRESENT MODE V2 (29 routes)
    layout.tsx               # PresentStateProvider + PresentThemeRoot + Toast + Activation
    page.tsx                 # homepage (spec-driven sections)
    login/ signup/ activation/
    category/[slug]/  collection/[slug]/  search/  product/[slug]/
    cart/  checkout/{shipping,payment,review}/  order-confirmation/
    account/{,orders,wishlists,invoices}/
    pages/{about,contact,faq,shipping-returns,terms,privacy,
           rep-locator,trade-shows,trade-program,virtual-showroom,dealer-locator}/

components/
  DesignerShell.tsx          # top bar + 3-panel layout + overlays
  LeftPanel.tsx              # tabbed: Brand / Business / Catalog / Images
  BrandManagement.tsx        # multi-brand: count, cards, switcher style, shared infra
  BusinessConfig.tsx         # WizOrder simulator toggles (Core/Advanced accordions)
  CatalogPanel.tsx ImagesPanel.tsx
  StorefrontPreview.tsx      # registry → section components + brand switcher strip
  VariantSwitcher.tsx RightPanel.tsx VersionBar.tsx VersionControl.tsx
  PersonaSwitcher.tsx CompareMode.tsx ExportSummary.tsx ExportScope.tsx
  ChatAssistant.tsx Modal.tsx AIPlaceholders.tsx
  sections/                  # 10 storefront sections (A/B/C/D) + _shared + registry
  present/                   # the shoppable storefront UI
    layout/ (Header, Footer, Breadcrumb, ToastManager, ActivationModal, SearchPanel, QuickViewModal, PresentThemeRoot)
    homepage/HomeSections.tsx
    plp/ (PLPProductCard, PLPProductGrid, PLPControls, PLPView)
    pdp/PDPView.tsx  cart/CartView.tsx  checkout/CheckoutProgressBar.tsx
    content/ (AuthScreen, ContentShell)  ui.tsx

lib/
  types.ts                   # DesignState, WizOrderSimulation, BrandEntry, Product, …
  DesignContext.tsx          # reducer + provider + persistence + boot
  cssVars.ts                 # DesignState → --sf-* CSS variables
  themes.ts industries.ts    # palettes/fonts/density + registry/presets/sample catalog
  brands.ts wizorder.ts      # multi-brand helpers + business defaults/personas/pricing
  exports.ts                 # summary + 4-section scope + WizOrder checklist
  SheetService.ts storage.ts # sheet IO + localStorage helpers
  wizsite-spec/              # WizSiteSpec V2: types, defaults, migrate, validate, index
  present/                   # presentState, presentReducer, usePresentState, dataLayer,
                             # filters, search, slugify, pricing, dummyData, toasts
docs/                        # PRD, Solution, Architecture, Features
BUILD_PROMPT.md CLAUDE.md
```

## 4. State management

**Design state** (`DesignState` in `lib/types.ts`) — flat, serializable: `brandName, logoUrl, industry, palette, customColors, font, density, logoStyle, variants{}, business (WizOrderSimulation), persona, brands[], activeBrandId, brandSwitcherStyle, mockIntegrations`. Managed by a `useReducer` in `DesignContext`. Initial state is **deterministic** (no localStorage) to avoid SSR hydration mismatch; persisted state is applied in a mount effect (`HYDRATE`). The active brand's identity mirrors the top-level fields (see `lib/brands.ts`) so adding multi-brand required no changes to the render pipeline.

**Present state** (`PresentState` in `lib/present/presentState.ts`) — `auth, cart{items,notes}, wishlists, search, activeFilters, activeSort, preferences, activeBrandId, toasts`. Separate provider/reducer, hydrated from and persisted to `sessionStorage`.

## 5. Theming

`storefrontVars(state)` (`lib/cssVars.ts`) returns a `CSSProperties` of `--sf-bg/surface/ink/brand/accent/muted/line/display/body/pad/...` from the active palette (or custom colors), font pairing, and density. Set on `.storefront` wrappers (editor preview, Present root). All section/store components style with `var(--sf-*)`. Chrome (panels, modals) uses a separate neutral `--chrome-*` system in `app/globals.css`.

## 6. Data layer & catalog

`lib/SheetService.ts` typed loaders (`loadSectionRegistry`, `loadProducts`, …) hit the Apps Script endpoint and **return null on any failure**; callers fall back to `lib/industries.ts` / `lib/themes.ts`. Catalog precedence at boot: **user-edited catalog (`localStorage`) → sheet → in-code default**. The Present data layer (`lib/present/dataLayer.ts`) exposes `loadDesignState()`, `getSpec()` (`= migrateV1ToV2`), `getPresentCatalog()`, and slug lookups.

## 7. Routing

- **Editor:** single route `/` (no multi-page routing — one screen).
- **Present:** `app/present/**`, 29 routes (static where possible; `[slug]` routes server-rendered on demand). The Present layout wraps everything with the shopping provider + theme root + global toast/activation modal.

## 8. Persistence keys

| Key | Store | Contents |
|---|---|---|
| `wizdesigner.state` | localStorage | full design state |
| `wizdesigner.versions` | localStorage | unlimited saved versions |
| `wizdesigner.catalog` | localStorage | user-edited products + categories |
| `wizdesigner.images` | localStorage | image asset library |
| `wizdesigner.sessionId` | localStorage | session UUID |
| `present_state` | sessionStorage | shopping state (cart/auth/…) |
| `present_orders` | sessionStorage | orders placed in a demo session |
| Sheet `Design Decisions` / `Snapshots` | Google Sheet | debounced design log / versions |

## 9. Build, run & environment notes

- `npm run dev` → `next dev --webpack` (port 3000). `npm run build` → `next build --webpack`. `npm start` → `next start`.
- **Webpack, not Turbopack:** Turbopack spawns a `node` PostCSS worker by bare name; in sandboxes without `node` on the worker's PATH it panics on `globals.css`. Webpack runs PostCSS in-process. The scripts bake in `--webpack`.
- **Node:** this environment has no system Node; a local Node 20 lives at `~/.local/node20` and is added to the shell PATH via the user profile. `gh` (GitHub CLI) is installed alongside it.
- **Dev gotcha:** newly-added dynamic routes can 404 on a long-running `next dev` until the server restarts (stale route manifest); a production build always has them.
- **Images:** remote/data URLs via plain `<img>` (with on-error fallback tiles), so no `next/image` remote-pattern config is needed.

## 10. Extension points

- **Real LLM:** replace the rule engine behind `interpret()` in `lib/assistant.ts` — UI unchanged.
- **Real validation:** swap `validateWizSiteSpec()` for a zod schema — same `{ok, errors}` contract.
- **Scraper:** a Next route handler + HTML parser that emits a `WizSiteSpecV2` draft (roadmap).
- **Panels → spec:** migrate panels to read/write `WizSiteSpecV2` directly via the `useWizSiteSpec` seam.
