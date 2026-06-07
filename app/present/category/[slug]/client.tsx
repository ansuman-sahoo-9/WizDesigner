'use client';

import { use } from 'react';
import { useParams } from 'next/navigation';
import { getCategoryBySlug, getProductsByCategory } from '@/lib/present/dataLayer';
import { PLPView } from '@/components/present/plp/PLPView';

export function CategoryPageClient({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const { slug } = useParams<{ slug: string }>();
  const cat = getCategoryBySlug(slug);
  const products = getProductsByCategory(slug);
  return (
    <PLPView
      categorySlug={slug}
      title={cat?.name ?? 'Shop'}
      description={`Explore our ${cat?.name ?? 'full'} range - wholesale pricing, trade terms, fast freight.`}
      breadcrumb={[{ label: cat?.name ?? 'Shop' }]}
      baseProducts={products}
      category={cat}
    />
  );
}
