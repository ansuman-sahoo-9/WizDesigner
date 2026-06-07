'use client';

import { useMemo, useState } from 'react';
import { useDesign } from '@/lib/DesignContext';
import { computeScope, buildScopeText, buildScopeJson } from '@/lib/exports';
import { useWizSiteSpec } from '@/lib/useWizSiteSpec';
import { validateWizSiteSpec } from '@/lib/wizsite-spec';
import { copyText, downloadText } from '@/lib/download';
import { Modal, GhostButton, PrimaryButton } from './Modal';

type Tab = 'txt' | 'json' | 'spec';

export function ExportScope({ onClose }: { onClose: () => void }) {
  const { state, sections, products, categories } = useDesign();
  const scope = useMemo(
    () => computeScope(state, sections, { products: products.length, categories: categories.length }),
    [state, sections, products, categories],
  );
  const text = useMemo(() => buildScopeText(state, sections, scope), [state, sections, scope]);
  const json = useMemo(() => buildScopeJson(scope), [scope]);

  const spec = useWizSiteSpec();
  const specJson = useMemo(() => JSON.stringify(spec, null, 2), [spec]);
  const validation = useMemo(() => validateWizSiteSpec(spec), [spec]);

  const [tab, setTab] = useState<Tab>('txt');
  const [copied, setCopied] = useState(false);

  const body = tab === 'txt' ? text : tab === 'json' ? json : specJson;

  return (
    <Modal
      title="Export Scope"
      subtitle="Implementation-ready: integrations, features & the full WizSiteSpec V2."
      onClose={onClose}
      footer={
        <>
          <GhostButton onClick={() => downloadText('wizdesigner-scope.txt', text)}>Scope .txt</GhostButton>
          <GhostButton onClick={() => downloadText('wizdesigner-scope.json', json, 'application/json')}>Scope .json</GhostButton>
          <GhostButton onClick={() => downloadText('wizsitespec-v2.json', specJson, 'application/json')}>Spec .json</GhostButton>
          <PrimaryButton
            onClick={async () => {
              if (await copyText(body)) {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }
            }}
          >
            {copied ? 'Copied ✓' : `Copy ${tab.toUpperCase()}`}
          </PrimaryButton>
        </>
      }
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="inline-flex rounded-md bg-[var(--chrome-bg)] p-0.5">
          {(['txt', 'json', 'spec'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded px-3 py-1.5 text-[12px] font-medium ${
                tab === t ? 'bg-white shadow-sm' : 'text-[var(--chrome-muted)]'
              }`}
            >
              {t === 'spec' ? 'SPEC V2' : t.toUpperCase()}
            </button>
          ))}
        </div>
        {tab === 'spec' && (
          <span
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
              validation.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}
            title={validation.ok ? 'Valid WizSiteSpec V2' : validation.errors.join('\n')}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${validation.ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {validation.ok ? 'Valid V2 schema' : `${validation.errors.length} schema issue(s)`}
          </span>
        )}
      </div>
      {tab === 'spec' && (
        <p className="mb-2 text-[11px] leading-snug text-[var(--chrome-muted)]">
          Canonical WizSiteSpec V2 — the single source of truth a WizOrder onboarding system could import directly.
        </p>
      )}
      <pre className="max-h-[52vh] overflow-auto rounded-lg bg-[var(--chrome-bg)] p-4 font-mono text-[12px] leading-relaxed text-[var(--chrome-ink)]">
        {body}
      </pre>
    </Modal>
  );
}
