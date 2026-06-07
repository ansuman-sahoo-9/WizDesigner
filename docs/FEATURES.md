# WizDesigner — Feature Inventory

Status legend: ✅ Done & verified · 🟡 Mocked (intentional for MVP) · ⛔ Not yet built

---

## 1. Designer shell (3-panel app)
| Feature | Status | Notes |
|---|---|---|
| Top bar: logo, sheet-status badge, persona switch, version bar, reset, present | ✅ | "Fallback data" vs "Sheet live" badge |
| Left panel — tabbed: **Brand · Business · Catalog · Images** | ✅ | All four tabs live |
| Center — live storefront preview, registry-driven | ✅ | Renders only enabled sections, in order |
| Right panel — Decision Summary (brand, palette, font, persona, sections, brands) | ✅ | Updates in real time |
| Canvas toolbar — persona strip + desktop/tablet/mobile viewport toggle | ✅ | Constrains preview width |

## 2. Brand & theme (Layer 1)
| Feature | Status |
|---|---|
| Brand name, logo upload (data URL), logo styles (wordmark/monogram/boxed/icon+wordmark/stacked) | ✅ |
| 6 palettes + custom 5-color picker | ✅ |
| 6 font pairings (Google Fonts) | ✅ |
| Density (tight/comfortable/spacious) with live mini-preview | ✅ |
| 16 industry presets (apply hero/category/product variants + palette) | ✅ |
| Live theming via `--sf-*` CSS variables | ✅ |

## 3. Storefront sections (Layer 2)
10 sections, each with 4 variants (About is single-variant): **header, hero, categories, featured, trade, testimonials, about, pdp, cart, footer**.
| Feature | Status |
|---|---|
| A/B/C/D variant switcher per section (instant) | ✅ |
| Section Registry drives what renders + order (sheet-editable, no code change) | ✅ |
| Broken/empty image fallback tiles | ✅ |

## 4. WizOrder Business Simulator (Layer 3)
| Group | Status |
|---|---|
| Pricing (login-gated, customer-specific, volume/tier, MAP, multi-currency) | ✅ |
| Catalog rules (MOQ, case packs, custom modifiers, ETA, best-seller tagging) | ✅ |
| Customer accounts (lead approval, customer groups, dealer login, rep, credit) | ✅ |
| Payments & terms (Net-30/60/90, CC, card-on-file, ACH, surcharge, partial) | ✅ |
| Shipping (flat, free threshold, carrier-calc, freight, pickup, multi-location) | ✅ |
| Order workflow (auto/manual/threshold approval, ERP type — 9 options) | ✅ |
| AI features (semantic/visual search, similar products, recs, cart-abandonment) | ✅ / 🟡 | toggles drive preview; advanced ones flagged "Pro" |
| External retail (Amazon/Walmart links, retail locator), Marketing, Quotes/Account | ✅ |
| Collapsible Core/Advanced accordions, Pro/Soon badges, inline explanations | ✅ |

## 5. Preview Personas
| Feature | Status |
|---|---|
| "Preview as" Guest / Dealer / Distributor / Retailer / International | ✅ |
| Persona drives login-gating, tier pricing, payment terms across the storefront | ✅ |
| Persona strip above the canvas + top-bar dropdown | ✅ |

## 6. Multi-Brand Management (Sprint-4 engine)
| Feature | Status |
|---|---|
| Brand count selector (1–6+) | ✅ |
| Per-brand cards: name, logo style, **hero style**, palette, font, logo upload, reorder, remove | ✅ |
| Active-brand selection re-themes the whole storefront live | ✅ |
| Storefront brand-switcher strip, with selectable **switcher styles** (pill/tabs/dropdown/minimal) | ✅ |
| Shared-infrastructure indicators (catalog/auth/cart/checkout) | ✅ |
| Reflected in Decision Summary, Export Scope, and WizSiteSpec V2 | ✅ |

