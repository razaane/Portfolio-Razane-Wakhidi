import type { SaleRow } from "@/content/lab";

export const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

export const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// Same rules as Sell4All: drop suspiciously small spends, then exact duplicate rows.
export function clean(rows: SaleRow[], opts: { removeSmall: boolean; removeDupes: boolean; minSpend: number }) {
  let out = rows;
  if (opts.removeSmall) out = out.filter((r) => r[3] >= opts.minSpend);
  if (opts.removeDupes) {
    const seen = new Set<string>();
    out = out.filter((r) => {
      const key = r.join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  return out;
}

export function spendByCountry(rows: SaleRow[]) {
  const totals = new Map<string, number>();
  for (const [, , country, spend] of rows) totals.set(country, (totals.get(country) ?? 0) + spend);
  return [...totals.entries()].sort((a, b) => b[1] - a[1]);
}
