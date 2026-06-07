'use client';

import { usePathname } from 'next/navigation';
import { Container } from '../ui';

const STEPS = [['shipping', 'Shipping Info'], ['payment', 'Payment Info'], ['review', 'Review']];

export function CheckoutProgressBar() {
  const path = usePathname();
  const current = STEPS.findIndex(([k]) => path.includes(k));
  return (
    <Container className="flex items-center justify-center gap-2 py-6">
      {STEPS.map(([k, label], i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={k} className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold" style={active ? { background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' } : done ? { background: 'var(--sf-ink)', color: '#fff' } : { background: 'var(--sf-faint)', color: 'var(--sf-soft)' }}>{done ? '✓' : i + 1}</span>
            <span className="text-[12px] font-medium" style={{ color: active ? 'var(--sf-ink)' : 'var(--sf-soft)' }}>{label}</span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px w-8" style={{ background: 'var(--sf-line)' }} />}
          </div>
        );
      })}
    </Container>
  );
}
