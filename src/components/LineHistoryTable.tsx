import type { Matchup } from "@/data/sportsData";

interface LineHistoryTableProps {
  matchup: Matchup;
  sport: string;
  view: "open" | "peak" | "current";
}

export function LineHistoryTable({ matchup, view }: LineHistoryTableProps) {
  return (
    <div 
      className="rounded-[14px] p-4"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))"
      }}
    >
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-['Inter',_sans-serif]" style={{ color: "var(--ma-text-secondary)" }}>
          <span>Market</span>
          <span>{view === "open" ? "Opening" : view === "peak" ? "Peak" : "Current"} Line</span>
        </div>
        <div className="flex justify-between text-sm font-['Inter',_sans-serif]" style={{ color: "var(--ma-text-primary)" }}>
          <span>Spread</span>
          <span>{matchup.away.odds.spread} / {matchup.home.odds.spread}</span>
        </div>
        <div className="flex justify-between text-sm font-['Inter',_sans-serif]" style={{ color: "var(--ma-text-primary)" }}>
          <span>Total</span>
          <span>{matchup.away.odds.total} / {matchup.home.odds.total}</span>
        </div>
        <div className="flex justify-between text-sm font-['Inter',_sans-serif]" style={{ color: "var(--ma-text-primary)" }}>
          <span>Moneyline</span>
          <span>{matchup.away.odds.ml} / {matchup.home.odds.ml}</span>
        </div>
      </div>
    </div>
  );
}
