'use client';

import { useParams } from 'next/navigation';
import { getProductBySlug } from '@/lib/present/dataLayer';
import { PresentHeader } from '@/components/present/layout/PresentHeader';
import { PresentFooter } from '@/components/present/layout/PresentFooter';
import { PDPView } from '@/components/present/pdp/PDPView';
import { PLink, Container } from '@/components/present/ui';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <>
        <PresentHeader />
        <Container className="py-24 text-center">
          <h1 className="sf-display text-2xl font-semibold">Product not found</h1>
          <PLink href="/category/seating" className="mt-4 inline-block underline">← Back to Shop</PLink>
        </Container>
        <PresentFooter />
      </>
    );
  }
  return <PDPView product={product} />;
}
