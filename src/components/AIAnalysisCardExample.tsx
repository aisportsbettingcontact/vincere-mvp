/**
 * EXAMPLE: AI-Powered Betting Analysis Card
 * 
 * This replaces the mock generateAIInsights function with real AI analysis.
 * Copy this pattern into your existing AIAnalysisCard component.
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Users, Loader2 } from "lucide-react";
import { useBettingInsights } from "@/hooks/useBettingInsights";

// Define Market type inline for this example
type Market = "Moneyline" | "Spread" | "Total";

// Helper to extract the play/side from insight text
const extractPlay = (insightText: string) => {
  const play = insightText.split('.')[0].trim();
  const match = play.match(/^([\w\s]+?\s+[+-]?\d+\.?\d*|OVER\s+\d+\.?\d*|UNDER\s+\d+\.?\d*|Mixed signals)/);
  return match ? match[0].trim() : play;
};

// Helper to get team info from play text
const getTeamFromPlay = (playText: string, game: any) => {
  const awayMatch = playText.includes(game.away.abbr);
  const homeMatch = playText.includes(game.home.abbr);
  
  if (awayMatch) {
    return { team: game.away, espnAbbr: game.away.espnAbbr, isAway: true };
  } else if (homeMatch) {
    return { team: game.home, espnAbbr: game.home.espnAbbr, isAway: false };
  }
  
  if (playText.includes('OVER') || playText.includes('Over')) {
    return { team: game.home, espnAbbr: game.home.espnAbbr, isAway: false, isTotal: true };
  } else if (playText.includes('UNDER') || playText.includes('Under')) {
    return { team: game.away, espnAbbr: game.away.espnAbbr, isAway: true, isTotal: true };
  }
  
  return null;
};

function getTeamLogo(espnAbbr: string, sport: string) {
  const sportPath = sport.toLowerCase();
  return `https://a.espncdn.com/i/teamlogos/${sportPath}/500/${espnAbbr}.png`;
}

export function AIAnalysisCard({ game, sport }: { game: any; sport: string }) {
  const [selectedMarket, setSelectedMarket] = useState<Market>("Spread");

  // Prepare parameters for AI analysis
  const analysisParams = useMemo(() => {
    if (!game.splits || !game.odds?.[0]) return null;

    const firstOdds = game.odds[0];
    const marketData = {
      Moneyline: {
        tickets: { away: game.splits.moneyline.away.tickets, home: game.splits.moneyline.home.tickets },
        money: { away: game.splits.moneyline.away.handle, home: game.splits.moneyline.home.handle }
      },
      Spread: {
        tickets: { away: game.splits.spread.away.tickets, home: game.splits.spread.home.tickets },
        money: { away: game.splits.spread.away.handle, home: game.splits.spread.home.handle }
      },
      Total: {
        tickets: { away: game.splits.total.over.tickets, home: game.splits.total.under.tickets },
        money: { away: game.splits.total.over.handle, home: game.splits.total.under.handle }
      }
    };

    const currentData = marketData[selectedMarket];
    
    let currentLine = "";
    let openLine = "";
    
    if (selectedMarket === "Spread") {
      const awaySpread = firstOdds?.spread?.away?.line;
      if (awaySpread !== undefined) {
        currentLine = `${awaySpread > 0 ? "+" : ""}${awaySpread}`;
        openLine = `${awaySpread + 0.5 > 0 ? "+" : ""}${awaySpread + 0.5}`;
      }
    } else if (selectedMarket === "Total") {
      const total = firstOdds?.total?.over?.line;
      if (total !== undefined) {
        currentLine = `${total}`;
        openLine = `${total - 0.5}`;
      }
    } else {
      const awayML = firstOdds?.moneyline?.away?.american;
      if (awayML !== undefined) {
        currentLine = `${awayML > 0 ? "+" : ""}${awayML}`;
        openLine = `${awayML > 0 ? "+" : ""}${Math.abs(awayML) > 100 ? awayML - 10 : awayML + 10}`;
      }
    }

    const awayMLFormatted = firstOdds?.moneyline?.away?.american !== undefined
      ? `${firstOdds.moneyline.away.american > 0 ? "+" : ""}${firstOdds.moneyline.away.american}`
      : undefined;
    const homeMLFormatted = firstOdds?.moneyline?.home?.american !== undefined
      ? `${firstOdds.moneyline.home.american > 0 ? "+" : ""}${firstOdds.moneyline.home.american}`
      : undefined;

    return {
      matchup: `${game.away.abbr} @ ${game.home.abbr}`,
      market: selectedMarket.toLowerCase() as "spread" | "moneyline" | "total",
      current_line: currentLine,
      away_line: selectedMarket === "Moneyline" ? awayMLFormatted : undefined,
      home_line: selectedMarket === "Moneyline" ? homeMLFormatted : undefined,
      tickets: selectedMarket === "Total" 
        ? { o: currentData.tickets.away, u: currentData.tickets.home }
        : { away: currentData.tickets.away, home: currentData.tickets.home },
      money: selectedMarket === "Total"
        ? { o: currentData.money.away, u: currentData.money.home }
        : { away: currentData.money.away, home: currentData.money.home },
      move: { from: openLine, to: currentLine }
    };
  }, [game, selectedMarket]);

  // Use the real AI hook
  const { insights, loading, error } = useBettingInsights(analysisParams);

  return (
    <div className="w-full mb-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-[2px]">
      {/* Game Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <img src={getTeamLogo(game.away.espnAbbr, sport)} alt={game.away.name} className="w-7 h-7 rounded" />
          <div className="text-sm font-semibold text-white truncate">{game.away.abbr}</div>
          <span className="text-white/40 text-xs">@</span>
          <div className="flex items-center gap-2 min-w-0">
            <img src={getTeamLogo(game.home.espnAbbr, sport)} alt={game.home.name} className="w-7 h-7 rounded" />
            <div className="text-sm font-semibold text-white truncate">{game.home.abbr}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-white/80 bg-white/5 px-2 py-1 rounded-md border border-white/10">
            {(() => {
              try {
                const d = new Date(game.kickoff);
                if (isNaN(d.getTime())) return game.kickoff;
                return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
              } catch {
                return game.kickoff;
              }
            })()}
          </div>
        </div>
      </div>

      {/* Market Toggle */}
      <div className="mt-[24px]">
        <div 
          className="relative flex gap-[8px] mb-[16px] justify-center px-[4px] py-[4px] rounded-[14px]"
          style={{
            background: "var(--ma-surface)",
            border: "1px solid var(--ma-stroke)"
          }}
        >
          <motion.div
            className="absolute top-[4px] bottom-[4px] rounded-[10px]"
            initial={false}
            animate={{
              left: selectedMarket === "Moneyline" ? "4px" : selectedMarket === "Spread" ? "calc(33.33% + 1px)" : "calc(66.66% + 2px)",
              width: "calc(33.33% - 3px)"
            }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            style={{
              background: "rgba(111, 116, 255, 0.14)",
              border: "1px solid var(--ma-accent-indigo)"
            }}
          />
          
          {["Moneyline", "Spread", "Total"].map((market) => (
            <button
              key={market}
              onClick={() => setSelectedMarket(market as Market)}
              className="flex-1 font-['Inter',_sans-serif] relative z-10 px-[16px] py-[8px] rounded-[10px] transition-colors flex items-center justify-center"
              style={{
                color: selectedMarket === market ? "var(--ma-text-primary)" : "var(--ma-text-secondary)",
                fontSize: "15px",
                fontWeight: 600,
                lineHeight: "20px"
              }}
            >
              {market === "Moneyline" ? "ML" : market}
            </button>
          ))}
        </div>

        {/* AI Insights Sections */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            {/* What Vegas Needs */}
            <InsightSection
              icon={TrendingUp}
              iconColor="var(--ma-accent-green)"
              iconBg="rgba(34, 197, 94, 0.12)"
              iconBorder="rgba(34, 197, 94, 0.25)"
              label="What Vegas Needs"
              insight={insights?.bookNeed || "Loading..."}
              game={game}
              sport={sport}
              selectedMarket={selectedMarket}
            />

            {/* Sharpest Play */}
            <InsightSection
              icon={Brain}
              iconColor="var(--ma-accent-amber)"
              iconBg="rgba(245, 158, 11, 0.12)"
              iconBorder="rgba(245, 158, 11, 0.25)"
              label="Sharpest Play"
              insight={insights?.sharpSide || "Loading..."}
              game={game}
              sport={sport}
              selectedMarket={selectedMarket}
            />

            {/* What The Public Is Hammering */}
            <InsightSection
              icon={Users}
              iconColor="var(--ma-accent-red)"
              iconBg="rgba(239, 68, 68, 0.12)"
              iconBorder="rgba(239, 68, 68, 0.25)"
              label="What The Public Is Hammering"
              insight={insights?.publicSide || "Loading..."}
              game={game}
              sport={sport}
              selectedMarket={selectedMarket}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function InsightSection({ 
  icon: Icon, 
  iconColor, 
  iconBg, 
  iconBorder, 
  label, 
  insight, 
  game, 
  sport,
  selectedMarket 
}: any) {
  const play = extractPlay(insight);
  const teamInfo = getTeamFromPlay(play, game);
  const isTotal = play.includes('OVER') || play.includes('UNDER');
  
  const displayPlay = teamInfo && !isTotal
    ? play.replace(game.away.abbr, game.away.name.split(' ').pop() || game.away.abbr)
        .replace(game.home.abbr, game.home.name.split(' ').pop() || game.home.abbr)
    : play;

  return (
    <div 
      className="rounded-[14px] p-4"
      style={{
        background: "#16171D",
        border: "1px solid var(--ma-stroke)"
      }}
    >
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="flex items-center justify-center w-6 h-6 rounded-lg"
            style={{
              background: iconBg,
              border: `1px solid ${iconBorder}`
            }}
          >
            <Icon className="w-4 h-4" style={{ color: iconColor }} />
          </div>
          <div 
            className="font-['Inter',_sans-serif]"
            style={{
              color: "var(--ma-text-secondary)",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.03em",
              textTransform: "uppercase"
            }}
          >
            {label}
          </div>
        </div>
        
        <div className="flex items-center gap-2.5">
          {isTotal && selectedMarket === "Total" ? (
            <div className="text-2xl">
              {play.includes('OVER') ? '⬆️' : '⬇️'}
            </div>
          ) : teamInfo && (
            <img 
              src={getTeamLogo(teamInfo.espnAbbr, sport)} 
              alt={teamInfo.team.name}
              className="w-8 h-8 rounded"
            />
          )}
          <h3 
            className="font-['Inter',_sans-serif]"
            style={{
              color: "var(--ma-text-primary)",
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "-0.02em"
            }}
          >
            {displayPlay}
          </h3>
        </div>
      </div>
      <p 
        className="font-['Inter',_sans-serif]"
        style={{
          color: "var(--ma-text-secondary)",
          fontSize: "13px",
          fontWeight: 400,
          lineHeight: "18px",
          letterSpacing: "-0.01em"
        }}
      >
        {insight.split('. ').slice(1).join('. ').trim()}
      </p>
    </div>
  );
}
