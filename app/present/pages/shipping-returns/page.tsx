'use client';
import { ContentShell } from '@/components/present/content/ContentShell';
export default function Page() {
  return (
    <ContentShell title="Shipping & Returns" eyebrow="Policies">
      <p>In-stock orders ship within 2–3 business days via LTL freight or parcel. Free freight on orders over $500. Freight orders are scheduled with your rep.</p>
      <p className="mt-4">Returns are accepted within 30 days on unused, resaleable goods. Contact your rep to arrange an RMA. Custom and clearance items are final sale.</p>
    </ContentShell>
  );
}
