'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import { getSpec } from '@/lib/present/dataLayer';
import { PresentHeader } from '@/components/present/layout/PresentHeader';
import { PresentFooter } from '@/components/present/layout/PresentFooter';
import { QuickViewModal } from '@/components/present/layout/QuickViewModal';
import { HomeSection } from '@/components/present/homepage/HomeSections';

export default function PresentHome() {
  const sections = useMemo(() => getSpec().brand.homepage.sections.filter((s) => s.enabled).sort((a, b) => a.order - b.order), []);
  const [qv, setQv] = useState<Product | null>(null);

  return (
    <>
      <PresentHeader />
      <main>
        {sections.map((s) => <HomeSection key={s.id} section={s} onQuickView={setQv} />)}
      </main>
      <PresentFooter />
      {qv && <QuickViewModal product={qv} onClose={() => setQv(null)} />}
    </>
  );
}
