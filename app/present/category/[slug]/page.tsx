import { CategoryPageClient } from './client';

export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  return <CategoryPageClient params={params} />;
}
