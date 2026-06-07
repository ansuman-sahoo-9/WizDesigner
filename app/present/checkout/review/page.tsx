'use client';

import { useRouter } from 'next/navigation';
import { usePresentState } from '@/lib/present/usePresentState';
import { getSpec } from '@/lib/present/dataLayer';
import { getPresentOrders, savePresentOrders, type PresentOrder } from '@/lib/present/dummyData';
import { generateId } from '@/lib/present/slugify';
import { Container, PLink, money, px } from '@/components/present/ui';

export default function ReviewPage() {
  const router = useRouter();
  const { state, dispatch } = usePresentState();
  const ship = getSpec().business.shipping;
  const items = state.cart.items;
  const sub = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const freight = ship.freeShipping && sub >= (ship.freeShippingThreshold ?? 0) ? 0 : ship.flatRate ? (ship.flatRateAmount ?? 0) : 0;
  const total = sub + freight;

  const place = () => {
    const order: PresentOrder = {
      id: 'WC_' + generateId().toUpperCase().slice(0, 5),
      status: 'Processing',
      total,
      date: new Date().toISOString().slice(0, 10),
      channel: 'WizShop',
      items: items.map((i) => ({ name: i.productName, sku: i.sku, qty: i.qty, price: i.unitPrice })),
    };
    savePresentOrders([order, ...getPresentOrders()]);
    dispatch({ type: 'CLEAR_CART' });
    router.push(px(`/order-confirmation?id=${order.id}`));
  };

  if (!items.length) {
    return <Container className="py-20 text-center"><p className="text-[14px]" style={{ color: 'var(--sf-muted)' }}>Your cart is empty.</p><PLink href="/cart" className="mt-3 inline-block underline">Back to cart</PLink></Container>;
  }

  return (
    <Container className="max-w-2xl">
      <h1 className="sf-display text-2xl font-semibold">Review your order</h1>
      <div className="mt-6 divide-y" style={{ borderColor: 'var(--sf-line)' }}>
        {items.map((i) => (
          <div key={i.id} className="flex justify-between py-3 text-[14px]"><span>{i.productName} <span style={{ color: 'var(--sf-soft)' }}>× {i.qty}</span></span><span className="font-semibold">{money(i.unitPrice * i.qty)}</span></div>
        ))}
      </div>
      <div className="mt-4 space-y-1.5 text-[13px]">
        <div className="flex justify-between"><span style={{ color: 'var(--sf-muted)' }}>Shipping to</span><span>240 Market St, Portland OR</span></div>
        <div className="flex justify-between"><span style={{ color: 'var(--sf-muted)' }}>Freight</span><span>{freight ? money(freight) : 'Free'}</span></div>
        <div className="flex justify-between border-t pt-2 text-[15px] font-semibold" style={{ borderColor: 'var(--sf-line)' }}><span>Total</span><span>{money(total)}</span></div>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <PLink href="/checkout/payment" className="text-[13px] underline" style={{ color: 'var(--sf-muted)' }}>← Back</PLink>
        <button onClick={place} className="px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ background: 'var(--sf-brand)', color: 'var(--sf-on-brand)' }}>Place Order</button>
      </div>
    </Container>
  );
}
