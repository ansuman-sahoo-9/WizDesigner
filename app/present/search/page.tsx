'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllProducts } from '@/lib/present/dataLayer';
import { searchProducts } from '@/lib/present/search';
import { PLPView } from '@/components/present/plp/PLPView';

function SearchInner() {
  const q = useSearchParams().get('q') ?? '';
  const results = searchProducts(q, getAllProducts());
  return (
    <PLPView
      categorySlug="search"
      title={results.length ? `${results.length} result${results.length === 1 ? '' : 's'} for “${q}”` : `No results for “${q}”`}
      description={results.length ? undefined : 'Try a different search term, or browse by category.'}
      breadcrumb={[{ label: 'Search Results' }]}
      baseProducts={results}
    />
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchInner />
    </Suspense>
  );
}
