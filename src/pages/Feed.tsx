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
import draftKingsLogo from "@/assets/draftkings-logo.png";
import circaLogo from "@/assets/circa-logo.svg";


function getTeamLogo(espnAbbr: string, sport: string) {
  const sportPath = sport.toLowerCase();
  return `https://a.espncdn.com/i/teamlogos/${sportPath}/500/${espnAbbr}.png`;
}

// Format date as HH:MM am/pm ET
function formatGameTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    
    return `${hours}:${minutes}${ampm} ET`;
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

// Calculate divergence for sorting
function calculateDivergence(game: GameOdds, market: Market): { divergence: number; sharpSide: string; team: string } {
  let tickets, money, awayName, homeName;
  
  if (market === "Spread") {
    tickets = { away: game.splits.spread.away.tickets, home: game.splits.spread.home.tickets };
    money = { away: game.splits.spread.away.handle, home: game.splits.spread.home.handle };
    awayName = game.away.abbr;
    homeName = game.home.abbr;
  } else if (market === "Total") {
    tickets = { away: game.splits.total.over.tickets, home: game.splits.total.under.tickets };
    money = { away: game.splits.total.over.handle, home: game.splits.total.under.handle };
    awayName = "Over";
    homeName = "Under";
  } else {
    tickets = { away: game.splits.moneyline.away.tickets, home: game.splits.moneyline.home.tickets };
    money = { away: game.splits.moneyline.away.handle, home: game.splits.moneyline.home.handle };
    awayName = game.away.abbr;
    homeName = game.home.abbr;
  }
  
  const awayDivergence = money.away - tickets.away;
  const homeDivergence = money.home - tickets.home;
  
  const maxDivergence = Math.max(Math.abs(awayDivergence), Math.abs(homeDivergence));
  const sharpSide = Math.abs(awayDivergence) > Math.abs(homeDivergence) ? "away" : "home";
  const team = sharpSide === "away" ? awayName : homeName;
  
  return { divergence: maxDivergence, sharpSide, team };
}

export default function Feed() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"lines" | "splits">("splits");
  const [globalMarket, setGlobalMarket] = useState<Market>("Spread");
  const [selectedBook, setSelectedBook] = useState<"DK" | "Circa">("DK");
  
  // Filter by book and sort games by date (earliest first)
  const sortedGames = useMemo(() => {
    const bookFilter = selectedBook === "Circa" ? "CIRCA" : selectedBook;
    const filtered = mockGameOdds.filter(game => game.book === bookFilter);
    return filtered.sort((a, b) => {
      const dateA = new Date(a.kickoff).getTime();
      const dateB = new Date(b.kickoff).getTime();
      return dateA - dateB;
    });
  }, [selectedBook]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    };

    checkAuth();

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
        <div className="container mx-auto px-4 py-3">
          <h1 
            className="text-2xl font-bold text-center font-['Inter',_sans-serif] mb-3"
            style={{ color: "var(--ma-text-primary)" }}
          >
            Feed
          </h1>
          
          {/* Lines/Splits Tabs */}
          <div 
            className="relative flex gap-[8px] px-[4px] py-[4px] rounded-[14px] max-w-xs mx-auto mb-2"
            style={{
              background: "var(--ma-surface)",
              border: "1px solid var(--ma-stroke)"
            }}
          >
            <motion.div
              className="absolute top-[4px] bottom-[4px] rounded-[10px]"
              initial={false}
              animate={{
                left: activeTab === "lines" ? "4px" : "calc(50% + 2px)",
                width: "calc(50% - 6px)"
              }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              style={{
                background: "rgba(111, 116, 255, 0.14)",
                border: "1px solid var(--ma-accent-indigo)"
              }}
            />
            
            <button
              onClick={() => setActiveTab("lines")}
              className="flex-1 font-['Inter',_sans-serif] relative z-10 px-[16px] py-[8px] rounded-[10px] transition-colors flex items-center justify-center"
              style={{
                color: activeTab === "lines" ? "var(--ma-text-primary)" : "var(--ma-text-secondary)",
                fontSize: "15px",
                fontWeight: 600
              }}
            >
              Lines
            </button>
            <button
              onClick={() => setActiveTab("splits")}
              className="flex-1 font-['Inter',_sans-serif] relative z-10 px-[16px] py-[8px] rounded-[10px] transition-colors flex items-center justify-center"
              style={{
                color: activeTab === "splits" ? "var(--ma-text-primary)" : "var(--ma-text-secondary)",
                fontSize: "15px",
                fontWeight: 600
              }}
            >
              Splits
            </button>
          </div>
          
          {/* Book Filter and Market Toggle Row */}
          <div className="flex items-center gap-2 max-w-md mx-auto">
            {/* Market toggle removed - showing all splits in each card */}
          </div>
        </div>
      </header>

      <div className="px-3 pt-3">
        <div className="space-y-2">
          {sortedGames.map((game) => (
            activeTab === "lines" ? (
              <LinesCard 
                key={`${game.gameId}-${game.book}`}
                game={game}
                book={selectedBook}
              />
            ) : (
              <SplitsCard 
                key={`${game.gameId}-${game.book}`}
                game={game}
              />
            )
          ))}
        </div>
      </div>
    </div>
  );
}

