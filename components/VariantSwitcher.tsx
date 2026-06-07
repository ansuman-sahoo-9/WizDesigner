'use client';

import type { Variant } from '@/lib/types';

type Props = {
  sectionId: string;
  current: Variant;
  onChange: (v: Variant) => void;
  available?: Variant[];
};

const ALL: Variant[] = ['A', 'B', 'C', 'D'];

export function VariantSwitcher({ sectionId, current, onChange, available = ALL }: Props) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-[var(--chrome-dark)] p-1 text-[11px] font-mono shadow-lg shadow-black/20 ring-1 ring-black/20">
      <span className="px-2.5 py-1 uppercase tracking-[0.12em] text-zinc-500">
        {sectionId}
      </span>
      {available.map((v) => {
        const active = current === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            aria-pressed={active}
            className={`h-6 w-6 rounded-full transition-colors ${
              active
                ? 'bg-[var(--chrome-accent)] font-bold text-zinc-900'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
}
