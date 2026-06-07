// Small formatting helpers shared across storefront sections.

export function money(n: number): string {
  if (!Number.isFinite(n)) return "$0";
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function initials(name: string): string {
  const parts = name.replace(/[^a-zA-Z0-9 &]/g, "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "WS";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function marginPct(msrp: number, wholesale: number): number {
  if (!msrp) return 0;
  return Math.round(((msrp - wholesale) / msrp) * 100);
}
