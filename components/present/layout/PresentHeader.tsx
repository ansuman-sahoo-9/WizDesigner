'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePresentState } from '@/lib/present/usePresentState';
import { getSpec, getPresentCatalog, loadDesignState } from '@/lib/present/dataLayer';
import { resolveBrands } from '@/lib/brands';
import { slugify } from '@/lib/present/slugify';
import { Logo } from '@/components/sections/_shared';
import { PLink, px, Container } from '../ui';
import { SearchPanel } from './SearchPanel';

function navHref(label: string, href: string | undefined, firstCat: string): string {
  const l = label.toLowerCase();
  if (l.includes('shop') || l.includes('product')) return `/category/${firstCat}`;
  if (l.includes('collection')) return `/collection/${firstCat}`;
  if (l.includes('trade')) return '/pages/trade-program';
  if (l.includes('about')) return '/pages/about';
  if (l.includes('contact')) return '/pages/contact';
  return href ? href : '/';
}

export function PresentHeader() {
  const router = useRouter();
  const { state, dispatch } = usePresentState();
  const spec = useMemo(() => getSpec(), []);
  const cats = useMemo(() => getPresentCatalog().categories, []);
  const ds = useMemo(() => loadDesignState(), []);
  const brands = useMemo(() => (ds ? resolveBrands(ds) : []), [ds]);
  const activeBrand = brands.find((b) => b.id === state.activeBrandId) ?? brands[0];
  const firstCat = cats[0] ? slugify(cats[0].name) : 'all';

  const [searchOpen, setSearchOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = spec.navigation.header;
  const items = (state.auth.isLoggedIn && nav.authNavItems.length ? nav.authNavItems : nav.guestNavItems);
  const ann = spec.navigation.announcementBar;

  return (
    <header style={{ background: 'var(--sf-surface)', borderBottom: '1px solid var(--sf-line)' }}>
      {ann.enabled && (
        <div className="py-2 text-center text-[11px] uppercase tracking-[0.18em]" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>
          {ann.text}
        </div>
      )}

      {/* Brand switcher */}
      {spec.multiBrand.enabled && brands.length > 1 && (
        <div className="border-b" style={{ borderColor: 'var(--sf-line)', background: 'var(--sf-faint)' }}>
          <Container className="flex items-center gap-1 py-1.5">
            <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--sf-soft)' }}>Brands</span>
            {brands.map((b) => {
              const active = (state.activeBrandId || brands[0].id) === b.id;
              return (
                <button key={b.id} onClick={() => dispatch({ type: 'SET_ACTIVE_BRAND', id: b.id })}
                  className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
                  style={active ? { background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' } : { color: 'var(--sf-muted)' }}>
                  {b.name}
                </button>
              );
            })}
          </Container>
        </div>
      )}

      <Container className="flex items-center justify-between gap-4 py-4">
        <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>

        <PLink href="/">{activeBrand ? <Logo name={activeBrand.name} style={activeBrand.logoStyle} logoUrl={activeBrand.logoUrl} /> : <span className="sf-display text-xl font-semibold">{spec.brand.name}</span>}</PLink>

        <nav className="hidden items-center gap-6 lg:flex">
          {items.map((item, i) => {
            const href = navHref(item.label, item.href, firstCat);
            if (item.type === 'mega_menu' && item.megaMenu) {
              return (
                <div key={i} className="group relative">
                  <span className="cursor-default text-[12px] font-medium uppercase tracking-[0.1em]">{item.label}</span>
                  <div className="invisible absolute left-1/2 top-full z-30 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
                    <div className="flex gap-8 rounded-md p-5 shadow-xl ring-1 ring-black/10" style={{ background: 'var(--sf-surface)' }}>
                      {item.megaMenu.columns.map((col, ci) => (
                        <div key={ci}>
                          {col.heading && <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--sf-soft)' }}>{col.heading}</div>}
                          <ul className="space-y-1.5">{col.links.map((lk, li) => <li key={li}><PLink href={navHref(lk.label, lk.href, firstCat)} className="text-[12px] hover:opacity-60">{lk.label}</PLink></li>)}</ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return <PLink key={i} href={href} className="text-[12px] font-medium uppercase tracking-[0.1em] hover:opacity-60">{item.label}</PLink>;
          })}
          {!state.auth.isLoggedIn && nav.unauthCTAItem && (
            <PLink href="/signup" className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--sf-brand)' }}>{nav.unauthCTAItem.label}</PLink>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={() => setSearchOpen(true)} aria-label="Search"><Icon path="M21 21l-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" /></button>
          <div className="relative">
            <button onClick={() => (state.auth.isLoggedIn ? setAcctOpen((v) => !v) : router.push(px('/login')))} aria-label="Account"><Icon path="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0" /></button>
            {acctOpen && state.auth.isLoggedIn && (
              <div className="absolute right-0 top-full z-30 mt-2 w-44 rounded-md py-1 shadow-xl ring-1 ring-black/10" style={{ background: 'var(--sf-surface)' }}>
                {[['Profile', '/account'], ['Orders', '/account/orders'], ['Wishlists', '/account/wishlists'], ['Invoices', '/account/invoices']].map(([l, h]) => (
                  <PLink key={h} href={h} className="block px-4 py-2 text-[13px] hover:bg-[var(--sf-faint)]">{l}</PLink>
                ))}
                <button onClick={() => { dispatch({ type: 'LOGOUT' }); setAcctOpen(false); router.push(px('/')); }} className="block w-full px-4 py-2 text-left text-[13px] hover:bg-[var(--sf-faint)]">Logout</button>
              </div>
            )}
          </div>
          {spec.navigation.header.showWishlistIcon && <PLink href="/account/wishlists" aria-label="Wishlist"><Icon path="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" /></PLink>}
          <PLink href="/cart" className="relative" aria-label="Cart">
            <Icon path="M6 6h15l-1.5 9h-12zM6 6L5 3H2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            {state.cart.items.length > 0 && <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-bold" style={{ background: 'var(--sf-accent)', color: '#111' }}>{state.cart.items.reduce((n, i) => n + i.qty, 0)}</span>}
          </PLink>
        </div>
      </Container>

      {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 p-5" style={{ background: 'var(--sf-surface)' }}>
            <button onClick={() => setMobileOpen(false)} className="mb-4 text-[var(--sf-soft)]">✕ Close</button>
            <nav className="flex flex-col gap-3">
              {items.map((item, i) => <PLink key={i} href={navHref(item.label, item.href, firstCat)} className="text-[14px] font-medium uppercase tracking-[0.08em]">{item.label}</PLink>)}
              <PLink href="/account" className="text-[14px] font-medium uppercase tracking-[0.08em]">Account</PLink>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function Icon({ path }: { path: string }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ color: 'var(--sf-ink)' }}><path d={path} /></svg>;
}
