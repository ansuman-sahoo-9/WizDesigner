'use client';

import { useRef, useState } from 'react';
import { useDesign } from '@/lib/DesignContext';
import type { Version } from '@/lib/types';
import { StorefrontPreview } from './StorefrontPreview';
import { paletteById, fontById } from '@/lib/themes';

function versionMeta(v: Version) {
  const pal = v.palette === 'custom' ? 'Custom' : paletteById(v.palette).name;
  return `${v.brandName} · ${pal} · ${fontById(v.font).display}`;
}

function stripMeta(v: Version) {
  const { id: _i, name: _n, createdAt: _c, ...st } = v;
  void _i; void _n; void _c;
  return st;
}

export function CompareMode({ onExit }: { onExit: () => void }) {
  const { versions, applyState } = useDesign();

  const [leftId, setLeftId] = useState<string>(versions[versions.length - 1]?.id ?? '');
  const [rightId, setRightId] = useState<string>(versions[versions.length - 2]?.id ?? versions[0]?.id ?? '');

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);

  const mirror = (from: HTMLDivElement | null, to: HTMLDivElement | null) => {
    if (!from || !to || syncing.current) return;
    syncing.current = true;
    const ratio = from.scrollTop / Math.max(1, from.scrollHeight - from.clientHeight);
    to.scrollTop = ratio * (to.scrollHeight - to.clientHeight);
    requestAnimationFrame(() => (syncing.current = false));
  };

  const Side = ({
    side,
    value,
    setValue,
    refEl,
    onMirror,
  }: {
    side: 'left' | 'right';
    value: string;
    setValue: (v: string) => void;
    refEl: React.RefObject<HTMLDivElement | null>;
    onMirror: () => void;
  }) => {
    const v = versions.find((x) => x.id === value);
    return (
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--chrome-line)] bg-[var(--chrome-panel)] px-4 py-2.5">
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-w-0 flex-1 rounded-md border border-[var(--chrome-line)] bg-white px-2.5 py-1.5 text-[12px] font-semibold outline-none"
          >
            {versions.map((x) => (
              <option key={x.id} value={x.id}>{x.name}</option>
            ))}
          </select>
          {v && <span className="hidden truncate text-[11px] text-[var(--chrome-muted)] lg:block">{versionMeta(v)}</span>}
          {v && (
            <button
              onClick={() => {
                applyState(stripMeta(v));
                onExit();
              }}
              className="flex-none rounded-md bg-[var(--chrome-ink)] px-3 py-1.5 text-[11px] font-semibold text-white hover:opacity-90"
            >
              {side === 'left' ? '← Use this' : 'Use this →'}
            </button>
          )}
        </div>
        <div ref={refEl} onScroll={onMirror} className="wd-scroll flex-1 overflow-y-auto bg-white">
          {v ? (
            <div style={{ zoom: 0.5 as unknown as number }}>
              <StorefrontPreview showSwitchers={false} stateOverride={stripMeta(v)} />
            </div>
          ) : (
            <div className="grid h-full place-items-center text-[13px] text-[var(--chrome-muted)]">Select a version</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--chrome-bg)] wd-fade">
      <div className="flex items-center justify-between border-b border-[var(--chrome-line)] bg-[var(--chrome-panel)] px-5 py-3">
        <div className="flex items-center gap-2 text-[13px] font-semibold">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="4" width="7" height="16" rx="1" />
            <rect x="14" y="4" width="7" height="16" rx="1" />
          </svg>
          Compare Versions
          <span className="font-normal text-[var(--chrome-muted)]">· synchronized scroll · pick a side to make it current</span>
        </div>
        <button onClick={onExit} className="rounded-md border border-[var(--chrome-line)] px-3 py-1.5 text-[12px] font-medium hover:border-[var(--chrome-muted)]">
          Close
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden divide-x divide-[var(--chrome-line)]">
        <Side side="left" value={leftId} setValue={setLeftId} refEl={leftRef} onMirror={() => mirror(leftRef.current, rightRef.current)} />
        <Side side="right" value={rightId} setValue={setRightId} refEl={rightRef} onMirror={() => mirror(rightRef.current, leftRef.current)} />
      </div>
    </div>
  );
}
