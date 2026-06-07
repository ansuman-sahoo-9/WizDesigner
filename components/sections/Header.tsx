import type { SectionProps } from './_shared';
import { Logo } from './_shared';

const NAV = ['Shop', 'Collections', 'Trade', 'About', 'Contact'];

function NavLink({ label, invert = false }: { label: string; invert?: boolean }) {
  return (
    <span
      className="cursor-default text-[12px] font-medium uppercase tracking-[0.12em] transition-opacity hover:opacity-60"
      style={{ color: invert ? 'var(--sf-on-brand)' : 'var(--sf-ink)' }}
    >
      {label}
    </span>
  );
}

export function Header({ variant, brandName, logoStyle, logoUrl, business }: SectionProps) {
  const announce = business.marketing;
  // A — Centered editorial
  if (variant === 'A') {
    return (
      <header>
        {announce.announcementBarEnabled && (
          <div
            className="py-2 text-center text-[11px] uppercase tracking-[0.2em]"
            style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}
          >
            {announce.announcementText}
          </div>
        )}
        <div className="sf-container flex flex-col items-center gap-4 py-6">
          <Logo name={brandName} style={logoStyle} logoUrl={logoUrl} />
          <nav className="flex flex-wrap items-center justify-center gap-7">
            {NAV.map((n) => (
              <NavLink key={n} label={n} />
            ))}
          </nav>
        </div>
      </header>
    );
  }

  // B — Inline classic
  if (variant === 'B') {
    return (
      <header style={{ borderBottom: '1px solid var(--sf-line)' }}>
        <div className="sf-container grid grid-cols-3 items-center py-5">
          <Logo name={brandName} style={logoStyle} logoUrl={logoUrl} />
          <nav className="flex items-center justify-center gap-7">
            {NAV.map((n) => (
              <NavLink key={n} label={n} />
            ))}
          </nav>
          <div className="flex items-center justify-end gap-5 text-[12px] font-medium uppercase tracking-[0.12em]">
            <span className="cursor-default hover:opacity-60">Trade Login</span>
            <span
              className="cursor-default px-3 py-1.5"
              style={{ background: 'var(--sf-accent)', color: 'var(--sf-ink)' }}
            >
              Cart (0)
            </span>
          </div>
        </div>
      </header>
    );
  }

  // C — Dark mega-menu
  if (variant === 'C') {
    return (
      <header style={{ background: 'var(--sf-ink)' }}>
        <div className="sf-container flex items-center justify-between py-5">
          <Logo name={brandName} style={logoStyle} logoUrl={logoUrl} invert />
          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <span
                key={n}
                className="flex cursor-default items-center gap-1 text-[12px] font-medium uppercase tracking-[0.12em] text-white/80 hover:text-white"
              >
                {n}
                <svg width="9" height="9" viewBox="0 0 10 10" className="opacity-50">
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
                </svg>
              </span>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-white/80">
            <span className="text-[12px] font-medium uppercase tracking-[0.12em] hover:text-white">
              Account
            </span>
            <span
              className="px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em]"
              style={{ background: 'var(--sf-accent)', color: '#111' }}
            >
              Cart
            </span>
          </div>
        </div>
      </header>
    );
  }

  // D — Stacked utility
  return (
    <header style={{ borderBottom: '1px solid var(--sf-line)' }}>
      <div style={{ background: 'var(--sf-faint)' }}>
        <div className="sf-container flex items-center justify-between py-2 text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--sf-muted)' }}>
          <span>Free freight on orders over $2,500</span>
          <div className="flex gap-5">
            <span className="cursor-default hover:opacity-60">Trade Login</span>
            <span className="cursor-default hover:opacity-60">USD $</span>
            <span className="cursor-default hover:opacity-60">Help</span>
          </div>
        </div>
      </div>
      <div className="sf-container flex items-center justify-between gap-6 py-5">
        <Logo name={brandName} style={logoStyle} logoUrl={logoUrl} />
        <div
          className="flex flex-1 items-center px-4 py-2.5 text-[13px]"
          style={{ border: '1px solid var(--sf-line)', color: 'var(--sf-soft)', maxWidth: 460 }}
        >
          Search the catalog…
        </div>
        <div className="flex items-center gap-4 text-[12px] font-semibold uppercase tracking-[0.12em]">
          <span className="cursor-default">Quick Order</span>
          <span className="cursor-default px-3 py-1.5" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>
            Cart (0)
          </span>
        </div>
      </div>
      <nav className="sf-container flex items-center gap-7 pb-3">
        {NAV.map((n) => (
          <NavLink key={n} label={n} />
        ))}
      </nav>
    </header>
  );
}
