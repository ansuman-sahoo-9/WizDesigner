import { ProductPageClient } from './client';

export function generateStaticParams() {
  return [];
}

export default function ProductPage() {
    return <ProductPageClient />;
}
