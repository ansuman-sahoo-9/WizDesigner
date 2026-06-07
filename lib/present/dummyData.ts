// Present Mode V2 — dummy data + session-order persistence (Steps 20–24).

export type OrderStatus = 'Delivered' | 'Processing' | 'Cancelled';
export interface PresentOrderItem { name: string; sku: string; qty: number; price: number }
export interface PresentOrder {
  id: string;
  status: OrderStatus;
  total: number;
  date: string; // ISO
  channel: string;
  items: PresentOrderItem[];
}

// Step 20 — default orders shown before any session order is placed.
export const dummyOrders: PresentOrder[] = [
  { id: 'WC_10428', status: 'Delivered', total: 4280, date: '2026-05-12', channel: 'WizShop', items: [{ name: 'Mara Lounge Chair', sku: 'BLA-2041', qty: 12, price: 268 }, { name: 'Loom Throw', sku: 'BLA-6002', qty: 24, price: 88 }] },
  { id: 'WC_10455', status: 'Processing', total: 1860, date: '2026-06-01', channel: 'WizShop', items: [{ name: 'Orbit Pendant', sku: 'BLA-4001', qty: 6, price: 178 }, { name: 'Cairn Vase', sku: 'BLA-7001', qty: 18, price: 44 }] },
  { id: 'WC_10399', status: 'Cancelled', total: 845, date: '2026-04-22', channel: 'Sales Rep', items: [{ name: 'Hadley Sofa', sku: 'BLA-2042', qty: 1, price: 845 }] },
];

// Step 21
export interface PresentRep { name: string; region: string; email: string; phone: string }
export const dummyReps: PresentRep[] = [
  { name: 'Marin Ellsworth', region: 'Northeast', email: 'marin@brand.example', phone: '(212) 555-0142' },
  { name: 'Devon Park', region: 'Southeast', email: 'devon@brand.example', phone: '(404) 555-0177' },
  { name: 'Priya Raman', region: 'West Coast', email: 'priya@brand.example', phone: '(415) 555-0119' },
  { name: 'Caleb Monroe', region: 'Midwest', email: 'caleb@brand.example', phone: '(312) 555-0188' },
  { name: 'Sofia Reyes', region: 'Southwest', email: 'sofia@brand.example', phone: '(602) 555-0133' },
];

// Step 22
export interface PresentTradeShow { name: string; venue: string; booth: string; startDate: string; endDate: string }
export const dummyTradeShows: PresentTradeShow[] = [
  { name: 'NY NOW', venue: 'Javits Center, New York', booth: '#4821', startDate: '2026-08-02', endDate: '2026-08-05' },
  { name: 'Atlanta Market', venue: 'AmericasMart, Atlanta', booth: '#1190', startDate: '2026-07-14', endDate: '2026-07-20' },
  { name: 'Las Vegas Market', venue: 'World Market Center', booth: '#C-340', startDate: '2026-07-26', endDate: '2026-07-30' },
];

// Step 23
export interface PresentFAQ { q: string; a: string }
export const dummyFAQs: PresentFAQ[] = [
  { q: 'How do I open a wholesale account?', a: 'Click “Apply for Account”, complete the trade application, and our team approves most accounts within one business day.' },
  { q: 'What is the minimum order quantity?', a: 'Most products carry a 12-unit MOQ, with case-pack multiples of 6. MOQ is shown on each product page and enforced in the cart.' },
  { q: 'What payment terms do you offer?', a: 'Approved accounts can use Net-30 terms; we also accept credit card and ACH. Net-60 is available for distributor tier.' },
  { q: 'How long does shipping take?', a: 'In-stock orders ship within 2–3 business days. Freight orders are scheduled with your rep. Free freight over $500.' },
  { q: 'How do I reorder?', a: 'Open Account → My Orders and hit RE-ORDER on any past order to load those items straight into your cart.' },
];

// Step 24 — session-scoped orders placed during the demo.
const ORDERS_KEY = 'present_orders';
export function getPresentOrders(): PresentOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(ORDERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as PresentOrder[]) : [];
  } catch {
    return [];
  }
}
export function savePresentOrders(orders: PresentOrder[]): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    /* ignore */
  }
}
