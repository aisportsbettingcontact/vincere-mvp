import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { mockGameOdds, type GameOdds } from "@/data/oddsData";
import { MirrorBar } from "@/components/MirrorBar";
import { LineHistoryTable } from "@/components/LineHistoryTable";
import type { Matchup } from "@/data/sportsData";
import type { Market } from "@/utils/bettingLogic";
import { generateAIInsights } from "@/utils/aiAnalysis";
import { formatSpreadLine } from "@/utils/bettingLogic";
import { Brain, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";


function getTeamLogo(espnAbbr: string, sport: string) {
  const sportPath = sport.toLowerCase();
  return `https://a.espncdn.com/i/teamlogos/${sportPath}/500/${espnAbbr}.png`;
}

// Format date as MM/DD · HH:MM AM/PM ET
function formatGameTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return `${month}/${day} · ${hours}:${minutes} ${ampm} ET`;
  } catch {
    return dateString;
  }
}

// Convert GameOdds to Matchup format for LineHistoryTable
function convertGameOddsToMatchup(game: GameOdds): Matchup {
  const firstOdds = game.odds[0];
  return {
    dateTime: game.kickoff,
    away: {
      name: game.away.name,
      espnAbbr: game.away.espnAbbr,
      color: game.away.color,
      odds: {
        ml: firstOdds?.moneyline?.away ? (firstOdds.moneyline.away.american > 0 ? `+${firstOdds.moneyline.away.american}` : `${firstOdds.moneyline.away.american}`) : "-110",
        spread: firstOdds?.spread?.away ? formatSpreadLine(firstOdds.spread.away.line) : "+7.5",
        spreadOdds: firstOdds?.spread?.away ? (firstOdds.spread.away.odds.american > 0 ? `+${firstOdds.spread.away.odds.american}` : `${firstOdds.spread.away.odds.american}`) : "-110",
        total: firstOdds?.total?.over ? `O ${firstOdds.total.over.line}` : "O 40.5",
        totalOdds: firstOdds?.total?.over ? (firstOdds.total.over.odds.american > 0 ? `+${firstOdds.total.over.odds.american}` : `${firstOdds.total.over.odds.american}`) : "-110",
      },
    },
    home: {
      name: game.home.name,
      espnAbbr: game.home.espnAbbr,
      color: game.home.color,
      odds: {
        ml: firstOdds?.moneyline?.home ? (firstOdds.moneyline.home.american > 0 ? `+${firstOdds.moneyline.home.american}` : `${firstOdds.moneyline.home.american}`) : "-110",
        spread: firstOdds?.spread?.home ? formatSpreadLine(firstOdds.spread.home.line) : "-7.5",
        spreadOdds: firstOdds?.spread?.home ? (firstOdds.spread.home.odds.american > 0 ? `+${firstOdds.spread.home.odds.american}` : `${firstOdds.spread.home.odds.american}`) : "-110",
        total: firstOdds?.total?.under ? `U ${firstOdds.total.under.line}` : "U 40.5",
        totalOdds: firstOdds?.total?.under ? (firstOdds.total.under.odds.american > 0 ? `+${firstOdds.total.under.odds.american}` : `${firstOdds.total.under.odds.american}`) : "-110",
      },
    },
  };
}

