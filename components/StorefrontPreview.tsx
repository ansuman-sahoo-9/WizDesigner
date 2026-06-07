'use client';

import { useDesign } from '@/lib/DesignContext';
import type { DesignState, BrandSwitcherStyle } from '@/lib/types';
import { storefrontVars } from '@/lib/cssVars';
import { resolveBrands } from '@/lib/brands';
import { VariantSwitcher } from './VariantSwitcher';
import { SECTION_COMPONENTS, availableVariants } from './sections/registry';

type Props = {
  // When true, hides every variant switcher (used by Present + Compare).
  showSwitchers?: boolean;
  // Optional state override (Compare mode renders snapshots, not live state).
  stateOverride?: DesignState;
  // Lets an override host (e.g. the Present tab) handle brand switching itself.
  onSelectBrand?: (id: string) => void;
};

function BrandSwitcherStrip({
  brands,
  activeId,
  onSelect,
  style = 'pill',
}: {
  brands: { id: string; name: string }[];
  activeId: string;
  onSelect?: (id: string) => void;
  style?: BrandSwitcherStyle;
}) {
  const cursor = onSelect ? 'cursor-pointer' : 'cursor-default';
  const wrap = (children: React.ReactNode) => (
    <div className="flex items-center gap-1 border-b px-4 py-2" style={{ background: 'var(--sf-ink)', borderColor: 'rgba(255,255,255,0.12)' }}>
      <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--sf-on-brand)', opacity: 0.5 }}>Brands</span>
      {children}
    </div>
  );

  if (style === 'dropdown') {
    return wrap(
      <select
        value={activeId}
        disabled={!onSelect}
        onChange={(e) => onSelect?.(e.target.value)}
        className="rounded-md border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] outline-none"
        style={{ background: 'transparent', color: 'var(--sf-on-brand)', borderColor: 'rgba(255,255,255,0.3)' }}
      >
        {brands.map((b) => <option key={b.id} value={b.id} style={{ color: '#111' }}>{b.name || 'Untitled'}</option>)}
      </select>,
    );
  }

  return wrap(
    <div className="flex items-center gap-1">
      {brands.map((b, i) => {
        const active = b.id === activeId;
        if (style === 'minimal') {
          return (
            <span key={b.id} className="flex items-center">
              {i > 0 && <span className="px-1.5 text-[10px]" style={{ color: 'var(--sf-on-brand)', opacity: 0.3 }}>·</span>}
              <button
                onClick={onSelect ? () => onSelect(b.id) : undefined}
                className={`text-[11px] uppercase tracking-[0.1em] ${cursor}`}
                style={{ color: active ? 'var(--sf-accent)' : 'var(--sf-on-brand)', fontWeight: active ? 700 : 500, opacity: active ? 1 : 0.65 }}
              >
                {b.name || 'Untitled'}
              </button>
            </span>
          );
        }
        if (style === 'underline') {
          return (
            <button
              key={b.id}
              onClick={onSelect ? () => onSelect(b.id) : undefined}
              className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${cursor}`}
              style={{ color: active ? 'var(--sf-accent)' : 'var(--sf-on-brand)', opacity: active ? 1 : 0.7, borderBottom: `2px solid ${active ? 'var(--sf-accent)' : 'transparent'}` }}
            >
              {b.name || 'Untitled'}
            </button>
          );
        }
        // pill (default)
        return (
          <button
            key={b.id}
            onClick={onSelect ? () => onSelect(b.id) : undefined}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors ${cursor}`}
            style={active ? { background: 'var(--sf-accent)', color: '#111' } : { color: 'var(--sf-on-brand)', opacity: 0.7 }}
          >
            {b.name || 'Untitled'}
          </button>
        );
      })}
    </div>,
  );
}

export function StorefrontPreview({ showSwitchers = true, stateOverride, onSelectBrand }: Props) {
  const { state: liveState, sections, products, categories, setVariant, setActiveBrand } = useDesign();
  const state = stateOverride ?? liveState;

  const enabled = sections.filter((s) => s.enabled);
  const brands = resolveBrands(state);
  const activeId = state.activeBrandId ?? brands[0]?.id ?? 'brand_1';
  // Live preview switches via context; an override host can pass its own handler.
  const onBrand = stateOverride ? onSelectBrand : setActiveBrand;

  return (
    <div className="storefront" style={storefrontVars(state)}>
      {brands.length > 1 && (
        <BrandSwitcherStrip brands={brands.map((b) => ({ id: b.id, name: b.name }))} activeId={activeId} onSelect={onBrand} style={state.brandSwitcherStyle ?? 'pill'} />
      )}
      {enabled.map((s) => {
        const Comp = SECTION_COMPONENTS[s.id];
        if (!Comp) return null;
        const variant = state.variants[s.id] ?? s.defaultVariant;
        return (
          <div key={s.id} className={showSwitchers ? 'sf-frame group' : ''}>
            {showSwitchers && (
              <div className="pointer-events-none absolute right-3 top-3 z-20 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
                <div className="pointer-events-auto">
                  <VariantSwitcher
                    sectionId={s.id}
                    current={variant}
                    available={availableVariants(s.id)}
                    onChange={(v) => setVariant(s.id, v)}
                  />
                </div>
              </div>
            )}
            <Comp
              variant={variant}
              brandName={state.brandName}
              logoStyle={state.logoStyle}
              logoUrl={state.logoUrl}
              industry={state.industry}
              products={products}
              categories={categories}
              business={state.business}
              persona={state.persona}
            />
            {showSwitchers && <span className="sf-frame-outline" />}
          </div>
        );
      })}
    </div>
  );
}
