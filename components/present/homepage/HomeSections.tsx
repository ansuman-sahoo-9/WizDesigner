'use client';

// Present Mode V2 — homepage sections (Steps 75–88, consolidated into one
// dispatcher for delivery). Each renders from the WizSiteSpec homepage section.

import { useState } from 'react';
import type { HomepageSection } from '@/lib/wizsite-spec';
import { usePresentState } from '@/lib/present/usePresentState';
import { getSpec, getPresentCatalog } from '@/lib/present/dataLayer';
import { dummyTradeShows } from '@/lib/present/dummyData';
import { slugify } from '@/lib/present/slugify';
import { createToast } from '@/lib/present/toasts';
import { Container, Img, PLink, SfButton, money } from '../ui';
import { PLPProductCard } from '../plp/PLPProductCard';

const HERO_IMG = 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1400&q=70';
const catImg = (catId: string) => getPresentCatalog().products.find((p) => p.category === catId && p.imageUrl)?.imageUrl || '';

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: 'var(--sf-brand)' }}>{children}</div>;
}
function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="sf-display text-3xl font-semibold tracking-tight md:text-4xl">{children}</h2>;
}

function Hero({ variant }: { variant: string }) {
  const spec = getSpec();
  const head = `${spec.meta.industry} crafted for the trade.`;
  if (variant === 'C') {
    return (
      <section className="relative min-h-[480px] overflow-hidden">
        <Img src={HERO_IMG} alt="" ratio="" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(0,0,0,.6),rgba(0,0,0,.1))' }} />
        <Container className="relative flex min-h-[480px] flex-col justify-center text-white">
          <div className="max-w-xl"><div className="mb-2 text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--sf-accent)' }}>Wholesale</div>
            <h1 className="sf-display text-5xl font-semibold">{head}</h1>
            <PLink href="/signup" className="mt-6 inline-block"><SfButton>Apply for Trade</SfButton></PLink></div>
        </Container>
      </section>
    );
  }
  return (
    <section className="grid items-stretch md:grid-cols-2" style={{ background: 'var(--sf-surface)' }}>
      <div className="flex flex-col justify-center px-8 py-16 md:px-14">
        <Eyebrow>New Season · {spec.meta.industry}</Eyebrow>
        <h1 className="sf-display text-4xl font-semibold tracking-tight md:text-5xl">{head}</h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>{spec.brand.name} supplies independent retailers and designers — wholesale pricing, deep inventory, freight built for volume.</p>
        <div className="mt-7 flex gap-3"><PLink href="/signup"><SfButton>Open a Trade Account</SfButton></PLink><PLink href="/category/seating"><SfButton filled={false}>Shop Catalog</SfButton></PLink></div>
      </div>
      <Img src={HERO_IMG} alt="" ratio="" className="min-h-[340px]" />
    </section>
  );
}

