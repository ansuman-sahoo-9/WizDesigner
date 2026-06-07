'use client';
import { ContentShell } from '@/components/present/content/ContentShell';
export default function Page() {
  return (
    <ContentShell title="Virtual Showroom" eyebrow="Explore">
      <p>Take a guided 3D tour of our seasonal showroom from anywhere. Book a live walkthrough with your rep, or explore on your own time.</p>
      <div className="mt-6 grid aspect-[16/9] place-items-center rounded-lg" style={{ background: 'var(--sf-faint)', color: 'var(--sf-soft)' }}>Showroom experience loads in the live site</div>
    </ContentShell>
  );
}
