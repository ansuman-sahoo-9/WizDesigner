import type { SectionProps } from './_shared';
import type { Category, Product } from '@/lib/types';
import { Eyebrow, ProductImage } from './_shared';

function imageFor(cat: Category, products: Product[]): string {
  const p = products.find((p) => p.category === cat.id && p.imageUrl);
  return p?.imageUrl || 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=70';
}

function Heading({ children }: { children: string }) {
  return (
    <div className="sf-container mb-8">
      <Eyebrow>Shop by Category</Eyebrow>
      <h2 className="sf-display text-3xl font-semibold tracking-tight md:text-4xl">{children}</h2>
    </div>
  );
}

export function Categories({ variant, categories, products }: SectionProps) {
  const cats = categories.slice(0, 6);

  // A — Big image cards
  if (variant === 'A') {
    return (
      <section className="sf-pad-y" style={{ background: 'var(--sf-bg)' }}>
        <Heading>Collections built for volume buyers</Heading>
        <div className="sf-container grid grid-cols-2 gap-4 md:grid-cols-3">
          {cats.map((c) => (
            <div key={c.id} className="group relative cursor-default overflow-hidden">
              <ProductImage src={imageFor(c, products)} alt={c.name} ratio="aspect-[4/5]" />
              <div className="absolute inset-0 flex items-end p-5" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.55), transparent 60%)' }}>
                <span className="sf-display text-lg font-semibold text-white">{c.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // B — Icon grid
  if (variant === 'B') {
    return (
      <section className="sf-pad-y" style={{ background: 'var(--sf-bg)' }}>
        <Heading>Browse the catalog</Heading>
        <div className="sf-container grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {cats.map((c) => (
            <div
              key={c.id}
              className="flex flex-col items-center gap-3 px-3 py-7 text-center transition-colors hover:bg-[var(--sf-faint)]"
              style={{ border: '1px solid var(--sf-line)' }}
            >
              <span className="grid h-12 w-12 place-items-center rounded-full" style={{ background: 'var(--sf-faint)', color: 'var(--sf-brand)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="1" />
                  <path d="M3 9h18M9 3v18" />
                </svg>
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-[0.1em]">{c.name}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // C — Staggered bento
  if (variant === 'C') {
    const span = ['md:col-span-2 md:row-span-2', '', '', 'md:col-span-2', '', ''];
    return (
      <section className="sf-pad-y" style={{ background: 'var(--sf-bg)' }}>
        <Heading>Curated departments</Heading>
        <div className="sf-container grid auto-rows-[180px] grid-cols-2 gap-3 md:grid-cols-4">
          {cats.map((c, i) => (
            <div key={c.id} className={`group relative overflow-hidden ${span[i] ?? ''}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageFor(c, products)} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 flex items-end p-4" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.5), transparent 55%)' }}>
                <span className="sf-display text-base font-semibold text-white">{c.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // D — Horizontal scroll
  return (
    <section className="sf-pad-y" style={{ background: 'var(--sf-bg)' }}>
      <Heading>Shop the departments</Heading>
      <div className="no-bar flex gap-4 overflow-x-auto px-8 pb-2">
        {cats.concat(cats.slice(0, 2)).map((c, i) => (
          <div key={i} className="w-[260px] flex-none">
            <ProductImage src={imageFor(c, products)} alt={c.name} ratio="aspect-[3/4]" />
            <div className="mt-3 flex items-center justify-between">
              <span className="sf-display text-base font-semibold">{c.name}</span>
              <span className="text-[12px]" style={{ color: 'var(--sf-muted)' }}>Shop →</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
