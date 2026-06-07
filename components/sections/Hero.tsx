import type { SectionProps } from './_shared';
import { Eyebrow, SfButton, ProductImage } from './_shared';

const HERO_IMG = 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1400&q=70';
const HERO_IMG_2 = 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=70';
const HERO_IMG_3 = 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=900&q=70';
const HERO_IMG_4 = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=70';

export function Hero({ variant, brandName, industry }: SectionProps) {
  const headline = `${industry} crafted for the trade.`;
  const sub = `${brandName} supplies independent retailers and designers with considered ${industry.toLowerCase()} — wholesale pricing, deep inventory, and freight built for volume.`;

  // A — Editorial: big centered statement over generous whitespace
  if (variant === 'A') {
    return (
      <section className="sf-pad-y" style={{ background: 'var(--sf-surface)' }}>
        <div className="sf-container max-w-3xl text-center">
          <Eyebrow className="mx-auto">Wholesale · Trade Program</Eyebrow>
          <h1 className="sf-display text-5xl font-semibold tracking-tight md:text-6xl">{headline}</h1>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>
            {sub}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <SfButton>Apply for Trade</SfButton>
            <SfButton filled={false}>Browse Catalog</SfButton>
          </div>
        </div>
      </section>
    );
  }

  // B — Split: copy left, image right
  if (variant === 'B') {
    return (
      <section className="grid items-stretch md:grid-cols-2" style={{ background: 'var(--sf-surface)' }}>
        <div className="flex flex-col justify-center px-8 py-16 md:px-14">
          <Eyebrow>New Season · {industry}</Eyebrow>
          <h1 className="sf-display text-4xl font-semibold tracking-tight md:text-5xl">{headline}</h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>
            {sub}
          </p>
          <div className="mt-7 flex gap-3">
            <SfButton>Open a Trade Account</SfButton>
            <SfButton filled={false}>Download Linesheet</SfButton>
          </div>
        </div>
        <div className="min-h-[340px]">
          <ProductImage src={HERO_IMG} alt={`${brandName} hero`} ratio="h-full" className="h-full" />
        </div>
      </section>
    );
  }

  // C — Cinematic: full-bleed image with overlaid copy
  if (variant === 'C') {
    return (
      <section className="relative min-h-[520px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_IMG} alt={`${brandName} hero`} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.15) 70%)' }} />
        <div className="sf-container relative flex min-h-[520px] flex-col justify-center">
          <div className="max-w-xl text-white">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--sf-accent)' }}>
              Wholesale Collection
            </div>
            <h1 className="sf-display text-5xl font-semibold tracking-tight md:text-6xl">{headline}</h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/80">{sub}</p>
            <div className="mt-8 flex gap-3">
              <SfButton>Shop the Collection</SfButton>
              <span className="inline-flex items-center justify-center border border-white/60 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white">
                Trade Login
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // D — Image grid: copy band + four-image mosaic
  return (
    <section className="sf-pad-y" style={{ background: 'var(--sf-surface)' }}>
      <div className="sf-container">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl">
            <Eyebrow>Lookbook · {industry}</Eyebrow>
            <h1 className="sf-display text-4xl font-semibold tracking-tight md:text-5xl">{headline}</h1>
          </div>
          <SfButton>View Lookbook</SfButton>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[HERO_IMG, HERO_IMG_2, HERO_IMG_3, HERO_IMG_4].map((src, i) => (
            <ProductImage key={i} src={src} alt={`look ${i + 1}`} ratio={i % 2 ? 'aspect-[3/4]' : 'aspect-[4/5]'} />
          ))}
        </div>
      </div>
    </section>
  );
}
