'use client';

import { useParams } from 'next/navigation';
import { getCategoryBySlug, getProductsByCategory } from '@/lib/present/dataLayer';
import { PLPView } from '@/components/present/plp/PLPView';

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const cat = getCategoryBySlug(slug);
  const products = getProductsByCategory(slug);
  return (
    <PLPView
      categorySlug={`collection-${slug}`}
      title={cat ? `${cat.name} Collection` : 'Collection'}
      description={`A curated ${cat?.name ?? ''} collection.`}
      breadcrumb={[{ label: 'Collections' }, { label: cat?.name ?? 'Collection' }]}
      baseProducts={products}
      category={cat}
    />
  );
}
