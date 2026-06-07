'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { usePresentState } from '@/lib/present/usePresentState';
import { getProductBySlug, getAllProducts } from '@/lib/present/dataLayer';
import { slugify } from '@/lib/present/slugify';
import { dummyOrders, getPresentOrders, type OrderStatus } from '@/lib/present/dummyData';
import { createToast } from '@/lib/present/toasts';
import { money, px } from '@/components/present/ui';

const DOT: Record<OrderStatus, string> = { Delivered: '#047857', Processing: '#1d4ed8', Cancelled: '#b91c1c' };

export default function OrdersPage() {
  const router = useRouter();
  const { dispatch } = usePresentState();
  const orders = useMemo(() => [...getPresentOrders(), ...dummyOrders].sort((a, b) => b.date.localeCompare(a.date)), []);

  const reorder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    dispatch({ type: 'CLEAR_CART' });
    order.items.forEach((it) => {
      const p = getAllProducts().find((x) => x.sku === it.sku) ?? getProductBySlug(slugify(it.name));
      dispatch({ type: 'ADD_TO_CART', item: { productId: it.sku, productName: it.name, sku: it.sku, imageUrl: p?.imageUrl ?? '', selectedVariants: {}, qty: it.qty, unitPrice: it.price, msrp: p?.msrp ?? it.price, slug: slugify(it.name) } });
    });
    dispatch({ type: 'SHOW_TOAST', toast: createToast('Order loaded into cart') });
    router.push(px('/cart'));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b text-left text-[11px] uppercase tracking-wide" style={{ borderColor: 'var(--sf-line)', color: 'var(--sf-soft)' }}>
            <th className="py-2 pr-4">Order ID</th><th className="py-2 pr-4">Status</th><th className="py-2 pr-4">Value</th><th className="py-2 pr-4">Created</th><th className="py-2 pr-4">Channel</th><th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b" style={{ borderColor: 'var(--sf-line)' }}>
              <td className="py-3 pr-4 font-semibold">{o.id}</td>
              <td className="py-3 pr-4"><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: DOT[o.status] }} />{o.status}</span></td>
              <td className="py-3 pr-4">{money(o.total)}</td>
              <td className="py-3 pr-4" style={{ color: 'var(--sf-muted)' }}>{o.date}</td>
              <td className="py-3 pr-4" style={{ color: 'var(--sf-muted)' }}>{o.channel}</td>
              <td className="py-3"><button onClick={() => reorder(o.id)} className="rounded border px-2.5 py-1 text-[11px] font-semibold uppercase" style={{ borderColor: 'var(--sf-line)' }}>Re-order</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