## 7. Catalog & Images
| Feature | Status |
|---|---|
| Catalog intelligence (products, categories, avg margin, missing images, dupe SKUs, complexity) | ✅ |
| CSV import / export / template (dependency-free parser) | ✅ |
| Inline product CRUD; image-library picker for product images | ✅ |
| Image library: upload (data URL) or link-by-URL, use-as-logo, copy-URL, rename, delete | ✅ |
| Catalog persists + overrides sheet/fallback + drives the live preview | ✅ |
| Native **.xlsx** import | ⛔ | CSV only today (SheetJS would add it) |

## 8. Versions, Compare, Present, Export
| Feature | Status |
|---|---|
| **Unlimited** versions (save/load/rename/delete), smart names, "unsaved changes" nudge | ✅ |
| Compare any two versions side-by-side (synced scroll, commit a side) | ✅ |
| Present opens in a new tab; live-syncs from `localStorage` | ✅ |
| Export Summary (.txt) | ✅ |
| Export Scope — 4-section IM blueprint incl. **WizOrder configuration checklist** (.txt/.json) | ✅ |
| Export **WizSiteSpec V2** JSON (validated) | ✅ |

## 9. Wiz Assistant (chat copilot)
| Feature | Status |
|---|---|
| Top-right chat that reads live state and **executes** actions | ✅ |
| Set variants, palette/font/persona, save/load versions, toggle business rules, open compare/present/exports | ✅ |
| Answers "what variants am I using?", "summarize my scope", etc. | ✅ |
| Backed by a real LLM | 🟡 | rule-based intent engine, swappable behind `interpret()` |

## 10. WizSiteSpec V2 (canonical schema)
| Feature | Status |
|---|---|
| Full `WizSiteSpecV2` interface tree (meta/brand/multiBrand/theme/nav/pages/business/ai/infra/imScope) | ✅ |
| `defaultWizSiteSpec` + `migrateV1ToV2` (pure) + dependency-free `validateWizSiteSpec` | ✅ |
| `useWizSiteSpec` read-only adapter; surfaced + downloadable in Export Scope | ✅ |

## 11. Present Mode V2 — shoppable storefront (29 routes)
| Area | Status |
|---|---|
| Global layout: header (announcement, brand switcher, nav incl. mega-menu, search, account, cart, mobile drawer), footer, breadcrumb, toasts, activation modal, quick-view | ✅ |
| Homepage: spec-driven sections (hero, category grid, featured, trade CTA, value pillars, trade shows, testimonials, newsletter, editorial) | ✅ |
| PLP: category / collection / search — filters, sort, pagination, collection banner, quick view, login-gated pricing | ✅ |
| PDP: gallery + lightbox, login-gated price, MOQ qty, unit type, accordions, related products, download button | ✅ |
| Cart: line items, notes, add-products modal, free-shipping progress, totals, empty state | ✅ |
| Checkout: progress bar → shipping → payment (terms-aware) → review → order confirmation (writes a session order) | ✅ |
| Account: tabbed — profile (hide-price/PDF prefs), orders (re-order), wishlists, invoices | ✅ |
| Auth: login / signup / activation | ✅ |
| Content pages: about, contact, FAQ, shipping & returns, terms, privacy, rep locator, trade shows, trade program, virtual showroom, dealer locator | ✅ |
| Shopping state persisted to `sessionStorage` | ✅ |

## 12. Intentionally out of scope / not yet built
| Item | Status |
|---|---|
| 5-stage **site scraper** (auto-populate from a live WizShop URL) | ⛔ |
| **Version analytics** / stability scores | ⛔ |
| Native **.xlsx** catalog import | ⛔ |
| Real auth / OAuth / multi-user collaboration | ⛔ (UUID/session only) |
| Real ERP integrations & real AI (search/recs/copy) | 🟡 mocked |
| Variant **thumbnail** hover previews, click-to-edit-on-canvas, onboarding wizard | ⛔ |
