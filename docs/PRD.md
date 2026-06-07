# WizDesigner — Product Requirements Document (PRD)

**Status:** Living document · **Owner:** Product · **Last updated:** this build

---

## 1. Summary

WizDesigner is a self-serve, single-screen tool that lets WizCommerce go-to-market and delivery teams design a wholesale B2B storefront, simulate the WizOrder business rules behind it, preview it as any buyer persona, and hand off an implementation-ready scope — in minutes, on a live customer call.

It compresses a process that today spans multiple tools, calls, and manual re-entry into one shared artifact: the **WizSiteSpec**.

## 2. Problem

Selling and implementing a WizShop storefront involves three painful gaps:

1. **Concept validation is slow.** Prospects can't "see" their store until late in the cycle. CSMs mock things up by hand or describe them verbally.
2. **Business rules live only in WizOrder.** Pricing, MOQ, terms, customer groups, ERP — none of it is visible during discovery, so scoping is guesswork and "we'll configure that later" ambiguity.
3. **Handoff is lossy.** What sales/CSM agree with the customer is re-typed by an IM into WizOrder, with drift and rework. Multi-brand customers (e.g., a parent with several child brands sharing cart/catalog) have no clean model at all.

## 3. Goals & non-goals

**Goals**
- G1 — Render a full, branded storefront preview in **< 3 seconds**, configurable live.
- G2 — Make every **WizOrder business rule** visually configurable and immediately reflected in the preview.
- G3 — Let a CSM **preview the store as any customer persona** (guest vs dealer vs distributor…).
- G4 — Support **multi-brand** (parent + children sharing auth/cart/catalog, overriding style).
- G5 — Produce a structured, implementation-ready **IM scope** (+ canonical spec) with zero manual re-entry as the end state.
- G6 — Provide a **fully shoppable Present mode** to walk a buyer through the real journey.

**Non-goals (this phase)**
- Real authentication / multi-user collaboration.
- Real ERP integration or real AI inference (both simulated).
- Publishing to a live storefront (export is the deliverable).
- A heavyweight database (Google Sheets is the system of record).

## 4. Users & personas

| User | Need |
|---|---|
| **Prospect / Customer** | See their brand as a real store; understand what they're buying. |
| **SDR / AE** | Spin up a credible, branded demo fast; leave-behind. |
| **CSM** | Run discovery on a call; show "what your dealer sees vs a guest"; capture decisions. |
| **Implementation Manager (IM)** | Receive an unambiguous configuration blueprint to set up WizOrder. |

## 5. User journeys

**J1 — Discovery call (CSM):** open tool → pick industry → tweak palette/font/logo → flip section variants live → switch persona to "Dealer" to reveal pricing → toggle the business rules the customer confirms → save a version → screen-share Present mode → export scope.

**J2 — Multi-brand setup:** set brand count to 2 → name "Sagebrook Home" + "Elevarre" → style each (palette/font/hero) → switch between them live in the storefront switcher → export lists both brands + shared infrastructure.

**J3 — IM handoff:** open the customer's saved version → Export Scope → receive the 4-section document with the **WizOrder configuration checklist** and the **WizSiteSpec V2 JSON** → configure WizOrder against it.

**J4 — Buyer walkthrough (Present mode):** Home → category PLP (filters/sort, login-gated prices) → PDP (gallery, MOQ qty, accordions) → add to cart → cart (MOQ, free-freight bar) → checkout (terms-aware) → order confirmation → account (orders, re-order, wishlists, invoices).

## 6. Functional requirements

### 6.1 Storefront designer
- FR-1 Render 10 sections, each with A/B/C/D variants (About single-variant); instant switching.
- FR-2 Section visibility/order is data-driven (Section Registry); editable without code.
- FR-3 Branding: name, logo upload, 5 logo styles, 6 palettes + custom, 6 font pairings, density, 16 industries.

### 6.2 WizOrder simulator (business layer)
- FR-4 Configure pricing, catalog rules (MOQ/case packs/modifiers/ETA), customer groups & lead approval, payment terms & methods, shipping, order-approval workflow, ERP type, AI features, external retail, marketing, quotes/account features.
- FR-5 Every toggle updates the preview in real time.
- FR-6 Advanced/premium capabilities are labelled (Pro/Soon) with explanations.

### 6.3 Personas
- FR-7 Preview as guest + each configured customer group; pricing, terms, and gating change accordingly.

### 6.4 Multi-brand
- FR-8 1–N brands; per-brand name, logo, palette, font, hero style; reorder; remove (parent locked).
- FR-9 Storefront brand switcher (4 selectable styles); switching re-themes live. Shared auth/cart/catalog noted.

### 6.5 Catalog & images
- FR-10 Editable catalog with CSV import/export/template, product CRUD, and a catalog-intelligence summary.
- FR-11 Image asset library (upload/link, use-as-logo, copy-URL); catalog can pick from it.

### 6.6 Versions, compare, exports
- FR-12 Unlimited named versions; save/load/rename/delete; "unsaved changes" indicator.
- FR-13 Compare any two versions side-by-side; commit a side back to current.
- FR-14 Export Summary (.txt), Export Scope (4-section + WizOrder checklist, .txt/.json), and validated WizSiteSpec V2 (.json).

### 6.7 Present mode (shoppable)
- FR-15 Full multi-page storefront (Home/PLP/PDP/Cart/Checkout/Account/auth/content) reflecting the design + business config + active persona/brand; cart/checkout/account simulated with session state.

### 6.8 Assistant
- FR-16 In-app assistant that reads live state, answers questions, and executes design/version/business actions (rule-based; LLM-swappable).

### 6.9 Persistence
- FR-17 Instant `localStorage` write on every change; debounced write to the Google Sheet; full fallback when no sheet is configured.

## 7. Success metrics
- Time-to-first-preview < 3 s; full discovery-to-scope in < 15 min.
- IM rework: target zero fields re-entered (structured scope/JSON adopted).
- Demo coverage: every section type & business rule observed in real WizShop sites is representable.

## 8. Acceptance criteria (verified)
1. Storefront renders instantly and is fully configurable. ✅
2. Every section has 4 working, instantly-switchable variants. ✅
3. Brand/palette/font/persona changes live-update every section. ✅
4. Save version A, change, save B, compare side-by-side. ✅
5. Refresh restores all state from localStorage/sheet. ✅
6. Present opens the shoppable storefront (new tab). ✅
7. Export Summary + Scope (+ WizSiteSpec V2 JSON) produced. ✅
8. Section Registry `Enabled=FALSE` removes a section with no code change. ✅
9. Multi-brand: configure 2 brands, switch live, both in the export. ✅

## 9. Risks & mitigations
| Risk | Mitigation |
|---|---|
| Sheet latency/availability | Async, non-blocking writes; complete localStorage + in-code fallback. |
| Scope drift across features | Single source of truth: WizSiteSpec V2 + migration. |
| Over-promising mocked features | Pro/Soon badges + explicit "simulated" labelling; documented in FEATURES. |

## 10. Future (roadmap)
5-stage **site scraper** (auto-populate from a URL), **version analytics**, native **.xlsx** import, per-brand nav/homepage overrides, variant thumbnail previews, click-to-edit canvas, onboarding wizard, and an IM-scope format WizOrder onboarding can import directly.
