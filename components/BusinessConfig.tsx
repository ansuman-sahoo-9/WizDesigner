'use client';

import { useState } from 'react';
import { useDesign } from '@/lib/DesignContext';
import type { WizOrderSimulation, ErpType } from '@/lib/types';

// ---- reusable controls ----------------------------------------------------

function Group({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--chrome-line)] px-5 py-3">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between py-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--chrome-muted)]">{title}</span>
        <span className="text-[var(--chrome-muted)]">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  );
}

function SubHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--chrome-bg)] px-5 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--chrome-muted)]">
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  hint,
  badge,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
  badge?: 'Pro' | 'Beta' | 'Soon';
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-3">
      <span className="text-[12.5px] leading-tight">
        <span className="inline-flex items-center gap-1.5">
          {label}
          {badge && (
            <span
              className="rounded-full px-1.5 py-px text-[8px] font-bold uppercase tracking-wide"
              style={
                badge === 'Pro'
                  ? { background: '#2e2a22', color: 'var(--chrome-accent)' }
                  : { background: 'var(--chrome-bg)', color: 'var(--chrome-muted)' }
              }
            >
              {badge}
            </span>
          )}
        </span>
        {hint && <span className="mt-0.5 block text-[10.5px] text-[var(--chrome-muted)]">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`mt-0.5 flex h-[18px] w-[30px] flex-none items-center rounded-full p-0.5 transition-colors ${
          checked ? 'bg-[var(--chrome-ink)]' : 'bg-[var(--chrome-line)]'
        }`}
      >
        <span className={`h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-3' : ''}`} />
      </button>
    </label>
  );
}

