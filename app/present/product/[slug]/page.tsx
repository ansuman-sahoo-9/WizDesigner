import { ProductPageClient } from './client';

export function generateStaticParams() {
  return [];
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ProductPageClient params={params} />;
}
