import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import type { GameOdds } from "@/types/odds";
import { useEdgeGuideData } from "@/hooks/useEdgeGuideData";
import { MirrorBar } from "@/components/MirrorBar";
import { LineHistoryTable } from "@/components/LineHistoryTable";
import { getTeamLogo } from "@/utils/teamLogos";
import type { Market } from "@/utils/bettingLogic";
import { formatSpreadLine } from "@/utils/bettingLogic";
import { UserCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
const draftKingsLogo = "/logos/Sportsbooks/DraftKings.png";
const circaLogo = "/logos/Sportsbooks/Circa.png";
import worldSeriesLogo from "@/assets/worldseries.png";
import foxLogo from "@/assets/FOX.png";
import abcLogo from "@/assets/ABC.png";
import nbcLogo from "@/assets/NBC.png";
import amazonPrimeLogo from "@/assets/Amazon-Prime.png";
import cbsLogo from "@/assets/CBS.png";
import espnLogo from "@/assets/ESPN.png";
import espn2Logo from "@/assets/ESPN2.png";
import cbssnLogo from "@/assets/CBSSN.png";
import nflBerlinLogo from "@/assets/nfl-berlin.png";
import tntLogo from "@/assets/TNT.png";
import nflLogo from "@/assets/league-logos/nfl.png";
import ncaafLogo from "@/assets/league-logos/ncaaf.png";
import nbaLogo from "@/assets/league-logos/nba.png";
import nhlLogo from "@/assets/league-logos/nhl.png";
import ncaamLogo from "@/assets/league-logos/ncaam.png";
import mlbLogo from "@/assets/league-logos/mlb.png";
import { areColorsSimilar, getBestContrastColor } from "@/utils/colorUtils";

// Map TV network names to their logos
const TV_LOGOS: Record<string, string> = {
  "FOX": foxLogo,
  "ABC": abcLogo,
  "NBC": nbcLogo,
  "Amazon": amazonPrimeLogo,
  "CBS": cbsLogo,
  "ESPN": espnLogo,
  "ESPN2": espn2Logo,
  "CBSSN": cbssnLogo,
  "Prime Video": amazonPrimeLogo,
  "NFL Network": espnLogo,
  "TNT": tntLogo,
};

// Map special logos (e.g., international games)
const SPECIAL_LOGOS: Record<string, string> = {
  "nfl-berlin": nflBerlinLogo,
};

// Format date as HH:MM am/pm ET/EST
function formatGameTime(dateString: string, sport?: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    
    const timezone = sport === 'NCAAM' ? 'EST' : 'ET';
    return `${hours}:${minutes}${ampm} ${timezone}`;
  } catch {
    return dateString;
  }
}