function Num({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-3 pl-0">
      <span className="text-[12px] text-[var(--chrome-muted)]">{label}</span>
      <span className="flex items-center gap-1 rounded-md border border-[var(--chrome-line)] bg-white px-2 py-1">
        {prefix && <span className="text-[11px] text-[var(--chrome-muted)]">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-12 bg-transparent text-right text-[12px] outline-none"
        />
        {suffix && <span className="text-[11px] text-[var(--chrome-muted)]">{suffix}</span>}
      </span>
    </label>
  );
}

function Radio<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-md bg-[var(--chrome-bg)] p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded px-2 py-1 text-[11px] font-medium transition-colors ${
            value === o.value ? 'bg-white text-[var(--chrome-ink)] shadow-sm' : 'text-[var(--chrome-muted)]'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const GROUP_CHOICES = ['Dealer', 'Distributor', 'Retail', 'International'];
const ERP_CHOICES: ErpType[] = ['NetSuite', 'SAP', 'QuickBooks', 'Sage', 'Dynamics', 'Acumatica', 'Shopify', 'BigCommerce', 'Other'];

// ---- panel ----------------------------------------------------------------

export function BusinessConfig() {
  const { state, setBusiness } = useDesign();
  const b = state.business;
  // typed setter helper
  const set = <G extends keyof WizOrderSimulation>(group: G, key: keyof WizOrderSimulation[G], value: unknown) =>
    setBusiness(group, key as string, value);

  const groups = b.customerAccounts.customerGroups;
  const toggleGroup = (g: string) => {
    const next = groups.includes(g) ? groups.filter((x) => x !== g) : [...groups, g];
    set('customerAccounts', 'customerGroups', next);
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto wd-scroll">
      <SubHeader>Core setup</SubHeader>
      <Group title="Pricing & Access">
        <Toggle label="Login-gated pricing" hint='PDP shows "Login to see price"' checked={b.pricing.loginGated} onChange={(v) => set('pricing', 'loginGated', v)} />
        <Toggle label="Customer-specific pricing" hint="Per-group price lists + persona switch" checked={b.pricing.customerSpecificPricing} onChange={(v) => set('pricing', 'customerSpecificPricing', v)} />
        <Toggle label="Volume / tier pricing" hint="Shows price-break table on PDP" checked={b.pricing.volumePricing} onChange={(v) => set('pricing', 'volumePricing', v)} />
        <Toggle label="MAP / IMAP policy" badge="Pro" hint="Enforce a price floor across the catalog" checked={b.pricing.mapPolicyEnabled} onChange={(v) => set('pricing', 'mapPolicyEnabled', v)} />
        <Toggle label="Multi-currency" checked={b.pricing.currencyMulti} onChange={(v) => set('pricing', 'currencyMulti', v)} />
        <div className="pt-1">
          <div className="mb-1.5 text-[11px] text-[var(--chrome-muted)]">Customer tiers</div>
          <div className="flex flex-wrap gap-1.5">
            {GROUP_CHOICES.map((g) => {
              const on = groups.includes(g);
              return (
                <button
                  key={g}
                  onClick={() => toggleGroup(g)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    on ? 'border-[var(--chrome-ink)] bg-[var(--chrome-ink)] text-white' : 'border-[var(--chrome-line)] text-[var(--chrome-muted)]'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>
      </Group>

      <Group title="Catalog Rules">
        <Toggle label="MOQ enforcement" checked={b.catalog.moqEnabled} onChange={(v) => set('catalog', 'moqEnabled', v)} />
        {b.catalog.moqEnabled && <Num label="Minimum units" value={b.catalog.moq} onChange={(v) => set('catalog', 'moq', v)} />}
        <Toggle label="Case packs" checked={b.catalog.casePacksEnabled} onChange={(v) => set('catalog', 'casePacksEnabled', v)} />
        {b.catalog.casePacksEnabled && <Num label="Pack size" value={b.catalog.casePackSize} onChange={(v) => set('catalog', 'casePackSize', v)} />}
        <Toggle label="Custom modifiers" hint="Imprint fields on PDP" checked={b.catalog.customModifiersEnabled} onChange={(v) => set('catalog', 'customModifiersEnabled', v)} />
        <Toggle label="ETA for out-of-stock" checked={b.catalog.etaForOOSEnabled} onChange={(v) => set('catalog', 'etaForOOSEnabled', v)} />
        <Toggle label="Best-seller tagging" checked={b.catalog.bestSellerTagging} onChange={(v) => set('catalog', 'bestSellerTagging', v)} />
      </Group>

      <Group title="Customer Accounts">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[12px] text-[var(--chrome-muted)]">Lead approval</span>
          <div className="w-36">
            <Radio value={b.customerAccounts.leadApproval} onChange={(v) => set('customerAccounts', 'leadApproval', v)} options={[{ value: 'auto', label: 'Auto' }, { value: 'manual', label: 'Manual' }]} />
          </div>
        </div>
        <Toggle label="Separate dealer login" checked={b.customerAccounts.dealerLoginSeparate} onChange={(v) => set('customerAccounts', 'dealerLoginSeparate', v)} />
        <Toggle label="Credit limits" checked={b.customerAccounts.creditLimitEnabled} onChange={(v) => set('customerAccounts', 'creditLimitEnabled', v)} />
        <Toggle label="Rep assignment" checked={b.customerAccounts.repAssignmentEnabled} onChange={(v) => set('customerAccounts', 'repAssignmentEnabled', v)} />
      </Group>

      <Group title="Payments & Terms">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Toggle label="Net-30" checked={b.paymentTerms.net30} onChange={(v) => set('paymentTerms', 'net30', v)} />
          <Toggle label="Net-60" checked={b.paymentTerms.net60} onChange={(v) => set('paymentTerms', 'net60', v)} />
          <Toggle label="Net-90" checked={b.paymentTerms.net90} onChange={(v) => set('paymentTerms', 'net90', v)} />
        </div>
        <Toggle label="Credit card" checked={b.payments.creditCard} onChange={(v) => set('payments', 'creditCard', v)} />
        <Toggle label="Card on file" checked={b.payments.cardOnFile} onChange={(v) => set('payments', 'cardOnFile', v)} />
        <Toggle label="ACH" checked={b.payments.ach} onChange={(v) => set('payments', 'ach', v)} />
        <Toggle label="Partial payments" checked={b.payments.partialPaymentsEnabled} onChange={(v) => set('payments', 'partialPaymentsEnabled', v)} />
        <Toggle label="Credit-card surcharge" checked={b.payments.surchargeEnabled} onChange={(v) => set('payments', 'surchargeEnabled', v)} />
        {b.payments.surchargeEnabled && <Num label="Surcharge" value={b.payments.surchargePercent} onChange={(v) => set('payments', 'surchargePercent', v)} suffix="%" />}
      </Group>

      <Group title="Shipping">
        <Toggle label="Flat rate" checked={b.shipping.flatRate} onChange={(v) => set('shipping', 'flatRate', v)} />
        {b.shipping.flatRate && <Num label="Flat amount" value={b.shipping.flatRateAmount} onChange={(v) => set('shipping', 'flatRateAmount', v)} prefix="$" />}
        <Toggle label="Carrier-calculated" checked={b.shipping.carrierCalculated} onChange={(v) => set('shipping', 'carrierCalculated', v)} />
        <Toggle label="Free-shipping threshold" checked={b.shipping.freeShippingEnabled} onChange={(v) => set('shipping', 'freeShippingEnabled', v)} />
        {b.shipping.freeShippingEnabled && <Num label="Free over" value={b.shipping.freeShippingThreshold} onChange={(v) => set('shipping', 'freeShippingThreshold', v)} prefix="$" />}
        <Toggle label="Freight" checked={b.shipping.freightEnabled} onChange={(v) => set('shipping', 'freightEnabled', v)} />
        <Toggle label="Pickup" checked={b.shipping.pickupEnabled} onChange={(v) => set('shipping', 'pickupEnabled', v)} />
        <Toggle label="Multi-location" checked={b.shipping.multiLocationEnabled} onChange={(v) => set('shipping', 'multiLocationEnabled', v)} />
      </Group>

      <SubHeader>Advanced</SubHeader>
      <Group title="Order Workflow" defaultOpen={false}>
        <Radio
          value={b.orderWorkflow.approvalType}
          onChange={(v) => set('orderWorkflow', 'approvalType', v)}
          options={[{ value: 'auto', label: 'Auto' }, { value: 'manual', label: 'Manual' }, { value: 'threshold', label: 'Threshold' }]}
        />
        <p className="text-[10.5px] leading-snug text-[var(--chrome-muted)]">
          {b.orderWorkflow.approvalType === 'auto'
            ? 'Auto: every order is approved automatically.'
            : b.orderWorkflow.approvalType === 'manual'
              ? 'Manual: a rep must approve every order before fulfilment.'
              : 'Threshold: orders above the amount below need rep approval; smaller ones auto-approve.'}
        </p>
        {b.orderWorkflow.approvalType === 'threshold' && (
          <Num label="Approval above" value={b.orderWorkflow.approvalThreshold} onChange={(v) => set('orderWorkflow', 'approvalThreshold', v)} prefix="$" />
        )}
        <label className="flex items-center justify-between gap-3 pt-1">
          <span className="text-[12px] text-[var(--chrome-muted)]">ERP</span>
          <select
            value={b.orderWorkflow.erpType}
            onChange={(e) => set('orderWorkflow', 'erpType', e.target.value as ErpType)}
            className="rounded-md border border-[var(--chrome-line)] bg-white px-2 py-1 text-[12px] outline-none"
          >
            {ERP_CHOICES.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </label>
      </Group>

      <Group title="AI Features" defaultOpen={false}>
        <Toggle label="Semantic search" checked={b.aiFeatures.semanticSearchEnabled} onChange={(v) => set('aiFeatures', 'semanticSearchEnabled', v)} />
        <Toggle label="Visual search" badge="Pro" checked={b.aiFeatures.visualSearchEnabled} onChange={(v) => set('aiFeatures', 'visualSearchEnabled', v)} />
        <Toggle label="Similar products" hint="Recommendation carousel on PDP" checked={b.aiFeatures.similarProductsEnabled} onChange={(v) => set('aiFeatures', 'similarProductsEnabled', v)} />
        <Toggle label="Personalized recs" badge="Pro" checked={b.aiFeatures.personalizedRecommendations} onChange={(v) => set('aiFeatures', 'personalizedRecommendations', v)} />
        <Toggle label="Cart-abandonment signals" badge="Pro" hint="Requires WizOrder AI Copilot" checked={b.aiFeatures.cartAbandonmentSignals} onChange={(v) => set('aiFeatures', 'cartAbandonmentSignals', v)} />
      </Group>

      <Group title="External Retail" defaultOpen={false}>
        <Toggle label="Amazon buy links" badge="Pro" checked={b.externalRetail.amazonLinksEnabled} onChange={(v) => set('externalRetail', 'amazonLinksEnabled', v)} />
        <Toggle label="Walmart buy links" badge="Pro" checked={b.externalRetail.walmartLinksEnabled} onChange={(v) => set('externalRetail', 'walmartLinksEnabled', v)} />
        <Toggle label="Retail locator" checked={b.externalRetail.retailLocatorEnabled} onChange={(v) => set('externalRetail', 'retailLocatorEnabled', v)} />
      </Group>

      <Group title="Marketing" defaultOpen={false}>
        <Toggle label="Announcement bar" checked={b.marketing.announcementBarEnabled} onChange={(v) => set('marketing', 'announcementBarEnabled', v)} />
        {b.marketing.announcementBarEnabled && (
          <textarea
            value={b.marketing.announcementText}
            onChange={(e) => set('marketing', 'announcementText', e.target.value)}
            rows={2}
            className="w-full resize-none rounded-md border border-[var(--chrome-line)] bg-white px-2.5 py-1.5 text-[12px] leading-snug outline-none focus:border-[var(--chrome-ink)]"
          />
        )}
        <Toggle label="Email capture" checked={b.marketing.emailCaptureEnabled} onChange={(v) => set('marketing', 'emailCaptureEnabled', v)} />
        <Toggle label="“Built on WizShop” badge" hint="Show the powered-by line in the footer" checked={b.marketing.poweredByBadge} onChange={(v) => set('marketing', 'poweredByBadge', v)} />
      </Group>

      <Group title="Quotes & Account" defaultOpen={false}>
        <Toggle label="Quote management" checked={b.quotes.quoteManagementEnabled} onChange={(v) => set('quotes', 'quoteManagementEnabled', v)} />
        <Toggle label="Multi-cart" checked={b.quotes.multiCartEnabled} onChange={(v) => set('quotes', 'multiCartEnabled', v)} />
        <Toggle label="Wishlist" checked={b.quotes.wishlistEnabled} onChange={(v) => set('quotes', 'wishlistEnabled', v)} />
        <Toggle label="Order history" checked={b.accountFeatures.orderHistoryEnabled} onChange={(v) => set('accountFeatures', 'orderHistoryEnabled', v)} />
        <Toggle label="One-click reorder" checked={b.accountFeatures.oneClickReorderEnabled} onChange={(v) => set('accountFeatures', 'oneClickReorderEnabled', v)} />
        <Toggle label="Invoice visibility" checked={b.accountFeatures.invoiceVisibilityEnabled} onChange={(v) => set('accountFeatures', 'invoiceVisibilityEnabled', v)} />
        <Toggle label="Shipment tracking" checked={b.accountFeatures.shipmentTrackingEnabled} onChange={(v) => set('accountFeatures', 'shipmentTrackingEnabled', v)} />
      </Group>
    </div>
  );
}
