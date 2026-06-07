'use client';

import { useMemo, useState } from 'react';
import { useDesign } from '@/lib/DesignContext';
import { buildSummaryText } from '@/lib/exports';
import { copyText, downloadText } from '@/lib/download';
import { Modal, GhostButton, PrimaryButton } from './Modal';

export function ExportSummary({ onClose }: { onClose: () => void }) {
  const { state, sections } = useDesign();
  const text = useMemo(() => buildSummaryText(state, sections), [state, sections]);
  const [copied, setCopied] = useState(false);

  return (
    <Modal
      title="Export Summary"
      subtitle="A clean recap of the current design direction."
      onClose={onClose}
      footer={
        <>
          <GhostButton onClick={() => downloadText('wizdesigner-summary.txt', text)}>Download .txt</GhostButton>
          <PrimaryButton
            onClick={async () => {
              if (await copyText(text)) {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }
            }}
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </PrimaryButton>
        </>
      }
    >
      <pre className="overflow-x-auto rounded-lg bg-[var(--chrome-bg)] p-4 font-mono text-[12px] leading-relaxed text-[var(--chrome-ink)]">
        {text}
      </pre>
    </Modal>
  );
}