export default function Feed() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ background: "var(--ma-bg)", minHeight: "100vh" }} className="flex items-center justify-center">
        <p style={{ color: "var(--ma-text-primary)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--ma-bg)", minHeight: "100vh", paddingBottom: "80px" }}>
      <header 
        className="sticky top-0 z-40 backdrop-blur-sm"
        style={{
          borderBottom: "1px solid var(--ma-stroke)",
          background: "var(--ma-card)"
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <h1 
            className="text-2xl font-bold text-center font-['Inter',_sans-serif]"
            style={{ color: "var(--ma-text-primary)" }}
          >
            Feed
          </h1>
        </div>
      </header>

      <div className="px-3 pt-4">
        {/* Game Cards */}
        <div className="space-y-3">
          {mockGameOdds.map((game) => (
            <GameCard 
              key={game.gameId} 
              game={game}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function GameCard({ game }: { game: GameOdds }) {
  const [selectedMarket, setSelectedMarket] = useState<Market>("ML");
  return <BettingSplitsCard game={game} selectedMarket={selectedMarket} setSelectedMarket={setSelectedMarket} />;
}

function BettingSplitsCard({ game, selectedMarket, setSelectedMarket }: { 
  game: GameOdds; 
  selectedMarket: Market;
  setSelectedMarket: (m: Market) => void;
}) {
  const currentData = useMemo(() => {
    if (!game.splits) return { tickets: { away: 50, home: 50 }, money: { away: 50, home: 50 } };
    
    if (selectedMarket === "Moneyline" || selectedMarket === "ML") {
      return {
        tickets: { away: game.splits.moneyline.away.tickets, home: game.splits.moneyline.home.tickets },
        money: { away: game.splits.moneyline.away.handle, home: game.splits.moneyline.home.handle }
      };
    } else if (selectedMarket === "Spread") {
      return {
        tickets: { away: game.splits.spread.away.tickets, home: game.splits.spread.home.tickets },
        money: { away: game.splits.spread.away.handle, home: game.splits.spread.home.handle }
      };
    } else {
      return {
        tickets: { away: game.splits.total.over.tickets, home: game.splits.total.under.tickets },
        money: { away: game.splits.total.over.handle, home: game.splits.total.under.handle }
      };
    }
  }, [game.splits, selectedMarket]);

  return (
    <div className="w-full mb-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-[2px]">
      {/* Game Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <img src={getTeamLogo(game.away.espnAbbr, game.sport)} alt={game.away.name} className="w-7 h-7 rounded" />
          <div className="text-sm font-semibold text-white truncate">{game.away.abbr}</div>
          <span className="text-white/40 text-xs">@</span>
          <div className="flex items-center gap-2 min-w-0">
            <img src={getTeamLogo(game.home.espnAbbr, game.sport)} alt={game.home.name} className="w-7 h-7 rounded" />
            <div className="text-sm font-semibold text-white truncate">{game.home.abbr}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-white/80 bg-white/5 px-2 py-1 rounded-md border border-white/10 whitespace-nowrap">
            {formatGameTime(game.kickoff)}
          </div>
          {game.tvInfo && (
            <div className="text-[10px] text-white/60 px-2 py-1 rounded-md border border-white/10">
              {game.tvInfo}
            </div>
          )}
        </div>
      </div>

      {/* Market Selection Buttons */}
      <div 
        className="relative flex gap-[8px] mb-[16px] px-[4px] py-[4px] rounded-[14px]"
        style={{
          background: "var(--ma-surface)",
          border: "1px solid var(--ma-stroke)"
        }}
      >
        <motion.div
          className="absolute top-[4px] bottom-[4px] rounded-[10px]"
          initial={false}
          animate={{
            left: (selectedMarket === "ML" || selectedMarket === "Moneyline") ? "4px" : selectedMarket === "Spread" ? "calc(33.33% + 1px)" : "calc(66.66% + 2px)",
            width: "calc(33.33% - 3px)"
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          style={{
            background: "rgba(111, 116, 255, 0.14)",
            border: "1px solid var(--ma-accent-indigo)"
          }}
        />
        
        <button
          onClick={() => setSelectedMarket("ML")}
          className="flex-1 font-['Inter',_sans-serif] relative z-10 px-[16px] py-[8px] rounded-[10px] transition-colors flex items-center justify-center"
          style={{
            color: (selectedMarket === "ML" || selectedMarket === "Moneyline") ? "var(--ma-text-primary)" : "var(--ma-text-secondary)",
            fontSize: "15px",
            fontWeight: 600,
            lineHeight: "20px"
          }}
        >
          ML
        </button>
        <button
          onClick={() => setSelectedMarket("Spread")}
          className="flex-1 font-['Inter',_sans-serif] relative z-10 px-[16px] py-[8px] rounded-[10px] transition-colors flex items-center justify-center"
          style={{
            color: selectedMarket === "Spread" ? "var(--ma-text-primary)" : "var(--ma-text-secondary)",
            fontSize: "15px",
            fontWeight: 600,
            lineHeight: "20px"
          }}
        >
          Spread
        </button>
        <button
          onClick={() => setSelectedMarket("Total")}
          className="flex-1 font-['Inter',_sans-serif] relative z-10 px-[16px] py-[8px] rounded-[10px] transition-colors flex items-center justify-center"
          style={{
            color: selectedMarket === "Total" ? "var(--ma-text-primary)" : "var(--ma-text-secondary)",
            fontSize: "15px",
            fontWeight: 600,
            lineHeight: "20px"
          }}
        >
          Total
        </button>
      </div>

      {/* Betting Splits Mirror Bars */}
      <div 
        className="rounded-[14px] p-[12px]"
        style={{
          background: "#16171D",
          border: "1px solid var(--ma-stroke)"
        }}
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ background: selectedMarket === "Total" ? "#6F74FF" : game.away.color }}
            />
            <span 
              className="font-['Inter',_sans-serif]"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--ma-text-secondary)",
                letterSpacing: "0.01em"
              }}
            >
              {selectedMarket === "Total" ? "Over" : game.away.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span 
              className="font-['Inter',_sans-serif]"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--ma-text-secondary)",
                letterSpacing: "0.01em"
              }}
            >
              {selectedMarket === "Total" ? "Under" : game.home.name}
            </span>
            <div 
              className="w-2 h-2 rounded-full"
              style={{ background: selectedMarket === "Total" ? "#06B6D4" : game.home.color }}
            />
          </div>
        </div>

        <MirrorBar
          label="Tickets"
          leftPercent={currentData.tickets.away}
          rightPercent={currentData.tickets.home}
          market={selectedMarket}
          awayColor={game.away.color}
          homeColor={game.home.color}
        />
        
        <div className="h-[8px]" />
        
        <MirrorBar
          label="Money"
          leftPercent={currentData.money.away}
          rightPercent={currentData.money.home}
          market={selectedMarket}
          awayColor={game.away.color}
          homeColor={game.home.color}
        />
      </div>
    </div>
  );
}

