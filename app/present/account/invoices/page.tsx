'use client';

import { usePresentState } from '@/lib/present/usePresentState';
import { createToast } from '@/lib/present/toasts';
import { money } from '@/components/present/ui';

const INVOICES = [
  { id: 'INV-2041', date: '2026-05-15', due: '2026-06-14', amount: 4280, status: 'Open' },
  { id: 'INV-2033', date: '2026-04-20', due: '2026-05-20', amount: 1860, status: 'Paid' },
  { id: 'INV-2019', date: '2026-03-28', due: '2026-04-27', amount: 845, status: 'Paid' },
];

export default function InvoicesPage() {
  const { dispatch } = usePresentState();
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead><tr className="border-b text-left text-[11px] uppercase tracking-wide" style={{ borderColor: 'var(--sf-line)', color: 'var(--sf-soft)' }}>
          <th className="py-2 pr-4">Invoice</th><th className="py-2 pr-4">Issued</th><th className="py-2 pr-4">Due</th><th className="py-2 pr-4">Amount</th><th className="py-2 pr-4">Status</th><th className="py-2">Actions</th>
        </tr></thead>
        <tbody>
          {INVOICES.map((inv) => (
            <tr key={inv.id} className="border-b" style={{ borderColor: 'var(--sf-line)' }}>
              <td className="py-3 pr-4 font-semibold">{inv.id}</td>
              <td className="py-3 pr-4" style={{ color: 'var(--sf-muted)' }}>{inv.date}</td>
              <td className="py-3 pr-4" style={{ color: 'var(--sf-muted)' }}>{inv.due}</td>
              <td className="py-3 pr-4">{money(inv.amount)}</td>
              <td className="py-3 pr-4"><span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={inv.status === 'Open' ? { background: '#fffbeb', color: '#b45309' } : { background: '#ecfdf5', color: '#047857' }}>{inv.status}</span></td>
              <td className="py-3"><button onClick={() => dispatch({ type: 'SHOW_TOAST', toast: createToast('Invoice PDF ready (connects to live in production)') })} className="text-[12px] font-medium underline">Download</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
