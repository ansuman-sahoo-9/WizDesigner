import type { SectionProps } from './_shared';
import { Logo } from './_shared';

const COLS: [string, string[]][] = [
  ['Shop', ['New Arrivals', 'Best Sellers', 'Collections', 'Clearance']],
  ['Trade', ['Apply for Account', 'Net Terms', 'Linesheets', 'Freight Policy']],
  ['Company', ['Our Story', 'Sustainability', 'Press', 'Careers']],
  ['Support', ['Contact', 'Order Status', 'Returns', 'FAQ']],
];

function Link({ children }: { children: string }) {
  return <li className="cursor-default text-[13px] transition-opacity hover:opacity-60" style={{ color: 'var(--sf-muted)' }}>{children}</li>;
}

export function Footer({ variant, brandName, logoStyle, logoUrl, business }: SectionProps) {
  const badge = business.marketing.poweredByBadge ? ' — built on WizShop' : '';
  // A — Big 5-col
  if (variant === 'A') {
    return (
      <footer style={{ background: 'var(--sf-surface)', borderTop: '1px solid var(--sf-line)' }}>
        <div className="sf-container grid gap-10 py-16 md:grid-cols-5">
          <div className="md:col-span-1">
            <Logo name={brandName} style={logoStyle} logoUrl={logoUrl} />
            <p className="mt-4 text-[13px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>
              Wholesale, made considered. Trade pricing, net terms, reliable freight.
            </p>
          </div>
          {COLS.map(([h, items]) => (
            <div key={h}>
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--sf-ink)' }}>{h}</div>
              <ul className="space-y-2.5">{items.map((i) => <Link key={i}>{i}</Link>)}</ul>
            </div>
          ))}
        </div>
        <div className="sf-container flex items-center justify-between py-5 text-[12px]" style={{ borderTop: '1px solid var(--sf-line)', color: 'var(--sf-soft)' }}>
          <span>© {brandName}{badge}</span>
          <span>Privacy · Terms</span>
        </div>
      </footer>
    );
  }

  // B — Minimal centered
  if (variant === 'B') {
    return (
      <footer style={{ background: 'var(--sf-surface)', borderTop: '1px solid var(--sf-line)' }}>
        <div className="sf-container flex flex-col items-center gap-5 py-14 text-center">
          <Logo name={brandName} style={logoStyle} logoUrl={logoUrl} />
          <nav className="flex flex-wrap justify-center gap-6">
            {['Shop', 'Trade', 'About', 'Contact', 'FAQ'].map((n) => (
              <span key={n} className="cursor-default text-[12px] uppercase tracking-[0.12em]" style={{ color: 'var(--sf-muted)' }}>{n}</span>
            ))}
          </nav>
          <span className="text-[12px]" style={{ color: 'var(--sf-soft)' }}>© {brandName}{badge}</span>
        </div>
      </footer>
    );
  }

  // C — Newsletter-led
  if (variant === 'C') {
    return (
      <footer style={{ background: 'var(--sf-ink)' }}>
        <div className="sf-container py-16" style={{ color: 'var(--sf-on-brand)' }}>
          <div className="grid items-center gap-8 pb-12 md:grid-cols-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
            <div>
              <h3 className="sf-display text-3xl font-semibold tracking-tight">Trade news, drops & restocks</h3>
              <p className="mt-2 text-[14px] text-white/60">Join the buyer list. New collections and reorder alerts, monthly.</p>
            </div>
            <div className="flex">
              <span className="flex-1 px-4 py-3.5 text-[13px] text-white/50" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>your@store.com</span>
              <span className="px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ background: 'var(--sf-accent)', color: '#111' }}>Subscribe</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-6">
            <Logo name={brandName} style={logoStyle} logoUrl={logoUrl} invert />
            <span className="text-[12px] text-white/50">© {brandName}{badge}</span>
          </div>
        </div>
      </footer>
    );
  }

  // D — Wide row
  return (
    <footer style={{ background: 'var(--sf-surface)', borderTop: '1px solid var(--sf-line)' }}>
      <div className="sf-container flex flex-col items-center justify-between gap-6 py-8 md:flex-row">
        <Logo name={brandName} style={logoStyle} logoUrl={logoUrl} />
        <nav className="flex flex-wrap justify-center gap-6">
          {['New', 'Collections', 'Trade Program', 'Net Terms', 'About', 'Contact', 'FAQ'].map((n) => (
            <span key={n} className="cursor-default text-[12px] uppercase tracking-[0.12em]" style={{ color: 'var(--sf-muted)' }}>{n}</span>
          ))}
        </nav>
        <span className="text-[12px]" style={{ color: 'var(--sf-soft)' }}>© {brandName}</span>
      </div>
    </footer>
  );
}
