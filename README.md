# WizDesigner

**A self-serve design-discovery + WizOrder-simulation tool for wholesale B2B e-commerce brands on WizShop.**

WizDesigner is a single-screen tool where a prospect, customer, CSM, or Implementation Manager (IM) can:

1. Pick an industry and load a full storefront preview in seconds
2. Switch every section between A/B/C/D layout variants
3. Apply branding — palette, fonts, density, logo, **multiple brands**
4. Simulate **WizOrder business rules** (pricing, MOQ, terms, shipping, ERP, AI) and preview them **as any customer persona**
5. Save unlimited versions, compare them side-by-side
6. Export a clean design summary **and an implementation-ready scope** (with a WizOrder configuration checklist) + the canonical **WizSiteSpec V2** JSON
7. Open a fully **shoppable Present-Mode storefront** (Home → PLP → PDP → Cart → Checkout → Account) to walk a buyer through the real experience

It is **not** a generic website builder. It is a **storefront designer + WizOrder business-configuration simulator + multi-brand manager + IM scope generator**.

> 📚 Full documentation lives in [`/docs`](./docs): [Features](./docs/FEATURES.md) · [PRD](./docs/PRD.md) · [Solution](./docs/SOLUTION.md) · [Architecture](./docs/ARCHITECTURE.md)

---

## Quick start

> Requires Node 20+. This environment ships a local Node at `~/.local/node20` already on the shell PATH.

```bash
git clone https://github.com/ansuman-sahoo-9/WizDesigner.git
cd WizDesigner
npm install
npm run dev
```

Open the printed URL:

- **Designer (editor):** http://localhost:3000
- **Present-Mode storefront:** http://localhost:3000/present

Production build:

```bash
npm run build && npm start
```

> The dev/build scripts use **webpack** (`next dev --webpack`) on purpose — Turbopack's PostCSS worker can fail to find `node` in some sandboxes. Use the npm scripts as-is.

The app runs entirely on **built-in fallback data** out of the box — no configuration required.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-config) + live `--sf-*` design tokens |
| Data | **Google Sheets only** via an Apps Script web app (no DB), with full offline fallback |
| Design state | React Context + `useReducer` |
| Present (shopping) state | React Context + `useReducer`, persisted to `sessionStorage` |
| Persistence | `localStorage` (design, versions, catalog, images) + Google Sheets (debounced) |

No Postgres/Mongo/Firebase, GraphQL, Redux, real LLM, or real ERP — by design (prototype/validation tool).

---

## Connecting the live Google Sheet (optional)

The tool works on fallback data; to make a Google Sheet the system of record:

1. Open the Sheet → **Extensions → Apps Script**, paste the script in [`BUILD_PROMPT.md`](./BUILD_PROMPT.md), deploy as a **Web app** (Execute as: Me, Access: Anyone).
2. Put the deployment URL in `.env.local`:
   ```
   NEXT_PUBLIC_SHEET_API=https://script.google.com/macros/s/XXXX/exec
   ```
3. Restart `npm run dev`. The top-bar badge flips from **Fallback data** → **Sheet live**.

---

## Project structure

```
app/
  page.tsx              # the 3-panel designer
  layout.tsx            # fonts + DesignProvider
  present/              # Present Mode V2 — 29-route shoppable storefront
components/
  sections/             # 10 storefront sections (A/B/C/D each)
  present/              # the shoppable storefront UI (layout/plp/pdp/cart/checkout/...)
  *.tsx                 # designer chrome (panels, switchers, modals, brand mgmt, assistant)
lib/
  DesignContext.tsx     # global design state
  wizsite-spec/         # WizSiteSpec V2 canonical schema + migration + validation
  present/              # Present-mode state, data layer, filters, search, dummy data
  themes / industries / cssVars / exports / brands / wizorder / SheetService …
docs/                   # PRD, Solution, Architecture, Features
```

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the full map.

---

## Status

Built and verified: the designer, WizOrder simulator + personas, multi-brand management, unlimited versions/compare, exports (incl. WizSiteSpec V2), catalog/image management, and the 29-route Present Mode V2 storefront. See [`docs/FEATURES.md`](./docs/FEATURES.md) for the complete, status-tagged list and what is intentionally mocked or not-yet-built.
