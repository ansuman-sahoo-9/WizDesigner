'use client';

import { PLink, Container } from '../ui';

export function PresentBreadcrumb({ segments }: { segments: { label: string; href?: string }[] }) {
  const all = [{ label: 'Home', href: '/' }, ...segments];
  return (
    <Container className="py-3 text-[12px]" >
      <nav className="flex flex-wrap items-center gap-1.5" style={{ color: 'var(--sf-soft)' }}>
        {all.map((s, i) => {
          const last = i === all.length - 1;
          return (
            <span key={i} className="flex items-center gap-1.5">
              {last || !s.href ? <span style={{ color: last ? 'var(--sf-ink)' : undefined }}>{s.label}</span> : <PLink href={s.href} className="hover:opacity-70">{s.label}</PLink>}
              {!last && <span>/</span>}
            </span>
          );
        })}
      </nav>
    </Container>
  );
}
