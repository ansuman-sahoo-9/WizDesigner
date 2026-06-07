'use client';

import { useState, type ReactNode } from 'react';
import type {
  Variant,
  LogoStyle,
  Product,
  Category,
  WizOrderSimulation,
  PersonaId,
} from '@/lib/types';
import { initials } from '@/lib/format';

// Props every section receives. Sections read theme via --sf-* CSS vars, so they
// only need content + structural inputs here. `business` + `persona` carry the
// Layer-3 WizOrder simulation so sections can render the right rules live.
export type SectionProps = {
  variant: Variant;
  brandName: string;
  logoStyle: LogoStyle;
  logoUrl?: string;
  industry: string;
  products: Product[];
  categories: Category[];
  business: WizOrderSimulation;
  persona: PersonaId;
};

// Brand logo — uploaded image if present, else wordmark / monogram / boxed.
export function Logo({
  name,
  style,
  logoUrl,
  className = '',
  invert = false,
}: {
  name: string;
  style: LogoStyle;
  logoUrl?: string;
  className?: string;
  invert?: boolean;
}) {
  const color = invert ? 'var(--sf-on-brand)' : 'var(--sf-ink)';

  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={name}
        className={`h-9 w-auto max-w-[180px] object-contain ${invert ? 'brightness-0 invert' : ''} ${className}`}
      />
    );
  }
  if (style === 'monogram') {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <span
          className="sf-display grid h-9 w-9 place-items-center text-sm font-bold tracking-tight"
          style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}
        >
          {initials(name)}
        </span>
        <span className="sf-display text-[15px] font-semibold tracking-tight" style={{ color }}>
          {name}
        </span>
      </span>
    );
  }
  if (style === 'boxed') {
    return (
      <span
        className={`sf-display inline-block px-3 py-1.5 text-sm font-bold uppercase tracking-[0.2em] ${className}`}
        style={{ border: `1.5px solid ${color}`, color }}
      >
        {name}
      </span>
    );
  }
  if (style === 'icon_wordmark') {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <span className="grid h-7 w-7 place-items-center rounded-full" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" /></svg>
        </span>
        <span className="sf-display text-lg font-semibold tracking-tight" style={{ color }}>{name}</span>
      </span>
    );
  }
  if (style === 'stacked') {
    return (
      <span className={`inline-flex flex-col items-center leading-none ${className}`}>
        <span className="sf-display text-lg font-semibold tracking-tight" style={{ color }}>{name}</span>
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.34em]" style={{ color: 'var(--sf-brand)' }}>Wholesale</span>
      </span>
    );
  }
  return (
    <span className={`sf-display text-xl font-semibold tracking-tight ${className}`} style={{ color }}>
      {name}
    </span>
  );
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] ${className}`}
      style={{ color: 'var(--sf-brand)' }}
    >
      {children}
    </div>
  );
}

export function SfButton({
  children,
  filled = true,
  className = '',
}: {
  children: ReactNode;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-90 ${className}`}
      style={
        filled
          ? { background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }
          : { border: '1px solid var(--sf-ink)', color: 'var(--sf-ink)' }
      }
    >
      {children}
    </span>
  );
}

// Square product image. On load failure it degrades to a tinted tile with the
// product name instead of showing raw broken-image alt text.
export function ProductImage({
  src,
  alt,
  className = '',
  ratio = 'aspect-[4/5]',
}: {
  src: string;
  alt: string;
  className?: string;
  ratio?: string;
}) {
  const [errored, setErrored] = useState(false);
  const broken = errored || !src;
  return (
    <div
      className={`relative overflow-hidden ${ratio} ${className}`}
      style={{ background: 'var(--sf-faint)' }}
    >
      {broken ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ color: 'var(--sf-soft)' }}>
            <rect x="3" y="3" width="18" height="18" rx="1" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
          </svg>
          {alt && <span className="text-[11px] font-medium leading-tight" style={{ color: 'var(--sf-soft)' }}>{alt}</span>}
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setErrored(true)}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
        />
      )}
    </div>
  );
}

export const PRICE_LOCK = '••• trade';
