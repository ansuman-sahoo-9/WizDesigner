'use client';
import { ContentShell } from '@/components/present/content/ContentShell';
export default function Page() {
  return (
    <ContentShell title="Contact" eyebrow="Get in touch">
      <p>Our trade team is here to help with orders, terms, and freight.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 text-[14px]" style={{ color: 'var(--sf-ink)' }}>
        <div className="rounded-md border p-4" style={{ borderColor: 'var(--sf-line)' }}><div className="font-semibold">Wholesale Orders</div><div className="mt-1" style={{ color: 'var(--sf-muted)' }}>orders@brand.example<br/>(800) 555-0100</div></div>
        <div className="rounded-md border p-4" style={{ borderColor: 'var(--sf-line)' }}><div className="font-semibold">Customer Care</div><div className="mt-1" style={{ color: 'var(--sf-muted)' }}>care@brand.example<br/>Mon–Fri, 9–5 ET</div></div>
      </div>
    </ContentShell>
  );
}
