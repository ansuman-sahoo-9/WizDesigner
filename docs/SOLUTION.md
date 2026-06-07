# WizDesigner — Solution Document

How the product solves the problems in the [PRD](./PRD.md): the model, the key decisions, the data flow, and the trade-offs.

---

## 1. North star

> **WizDesigner = Storefront Designer + WizOrder Business-Config Simulator + Multi-Brand Manager + IM Scope Generator.**

A CSM configures the look *and the business rules*, previews them as any persona, and exports a blueprint — without ever touching WizOrder. This delivers ~90% of the perceived value of a real WizOrder-connected system within prototype constraints.

## 2. The layered model

```
LAYER 1 — BRAND        logo · fonts · colors · density · (multi-brand)
        ↓
LAYER 2 — STOREFRONT   header · hero · categories · featured · trade · testimonials
                       · about · PDP · cart · footer   (A/B/C/D variants each)
        ↓
LAYER 3 — BUSINESS     pricing · MOQ · terms · customer groups · shipping · workflow
        (WizOrder sim) · ERP · AI · external retail · marketing   (CSM toggles)
        ↓
PERSONAS               guest / dealer / distributor / retailer / international
        ↓
OUTPUT                 IM Scope (+ WizOrder checklist) · WizSiteSpec V2 JSON · Present mode
```

Everything is a **Decision** captured in one serializable state object, so a version/snapshot is just a capture of that object, and the export is a serialization of it.

## 3. Key design decisions

### 3.1 Live theming through CSS variables
The storefront is themed by `--sf-*` custom properties (`--sf-bg`, `--sf-brand`, `--sf-display`, `--sf-pad`, …) computed from state (`lib/cssVars.ts`) and set on the preview wrapper. Sections read `var(--sf-*)`, so palette/font/density/**brand** changes re-render instantly with zero per-section wiring. This mirrors how the reference WizShop demo themed itself and makes multi-brand switching a single variable swap.

### 3.2 Registry-driven storefront
A **Section Registry** (sheet-backed, with a code fallback) declares which sections render, in what order, and their default variant. The preview maps the registry to components. Adding/removing/reordering sections is a data edit, not a code change — this is what lets the tool cover every site's section mix.

### 3.3 Google Sheets as the system of record
No database. Reads/writes go through a no-auth Google Apps Script web-app endpoint (`lib/SheetService.ts`). Every reader degrades gracefully: missing URL or any error → in-code fallback data (`lib/industries.ts`, `lib/themes.ts`). This keeps setup near-zero and the tool always demoable, while still letting non-engineers edit the catalog/registry in a spreadsheet.

### 3.4 Two state machines
- **Design-time state** (`lib/DesignContext.tsx`) — the WizSiteSpec the IM is building. Persisted to `localStorage` (instant) + debounced to the sheet's `Design Decisions` tab.
- **Present (shopping) state** (`lib/present/usePresentState.ts`) — the simulated buyer's cart/auth/wishlist/filters, persisted to `sessionStorage`. Separate lifecycle, separate storage, so a demo session never pollutes the design.

### 3.5 Personas drive a pricing resolver
`priceView(product, { isLoggedIn, hidePrices, loginGated })` and per-persona tier factors centralize "what does this buyer see" — login-gated lock, tier price, MSRP, hidden. Sections call it; switching persona re-renders the whole store. This is the discovery superpower: "here's what your dealer sees vs a guest."

### 3.6 WizSiteSpec V2 — one canonical contract
`lib/wizsite-spec/` defines the full `WizSiteSpecV2` (meta, brand, multiBrand, theme, navigation, pages [PLP/PDP/cart/content], business, ai, infrastructure, imScope). `migrateV1ToV2()` derives it purely from the live design state; `validateWizSiteSpec()` checks it (dependency-free, zod-swappable). Panels write design state; the spec is derived and **exported** — the single source of truth that the IM scope and (future) WizOrder import read from, eliminating drift.

### 3.7 Multi-brand as a first-class dimension
Brands live in `state.brands[]` with an `activeBrandId`; the active brand's identity mirrors the top-level fields so the entire render pipeline is untouched (zero regression). Helpers (`lib/brands.ts`) resolve/commit/switch brands. The storefront switcher re-themes live; the spec records parent + children + overrides + switcher style + shared infrastructure.

### 3.8 Present mode is the storefront, run for real
Rather than fake screenshots, Present mode is an actual multi-page Next.js app (`app/present/**`, 29 routes) that reads the design via the same data layer and renders a working shopping flow with session-backed cart/checkout/account. It is the highest-fidelity discovery artifact.

## 4. Data flow

```
User edits panel ─▶ dispatch ─▶ DesignContext (reducer)
   │                               │
   │                               ├─▶ localStorage (instant)
   │                               ├─▶ Google Sheet "Design Decisions" (debounced 500ms)
   │                               └─▶ storefrontVars() ─▶ --sf-* ─▶ live preview
   │
Catalog tab ─▶ setCatalog ─▶ localStorage "catalog" (overrides sheet/fallback) ─▶ preview
Versions ─▶ localStorage "versions" + Sheet "Snapshots"
Export ─▶ migrateV1ToV2(state) ─▶ WizSiteSpec V2 (validated) + scope text/JSON

Present tab (new window) ─▶ reads localStorage design + catalog ─▶ getSpec()/getPresentCatalog()
   └─▶ PresentState (sessionStorage) for cart/auth/wishlist
```

## 5. What is real vs simulated

| Real | Simulated (intentional) |
|---|---|
| Live theming, variants, personas, multi-brand re-theming | AI search/recs/copy (hardcoded/templated) |
| Catalog CRUD + CSV import, image library | ERP/WizPay/integration "connections" |
| Versions, compare, exports, WizSiteSpec V2 | Real auth (UUID/session only) |
| Full Present shopping flow (cart/checkout/account session) | Payment processing, real freight rates |
| Sheets read/write + fallback | The 5-stage scraper (roadmap) |

## 6. Trade-offs

- **Sheets over a DB:** near-zero setup and spreadsheet-editable, at the cost of latency and no relational integrity — mitigated by treating the sheet as eventual persistence and operating from in-memory/localStorage.
- **Derived spec (read-only) in this phase:** panels still write the legacy design state; the V2 spec is derived/exported. This was deliberate to ship multi-brand and Present mode without a risky big-bang state rewrite. Panels can migrate onto the spec incrementally.
- **Consolidated Present components:** several "one-file-per-component" spec steps were delivered as dispatcher modules (HomeSections, PLPControls, PDPView, CartView) — identical behavior, far fewer files, faster to ship; trivially splittable later.

## 7. Why this is the right shape
Tightening everything around a single WizSiteSpec (write from panels, read by preview, serialize to export) is the highest-ROI structural choice: it kills handoff drift, makes multi-brand a field-level concern, and turns "configure it later in WizOrder" ambiguity into an explicit, exportable checklist.
