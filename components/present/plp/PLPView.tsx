'use client';

import { useMemo, useState } from 'react';
import type { Product, Category } from '@/lib/types';
import type { SortOption } from '@/lib/wizsite-spec';
import { usePresentState } from '@/lib/present/usePresentState';
import { getSpec } from '@/lib/present/dataLayer';
import { applyFilters, applySort, applyPagination } from '@/lib/present/filters';
import { PresentHeader } from '../layout/PresentHeader';
import { PresentFooter } from '../layout/PresentFooter';
import { PresentBreadcrumb } from '../layout/PresentBreadcrumb';
import { QuickViewModal } from '../layout/QuickViewModal';
import { Container } from '../ui';
import { PLPProductGrid } from './PLPProductGrid';
import { PLPFilterBar, PLPSortDropdown, PLPPagination, PLPCollectionBanner } from './PLPControls';

export function PLPView({ categorySlug, title, description, breadcrumb, baseProducts, category }: {
  categorySlug: string;
  title: string;
  description?: string;
  breadcrumb: { label: string; href?: string }[];
  baseProducts: Product[];
  category?: Category;
}) {
  const { state } = usePresentState();
  const plp = getSpec().pages.plp;
  const [page, setPage] = useState(1);
  const [qv, setQv] = useState<Product | null>(null);

  const filters = state.activeFilters[categorySlug] ?? {};
  const sort = (state.activeSort[categorySlug] as SortOption) ?? plp.defaultSort;

  const filtered = useMemo(() => applySort(applyFilters(baseProducts, filters), sort), [baseProducts, filters, sort]);
  const paged = applyPagination(filtered, page, plp.pagination.perPage);

  return (
    <>
      <PresentHeader />
      <PresentBreadcrumb segments={breadcrumb} />
      <main className="pb-16">
        <Container>
          <PLPCollectionBanner plp={plp} category={category} />
          <h1 className="sf-display text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
          {plp.categoryDescription.enabled && description && <p className="mt-2 max-w-2xl text-[14px] leading-relaxed" style={{ color: 'var(--sf-muted)' }}>{description}</p>}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <PLPFilterBar plp={plp} categorySlug={categorySlug} />
            <div className="flex items-center gap-3 text-[12px]" style={{ color: 'var(--sf-soft)' }}>
              <span>{filtered.length} products</span>
              <PLPSortDropdown categorySlug={categorySlug} allowed={plp.allowedSorts} value={sort} />
            </div>
          </div>
          <div className="mt-8"><PLPProductGrid products={paged} cardConfig={plp.productCard} columns={plp.grid.columns} onQuickView={setQv} /></div>
          <PLPPagination total={filtered.length} perPage={plp.pagination.perPage} page={page} onPage={setPage} />
        </Container>
      </main>
      <PresentFooter />
      {qv && <QuickViewModal product={qv} onClose={() => setQv(null)} />}
    </>
  );
}