// Format date for display (e.g., "Thu, 10/30")
function formatGameDate(dateString: string): string {
  try {
    const gameDate = new Date(dateString);
    if (isNaN(gameDate.getTime())) return dateString;
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const dayName = dayNames[gameDate.getDay()];
    const month = gameDate.getMonth() + 1;
    const date = gameDate.getDate();
    
    return `${dayName}, ${month}/${date}`;
  } catch {
    return dateString;
  }
}

// Lines Card - displays all three markets at once
function LinesCard({ game, book }: { game: GameOdds; book: "DK" | "Circa" }) {
  // Check if both DK and CIRCA data exist for this game
  const hasDK = useMemo(() => 
    mockGameOdds.some(g => g.gameId === game.gameId && g.book === "DK"),
    [game.gameId]
  );
  
  const hasCirca = useMemo(() => 
    mockGameOdds.some(g => g.gameId === game.gameId && g.book === "CIRCA"),
    [game.gameId]
  );
  
  // If only DK is available, force DK selection
  const [selectedBook, setSelectedBook] = useState<"DK" | "Circa">(
    hasCirca ? book : "DK"
  );
  
  // Find the game data for the selected book
  const displayGame = useMemo(() => {
    const bookFilter = selectedBook === "Circa" ? "CIRCA" : selectedBook;
    const matchingGame = mockGameOdds.find(g => g.gameId === game.gameId && g.book === bookFilter);
    return matchingGame || game;
  }, [game.gameId, selectedBook, game]);
  
  const firstOdds = displayGame.odds[0];
  
  // Ensure book selection is valid
  useEffect(() => {
    if (!hasDK && selectedBook === "DK") {
      setSelectedBook("Circa");
    }
    if (!hasCirca && selectedBook === "Circa") {
      setSelectedBook("DK");
    }
  }, [hasDK, hasCirca, selectedBook]);
  
  return (
    <motion.div 
      className="w-full rounded-xl overflow-hidden animate-fade-in"
      style={{
        background: "var(--ma-card)",
        border: "1px solid var(--ma-stroke)"
      }}
    >
      {/* Date Header - Desktop Only */}
      <div 
        className="hidden md:flex items-center justify-between px-4 py-2"
        style={{
          background: "var(--ma-bg)",
          borderBottom: "1px solid var(--ma-stroke)"
        }}
      >
        <div className="text-xs font-semibold" style={{ color: "var(--ma-text-secondary)" }}>
          {formatGameDate(game.kickoff)} {formatGameTime(game.kickoff)}
        </div>
        
        {hasDK && hasCirca && (
          <div 
            className="relative flex gap-[8px] px-[4px] py-[4px] rounded-[14px] flex-shrink-0"
            style={{
              background: "var(--ma-surface)",
              border: "1px solid var(--ma-stroke)"
            }}
          >
            <motion.div
              className="absolute top-[4px] bottom-[4px] rounded-[10px]"
              initial={false}
              animate={{
                left: selectedBook === "DK" ? "4px" : "calc(50% + 2px)",
                width: "calc(50% - 6px)"
              }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              style={{
                background: "rgba(111, 116, 255, 0.14)",
                border: "1px solid var(--ma-accent-indigo)"
              }}
            />
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBook("DK");
              }}
              className="relative z-10 px-[8px] py-[6px] rounded-[10px] transition-all flex items-center justify-center"
              style={{
                opacity: selectedBook === "DK" ? 1 : 0.5
              }}
            >
              <img src={draftKingsLogo} alt="DraftKings" className="h-5 w-auto" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBook("Circa");
              }}
              className="relative z-10 px-[8px] py-[6px] rounded-[10px] transition-all flex items-center justify-center"
              style={{
                opacity: selectedBook === "Circa" ? 1 : 0.5
              }}
            >
              <img src={circaLogo} alt="Circa" className="h-5 w-auto" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Date Header with Column Labels */}
        <div 
          className="grid grid-cols-[1fr_2fr] gap-4 px-4 py-3 items-center"
          style={{
            background: "var(--ma-bg)",
            borderBottom: "1px solid var(--ma-stroke)"
          }}
        >
          <div className="flex flex-col items-center justify-center gap-0.5">
            <div className="text-base font-semibold" style={{ color: "var(--ma-text-secondary)" }}>
              {formatGameDate(game.kickoff)}
            </div>
            <div className="text-xs font-medium" style={{ color: "var(--ma-text-secondary)" }}>
              {formatGameTime(game.kickoff)}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-xs font-semibold text-center" style={{ color: "var(--ma-text-secondary)" }}>
              Spread
            </div>
            <div className="text-xs font-semibold text-center" style={{ color: "var(--ma-text-secondary)" }}>
              Total
            </div>
            <div className="text-xs font-semibold text-center" style={{ color: "var(--ma-text-secondary)" }}>
              Moneyline
            </div>
          </div>
        </div>

        {/* Content: Teams + Odds */}
        <div 
          className="grid grid-cols-[1fr_2fr] gap-4 px-4 py-4"
          style={{ background: "var(--ma-card)" }}
        >
          {/* Left: Teams */}
          <div className="flex flex-col justify-center relative">
            <div className="flex items-center gap-3 mb-1">
              <img src={getTeamLogo(displayGame.away.espnAbbr, displayGame.sport)} alt="" className="w-12 h-12 rounded flex-shrink-0" />
              <div className="text-base font-bold leading-tight" style={{ color: "var(--ma-text-primary)" }}>
                {displayGame.away.abbr}
              </div>
            </div>
            
            <div className="text-center py-2">
              <div className="text-[11px] font-semibold" style={{ color: "var(--ma-text-secondary)" }}>
                AT
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-1">
              <img src={getTeamLogo(displayGame.home.espnAbbr, displayGame.sport)} alt="" className="w-12 h-12 rounded flex-shrink-0" />
              <div className="text-base font-bold leading-tight" style={{ color: "var(--ma-text-primary)" }}>
                {displayGame.home.abbr}
              </div>
            </div>
          </div>

          {/* Right: Odds Grid */}
          <div className="grid grid-cols-3 gap-2 items-center h-full">
            {/* Row 1: Away Team Odds */}
            <div 
              className="rounded-lg p-3 flex flex-col items-center justify-center h-full"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <div className="text-base font-bold leading-none mb-1" style={{ color: "var(--ma-text-primary)" }}>
                {formatSpreadLine(firstOdds?.spread?.away?.line || -3.5)}
              </div>
              <div className="text-xs font-semibold leading-none" style={{ color: "#4ade80" }}>
                {(() => {
                  const odds = firstOdds?.spread?.away?.odds.american || -110;
                  return `${odds > 0 ? '+' : ''}${odds}`;
                })()}
              </div>
            </div>

            <div 
              className="rounded-lg p-3 flex flex-col items-center justify-center h-full"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <div className="text-base font-bold leading-none mb-1 whitespace-nowrap" style={{ color: "var(--ma-text-primary)" }}>
                O {firstOdds?.total?.over?.line || 47.5}
              </div>
              <div className="text-xs font-semibold leading-none" style={{ color: "#4ade80" }}>
                {(() => {
                  const odds = firstOdds?.total?.over?.odds.american || -110;
                  return `${odds > 0 ? '+' : ''}${odds}`;
                })()}
              </div>
            </div>

            <div 
              className="rounded-lg p-3 flex items-center justify-center h-full"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <div className="text-base font-bold" style={{ color: "#4ade80" }}>
                {(() => {
                  const awayML = firstOdds?.moneyline?.away?.american || -110;
                  return `${awayML > 0 ? '+' : ''}${awayML}`;
                })()}
              </div>
            </div>

            {/* Row 2: Home Team Odds */}
            <div 
              className="rounded-lg p-3 flex flex-col items-center justify-center h-full"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <div className="text-base font-bold leading-none mb-1" style={{ color: "var(--ma-text-primary)" }}>
                {formatSpreadLine(firstOdds?.spread?.home?.line || 3.5)}
              </div>
              <div className="text-xs font-semibold leading-none" style={{ color: "#4ade80" }}>
                {(() => {
                  const odds = firstOdds?.spread?.home?.odds.american || -110;
                  return `${odds > 0 ? '+' : ''}${odds}`;
                })()}
              </div>
            </div>

            <div 
              className="rounded-lg p-3 flex flex-col items-center justify-center h-full"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <div className="text-base font-bold leading-none mb-1 whitespace-nowrap" style={{ color: "var(--ma-text-primary)" }}>
                U {firstOdds?.total?.under?.line || 47.5}
              </div>
              <div className="text-xs font-semibold leading-none" style={{ color: "#4ade80" }}>
                {(() => {
                  const odds = firstOdds?.total?.under?.odds.american || -110;
                  return `${odds > 0 ? '+' : ''}${odds}`;
                })()}
              </div>
            </div>

            <div 
              className="rounded-lg p-3 flex items-center justify-center h-full"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <div className="text-base font-bold" style={{ color: "#4ade80" }}>
                {(() => {
                  const homeML = firstOdds?.moneyline?.home?.american || -110;
                  return `${homeML > 0 ? '+' : ''}${homeML}`;
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-between px-4 py-3"
          style={{
            background: "var(--ma-surface)",
            borderTop: "1px solid var(--ma-stroke)"
          }}
        >
          <div></div>

          {hasDK && hasCirca && (
            <div 
              className="relative flex gap-[8px] px-[4px] py-[4px] rounded-[14px] flex-shrink-0"
              style={{
                background: "var(--ma-surface)",
                border: "1px solid var(--ma-stroke)"
              }}
            >
              <motion.div
                className="absolute top-[4px] bottom-[4px] rounded-[10px]"
                initial={false}
                animate={{
                  left: selectedBook === "DK" ? "4px" : "calc(50% + 2px)",
                  width: "calc(50% - 6px)"
                }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                style={{
                  background: "rgba(111, 116, 255, 0.14)",
                  border: "1px solid var(--ma-accent-indigo)"
                }}
              />
              
              <button
                onClick={() => setSelectedBook("DK")}
                className="relative z-10 px-[8px] py-[6px] rounded-[10px] transition-all flex items-center justify-center"
                style={{
                  opacity: selectedBook === "DK" ? 1 : 0.5
                }}
              >
                <img src={draftKingsLogo} alt="DraftKings" className="h-5 w-auto" />
              </button>
              <button
                onClick={() => setSelectedBook("Circa")}
                className="relative z-10 px-[8px] py-[6px] rounded-[10px] transition-all flex items-center justify-center"
                style={{
                  opacity: selectedBook === "Circa" ? 1 : 0.5
                }}
              >
                <img src={circaLogo} alt="Circa" className="h-5 w-auto" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Column Headers */}
        <div 
          className="grid grid-cols-4 gap-px px-2 md:px-4 py-1.5 md:py-2 items-center"
          style={{
            background: "var(--ma-surface)",
            borderBottom: "1px solid var(--ma-stroke)"
          }}
        >
          <div className="text-[10px] md:text-xs font-semibold text-center flex items-center justify-center" style={{ color: "var(--ma-text-secondary)" }}>
            Team
          </div>
          <div className="text-[10px] md:text-xs font-semibold text-center flex items-center justify-center" style={{ color: "var(--ma-text-secondary)" }}>
            Spread
          </div>
          <div className="text-[10px] md:text-xs font-semibold text-center flex items-center justify-center" style={{ color: "var(--ma-text-secondary)" }}>
            Total
          </div>
          <div className="text-[10px] md:text-xs font-semibold text-center flex items-center justify-center" style={{ color: "var(--ma-text-secondary)" }}>
            Moneyline
          </div>
        </div>

        {/* Odds Values */}
        <div className="px-2 md:px-4 py-2 md:py-3" style={{ background: "var(--ma-card)" }}>
          <div className="grid grid-cols-4 gap-1.5 md:gap-3 items-center">
            {/* Team Column */}
            <div className="flex flex-col items-center justify-center h-full">
              {/* Away Team */}
              <div className="flex items-center justify-center gap-2 md:gap-3 py-1.5 md:py-2">
                <img src={getTeamLogo(displayGame.away.espnAbbr, displayGame.sport)} alt="" className="w-6 h-6 md:w-8 md:h-8 rounded flex-shrink-0" />
                <div className="text-xs md:text-base font-bold" style={{ color: "var(--ma-text-primary)" }}>
                  {displayGame.away.abbr}
                </div>
              </div>
              
              {/* AT - Centered spacer */}
              <div className="flex items-center justify-center py-1">
                <div className="text-[10px] md:text-xs font-semibold" style={{ color: "var(--ma-text-secondary)" }}>
                  AT
                </div>
              </div>
              
              {/* Home Team */}
              <div className="flex items-center justify-center gap-2 md:gap-3 py-1.5 md:py-2">
                <img src={getTeamLogo(displayGame.home.espnAbbr, displayGame.sport)} alt="" className="w-6 h-6 md:w-8 md:h-8 rounded flex-shrink-0" />
                <div className="text-xs md:text-base font-bold" style={{ color: "var(--ma-text-primary)" }}>
                  {displayGame.home.abbr}
                </div>
              </div>
            </div>
            
            {/* Spread Column */}
            <div className="flex flex-col items-center justify-center h-full">
              {/* Away Spread */}
              <div 
                className="rounded p-1.5 md:p-2 w-full"
                style={{ background: "var(--ma-surface)" }}
              >
                <div className="text-center text-sm md:text-base font-bold mb-0.5" style={{ color: "var(--ma-text-primary)" }}>
                  {formatSpreadLine(firstOdds?.spread?.away?.line || -3.5)}
                </div>
                <div className="text-center text-[10px] md:text-xs font-semibold" style={{ color: "#4ade80" }}>
                  {(() => {
                    const odds = firstOdds?.spread?.away?.odds.american || -110;
                    return `${odds > 0 ? '+' : ''}${odds}`;
                  })()}
                </div>
              </div>
              
              {/* Spacer to match AT */}
              <div className="py-1"></div>
              
              {/* Home Spread */}
              <div 
                className="rounded p-1.5 md:p-2 w-full"
                style={{ background: "var(--ma-surface)" }}
              >
                <div className="text-center text-sm md:text-base font-bold mb-0.5" style={{ color: "var(--ma-text-primary)" }}>
                  {formatSpreadLine(firstOdds?.spread?.home?.line || 3.5)}
                </div>
                <div className="text-center text-[10px] md:text-xs font-semibold" style={{ color: "#4ade80" }}>
                  {(() => {
                    const odds = firstOdds?.spread?.home?.odds.american || -110;
                    return `${odds > 0 ? '+' : ''}${odds}`;
                  })()}
                </div>
              </div>
            </div>
            
            {/* Total Column */}
            <div className="flex flex-col items-center justify-center h-full">
              {/* Over */}
              <div 
                className="rounded p-1.5 md:p-2 w-full"
                style={{ background: "var(--ma-surface)" }}
              >
                <div className="text-center text-sm md:text-base font-bold mb-0.5" style={{ color: "var(--ma-text-primary)" }}>
                  O {firstOdds?.total?.over?.line || 47.5}
                </div>
                <div className="text-center text-[10px] md:text-xs font-semibold" style={{ color: "#4ade80" }}>
                  {(() => {
                    const odds = firstOdds?.total?.over?.odds.american || -110;
                    return `${odds > 0 ? '+' : ''}${odds}`;
                  })()}
                </div>
              </div>
              
              {/* Spacer to match AT */}
              <div className="py-1"></div>
              
              {/* Under */}
              <div 
                className="rounded p-1.5 md:p-2 w-full"
                style={{ background: "var(--ma-surface)" }}
              >
                <div className="text-center text-sm md:text-base font-bold mb-0.5" style={{ color: "var(--ma-text-primary)" }}>
                  U {firstOdds?.total?.under?.line || 47.5}
                </div>
                <div className="text-center text-[10px] md:text-xs font-semibold" style={{ color: "#4ade80" }}>
                  {(() => {
                    const odds = firstOdds?.total?.under?.odds.american || -110;
                    return `${odds > 0 ? '+' : ''}${odds}`;
                  })()}
                </div>
              </div>
            </div>
            
            {/* Moneyline Column */}
            <div className="flex flex-col items-center justify-center h-full">
              {/* Away ML */}
              <div 
                className="rounded p-1.5 md:p-2 w-full flex items-center justify-center min-h-[44px] md:min-h-[52px]"
                style={{ background: "var(--ma-surface)" }}
              >
                <div className="text-center text-sm md:text-base font-bold" style={{ color: "#4ade80" }}>
                  {(() => {
                    const awayML = firstOdds?.moneyline?.away?.american || -110;
                    return `${awayML > 0 ? '+' : ''}${awayML}`;
                  })()}
                </div>
              </div>
              
              {/* Spacer to match AT */}
              <div className="py-1"></div>
              
              {/* Home ML */}
              <div 
                className="rounded p-1.5 md:p-2 w-full flex items-center justify-center min-h-[44px] md:min-h-[52px]"
                style={{ background: "var(--ma-surface)" }}
              >
                <div className="text-center text-sm md:text-base font-bold" style={{ color: "#4ade80" }}>
                  {(() => {
                    const homeML = firstOdds?.moneyline?.home?.american || -110;
                    return `${homeML > 0 ? '+' : ''}${homeML}`;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Splits Card - displays ticket/money percentages for all markets
function SplitsCard({ game }: { game: GameOdds }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const firstOdds = game.odds[0];
  
  // Calculate data for all three markets
  const spreadsData = useMemo(() => {
    const tickets = { left: game.splits.spread.away.tickets, right: game.splits.spread.home.tickets };
    const money = { left: game.splits.spread.away.handle, right: game.splits.spread.home.handle };
    const currentLine = firstOdds?.spread?.away?.line || -3.5;
    return {
      tickets,
      money,
      leftLabel: game.away.abbr,
      rightLabel: game.home.abbr,
      lineDisplay: `${game.away.abbr} ${formatSpreadLine(currentLine)}`,
      leftColor: game.away.color,
      rightColor: game.home.color
    };
  }, [game, firstOdds]);
  
  const totalsData = useMemo(() => {
    const tickets = { left: game.splits.total.over.tickets, right: game.splits.total.under.tickets };
    const money = { left: game.splits.total.over.handle, right: game.splits.total.under.handle };
    const currentLine = firstOdds?.total?.over?.line || 47.5;
    return {
      tickets,
      money,
      leftLabel: "O",
      rightLabel: "U",
      lineDisplay: `${currentLine}`,
      leftColor: game.away.color,
      rightColor: game.home.color
    };
  }, [game, firstOdds]);
  
  const mlData = useMemo(() => {
    const tickets = { left: game.splits.moneyline.away.tickets, right: game.splits.moneyline.home.tickets };
    const money = { left: game.splits.moneyline.away.handle, right: game.splits.moneyline.home.handle };
    const awayML = firstOdds?.moneyline?.away?.american || -110;
    return {
      tickets,
      money,
      leftLabel: game.away.abbr,
      rightLabel: game.home.abbr,
      lineDisplay: `${game.away.abbr} ${awayML > 0 ? '+' : ''}${awayML}`,
      leftColor: game.away.color,
      rightColor: game.home.color
    };
  }, [game, firstOdds]);

  return (
    <motion.div 
      className="w-full rounded-xl overflow-hidden"
      style={{
        background: "var(--ma-card)",
        border: "1px solid var(--ma-stroke)"
      }}
    >
      <div className="p-3">
        {/* Teams Row */}
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center gap-2">
            <img src={getTeamLogo(game.away.espnAbbr, game.sport)} alt="" className="w-6 h-6 rounded" />
            <span className="font-semibold text-sm" style={{ color: "var(--ma-text-primary)" }}>{game.away.abbr}</span>
            <span className="text-xs" style={{ color: "var(--ma-text-secondary)" }}>@</span>
            <img src={getTeamLogo(game.home.espnAbbr, game.sport)} alt="" className="w-6 h-6 rounded" />
            <span className="font-semibold text-sm" style={{ color: "var(--ma-text-primary)" }}>{game.home.abbr}</span>
            <div 
              className="text-[10px] px-2 py-1 rounded bg-white/5 ml-2"
              style={{
                color: "var(--ma-text-secondary)"
              }}
            >
              {formatGameDate(game.kickoff)} {formatGameTime(game.kickoff)}
            </div>
          </div>
        </div>
        
        {/* Spread Bar */}
        <div className="mb-2">
          <div className="text-[10px] font-semibold mb-1 text-center" style={{ color: "var(--ma-text-secondary)" }}>
            Spread
          </div>
          <div className="relative h-8 rounded-lg overflow-hidden" style={{ background: "var(--ma-surface)", border: "0.5px solid white" }}>
            <div 
              className="absolute inset-y-0 left-0"
              style={{
                width: `${spreadsData.money.left}%`,
                background: spreadsData.leftColor,
                borderRight: "0.5px solid white"
              }}
            />
            <div 
              className="absolute inset-y-0 right-0"
              style={{
                width: `${spreadsData.money.right}%`,
                background: spreadsData.rightColor
              }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-bold" style={{ color: "var(--ma-text-primary)" }}>
              <span>{spreadsData.money.left}%</span>
              <span>{spreadsData.money.right}%</span>
            </div>
          </div>
        </div>
        
        {/* Total Bar */}
        <div className="mb-2">
          <div className="text-[10px] font-semibold mb-1 text-center" style={{ color: "var(--ma-text-secondary)" }}>
            Total
          </div>
          <div className="relative h-8 rounded-lg overflow-hidden" style={{ background: "var(--ma-surface)", border: "0.5px solid white" }}>
            <div 
              className="absolute inset-y-0 left-0"
              style={{
                width: `${totalsData.money.left}%`,
                background: totalsData.leftColor,
                borderRight: "0.5px solid white"
              }}
            />
            <div 
              className="absolute inset-y-0 right-0"
              style={{
                width: `${totalsData.money.right}%`,
                background: totalsData.rightColor
              }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-bold" style={{ color: "var(--ma-text-primary)" }}>
              <span>{totalsData.money.left}%</span>
              <span>{totalsData.money.right}%</span>
            </div>
          </div>
        </div>
        
        {/* Moneyline Bar */}
        <div>
          <div className="text-[10px] font-semibold mb-1 text-center" style={{ color: "var(--ma-text-secondary)" }}>
            Moneyline
          </div>
          <div className="relative h-8 rounded-lg overflow-hidden" style={{ background: "var(--ma-surface)", border: "0.5px solid white" }}>
            <div 
              className="absolute inset-y-0 left-0"
              style={{
                width: `${mlData.money.left}%`,
                background: mlData.leftColor,
                borderRight: "0.5px solid white"
              }}
            />
            <div 
              className="absolute inset-y-0 right-0"
              style={{
                width: `${mlData.money.right}%`,
                background: mlData.rightColor
              }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-bold" style={{ color: "var(--ma-text-primary)" }}>
              <span>{mlData.money.left}%</span>
              <span>{mlData.money.right}%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
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
