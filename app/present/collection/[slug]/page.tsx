import { CollectionPageClient } from './client';

export function generateStaticParams() {
  return [];
}

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  return <CollectionPageClient params={params} />;
}
