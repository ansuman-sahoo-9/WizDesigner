'use client';

import type { ReactNode } from 'react';
import { PresentHeader } from '../layout/PresentHeader';
import { PresentFooter } from '../layout/PresentFooter';
import { PresentBreadcrumb } from '../layout/PresentBreadcrumb';
import { Container } from '../ui';

export function ContentShell({ title, eyebrow, children }: { title: string; eyebrow?: string; children: ReactNode }) {
  return (
    <>
      <PresentHeader />
      <PresentBreadcrumb segments={[{ label: title }]} />
      <main className="pb-20">
        <Container className="max-w-3xl pt-4">
          {eyebrow && <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--sf-brand)' }}>{eyebrow}</div>}
          <h1 className="sf-display text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
          <div className="mt-6 text-[14px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>{children}</div>
        </Container>
      </main>
      <PresentFooter />
    </>
  );
}
