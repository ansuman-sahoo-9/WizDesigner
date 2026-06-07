'use client';

// Present Mode V2 — tiny shared UI primitives.

import Link from 'next/link';
import type { ReactNode } from 'react';

// Prefix every in-store link with /present.
export const px = (path: string) => `/present${path.startsWith('/') ? '' : '/'}${path}`;

export function PLink({ href, children, className, style }: { href: string; children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <Link href={px(href)} className={className} style={style}>
      {children}
    </Link>
  );
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-5 ${className}`}>{children}</div>;
}

export function SfButton({ children, filled = true, className = '', as = 'span' }: { children: ReactNode; filled?: boolean; className?: string; as?: 'span' | 'button' }) {
  const Cmp = as;
  return (
    <Cmp
      className={`inline-flex cursor-pointer items-center justify-center px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-90 ${className}`}
      style={filled ? { background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' } : { border: '1px solid var(--sf-ink)', color: 'var(--sf-ink)' }}
    >
      {children}
    </Cmp>
  );
}

export function money(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// Square image with graceful empty/broken fallback.
export function Img({ src, alt, className = '', ratio = 'aspect-[4/5]' }: { src: string; alt: string; className?: string; ratio?: string }) {
  return (
    <span className={`relative block overflow-hidden ${ratio} ${className}`} style={{ background: 'var(--sf-faint)' }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <span className="absolute inset-0 grid place-items-center px-2 text-center text-[11px]" style={{ color: 'var(--sf-soft)' }}>{alt}</span>
      )}
    </span>
  );
}
