'use client';

import { useState } from 'react';
import { useDesign } from '@/lib/DesignContext';
import { PALETTES, paletteById } from '@/lib/themes';
import { variantLabel } from '@/lib/industries';

function Panel({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-md border border-[var(--chrome-line)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left"
      >
        <span className="flex items-center gap-2 text-[12px] font-semibold">
          <span className="grid h-4 w-4 place-items-center rounded bg-[var(--chrome-accent)] text-[9px] font-bold text-zinc-900">
            AI
          </span>
          {title}
        </span>
        <span className="text-[var(--chrome-muted)]">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="border-t border-[var(--chrome-line)] px-3 py-3 text-[12px] leading-relaxed text-[var(--chrome-muted)]">{children}</div>}
    </div>
  );
}

export function AIPlaceholders() {
  const { state } = useDesign();
  const ind = state.industry.toLowerCase();
  const heroV = state.variants.hero ?? 'B';

  // 3 suggested palettes = current + two others, for the "palette suggestions" panel.
  const suggested = [paletteById(state.palette === 'custom' ? 'heritage' : state.palette), ...PALETTES.filter((p) => p.id !== state.palette).slice(0, 2)];

  return (
    <div className="space-y-2">
      <Panel title="Brand Auditor" defaultOpen>
        Your <strong>{state.brandName}</strong> identity reads warm and heritage-led.
        For {ind} wholesale we&apos;d lean into the <strong>Heritage</strong> palette with a serif display
        like Fraunces — it signals craftsmanship to trade buyers.
      </Panel>

      <Panel title="Palette Suggestions">
        <div className="space-y-2">
          {suggested.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <span className="flex h-5 w-16 overflow-hidden rounded">
                {[p.colors.bg, p.colors.brand, p.colors.accent, p.colors.ink].map((c, i) => (
                  <span key={i} className="flex-1" style={{ background: c }} />
                ))}
              </span>
              <span className="text-[11px]">
                <strong className="text-[var(--chrome-ink)]">{p.name}</strong> — {p.blurb}
              </span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Copy Generator">
        <div className="space-y-2">
          <div>
            <div className="text-[10px] uppercase tracking-wide">Hero headline</div>
            <div className="text-[var(--chrome-ink)]">&ldquo;{state.industry} crafted for the trade.&rdquo;</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide">Category names</div>
            <div className="text-[var(--chrome-ink)]">Seating · Tables · Lighting · Storage · Textiles · Objects</div>
          </div>
        </div>
      </Panel>

      <Panel title="Design Recommendations">
        73% of {ind} wholesalers like {state.brandName} choose
        <strong> Variant B</strong> for the hero (Split). You&apos;re currently on
        <strong> Variant {heroV}</strong> ({variantLabel('hero', heroV)}).
      </Panel>

      <p className="px-1 text-[10px] leading-snug text-[var(--chrome-muted)]">
        AI panels are mocked for the MVP — responses are illustrative, not live model output.
      </p>
    </div>
  );
}
