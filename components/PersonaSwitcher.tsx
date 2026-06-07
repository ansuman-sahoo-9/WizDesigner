'use client';

import { useDesign } from '@/lib/DesignContext';
import { PERSONA_META, availablePersonas } from '@/lib/wizorder';
import type { PersonaId } from '@/lib/types';

// "Preview As" — switches whose storefront the preview simulates (guest vs each
// configured customer group). The single biggest CSM value prop.
export function PersonaSwitcher() {
  const { state, setPersona } = useDesign();
  const available = availablePersonas(state.business);

  return (
    <label className="flex items-center gap-2 rounded-md border border-[var(--chrome-line)] bg-white pl-2.5 pr-1 py-1">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-[var(--chrome-muted)]">
        <circle cx="12" cy="8" r="3.2" /><path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
      <span className="text-[11px] font-medium text-[var(--chrome-muted)]">Preview as</span>
      <select
        value={state.persona}
        onChange={(e) => setPersona(e.target.value as PersonaId)}
        className="cursor-pointer bg-transparent py-0.5 pr-1 text-[12px] font-semibold text-[var(--chrome-ink)] outline-none"
      >
        {available.map((p) => (
          <option key={p} value={p}>{PERSONA_META[p].label}</option>
        ))}
      </select>
    </label>
  );
}
