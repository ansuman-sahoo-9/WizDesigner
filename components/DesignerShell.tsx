'use client';

import { useState } from 'react';
import { useDesign } from '@/lib/DesignContext';
import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';
import { StorefrontPreview } from './StorefrontPreview';
import { VersionBar } from './VersionBar';
import { PersonaSwitcher } from './PersonaSwitcher';
import { ChatAssistant } from './ChatAssistant';
import { CompareMode } from './CompareMode';
import { ExportSummary } from './ExportSummary';
import { ExportScope } from './ExportScope';
import { availablePersonas, PERSONA_META } from '@/lib/wizorder';
import type { PersonaId } from '@/lib/types';

type Viewport = 'desktop' | 'tablet' | 'mobile';
const VIEWPORT_WIDTH: Record<Viewport, number> = { desktop: 1240, tablet: 820, mobile: 414 };

export function DesignerShell() {
  const { booting, sheetLive, reset, state, setPersona } = useDesign();
  const [compare, setCompare] = useState(false);
  const [modal, setModal] = useState<'summary' | 'scope' | null>(null);
  const [viewport, setViewport] = useState<Viewport>('desktop');

  // Present opens the storefront in its own browser tab (shares localStorage).
  const openPresent = () => window.open('/present', '_blank', 'noopener');

  const personas = availablePersonas(state.business);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex h-14 flex-none items-center justify-between gap-4 border-b border-[var(--chrome-line)] bg-[var(--chrome-panel)] px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--chrome-ink)] text-[13px] font-bold text-[var(--chrome-accent)]">
              W
            </span>
            <span className="text-[14px] font-semibold tracking-tight">WizDesigner</span>
          </div>
          <span
            className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium sm:flex ${
              sheetLive ? 'bg-emerald-50 text-emerald-700' : 'bg-[var(--chrome-bg)] text-[var(--chrome-muted)]'
            }`}
            title={sheetLive ? 'Reading from the live Google Sheet' : 'Sheet API not configured — running on fallback data'}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${sheetLive ? 'bg-emerald-500' : 'bg-amber-400'}`} />
            {sheetLive ? 'Sheet live' : 'Fallback data'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <PersonaSwitcher />
          <div className="h-6 w-px bg-[var(--chrome-line)]" />
          <VersionBar onCompare={() => setCompare(true)} />
          <div className="h-6 w-px bg-[var(--chrome-line)]" />
          <button
            onClick={reset}
            className="flex h-8 items-center rounded-md border border-[var(--chrome-line)] px-3 text-[11px] font-medium text-[var(--chrome-muted)] hover:border-[var(--chrome-muted)] hover:text-[var(--chrome-ink)]"
          >
            Reset
          </button>
          <button
            onClick={openPresent}
            title="Open the presentation in a new tab"
            className="flex h-8 items-center gap-1.5 rounded-md bg-[var(--chrome-ink)] px-3.5 text-[12px] font-semibold text-white hover:opacity-90"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 4h16v12H4zM2 20h20M9 16v4M15 16v4" />
            </svg>
            Present
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="opacity-70">
              <path d="M14 4h6v6M20 4l-9 9M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" />
            </svg>
          </button>
          <ChatAssistant
            onPresent={openPresent}
            onCompare={() => setCompare(true)}
            onExportSummary={() => setModal('summary')}
            onExportScope={() => setModal('scope')}
          />
        </div>
      </header>

      {/* 3-panel body */}
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[300px] flex-none border-r border-[var(--chrome-line)] bg-[var(--chrome-panel)] lg:block">
          <LeftPanel />
        </aside>

        <main className="relative flex min-w-0 flex-1 flex-col bg-[var(--chrome-bg)]">
          {/* Canvas toolbar: persona strip (left) + viewport toggle (right) */}
          <div className="flex flex-none items-center justify-between gap-3 border-b border-[var(--chrome-line)] bg-[var(--chrome-panel)] px-4 py-2">
            <div className="flex items-center gap-1.5 overflow-x-auto no-bar">
              <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--chrome-muted)]">View as</span>
              {personas.map((p) => {
                const active = state.persona === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPersona(p as PersonaId)}
                    className={`flex-none rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                      active ? 'bg-[var(--chrome-ink)] text-white' : 'text-[var(--chrome-muted)] hover:bg-[var(--chrome-bg)]'
                    }`}
                  >
                    {PERSONA_META[p].label}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-none items-center gap-0.5 rounded-md bg-[var(--chrome-bg)] p-0.5">
              {(['desktop', 'tablet', 'mobile'] as Viewport[]).map((vp) => (
                <button
                  key={vp}
                  onClick={() => setViewport(vp)}
                  title={vp[0].toUpperCase() + vp.slice(1)}
                  className={`grid h-7 w-8 place-items-center rounded transition-colors ${
                    viewport === vp ? 'bg-white text-[var(--chrome-ink)] shadow-sm' : 'text-[var(--chrome-muted)] hover:text-[var(--chrome-ink)]'
                  }`}
                >
                  {vp === 'desktop' && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="2" y="4" width="20" height="13" rx="1" /><path d="M8 21h8M12 17v4" /></svg>
                  )}
                  {vp === 'tablet' && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M11 18h2" /></svg>
                  )}
                  {vp === 'mobile' && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto wd-scroll">
            <div
              className="mx-auto my-4 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5 transition-[max-width] duration-300"
              style={{ maxWidth: VIEWPORT_WIDTH[viewport] }}
            >
              <StorefrontPreview />
            </div>
          </div>
        </main>

        <aside className="hidden w-[340px] flex-none border-l border-[var(--chrome-line)] bg-[var(--chrome-panel)] xl:block">
          <RightPanel
            onExportSummary={() => setModal('summary')}
            onExportScope={() => setModal('scope')}
            onCompare={() => setCompare(true)}
          />
        </aside>
      </div>

      {/* Boot overlay */}
      {booting && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-[var(--chrome-bg)]/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-[13px] text-[var(--chrome-muted)]">
            <span className="wd-spin inline-block h-4 w-4 rounded-full border-2 border-[var(--chrome-line)] border-t-[var(--chrome-ink)]" />
            Loading Section Registry…
          </div>
        </div>
      )}

      {/* Overlays */}
      {compare && <CompareMode onExit={() => setCompare(false)} />}
      {modal === 'summary' && <ExportSummary onClose={() => setModal(null)} />}
      {modal === 'scope' && <ExportScope onClose={() => setModal(null)} />}
    </div>
  );
}
