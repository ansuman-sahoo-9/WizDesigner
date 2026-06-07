'use client';

import { useState } from 'react';
import { useDesign } from '@/lib/DesignContext';
import { paletteById, fontById } from '@/lib/themes';
import { PERSONA_META } from '@/lib/wizorder';
import type { Version, DesignState } from '@/lib/types';

// Compare the design-relevant fields of two states (ignore session/meta).
function signature(s: DesignState): string {
  return JSON.stringify({
    brandName: s.brandName, logoUrl: s.logoUrl, palette: s.palette, customColors: s.customColors,
    font: s.font, density: s.density, logoStyle: s.logoStyle, industry: s.industry,
    variants: s.variants, persona: s.persona, business: s.business,
  });
}

function when(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  } catch {
    return '';
  }
}

function meta(v: Version): string {
  const pal = v.palette === 'custom' ? 'Custom' : paletteById(v.palette).name;
  return `${pal} · ${fontById(v.font).display} · hero ${v.variants.hero ?? '—'}`;
}

export function VersionControl({ onCompare }: { onCompare: () => void }) {
  const { state, versions, saveVersion, loadVersion, deleteVersion, renameVersion } = useDesign();
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const palName = state.palette === 'custom' ? 'Custom' : paletteById(state.palette).name;
  const suggestion = `${palName} · ${PERSONA_META[state.persona].label} · v${versions.length + 1}`;

  const latest = versions[versions.length - 1];
  const dirty = !latest || signature(state) !== signature(latest);

  const save = () => {
    saveVersion(name.trim() || suggestion);
    setName('');
  };

  const startRename = (v: Version) => {
    setEditing(v.id);
    setDraft(v.name);
  };
  const commitRename = (id: string) => {
    renameVersion(id, draft);
    setEditing(null);
  };

  return (
    <div>
      {dirty && (
        <div className="mb-2 flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1.5 text-[11px] font-medium text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Unsaved changes — save a version to keep this direction
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          placeholder={suggestion}
          className="min-w-0 flex-1 rounded-md border border-[var(--chrome-line)] bg-white px-2.5 py-1.5 text-[12px] outline-none focus:border-[var(--chrome-ink)]"
        />
        <button
          onClick={save}
          className="flex-none rounded-md bg-[var(--chrome-ink)] px-3 py-1.5 text-[12px] font-semibold text-white hover:opacity-90"
        >
          + Save
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-[var(--chrome-muted)]">
          {versions.length} {versions.length === 1 ? 'version' : 'versions'} saved
        </span>
        <button
          onClick={onCompare}
          disabled={versions.length < 2}
          className="text-[11px] font-medium text-[var(--chrome-ink)] hover:underline disabled:text-[var(--chrome-line)]"
        >
          Compare →
        </button>
      </div>

      {versions.length === 0 ? (
        <p className="mt-3 rounded-md border border-dashed border-[var(--chrome-line)] px-3 py-4 text-center text-[12px] text-[var(--chrome-muted)]">
          No versions yet. Save the current design to start a history — create as many as you like.
        </p>
      ) : (
        <div className="mt-2 max-h-[320px] space-y-1.5 overflow-y-auto wd-scroll pr-0.5">
          {versions
            .slice()
            .reverse()
            .map((v) => (
              <div key={v.id} className="rounded-md border border-[var(--chrome-line)] px-2.5 py-2">
                <div className="flex items-start justify-between gap-2">
                  {editing === v.id ? (
                    <input
                      value={draft}
                      autoFocus
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitRename(v.id);
                        if (e.key === 'Escape') setEditing(null);
                      }}
                      onBlur={() => commitRename(v.id)}
                      className="min-w-0 flex-1 rounded border border-[var(--chrome-ink)] bg-white px-1.5 py-0.5 text-[12.5px] font-semibold outline-none"
                    />
                  ) : (
                    <button
                      onClick={() => startRename(v)}
                      title="Click to rename"
                      className="min-w-0 flex-1 truncate text-left text-[12.5px] font-semibold hover:underline"
                    >
                      {v.name}
                    </button>
                  )}
                  <div className="flex flex-none items-center gap-1">
                    <button
                      onClick={() => loadVersion(v.id)}
                      className="rounded border border-[var(--chrome-line)] px-2 py-0.5 text-[11px] font-medium hover:border-[var(--chrome-muted)]"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deleteVersion(v.id)}
                      title="Delete version"
                      className="grid h-6 w-6 place-items-center rounded text-[var(--chrome-muted)] hover:bg-[var(--chrome-bg)] hover:text-red-600"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-0.5 text-[10.5px] text-[var(--chrome-muted)]">
                  {when(v.createdAt)} · {meta(v)}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