// Convert GameOdds for LineHistoryTable
function convertGameOddsToMatchup(game: GameOdds) {
  const firstOdds = game.odds[0];
  
  // Check if spread/total data is missing (line = 0 means no data)
  const hasSpread = firstOdds?.spread?.away && firstOdds.spread.away.line !== 0;
  const hasTotal = firstOdds?.total?.over && firstOdds.total.over.line !== 0;
  const hasML = firstOdds?.moneyline?.away && firstOdds.moneyline.away.american !== 0;
  
  return {
    dateTime: game.kickoff,
    away: {
      name: game.away.name,
      espnAbbr: game.away.espnAbbr,
      color: game.away.color,
      odds: {
        ml: hasML ? (firstOdds.moneyline!.away.american > 0 ? `+${firstOdds.moneyline!.away.american}` : `${firstOdds.moneyline!.away.american}`) : "-",
        spread: hasSpread ? formatSpreadLine(firstOdds.spread!.away.line) : "-",
        spreadOdds: hasSpread ? (firstOdds.spread!.away.odds.american > 0 ? `+${firstOdds.spread!.away.odds.american}` : `${firstOdds.spread!.away.odds.american}`) : "-",
        total: hasTotal ? `O ${firstOdds.total!.over.line}` : "-",
        totalOdds: hasTotal ? (firstOdds.total!.over.odds.american > 0 ? `+${firstOdds.total!.over.odds.american}` : `${firstOdds.total!.over.odds.american}`) : "-",
      },
    },
    home: {
      name: game.home.name,
      espnAbbr: game.home.espnAbbr,
      color: game.home.color,
      odds: {
        ml: hasML ? (firstOdds.moneyline!.home.american > 0 ? `+${firstOdds.moneyline!.home.american}` : `${firstOdds.moneyline!.home.american}`) : "-",
        spread: hasSpread ? formatSpreadLine(firstOdds.spread!.home.line) : "-",
        spreadOdds: hasSpread ? (firstOdds.spread!.home.odds.american > 0 ? `+${firstOdds.spread!.home.odds.american}` : `${firstOdds.spread!.home.odds.american}`) : "-",
        total: hasTotal ? `U ${firstOdds.total!.under.line}` : "-",
        totalOdds: hasTotal ? (firstOdds.total!.under.odds.american > 0 ? `+${firstOdds.total!.under.odds.american}` : `${firstOdds.total!.under.odds.american}`) : "-",
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
  const [activeTab, setActiveTab] = useState<"lines" | "splits">("lines");
  const [globalMarket, setGlobalMarket] = useState<Market>("Spread");
  const [selectedBook, setSelectedBook] = useState<"DK" | "Circa">("DK");
  const [selectedSport, setSelectedSport] = useState<"NFL" | "NCAAF" | "NBA" | "NHL" | "MLB" | "NCAAM">("NFL");
  
  // Fetch live data from EdgeGuide with automatic fallback to mock data
  const { data: liveGames, isLoading: isLoadingGames } = useEdgeGuideData();
  
  // Check which books have data for the selected sport
  const availableBooksForSport = useMemo(() => {
    if (!liveGames) return { hasDK: false, hasCirca: false };
    const hasDK = liveGames.some(game => game.book === "DK" && game.sport === selectedSport);
    const hasCirca = liveGames.some(game => game.book === "CIRCA" && game.sport === selectedSport);
    return { hasDK, hasCirca };
  }, [liveGames, selectedSport]);

  // Auto-select the only available book
  useEffect(() => {
    if (availableBooksForSport.hasDK && !availableBooksForSport.hasCirca) {
      setSelectedBook("DK");
    } else if (!availableBooksForSport.hasDK && availableBooksForSport.hasCirca) {
      setSelectedBook("Circa");
    }
  }, [availableBooksForSport]);

  // Filter by book, sport, and sort games by date (earliest first)
  // Exclude specific prohibited matchups
  const sortedGames = useMemo(() => {
    if (!liveGames) return [];
    const bookFilter = selectedBook === "Circa" ? "CIRCA" : selectedBook;
    const filtered = liveGames.filter(game => {
      // Filter by book and sport
      if (game.book !== bookFilter || game.sport !== selectedSport) return false;
      
      // Exclude prohibited matchups
      const isProhibited = 
        (game.away.name === "Brown" && game.home.name === "Pennsylvania") ||
        (game.away.name === "Idaho" && game.home.name === "N Arizona");
      
      return !isProhibited;
    });
    return filtered.sort((a, b) => {
      const dateA = new Date(a.kickoff).getTime();
      const dateB = new Date(b.kickoff).getTime();
      return dateA - dateB;
    });
  }, [liveGames, selectedBook, selectedSport]);

  // Auto-switch to NHL/NBA if no NFL games available
  useEffect(() => {
    if (!liveGames || liveGames.length === 0) return;
    
    const bookFilter = selectedBook === "Circa" ? "CIRCA" : selectedBook;
    const hasNFL = liveGames.some(game => game.book === bookFilter && game.sport === "NFL");
    const hasNHL = liveGames.some(game => game.book === bookFilter && game.sport === "NHL");
    const hasNBA = liveGames.some(game => game.book === bookFilter && game.sport === "NBA");
    
    if (selectedSport === "NFL" && !hasNFL) {
      if (hasNHL) {
        setSelectedSport("NHL");
      } else if (hasNBA) {
        setSelectedSport("NBA");
      }
    }
  }, [liveGames, selectedBook, selectedSport]);

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

  if (loading || isLoadingGames) {
    return (
      <div style={{ background: "var(--ma-bg)", minHeight: "100vh" }} className="flex items-center justify-center">
        <p style={{ color: "var(--ma-text-primary)" }}>Loading odds data...</p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--ma-bg)", minHeight: "100vh" }}>
      <header
        className="sticky top-0 z-40 backdrop-blur-sm"
        style={{
          borderBottom: "1px solid var(--ma-stroke)",
          background: "var(--ma-card)"
        }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10"></div>
            <h1 
              className="text-2xl font-bold text-center font-['Inter',_sans-serif]"
              style={{ color: "var(--ma-text-primary)" }}
            >
              Feed
            </h1>
            <button
              onClick={() => navigate("/profile")}
              className="p-2 rounded-full hover:bg-white/5 transition-colors"
            >
              <UserCircle className="h-6 w-6" style={{ color: "var(--ma-text-primary)" }} />
            </button>
          </div>
          
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
        {/* Sport Filter */}
        <div className="relative mb-3 px-3">
          <div className="overflow-x-auto scrollbar-hide scroll-smooth">
            <div className="flex justify-center gap-2 min-w-max pb-1 mx-auto">
              <button
                onClick={() => setSelectedSport("NFL")}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all min-w-[56px] ${
                  selectedSport === "NFL"
                    ? "border border-white shadow-lg"
                    : "border border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img 
                  src={nflLogo}
                  alt="NFL"
                  className="w-6 h-6 object-contain"
                  onError={(e) => console.error("NFL logo failed to load:", e)}
                />
                <span className="leading-tight">NFL</span>
              </button>
              <button
                onClick={() => setSelectedSport("MLB")}
                className={`hidden flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all min-w-[56px] ${
                  selectedSport === "MLB"
                    ? "border border-white shadow-lg"
                    : "border border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img 
                  src={mlbLogo}
                  alt="MLB"
                  className="w-6 h-6 object-contain"
                  onError={(e) => console.error("MLB logo failed to load:", e)}
                />
                <span className="leading-tight">MLB</span>
              </button>
              <button
                onClick={() => setSelectedSport("NCAAF")}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all min-w-[56px] ${
                  selectedSport === "NCAAF"
                    ? "border border-white shadow-lg"
                    : "border border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img 
                  src={ncaafLogo}
                  alt="NCAAF"
                  className="w-6 h-6 object-contain"
                  onError={(e) => console.error("NCAAF logo failed to load:", e)}
                />
                <span className="leading-tight">NCAAF</span>
              </button>
              <button
                onClick={() => setSelectedSport("NBA")}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all min-w-[56px] ${
                  selectedSport === "NBA"
                    ? "border border-white shadow-lg"
                    : "border border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img 
                  src={nbaLogo}
                  alt="NBA"
                  className="w-6 h-6 object-contain"
                  onError={(e) => console.error("NBA logo failed to load:", e)}
                />
                <span className="leading-tight">NBA</span>
              </button>
              <button
                onClick={() => setSelectedSport("NHL")}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all min-w-[56px] ${
                  selectedSport === "NHL"
                    ? "border border-white shadow-lg"
                    : "border border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img 
                  src={nhlLogo}
                  alt="NHL"
                  className="w-6 h-6 object-contain"
                  onError={(e) => console.error("NHL logo failed to load:", e)}
                />
                <span className="leading-tight">NHL</span>
              </button>
              <button
                onClick={() => setSelectedSport("NCAAM")}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all min-w-[56px] ${
                  selectedSport === "NCAAM"
                    ? "border border-white shadow-lg"
                    : "border border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img 
                  src={ncaamLogo}
                  alt="NCAAM"
                  className="w-6 h-6 object-contain"
                  onError={(e) => console.error("NCAAM logo failed to load:", e)}
                />
                <span className="leading-tight">NCAAM</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bookmaker Toggle - Show buttons only for books with data */}
        <div className="flex justify-center mb-3 px-3">
          <div 
            className="flex gap-1.5 rounded-[10px]"
            style={{
              background: "var(--ma-surface)",
              border: "1px solid var(--ma-stroke)",
              padding: "6px"
            }}
          >
            {availableBooksForSport.hasDK && (
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => setSelectedBook("DK")}
                  className="relative z-10 w-9 h-9 rounded-[7px] transition-all overflow-hidden"
                  style={{
                    opacity: selectedBook === "DK" ? 1 : 0.5,
                    background: "transparent",
                    border: selectedBook === "DK" ? "1.5px solid white" : "none",
                    padding: 0
                  }}
                >
                  <img src={draftKingsLogo} alt="DraftKings" className="w-full h-full object-cover rounded-[7px]" style={{ display: "block" }} />
                </button>
                <span 
                  className="text-[9px] font-semibold" 
                  style={{ color: selectedBook === "DK" ? "var(--ma-text-primary)" : "var(--ma-text-secondary)" }}
                >
                  DK
                </span>
              </div>
            )}
            {availableBooksForSport.hasCirca && (
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => setSelectedBook("Circa")}
                  className="relative z-10 w-9 h-9 rounded-[7px] transition-all overflow-hidden"
                  style={{
                    opacity: selectedBook === "Circa" ? 1 : 0.5,
                    background: "transparent",
                    border: selectedBook === "Circa" ? "1.5px solid white" : "none",
                    padding: 0
                  }}
                >
                  <img src={circaLogo} alt="Circa" className="w-full h-full object-cover rounded-[7px]" style={{ display: "block" }} />
                </button>
                <span 
                  className="text-[9px] font-semibold" 
                  style={{ color: selectedBook === "Circa" ? "var(--ma-text-primary)" : "var(--ma-text-secondary)" }}
                >
                  Circa
                </span>
              </div>
            )}
          </div>
        </div>

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
                book={selectedBook}
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
  const firstOdds = game.odds[0];
  
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
        className="hidden md:flex items-center justify-center gap-2 px-4 py-2"
        style={{
          background: "var(--ma-bg)",
          borderBottom: "1px solid var(--ma-stroke)"
        }}
      >
        <div className="text-xs font-semibold" style={{ color: "var(--ma-text-secondary)" }}>
          {formatGameDate(game.kickoff)} • {formatGameTime(game.kickoff, game.sport)}
        </div>
        {game.specialLogo && SPECIAL_LOGOS[game.specialLogo] && (
          <>
            <span style={{ color: "var(--ma-text-secondary)" }}>•</span>
            <img src={SPECIAL_LOGOS[game.specialLogo]} alt="Special Game" className="h-5 w-auto object-contain" />
          </>
        )}
        {game.tvInfo && TV_LOGOS[game.tvInfo] && (
          <>
            <span style={{ color: "var(--ma-text-secondary)" }}>•</span>
            <div className="flex items-center gap-1.5">
              <img 
                src={TV_LOGOS[game.tvInfo]} 
                alt={game.tvInfo} 
                className={`w-auto object-contain ${game.tvInfo === 'ESPN2' ? 'h-0.5' : 'h-3'}`} 
              />
              <span className="text-xs font-semibold" style={{ color: "var(--ma-text-primary)" }}>
                {game.tvInfo}
              </span>
            </div>
          </>
        )}
        {game.stadium && (
          <>
            <span style={{ color: "var(--ma-text-secondary)" }}>•</span>
            <span className="text-xs font-medium" style={{ color: "var(--ma-text-secondary)" }}>
              {game.stadium}
            </span>
          </>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Date Header with Column Labels */}
        <div 
          style={{
            background: "var(--ma-bg)",
            borderBottom: "1px solid var(--ma-stroke)"
          }}
        >
          {/* Top Lines: Date/Time and Stadium */}
          <div className="px-4 pt-3 pb-2">
            {/* First Line: Date, Time */}
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-xs font-semibold text-white">
                {formatGameDate(game.kickoff)}
              </span>
              <span className="text-xs text-white">•</span>
              <span className="text-xs font-medium" style={{ color: "var(--ma-text-secondary)" }}>
                {formatGameTime(game.kickoff, game.sport)}
              </span>
            </div>
            
            {/* Second Line: Stadium */}
            {game.stadium && (
              <div className="flex items-center justify-center">
                <span className="text-xs font-medium" style={{ color: "var(--ma-text-secondary)" }}>
                  {game.stadium}
                </span>
              </div>
            )}
          </div>

          {/* Bottom Row: TV Network + Column Headers - Matching cell structure exactly */}
          <div className="flex items-center gap-4 px-4 pb-1">
            {/* Left: TV Network Logo + Name - Same width as team column */}
            <div className="flex items-center justify-center gap-2 flex-shrink-0 w-20">
              {game.tvInfo && TV_LOGOS[game.tvInfo] ? (
                <img 
                  src={TV_LOGOS[game.tvInfo]} 
                  alt={game.tvInfo} 
                  className={`w-auto object-contain ${game.tvInfo === 'ESPN2' ? 'h-1' : 'h-6'}`}
                />
              ) : null}
            </div>

            {/* Right: Column Headers - Exact same grid structure as odds cells */}
            <div className="grid grid-cols-3 gap-2 flex-1">
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
        </div>

        {/* Content: Teams + Odds */}
        <div 
          className="flex gap-4 px-4 py-4"
          style={{ background: "var(--ma-card)" }}
        >
          {/* Left: Teams */}
          <div className="flex flex-col justify-center items-center flex-shrink-0 w-20">
            <div className="flex flex-col items-center mb-1">
              <img src={getTeamLogo(game.sport, game.away.espnAbbr, game.away.slug)} alt="" className="w-12 h-12 rounded flex-shrink-0 mb-1.5" />
              <div className="flex flex-col items-center text-center leading-tight">
                <div className="text-[10px] font-semibold whitespace-nowrap" style={{ color: "var(--ma-text-primary)" }}>
                  {(() => {
                    if (game.sport === "NCAAF" || game.sport === "NCAAM") {
                      // For college: show school name on first line
                      return game.away.name;
                    } else {
                      // For pro sports: extract city from fullName
                      const fullName = game.away.fullName || game.away.name;
                      const nickname = game.away.name;
                      // Remove nickname from fullName to get city
                      const city = fullName.replace(nickname, "").trim();
                      return city || game.away.abbr;
                    }
                  })()}
                </div>
                <div className="text-[8px] font-bold whitespace-nowrap" style={{ color: "var(--ma-text-primary)" }}>
                  {(() => {
                    if (game.sport === "NCAAF" || game.sport === "NCAAM") {
                      // For college: show nickname on second line
                      const nickname = game.away.fullName?.replace(game.away.name, "").trim();
                      return nickname || game.away.abbr;
                    } else {
                      // For pro sports: nickname is the name field
                      return game.away.name;
                    }
                  })()}
                </div>
              </div>
            </div>
            
            <div className="text-center py-2">
              <div className="text-[11px] font-semibold" style={{ color: "var(--ma-text-secondary)" }}>
                AT
              </div>
            </div>
            
            <div className="flex flex-col items-center mt-1">
              <img src={getTeamLogo(game.sport, game.home.espnAbbr, game.home.slug)} alt="" className="w-12 h-12 rounded flex-shrink-0 mb-1.5" />
              <div className="flex flex-col items-center text-center leading-tight">
                <div className="text-[10px] font-semibold whitespace-nowrap" style={{ color: "var(--ma-text-primary)" }}>
                  {(() => {
                    if (game.sport === "NCAAF" || game.sport === "NCAAM") {
                      // For college: show school name on first line
                      return game.home.name;
                    } else {
                      // For pro sports: extract city from fullName
                      const fullName = game.home.fullName || game.home.name;
                      const nickname = game.home.name;
                      // Remove nickname from fullName to get city
                      const city = fullName.replace(nickname, "").trim();
                      return city || game.home.abbr;
                    }
                  })()}
                </div>
                <div className="text-[8px] font-bold whitespace-nowrap" style={{ color: "var(--ma-text-primary)" }}>
                  {(() => {
                    if (game.sport === "NCAAF" || game.sport === "NCAAM") {
                      // For college: show nickname on second line
                      const nickname = game.home.fullName?.replace(game.home.name, "").trim();
                      return nickname || game.home.abbr;
                    } else {
                      // For pro sports: nickname is the name field
                      return game.home.name;
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Odds Grid */}
          <div className="grid grid-cols-3 gap-2 flex-1">
            {/* Row 1: Away Team Odds */}
            <div 
              className="rounded-lg p-1 flex flex-col items-center justify-center"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              {(() => {
                const line = firstOdds?.spread?.away?.line;
                const odds = firstOdds?.spread?.away?.odds.american;
                const hasData = line && line !== 0;
                
                if (!hasData) {
                  return <div className="text-sm font-bold" style={{ color: "var(--ma-text-primary)" }}>-</div>;
                }
                
                return (
                  <>
                    <div className="text-sm font-bold leading-none" style={{ color: "var(--ma-text-primary)" }}>
                      {formatSpreadLine(line)}
                    </div>
                    <div className="text-[10px] font-semibold leading-none mt-0.5" style={{ color: "#4ade80" }}>
                      -110
                    </div>
                  </>
                );
              })()}
            </div>

            <div 
              className="rounded-lg p-1 flex flex-col items-center justify-center"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              {(() => {
                const line = firstOdds?.total?.over?.line;
                const odds = firstOdds?.total?.over?.odds.american;
                const hasData = line && line !== 0;
                
                if (!hasData) {
                  return <div className="text-sm font-bold" style={{ color: "var(--ma-text-primary)" }}>-</div>;
                }
                
                return (
                  <>
                    <div className="text-sm font-bold leading-none whitespace-nowrap" style={{ color: "var(--ma-text-primary)" }}>
                      o {line}
                    </div>
                    <div className="text-[10px] font-semibold leading-none" style={{ color: "#4ade80" }}>
                      {odds && odds !== 0 ? `${odds > 0 ? '+' : ''}${odds}` : '-'}
                    </div>
                  </>
                );
              })()}
            </div>

            <div 
              className="rounded-lg p-1 flex items-center justify-center"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              {(() => {
                const ml = firstOdds?.moneyline?.away?.american;
                if (!ml || ml === 0) {
                  return <div className="text-sm font-bold" style={{ color: "var(--ma-text-primary)" }}>-</div>;
                }
                return <div className="text-sm font-bold" style={{ color: "#4ade80" }}>{ml > 0 ? '+' : ''}{ml}</div>;
              })()}
            </div>

            {/* Row 2: Home Team Odds */}
            <div 
              className="rounded-lg p-1 flex flex-col items-center justify-center"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              {(() => {
                const line = firstOdds?.spread?.home?.line;
                const odds = firstOdds?.spread?.home?.odds.american;
                const hasData = line && line !== 0;
                
                if (!hasData) {
                  return <div className="text-sm font-bold" style={{ color: "var(--ma-text-primary)" }}>-</div>;
                }
                
                return (
                  <>
                    <div className="text-sm font-bold leading-none" style={{ color: "var(--ma-text-primary)" }}>
                      {formatSpreadLine(line)}
                    </div>
                    <div className="text-[10px] font-semibold leading-none mt-0.5" style={{ color: "#4ade80" }}>
                      -110
                    </div>
                  </>
                );
              })()}
            </div>

            <div 
              className="rounded-lg p-1 flex flex-col items-center justify-center"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              {(() => {
                const line = firstOdds?.total?.under?.line;
                const odds = firstOdds?.total?.under?.odds.american;
                const hasData = line && line !== 0;
                
                if (!hasData) {
                  return <div className="text-sm font-bold" style={{ color: "var(--ma-text-primary)" }}>-</div>;
                }
                
                return (
                  <>
                    <div className="text-sm font-bold leading-none whitespace-nowrap" style={{ color: "var(--ma-text-primary)" }}>
                      u {line}
                    </div>
                    <div className="text-[10px] font-semibold leading-none" style={{ color: "#4ade80" }}>
                      {odds && odds !== 0 ? `${odds > 0 ? '+' : ''}${odds}` : '-'}
                    </div>
                  </>
                );
              })()}
            </div>

            <div 
              className="rounded-lg p-1 flex items-center justify-center"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              {(() => {
                const ml = firstOdds?.moneyline?.home?.american;
                if (!ml || ml === 0) {
                  return <div className="text-sm font-bold" style={{ color: "var(--ma-text-primary)" }}>-</div>;
                }
                return <div className="text-sm font-bold" style={{ color: "#4ade80" }}>{ml > 0 ? '+' : ''}{ml}</div>;
              })()}
            </div>
          </div>
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
                <img src={getTeamLogo(game.sport, game.away.espnAbbr, game.away.slug)} alt="" className="w-6 h-6 md:w-8 md:h-8 rounded flex-shrink-0" />
                <div className="flex flex-col text-center">
                  <div className="text-xs md:text-sm font-semibold" style={{ color: "var(--ma-text-primary)" }}>
                    {(() => {
                      if (game.sport === "NCAAF" || game.sport === "NCAAM") {
                        return game.away.name;
                      } else {
                        const fullName = game.away.fullName || game.away.name;
                        const nickname = game.away.name;
                        return fullName.replace(nickname, "").trim() || game.away.abbr;
                      }
                    })()}
                  </div>
                  <div className="text-[10px] md:text-xs font-bold" style={{ color: "var(--ma-text-primary)" }}>
                    {(() => {
                      if (game.sport === "NCAAF" || game.sport === "NCAAM") {
                        const nickname = game.away.fullName?.replace(game.away.name, "").trim();
                        return nickname || game.away.abbr;
                      } else {
                        return game.away.name;
                      }
                    })()}
                  </div>
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
                <img src={getTeamLogo(game.sport, game.home.espnAbbr, game.home.slug)} alt="" className="w-6 h-6 md:w-8 md:h-8 rounded flex-shrink-0" />
                <div className="flex flex-col text-center">
                  <div className="text-xs md:text-sm font-semibold" style={{ color: "var(--ma-text-primary)" }}>
                    {(() => {
                      if (game.sport === "NCAAF" || game.sport === "NCAAM") {
                        return game.home.name;
                      } else {
                        const fullName = game.home.fullName || game.home.name;
                        const nickname = game.home.name;
                        return fullName.replace(nickname, "").trim() || game.home.abbr;
                      }
                    })()}
                  </div>
                  <div className="text-[10px] md:text-xs font-bold" style={{ color: "var(--ma-text-primary)" }}>
                    {(() => {
                      if (game.sport === "NCAAF" || game.sport === "NCAAM") {
                        const nickname = game.home.fullName?.replace(game.home.name, "").trim();
                        return nickname || game.home.abbr;
                      } else {
                        return game.home.name;
                      }
                    })()}
                  </div>
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
                {(() => {
                  const line = firstOdds?.spread?.away?.line;
                  const odds = firstOdds?.spread?.away?.odds.american;
                  const hasData = line && line !== 0;
                  
                  if (!hasData) {
                    return <div className="text-center text-sm md:text-base font-bold" style={{ color: "var(--ma-text-primary)" }}>-</div>;
                  }
                  
                  return (
                    <>
                      <div className="text-center text-sm md:text-base font-bold mb-0.5" style={{ color: "var(--ma-text-primary)" }}>
                        {formatSpreadLine(line)}
                      </div>
                      <div className="text-center text-[10px] md:text-xs font-semibold" style={{ color: "#4ade80" }}>
                        {odds && odds !== 0 ? `${odds > 0 ? '+' : ''}${odds}` : '-'}
                      </div>
                    </>
                  );
                })()}
              </div>
              
              {/* Spacer to match AT */}
              <div className="py-1"></div>
              
              {/* Home Spread */}
              <div 
                className="rounded p-1.5 md:p-2 w-full"
                style={{ background: "var(--ma-surface)" }}
              >
                {(() => {
                  const line = firstOdds?.spread?.home?.line;
                  const odds = firstOdds?.spread?.home?.odds.american;
                  const hasData = line && line !== 0;
                  
                  if (!hasData) {
                    return <div className="text-center text-sm md:text-base font-bold" style={{ color: "var(--ma-text-primary)" }}>-</div>;
                  }
                  
                  return (
                    <>
                      <div className="text-center text-sm md:text-base font-bold mb-0.5" style={{ color: "var(--ma-text-primary)" }}>
                        {formatSpreadLine(line)}
                      </div>
                      <div className="text-center text-[10px] md:text-xs font-semibold" style={{ color: "#4ade80" }}>
                        {odds && odds !== 0 ? `${odds > 0 ? '+' : ''}${odds}` : '-'}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
            
            {/* Total Column */}
            <div className="flex flex-col items-center justify-center h-full">
              {/* Over */}
              <div 
                className="rounded p-1.5 md:p-2 w-full"
                style={{ background: "var(--ma-surface)" }}
              >
                {(() => {
                  const line = firstOdds?.total?.over?.line;
                  const odds = firstOdds?.total?.over?.odds.american;
                  const hasData = line && line !== 0;
                  
                  if (!hasData) {
                    return <div className="text-center text-sm md:text-base font-bold" style={{ color: "var(--ma-text-primary)" }}>-</div>;
                  }
                  
                  return (
                    <>
                      <div className="text-center text-sm md:text-base font-bold mb-0.5" style={{ color: "var(--ma-text-primary)" }}>
                        o {line}
                      </div>
                      <div className="text-center text-[10px] md:text-xs font-semibold" style={{ color: "#4ade80" }}>
                        {odds && odds !== 0 ? `${odds > 0 ? '+' : ''}${odds}` : '-'}
                      </div>
                    </>
                  );
                })()}
              </div>
              
              {/* Spacer to match AT */}
              <div className="py-1"></div>
              
              {/* Under */}
              <div 
                className="rounded p-1.5 md:p-2 w-full"
                style={{ background: "var(--ma-surface)" }}
              >
                {(() => {
                  const line = firstOdds?.total?.under?.line;
                  const odds = firstOdds?.total?.under?.odds.american;
                  const hasData = line && line !== 0;
                  
                  if (!hasData) {
                    return <div className="text-center text-sm md:text-base font-bold" style={{ color: "var(--ma-text-primary)" }}>-</div>;
                  }
                  
                  return (
                    <>
                      <div className="text-center text-sm md:text-base font-bold mb-0.5" style={{ color: "var(--ma-text-primary)" }}>
                        u {line}
                      </div>
                      <div className="text-center text-[10px] md:text-xs font-semibold" style={{ color: "#4ade80" }}>
                        {odds && odds !== 0 ? `${odds > 0 ? '+' : ''}${odds}` : '-'}
                      </div>
                    </>
                  );
                })()}
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
                    const ml = firstOdds?.moneyline?.away?.american;
                    if (!ml || ml === 0) return <span style={{ color: "var(--ma-text-primary)" }}>-</span>;
                    return `${ml > 0 ? '+' : ''}${ml}`;
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
                    const ml = firstOdds?.moneyline?.home?.american;
                    if (!ml || ml === 0) return <span style={{ color: "var(--ma-text-primary)" }}>-</span>;
                    return `${ml > 0 ? '+' : ''}${ml}`;
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
function SplitsCard({ game, book }: { game: GameOdds; book: "DK" | "Circa" }) {
  const firstOdds = game.odds[0];
  const [viewMode, setViewMode] = useState<"tickets" | "handle">("handle");
  
  // Calculate data for all three markets with GUARANTEED 100% sum
  const spreadsData = useMemo(() => {
    // Convert decimals to percentages and normalize to ensure 100% sum
    const rawTicketsLeft = game.splits.spread.away.tickets * 100;
    const rawTicketsRight = game.splits.spread.home.tickets * 100;
    const ticketsSum = rawTicketsLeft + rawTicketsRight;
    
    const rawMoneyLeft = game.splits.spread.away.handle * 100;
    const rawMoneyRight = game.splits.spread.home.handle * 100;
    const moneySum = rawMoneyLeft + rawMoneyRight;
    
    // Normalize to ensure exact 100% sum (handle rounding errors)
    const tickets = { 
      left: Math.round(rawTicketsLeft), 
      right: Math.round(100 - Math.round(rawTicketsLeft))
    };
    const money = { 
      left: Math.round(rawMoneyLeft), 
      right: Math.round(100 - Math.round(rawMoneyLeft))
    };
    
    console.log(`[SPLITS DEBUG] Spread - ${game.away.abbr} @ ${game.home.abbr}:`, {
      rawTickets: { left: rawTicketsLeft, right: rawTicketsRight, sum: ticketsSum },
      normalizedTickets: tickets,
      ticketsCheck: tickets.left + tickets.right,
      rawMoney: { left: rawMoneyLeft, right: rawMoneyRight, sum: moneySum },
      normalizedMoney: money,
      moneyCheck: money.left + money.right
    });
    
    const currentLine = firstOdds?.spread?.away?.line || 0;
    const hasSpread = currentLine !== 0;
    
    // Check if colors are too similar
    const colorsSimilar = areColorsSimilar(game.away.color, game.home.color);
    const awayColor = colorsSimilar 
      ? getBestContrastColor(game.away.color, game.away.secondaryColor, game.away.tertiaryColor)
      : game.away.color;
    
    return {
      tickets,
      money,
      leftLabel: game.away.abbr,
      rightLabel: game.home.abbr,
      lineDisplay: hasSpread ? `${game.away.abbr} ${formatSpreadLine(currentLine)}` : "-",
      leftColor: awayColor,
      rightColor: game.home.color
    };
  }, [game, firstOdds]);
  
  const totalsData = useMemo(() => {
    // Convert decimals to percentages and normalize to ensure 100% sum
    const rawTicketsLeft = game.splits.total.over.tickets * 100;
    const rawTicketsRight = game.splits.total.under.tickets * 100;
    const ticketsSum = rawTicketsLeft + rawTicketsRight;
    
    const rawMoneyLeft = game.splits.total.over.handle * 100;
    const rawMoneyRight = game.splits.total.under.handle * 100;
    const moneySum = rawMoneyLeft + rawMoneyRight;
    
    // Normalize to ensure exact 100% sum
    const tickets = { 
      left: Math.round(rawTicketsLeft), 
      right: Math.round(100 - Math.round(rawTicketsLeft))
    };
    const money = { 
      left: Math.round(rawMoneyLeft), 
      right: Math.round(100 - Math.round(rawMoneyLeft))
    };
    
    console.log(`[SPLITS DEBUG] Total - ${game.away.abbr} @ ${game.home.abbr}:`, {
      rawTickets: { over: rawTicketsLeft, under: rawTicketsRight, sum: ticketsSum },
      normalizedTickets: tickets,
      ticketsCheck: tickets.left + tickets.right,
      rawMoney: { over: rawMoneyLeft, under: rawMoneyRight, sum: moneySum },
      normalizedMoney: money,
      moneyCheck: money.left + money.right
    });
    
    const currentLine = firstOdds?.total?.over?.line || 0;
    const hasTotal = currentLine !== 0;
    
    // Check if colors are too similar - Over uses away color, Under uses home color
    const colorsSimilar = areColorsSimilar(game.away.color, game.home.color);
    const overColor = colorsSimilar 
      ? getBestContrastColor(game.away.color, game.away.secondaryColor, game.away.tertiaryColor)
      : game.away.color;
    
    return {
      tickets,
      money,
      leftLabel: "Over",
      rightLabel: "Under",
      lineDisplay: hasTotal ? `${currentLine}` : "-",
      leftColor: overColor,
      rightColor: game.home.color
    };
  }, [game, firstOdds]);
  
  const mlData = useMemo(() => {
    // Convert decimals to percentages and normalize to ensure 100% sum
    const rawTicketsLeft = game.splits.moneyline.away.tickets * 100;
    const rawTicketsRight = game.splits.moneyline.home.tickets * 100;
    const ticketsSum = rawTicketsLeft + rawTicketsRight;
    
    const rawMoneyLeft = game.splits.moneyline.away.handle * 100;
    const rawMoneyRight = game.splits.moneyline.home.handle * 100;
    const moneySum = rawMoneyLeft + rawMoneyRight;
    
    // Normalize to ensure exact 100% sum
    const tickets = { 
      left: Math.round(rawTicketsLeft), 
      right: Math.round(100 - Math.round(rawTicketsLeft))
    };
    const money = { 
      left: Math.round(rawMoneyLeft), 
      right: Math.round(100 - Math.round(rawMoneyLeft))
    };
    
    console.log(`[SPLITS DEBUG] Moneyline - ${game.away.abbr} @ ${game.home.abbr}:`, {
      rawTickets: { away: rawTicketsLeft, home: rawTicketsRight, sum: ticketsSum },
      normalizedTickets: tickets,
      ticketsCheck: tickets.left + tickets.right,
      rawMoney: { away: rawMoneyLeft, home: rawMoneyRight, sum: moneySum },
      normalizedMoney: money,
      moneyCheck: money.left + money.right
    });
    
    const awayML = firstOdds?.moneyline?.away?.american;
    const hasML = awayML && awayML !== 0;
    
    // Check if colors are too similar
    const colorsSimilar = areColorsSimilar(game.away.color, game.home.color);
    const awayColor = colorsSimilar 
      ? getBestContrastColor(game.away.color, game.away.secondaryColor, game.away.tertiaryColor)
      : game.away.color;
    
    return {
      tickets,
      money,
      leftLabel: game.away.abbr,
      rightLabel: game.home.abbr,
      lineDisplay: hasML ? `${game.away.abbr} ${awayML! > 0 ? '+' : ''}${awayML}` : "-",
      leftColor: awayColor,
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
      <div className="p-4">
        {/* Desktop: Team Nicknames + Metadata Header */}
        <div className="hidden md:block mb-4">
          {/* Team Nicknames Row - Centered */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src={getTeamLogo(game.sport, game.away.espnAbbr, game.away.slug)} alt={game.away.name} className="w-8 h-8 rounded" />
            <span className="font-bold text-lg text-white">
              {game.away.name}
            </span>
            <span className="text-sm font-semibold" style={{ color: "var(--ma-text-secondary)" }}>@</span>
            <img src={getTeamLogo(game.sport, game.home.espnAbbr, game.home.slug)} alt={game.home.name} className="w-8 h-8 rounded" />
            <span className="font-bold text-lg text-white">
              {game.home.name}
            </span>
          </div>
          
          {/* Game Metadata Row - Centered */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="font-medium" style={{ color: "var(--ma-text-secondary)" }}>
              {formatGameDate(game.kickoff)} • {formatGameTime(game.kickoff, game.sport)}
            </span>
            {game.specialLogo && SPECIAL_LOGOS[game.specialLogo] && (
              <>
                <span style={{ color: "var(--ma-text-secondary)" }}>•</span>
                <img src={SPECIAL_LOGOS[game.specialLogo]} alt="Special Game" className="h-4 w-auto object-contain" />
              </>
            )}
            {game.tvInfo && TV_LOGOS[game.tvInfo] && (
              <>
                <span style={{ color: "var(--ma-text-secondary)" }}>•</span>
                <div className="flex items-center gap-1.5">
                  <img 
                    src={TV_LOGOS[game.tvInfo]} 
                    alt={game.tvInfo} 
                    className={`w-auto object-contain ${game.tvInfo === 'ESPN2' ? 'h-0.5' : 'h-3'}`}
                  />
                  <span className="font-semibold" style={{ color: "var(--ma-text-primary)" }}>
                    {game.tvInfo}
                  </span>
                </div>
              </>
            )}
            {game.stadium && (
              <>
                <span style={{ color: "var(--ma-text-secondary)" }}>•</span>
                <span className="font-medium" style={{ color: "var(--ma-text-secondary)" }}>
                  {game.stadium}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Mobile: Compact Teams + Metadata */}
        <div className="md:hidden mb-4">
          <div className="flex items-center gap-2 justify-center mb-2">
            <img src={getTeamLogo(game.sport, game.away.espnAbbr, game.away.slug)} alt={game.away.name} className="w-8 h-8 rounded" />
            <span className="font-bold text-base text-white">{game.away.name}</span>
            <span className="text-sm" style={{ color: "var(--ma-text-secondary)" }}>@</span>
            <img src={getTeamLogo(game.sport, game.home.espnAbbr, game.home.slug)} alt={game.home.name} className="w-8 h-8 rounded" />
            <span className="font-bold text-base text-white">{game.home.name}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="font-medium" style={{ color: "var(--ma-text-secondary)" }}>
              {formatGameDate(game.kickoff)} • {formatGameTime(game.kickoff, game.sport)}
            </span>
            {game.tvInfo && (
              <>
                <span style={{ color: "var(--ma-text-secondary)" }}>•</span>
                <span className="font-semibold" style={{ color: "var(--ma-text-primary)" }}>
                  {game.tvInfo}
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Toggle: Tickets vs Money - Centered between Date/Time and Markets */}
        <div className="flex items-center justify-center gap-3 my-4">
          <button
            onClick={() => {
              console.log(`[SPLITS DEBUG] Toggle clicked: ${viewMode} -> tickets`);
              setViewMode("tickets");
            }}
            className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 shadow-sm"
            style={{
              background: viewMode === "tickets" 
                ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-variant)))" 
                : "hsl(var(--ma-card-secondary))",
              color: viewMode === "tickets" ? "white" : "var(--ma-text-secondary)",
              border: `2px solid ${viewMode === "tickets" ? "hsl(var(--primary))" : "var(--ma-stroke)"}`,
              transform: viewMode === "tickets" ? "scale(1.05)" : "scale(1)",
              boxShadow: viewMode === "tickets" ? "0 4px 12px hsl(var(--primary) / 0.3)" : "none"
            }}
          >
            Tickets
          </button>
          <button
            onClick={() => {
              console.log(`[SPLITS DEBUG] Toggle clicked: ${viewMode} -> handle`);
              setViewMode("handle");
            }}
            className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 shadow-sm"
            style={{
              background: viewMode === "handle" 
                ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-variant)))" 
                : "hsl(var(--ma-card-secondary))",
              color: viewMode === "handle" ? "white" : "var(--ma-text-secondary)",
              border: `2px solid ${viewMode === "handle" ? "hsl(var(--primary))" : "var(--ma-stroke)"}`,
              transform: viewMode === "handle" ? "scale(1.05)" : "scale(1)",
              boxShadow: viewMode === "handle" ? "0 4px 12px hsl(var(--primary) / 0.3)" : "none"
            }}
          >
            Money
          </button>
        </div>
        
        {/* Moneyline */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold" style={{ color: "var(--ma-text-primary)" }}>
                {viewMode === "tickets" ? mlData.tickets.left : mlData.money.left}%
              </span>
              <span className="text-xs" style={{ color: "var(--ma-text-secondary)" }}>{mlData.leftLabel}</span>
            </div>
            <span className="text-xs font-semibold" style={{ color: "var(--ma-text-secondary)" }}>Moneyline</span>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "var(--ma-text-secondary)" }}>{mlData.rightLabel}</span>
              <span className="text-lg font-bold" style={{ color: "var(--ma-text-primary)" }}>
                {viewMode === "tickets" ? mlData.tickets.right : mlData.money.right}%
              </span>
            </div>
          </div>
          <div className="relative h-3 rounded-full overflow-hidden" style={{ border: "0.5px solid white" }}>
            <div 
              className="absolute inset-y-0 left-0"
              style={{
                width: `${viewMode === "tickets" ? mlData.tickets.left : mlData.money.left}%`,
                background: mlData.leftColor
              }}
            />
            <div 
              className="absolute inset-y-0 right-0"
              style={{
                width: `${viewMode === "tickets" ? mlData.tickets.right : mlData.money.right}%`,
                background: mlData.rightColor
              }}
            />
          </div>
        </div>
        
        {/* Spread */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold" style={{ color: "var(--ma-text-primary)" }}>
                {viewMode === "tickets" ? spreadsData.tickets.left : spreadsData.money.left}%
              </span>
              <span className="text-xs" style={{ color: "var(--ma-text-secondary)" }}>
                {spreadsData.leftLabel} {formatSpreadLine(firstOdds?.spread?.away?.line || -3.5)}
              </span>
            </div>
            <span className="text-xs font-semibold" style={{ color: "var(--ma-text-secondary)" }}>Spread</span>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "var(--ma-text-secondary)" }}>
                {(() => {
                  const line = firstOdds?.spread?.home?.line;
                  if (!line || line === 0) return `${spreadsData.rightLabel} -`;
                  return `${spreadsData.rightLabel} ${formatSpreadLine(line)}`;
                })()}
              </span>
              <span className="text-lg font-bold" style={{ color: "var(--ma-text-primary)" }}>
                {viewMode === "tickets" ? spreadsData.tickets.right : spreadsData.money.right}%
              </span>
            </div>
          </div>
          <div className="relative h-3 rounded-full overflow-hidden" style={{ border: "0.5px solid white" }}>
            <div 
              className="absolute inset-y-0 left-0"
              style={{
                width: `${viewMode === "tickets" ? spreadsData.tickets.left : spreadsData.money.left}%`,
                background: spreadsData.leftColor
              }}
            />
            <div 
              className="absolute inset-y-0 right-0"
              style={{
                width: `${viewMode === "tickets" ? spreadsData.tickets.right : spreadsData.money.right}%`,
                background: spreadsData.rightColor
              }}
            />
          </div>
        </div>
        
        {/* Total */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold" style={{ color: "var(--ma-text-primary)" }}>
                {viewMode === "tickets" ? totalsData.tickets.left : totalsData.money.left}%
              </span>
              <span className="text-xs" style={{ color: "var(--ma-text-secondary)" }}>
                {(() => {
                  const line = firstOdds?.total?.over?.line;
                  if (!line || line === 0) return 'Over -';
                  return `Over ${line}`;
                })()}
              </span>
            </div>
            <span className="text-xs font-semibold" style={{ color: "var(--ma-text-secondary)" }}>Total</span>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "var(--ma-text-secondary)" }}>
                {(() => {
                  const line = firstOdds?.total?.under?.line;
                  if (!line || line === 0) return 'Under -';
                  return `Under ${line}`;
                })()}
              </span>
              <span className="text-lg font-bold" style={{ color: "var(--ma-text-primary)" }}>
                {viewMode === "tickets" ? totalsData.tickets.right : totalsData.money.right}%
              </span>
            </div>
          </div>
          <div className="relative h-3 rounded-full overflow-hidden" style={{ border: "0.5px solid white" }}>
            <div 
              className="absolute inset-y-0 left-0"
              style={{
                width: `${viewMode === "tickets" ? totalsData.tickets.left : totalsData.money.left}%`,
                background: totalsData.leftColor
              }}
            />
            <div 
              className="absolute inset-y-0 right-0"
              style={{
                width: `${viewMode === "tickets" ? totalsData.tickets.right : totalsData.money.right}%`,
                background: totalsData.rightColor
              }}
            />
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
          <img src={getTeamLogo(game.sport, game.away.espnAbbr, game.away.slug)} alt={game.away.name} className="w-7 h-7 rounded" />
          <div className="text-sm font-semibold text-white truncate">{game.away.abbr}</div>
          <span className="text-white/40 text-xs">@</span>
          <div className="flex items-center gap-2 min-w-0">
            <img src={getTeamLogo(game.sport, game.home.espnAbbr, game.home.slug)} alt={game.home.name} className="w-7 h-7 rounded" />
            <div className="text-sm font-semibold text-white truncate">{game.home.abbr}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-white/80 bg-white/5 px-2 py-1 rounded-md border border-white/10 whitespace-nowrap">
            {formatGameTime(game.kickoff, game.sport)}
          </div>
          {game.tvInfo && (
            <div className="text-[10px] text-white/60 px-2 py-1 rounded-md border border-white/10">
              {game.tvInfo}
            </div>
          )}
          {game.stadium && (
            <div className="text-[10px] text-white/50 px-2 py-1">
              {game.stadium}
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

