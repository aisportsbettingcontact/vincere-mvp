import { useState, useMemo } from "react";
import { Brain, TrendingUp, Users, Loader2 } from "lucide-react";
import { useBettingInsights } from "@/hooks/useBettingInsights";
import type { GameOdds } from "@/data/oddsData";

interface AIAnalysisCardProps {
  game: GameOdds;
  sport: string;
}

export function AIAnalysisCard({ game, sport }: AIAnalysisCardProps) {
  const [selectedMarket, setSelectedMarket] = useState<"Moneyline" | "Spread" | "Total">("Spread");

  // Get current odds for the selected market
  const currentOdds = game.odds[0];
  
  const analysisParams = useMemo(() => {
    const formatMarket = (): "moneyline" | "spread" | "total" => {
      if (selectedMarket === "Moneyline") return "moneyline";
      if (selectedMarket === "Spread") return "spread";
      return "total";
    };

    const getCurrentLine = () => {
      if (selectedMarket === "Moneyline") {
        return `${currentOdds.moneyline?.away.american || 0} / ${currentOdds.moneyline?.home.american || 0}`;
      }
      if (selectedMarket === "Spread") {
        return `${currentOdds.spread?.away.line || 0}`;
      }
      return `${currentOdds.total?.over.line || 0}`;
    };

    const getTickets = () => {
      if (selectedMarket === "Moneyline") {
        return {
          away: game.splits.moneyline.away.tickets,
          home: game.splits.moneyline.home.tickets,
        };
      }
      if (selectedMarket === "Spread") {
        return {
          away: game.splits.spread.away.tickets,
          home: game.splits.spread.home.tickets,
        };
      }
      return {
        o: game.splits.total.over.tickets,
        u: game.splits.total.under.tickets,
      };
    };

    const getMoney = () => {
      if (selectedMarket === "Moneyline") {
        return {
          away: game.splits.moneyline.away.handle,
          home: game.splits.moneyline.home.handle,
        };
      }
      if (selectedMarket === "Spread") {
        return {
          away: game.splits.spread.away.handle,
          home: game.splits.spread.home.handle,
        };
      }
      return {
        o: game.splits.total.over.handle,
        u: game.splits.total.under.handle,
      };
    };

    return {
      matchup: `${game.away.name} @ ${game.home.name}`,
      market: formatMarket(),
      current_line: getCurrentLine(),
      away_line: `${currentOdds.moneyline?.away.american || 0}`,
      home_line: `${currentOdds.moneyline?.home.american || 0}`,
      tickets: getTickets(),
      money: getMoney(),
      move: {
        from: getCurrentLine(),
        to: getCurrentLine(),
      },
    };
  }, [game, selectedMarket, currentOdds]);

  const { insights, loading, error } = useBettingInsights(analysisParams);

  const markets: ("Moneyline" | "Spread" | "Total")[] = ["Moneyline", "Spread", "Total"];

  return (
    <div 
      className="rounded-[14px] p-6"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))"
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
        <h3 className="text-lg font-semibold" style={{ color: "hsl(var(--foreground))" }}>
          AI Betting Insights
        </h3>
      </div>

      {/* Market Selector */}
      <div className="flex gap-2 mb-6">
        {markets.map((market) => (
          <button
            key={market}
            onClick={() => setSelectedMarket(market)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: selectedMarket === market ? "hsl(var(--primary))" : "transparent",
              color: selectedMarket === market ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
              border: `1px solid ${selectedMarket === market ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
            }}
          >
            {market}
          </button>
        ))}
      </div>

      {/* Insights */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(var(--primary))" }} />
        </div>
      ) : error ? (
        <p className="text-sm text-center py-8" style={{ color: "hsl(var(--muted-foreground))" }}>
          Analysis unavailable. Please try again.
        </p>
      ) : insights ? (
        <div className="space-y-4">
          <InsightItem
            icon={<TrendingUp className="w-5 h-5" />}
            title="What Vegas Needs"
            content={insights.bookNeed}
          />
          <InsightItem
            icon={<Brain className="w-5 h-5" />}
            title="Sharpest Play"
            content={insights.sharpSide}
          />
          <InsightItem
            icon={<Users className="w-5 h-5" />}
            title="What The Public Is Hammering"
            content={insights.publicSide}
          />
        </div>
      ) : null}
    </div>
  );
}

function InsightItem({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) {
  return (
    <div 
      className="p-4 rounded-lg"
      style={{
        background: "hsl(var(--muted) / 0.3)",
        border: "1px solid hsl(var(--border))"
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div style={{ color: "hsl(var(--primary))" }}>{icon}</div>
        <h4 className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
          {title}
        </h4>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
        {content}
      </p>
    </div>
  );
}
