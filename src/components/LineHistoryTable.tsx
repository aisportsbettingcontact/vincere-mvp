import type { GameOdds } from "@/types/odds";

interface LineHistoryTableProps {
  matchup: ReturnType<typeof convertMatchupData>;
  sport: string;
  view: "open" | "peak" | "current";
}

// Helper type for the converted matchup format
function convertMatchupData(game: GameOdds) {
  const firstOdds = game.odds[0];
  return {
    dateTime: game.kickoff,
    away: {
      name: game.away.name,
      espnAbbr: game.away.espnAbbr,
      color: game.away.color,
      odds: {
        ml: firstOdds?.moneyline?.away ? String(firstOdds.moneyline.away.american) : "-",
        spread: firstOdds?.spread?.away ? String(firstOdds.spread.away.line) : "-",
        spreadOdds: firstOdds?.spread?.away ? String(firstOdds.spread.away.odds.american) : "-",
        total: firstOdds?.total?.over ? `O ${firstOdds.total.over.line}` : "-",
        totalOdds: firstOdds?.total?.over ? String(firstOdds.total.over.odds.american) : "-",
      },
    },
    home: {
      name: game.home.name,
      espnAbbr: game.home.espnAbbr,
      color: game.home.color,
      odds: {
        ml: firstOdds?.moneyline?.home ? String(firstOdds.moneyline.home.american) : "-",
        spread: firstOdds?.spread?.home ? String(firstOdds.spread.home.line) : "-",
        spreadOdds: firstOdds?.spread?.home ? String(firstOdds.spread.home.odds.american) : "-",
        total: firstOdds?.total?.under ? `U ${firstOdds.total.under.line}` : "-",
        totalOdds: firstOdds?.total?.under ? String(firstOdds.total.under.odds.american) : "-",
      },
    },
  };
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
