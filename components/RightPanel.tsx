'use client';

import { useState } from 'react';
import { useDesign } from '@/lib/DesignContext';
import { fontById, paletteById } from '@/lib/themes';
import { variantLabel } from '@/lib/industries';
import { PERSONA_META } from '@/lib/wizorder';
import { VersionControl } from './VersionControl';
import { AIPlaceholders } from './AIPlaceholders';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--chrome-muted)]">{label}</div>
      <div className="mt-0.5 text-[14px] font-medium">{value}</div>
    </div>
  );
}

function Collapsible({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-[var(--chrome-line)] px-5 py-4">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--chrome-muted)]">{title}</span>
        <span className="text-[var(--chrome-muted)]">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function RightPanel({
  onExportSummary,
  onExportScope,
  onCompare,
}: {
  onExportSummary: () => void;
  onExportScope: () => void;
  onCompare: () => void;
}) {
  const { state, sections, brands, activeBrandId } = useDesign();
  const f = fontById(state.font);
  const palName = state.palette === 'custom' ? 'Custom' : paletteById(state.palette).name;
  const enabled = sections.filter((s) => s.enabled);

  return (
    <div className="flex h-full flex-col overflow-y-auto wd-scroll">
      <div className="px-5 py-5">
        <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--chrome-muted)]">
          Decision Summary
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand" value={state.brandName || '—'} />
          <Field label="Industry" value={state.industry} />
          <Field label="Palette" value={palName} />
          <Field label="Font" value={`${f.display} / ${f.body}`} />
          <Field label="Density" value={state.density[0].toUpperCase() + state.density.slice(1)} />
          <Field label="Logo" value={state.logoStyle[0].toUpperCase() + state.logoStyle.slice(1)} />
          <Field label="Previewing as" value={PERSONA_META[state.persona].label} />
          <Field label="Pricing" value={state.business.pricing.loginGated ? 'Login-gated' : 'Public'} />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[
            state.business.pricing.volumePricing && 'Volume tiers',
            state.business.catalog.moqEnabled && `MOQ ${state.business.catalog.moq}`,
            `${state.business.customerAccounts.leadApproval} approval`,
            state.business.orderWorkflow.erpType,
          ]
            .filter(Boolean)
            .map((t) => (
              <span key={t as string} className="rounded-full bg-[var(--chrome-bg)] px-2 py-0.5 text-[10px] font-medium text-[var(--chrome-muted)]">
                {t}
              </span>
            ))}
        </div>
      </div>

      {brands.length > 1 && (
        <div className="border-t border-[var(--chrome-line)] px-5 py-4">
          <div className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--chrome-muted)]">
            Brands ({brands.length})
          </div>
          <div className="space-y-2">
            {brands.map((b) => {
              const active = b.id === activeBrandId;
              const bp = b.palette === 'custom' ? 'Custom' : paletteById(b.palette).name;
              return (
                <div key={b.id} className="flex items-start gap-2 text-[12px]">
                  <span className={`mt-1 h-1.5 w-1.5 flex-none rounded-full ${active ? 'bg-[var(--chrome-ink)]' : 'bg-[var(--chrome-line)]'}`} />
                  <div className="min-w-0">
                    <div className="font-medium">
                      {b.name || 'Untitled'} {active && <span className="text-[10px] font-normal text-[var(--chrome-muted)]">(active)</span>}
                    </div>
                    <div className="text-[10.5px] text-[var(--chrome-muted)]">{bp} · {fontById(b.font).display} · {b.logoStyle.replace('_', ' ')} · hero {b.heroVariant}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="border-t border-[var(--chrome-line)] px-5 py-4">
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--chrome-muted)]">
          Sections ({enabled.length})
        </div>
        <div className="space-y-1.5">
          {enabled.map((s) => {
            const v = state.variants[s.id] ?? s.defaultVariant;
            return (
              <div key={s.id} className="flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-600">✓</span>
                  {s.name}
                </span>
                <span className="text-[var(--chrome-muted)]">
                  {s.id === 'about' ? 'default' : (
                    <>
                      <span className="font-mono font-semibold text-[var(--chrome-ink)]">{v}</span>
                      <span className="ml-1.5">{variantLabel(s.id, v)}</span>
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[var(--chrome-line)] px-5 py-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onExportSummary}
            title="A plain-text recap of the design (copy or download .txt)"
            className="flex items-center justify-center gap-1.5 rounded-md border border-[var(--chrome-line)] py-2.5 text-[12px] font-medium hover:border-[var(--chrome-muted)]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6" /></svg>
            Summary
          </button>
          <button
            onClick={onExportScope}
            title="Implementation blueprint for the IM — WizOrder checklist (.txt / .json)"
            className="flex items-center justify-center gap-1.5 rounded-md border border-[var(--chrome-line)] py-2.5 text-[12px] font-medium hover:border-[var(--chrome-muted)]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 11l3 3 8-8M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h11" /></svg>
            Scope
          </button>
        </div>
        <p className="mt-1.5 text-[10.5px] text-[var(--chrome-muted)]">Summary = design recap (.txt). Scope = IM blueprint (.txt / .json).</p>
      </div>

      <Collapsible title="Version Control" defaultOpen>
        <VersionControl onCompare={onCompare} />
      </Collapsible>

      <Collapsible title="AI Assist">
        <AIPlaceholders />
      </Collapsible>
    </div>
  );
}
