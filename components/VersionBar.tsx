'use client';

import { useDesign } from '@/lib/DesignContext';

// Top-bar quick controls for the (unlimited) version history.
// Full management lives in the right-rail Version Control panel.
export function VersionBar({ onCompare }: { onCompare: () => void }) {
  const { versions, saveVersion } = useDesign();

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => saveVersion()}
        title="Save the current design as a new version"
        className="flex h-8 items-center gap-1.5 rounded-md border border-[var(--chrome-line)] px-3 text-[11px] font-medium hover:border-[var(--chrome-muted)]"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 3h11l3 3v15H5zM8 3v6h7M8 21v-7h8v7" />
        </svg>
        Save version
      </button>
      <span className="flex h-8 items-center rounded-md bg-[var(--chrome-bg)] px-2 text-[11px] font-semibold text-[var(--chrome-muted)]">
        {versions.length}
      </span>
      <button
        onClick={onCompare}
        disabled={versions.length < 2}
        title={versions.length < 2 ? 'Save at least two versions to compare' : 'Compare two versions side by side'}
        className="flex h-8 items-center gap-1.5 rounded-md border border-[var(--chrome-line)] px-3 text-[11px] font-medium transition-colors hover:border-[var(--chrome-muted)] disabled:opacity-40"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="7" height="16" rx="1" />
          <rect x="14" y="4" width="7" height="16" rx="1" />
        </svg>
        Compare
      </button>
    </div>
  );
}
