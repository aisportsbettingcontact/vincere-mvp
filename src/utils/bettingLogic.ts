export type Market = "Moneyline" | "Spread" | "Total" | "ML";

export function formatSpreadLine(line: number): string {
  if (line > 0) return `+${line}`;
  return `${line}`;
}