function CategoryGrid() {
  const cats = getPresentCatalog().categories.slice(0, 6);
  return (
    <section className="sf-pad-y py-14" style={{ background: 'var(--sf-bg)' }}>
      <Container><Eyebrow>Shop by Category</Eyebrow><Heading>Collections for volume buyers</Heading>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {cats.map((c) => (
            <PLink key={c.id} href={`/category/${slugify(c.name)}`} className="group relative block overflow-hidden">
              <Img src={catImg(c.id)} alt={c.name} ratio="aspect-[4/5]" />
              <span className="absolute inset-0 flex items-end p-5" style={{ background: 'linear-gradient(0deg,rgba(0,0,0,.5),transparent 60%)' }}><span className="sf-display text-lg font-semibold text-white">{c.name}</span></span>
            </PLink>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Featured({ onQuickView }: { onQuickView?: (p: import('@/lib/types').Product) => void }) {
  const products = getPresentCatalog().products.slice(0, 4);
  const cc = getSpec().pages.plp.productCard;
  return (
    <section className="sf-pad-y py-14" style={{ background: 'var(--sf-surface)' }}>
      <Container><Eyebrow>Featured</Eyebrow><Heading>This season&apos;s edit</Heading>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">{products.map((p) => <PLPProductCard key={p.sku} product={p} cardConfig={cc} onQuickView={onQuickView} />)}</div>
      </Container>
    </section>
  );
}

function TradeCTA() {
  return (
    <section style={{ background: 'var(--sf-brand)' }}>
      <Container className="flex flex-col items-center justify-between gap-6 py-12 text-center md:flex-row md:text-left" >
        <div style={{ color: 'var(--sf-on-brand)' }}><div className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80">Trade Program</div>
          <h2 className="sf-display mt-2 text-3xl font-semibold md:text-4xl">Open a wholesale account — up to 50% off MSRP</h2></div>
        <PLink href="/signup"><span className="inline-flex px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ background: 'var(--sf-accent)', color: '#111' }}>Apply Now</span></PLink>
      </Container>
    </section>
  );
}

function ValuePillars() {
  const items = [['Net-30 Terms', 'Ship now, pay in 30 days'], ['Low MOQ', 'Open with a $500 first order'], ['Dedicated Rep', 'A real person who knows your store'], ['Fast Freight', 'In-stock ships in 2–3 days']];
  return (
    <section className="py-10" style={{ background: 'var(--sf-bg)', borderTop: '1px solid var(--sf-line)', borderBottom: '1px solid var(--sf-line)' }}>
      <Container className="grid grid-cols-2 gap-6 md:grid-cols-4">{items.map(([t, d]) => <div key={t}><div className="text-[13px] font-semibold">{t}</div><div className="mt-1 text-[12px]" style={{ color: 'var(--sf-muted)' }}>{d}</div></div>)}</Container>
    </section>
  );
}

function TradeShows() {
  return (
    <section className="sf-pad-y py-14" style={{ background: 'var(--sf-bg)' }}>
      <Container><Eyebrow>See us in person</Eyebrow><Heading>Upcoming trade shows</Heading>
        <div className="mt-8 grid gap-4 md:grid-cols-3">{dummyTradeShows.map((s) => <div key={s.name} className="p-5" style={{ background: 'var(--sf-surface)', border: '1px solid var(--sf-line)' }}><div className="sf-display text-lg font-semibold">{s.name}</div><div className="mt-1 text-[13px]" style={{ color: 'var(--sf-muted)' }}>{s.venue}</div><div className="mt-2 text-[12px]" style={{ color: 'var(--sf-soft)' }}>Booth {s.booth} · {s.startDate} – {s.endDate}</div></div>)}</div>
      </Container>
    </section>
  );
}

function Testimonials() {
  const q = [['Reordering is effortless and the margins work for an independent shop.', 'Marin Ellsworth', 'Foothill Mercantile'], ['The trade portal cut our purchasing time in half.', 'Devon Park', 'North & Oak'], ['Best wholesale partner we have — freight is predictable.', 'Priya Raman', 'Studio Verde']];
  return (
    <section className="sf-pad-y py-14" style={{ background: 'var(--sf-surface)' }}>
      <Container><Eyebrow>Loved by buyers</Eyebrow><Heading>What stockists say</Heading>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{q.map(([t, a, c]) => <div key={a} className="p-6" style={{ background: 'var(--sf-bg)', border: '1px solid var(--sf-line)' }}><div style={{ color: 'var(--sf-accent)' }}>★★★★★</div><p className="mt-3 text-[14px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>“{t}”</p><div className="mt-4 text-[12px] font-semibold">{a}</div><div className="text-[11px]" style={{ color: 'var(--sf-soft)' }}>{c}</div></div>)}</div>
      </Container>
    </section>
  );
}

function Newsletter() {
  const { dispatch } = usePresentState();
  const [email, setEmail] = useState('');
  return (
    <section className="sf-pad-y py-14" style={{ background: 'var(--sf-ink)' }}>
      <Container className="text-center" >
        <h2 className="sf-display text-3xl font-semibold" style={{ color: 'var(--sf-on-brand)' }}>Trade news, drops & restocks</h2>
        <div className="mx-auto mt-5 flex max-w-md">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@store.com" className="flex-1 px-4 py-3 text-[13px] outline-none" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }} />
          <button onClick={() => { setEmail(''); dispatch({ type: 'SHOW_TOAST', toast: createToast("Thanks for subscribing! You'll hear from us soon.") }); }} className="px-6 py-3 text-[12px] font-semibold uppercase" style={{ background: 'var(--sf-accent)', color: '#111' }}>Subscribe</button>
        </div>
      </Container>
    </section>
  );
}

function Editorial() {
  return (
    <section className="grid items-stretch md:grid-cols-2" style={{ background: 'var(--sf-bg)' }}>
      <Img src="https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1000&q=70" alt="" ratio="" className="min-h-[320px]" />
      <div className="flex flex-col justify-center px-8 py-14 md:px-14"><Eyebrow>Our Story</Eyebrow><Heading>Made well, priced fairly</Heading><p className="mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>Three decades of in-house design, now backed by the inventory serious buyers depend on.</p><PLink href="/pages/about" className="mt-6"><SfButton filled={false}>Read more</SfButton></PLink></div>
    </section>
  );
}

function Generic({ type }: { type: string }) {
  return <section className="py-12" style={{ background: 'var(--sf-bg)' }}><Container><div className="rounded-md border border-dashed p-6 text-center text-[13px]" style={{ borderColor: 'var(--sf-line)', color: 'var(--sf-soft)' }}>{type} section</div></Container></section>;
}

export function HomeSection({ section, onQuickView }: { section: HomepageSection; onQuickView?: (p: import('@/lib/types').Product) => void }) {
  switch (section.type) {
    case 'hero': return <Hero variant={section.variant} />;
    case 'categoryTileGrid': return <CategoryGrid />;
    case 'featuredCollection':
    case 'tabbedShop': return <Featured onQuickView={onQuickView} />;
    case 'tradeAccountCTA': return <TradeCTA />;
    case 'valuePillars': return <ValuePillars />;
    case 'tradeShowGrid': return <TradeShows />;
    case 'testimonials': return <Testimonials />;
    case 'newsletter': return <Newsletter />;
    case 'editorialBanner': return <Editorial />;
    case 'pressLogoCarousel':
    case 'virtualShowroom':
    case 'dealerLocator':
    case 'customHtml': return <Generic type={section.type} />;
    default: return <Generic type={section.type} />;
  }
}