function LineMovementCard({ game, selectedMarket, setSelectedMarket }: { 
  game: GameOdds;
  selectedMarket: Market;
  setSelectedMarket: (m: Market) => void;
}) {
  const [lineHistoryView, setLineHistoryView] = useState<"open" | "peak" | "current">("current");
  const matchup = useMemo(() => convertGameOddsToMatchup(game), [game]);

  return (
    <div className="w-full mb-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-[2px]">
      {/* Game Header - same as BettingSplitsCard */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <img src={getTeamLogo(game.away.espnAbbr, game.sport)} alt={game.away.name} className="w-7 h-7 rounded" />
          <div className="text-sm font-semibold text-white truncate">{game.away.abbr}</div>
          <span className="text-white/40 text-xs">@</span>
          <div className="flex items-center gap-2 min-w-0">
            <img src={getTeamLogo(game.home.espnAbbr, game.sport)} alt={game.home.name} className="w-7 h-7 rounded" />
            <div className="text-sm font-semibold text-white truncate">{game.home.abbr}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-white/80 bg-white/5 px-2 py-1 rounded-md border border-white/10 whitespace-nowrap">
            {formatGameTime(game.kickoff)}
          </div>
          {game.tvInfo && (
            <div className="text-[10px] text-white/60 px-2 py-1 rounded-md border border-white/10">
              {game.tvInfo}
            </div>
          )}
        </div>
      </div>

      <div className="mt-[24px]">
        <h2 
          className="font-['Inter',_sans-serif] mb-[16px] text-center"
          style={{
            color: "var(--ma-text-primary)",
            fontSize: "20px",
            fontWeight: 700,
            lineHeight: "26px"
          }}
        >
          Line History
        </h2>

        {/* Line History Toggle Buttons */}
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
              left: lineHistoryView === "open" ? "4px" : lineHistoryView === "peak" ? "calc(33.33% + 1px)" : "calc(66.66% + 2px)",
              width: "calc(33.33% - 3px)"
            }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            style={{
              background: "rgba(111, 116, 255, 0.14)",
              border: "1px solid var(--ma-accent-indigo)"
            }}
          />
          
          {["open", "peak", "current"].map((view) => (
            <button
              key={view}
              onClick={() => setLineHistoryView(view as "open" | "peak" | "current")}
              className="flex-1 font-['Inter',_sans-serif] relative z-10 px-[16px] py-[8px] rounded-[10px] transition-colors flex items-center justify-center"
              style={{
                color: lineHistoryView === view ? "var(--ma-text-primary)" : "var(--ma-text-secondary)",
                fontSize: "15px",
                fontWeight: 600,
                lineHeight: "20px"
              }}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        <LineHistoryTable 
          matchup={matchup}
          sport={game.sport}
          view={lineHistoryView}
        />
      </div>
    </div>
  );
}

function AIAnalysisCard({ game, selectedMarket, setSelectedMarket }: { 
  game: GameOdds;
  selectedMarket: Market;
  setSelectedMarket: (m: Market) => void;
}) {
  const insights = useMemo(() => {
    const firstOdds = game.odds[0];
    let currentLine = "";
    let openLine = "";
    let tickets, money;
    
    if (selectedMarket === "Spread") {
      const awaySpread = firstOdds?.spread?.away?.line;
      currentLine = awaySpread !== undefined ? formatSpreadLine(awaySpread) : "+3.5";
      openLine = awaySpread !== undefined ? formatSpreadLine(awaySpread + 0.5) : "+3";
      tickets = { away: game.splits.spread.away.tickets, home: game.splits.spread.home.tickets };
      money = { away: game.splits.spread.away.handle, home: game.splits.spread.home.handle };
    } else if (selectedMarket === "Total") {
      const total = firstOdds?.total?.over?.line;
      currentLine = total !== undefined ? `${total}` : "47.5";
      openLine = total !== undefined ? `${total - 0.5}` : "47";
      tickets = { o: game.splits.total.over.tickets, u: game.splits.total.under.tickets };
      money = { o: game.splits.total.over.handle, u: game.splits.total.under.handle };
    } else {
      const awayML = firstOdds?.moneyline?.away?.american;
      currentLine = awayML !== undefined ? `${awayML > 0 ? "+" : ""}${awayML}` : "-110";
      openLine = awayML !== undefined ? `${awayML > 0 ? "+" : ""}${Math.abs(awayML) > 100 ? awayML - 10 : awayML + 10}` : "-120";
      tickets = { away: game.splits.moneyline.away.tickets, home: game.splits.moneyline.home.tickets };
      money = { away: game.splits.moneyline.away.handle, home: game.splits.moneyline.home.handle };
    }

    return generateAIInsights({
      matchup: `${game.away.abbr} @ ${game.home.abbr}`,
      market: selectedMarket === "ML" ? "moneyline" : selectedMarket.toLowerCase() as "spread" | "moneyline" | "total",
      current_line: currentLine,
      tickets,
      money,
      move: { from: openLine, to: currentLine }
    });
  }, [game, selectedMarket]);

  const extractPlay = (insightText: string) => {
    const play = insightText.split('.')[0].trim();
    const match = play.match(/^([\w\s]+?\s+[+-]?\d+\.?\d*|OVER\s+\d+\.?\d*|UNDER\s+\d+\.?\d*|Mixed signals)/);
    return match ? match[0].trim() : play;
  };

  const getTeamFromPlay = (playText: string) => {
    if (playText.includes(game.away.abbr)) {
      return { team: game.away, espnAbbr: game.away.espnAbbr };
    } else if (playText.includes(game.home.abbr)) {
      return { team: game.home, espnAbbr: game.home.espnAbbr };
    }
    return null;
  };

  const InsightSection = ({ icon: Icon, iconBg, iconBorder, title, insight }: any) => {
    const play = extractPlay(insight);
    const teamInfo = getTeamFromPlay(play);
    const isTotal = play.includes('OVER') || play.includes('UNDER');
    const displayPlay = teamInfo && !isTotal
      ? play.replace(game.away.abbr, game.away.name).replace(game.home.abbr, game.home.name)
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
              <Icon className="w-4 h-4" style={{ color: iconBorder.replace('rgba', 'rgb').replace(/,\s*0\.\d+\)/, ')') }} />
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
              {title}
            </div>
          </div>
          
          <div className="flex items-center gap-2.5">
            {isTotal && selectedMarket === "Total" ? (
              <div className="text-2xl">
                {play.includes('OVER') ? '⬆️' : '⬇️'}
              </div>
            ) : teamInfo && (
              <img 
                src={getTeamLogo(teamInfo.espnAbbr, game.sport)} 
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
  };

  return (
    <div className="w-full mb-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-[2px]">
      {/* Game Header - same as other cards */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <img src={getTeamLogo(game.away.espnAbbr, game.sport)} alt={game.away.name} className="w-7 h-7 rounded" />
          <div className="text-sm font-semibold text-white truncate">{game.away.abbr}</div>
          <span className="text-white/40 text-xs">@</span>
          <div className="flex items-center gap-2 min-w-0">
            <img src={getTeamLogo(game.home.espnAbbr, game.sport)} alt={game.home.name} className="w-7 h-7 rounded" />
            <div className="text-sm font-semibold text-white truncate">{game.home.abbr}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-white/80 bg-white/5 px-2 py-1 rounded-md border border-white/10 whitespace-nowrap">
            {formatGameTime(game.kickoff)}
          </div>
          {game.tvInfo && (
            <div className="text-[10px] text-white/60 px-2 py-1 rounded-md border border-white/10">
              {game.tvInfo}
            </div>
          )}
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
              left: (selectedMarket === "Moneyline" || selectedMarket === "ML") ? "4px" : selectedMarket === "Spread" ? "calc(33.33% + 1px)" : "calc(66.66% + 2px)",
              width: "calc(33.33% - 3px)"
            }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            style={{
              background: "rgba(111, 116, 255, 0.14)",
              border: "1px solid var(--ma-accent-indigo)"
            }}
          />
          
          {[["ML", "ML"], ["Spread", "Spread"], ["Total", "Total"]].map(([label, market]) => (
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
              {label}
            </button>
          ))}
        </div>

        {/* AI Insights Sections */}
        <div className="space-y-3">
          <InsightSection 
            icon={TrendingUp}
            iconBg="rgba(34, 197, 94, 0.12)"
            iconBorder="rgba(34, 197, 94, 0.25)"
            title="What Vegas Needs"
            insight={insights.bookNeed}
          />
          
          <InsightSection 
            icon={Brain}
            iconBg="rgba(245, 158, 11, 0.12)"
            iconBorder="rgba(245, 158, 11, 0.25)"
            title="Sharpest Play"
            insight={insights.sharpSide}
          />
          
          <InsightSection 
            icon={Users}
            iconBg="rgba(239, 68, 68, 0.12)"
            iconBorder="rgba(239, 68, 68, 0.25)"
            title="What The Public Is Hammering"
            insight={insights.publicSide}
          />
        </div>
      </div>
    </div>
  );
}
