import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { games } from "@/data/games";
import { analyzeGame } from "@/lib/edge";
import { League, Market, DateTag, Game } from "@/types";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { FeedToggle, type FeedMode } from "@/components/FeedToggle";

export default function Feed() {
  const [leagueFilter, setLeagueFilter] = useState<League | "All">("All");
  const [dateFilter, setDateFilter] = useState<DateTag | "All">("All");
  const [marketFilter, setMarketFilter] = useState<Market>("Spread");
  const [feedMode, setFeedMode] = useState<FeedMode>("splits");

  const filteredGames = games.filter((game) => {
    if (leagueFilter !== "All" && game.league !== leagueFilter) return false;
    if (dateFilter !== "All" && game.dateTag !== dateFilter) return false;
    return true;
  });

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
        {/* Feed Toggle */}
        <div className="mb-4 flex justify-center">
          <FeedToggle mode={feedMode} setMode={setFeedMode} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <FilterSelect
            value={leagueFilter}
            onChange={setLeagueFilter}
            options={[
              { value: "All", label: "All Leagues" },
              { value: "NFL", label: "NFL" },
              { value: "NBA", label: "NBA" },
              { value: "NHL", label: "NHL" },
            ]}
          />
          <FilterSelect
            value={dateFilter}
            onChange={setDateFilter}
            options={[
              { value: "All", label: "All Dates" },
              { value: "Today", label: "Today" },
              { value: "Tomorrow", label: "Tomorrow" },
            ]}
          />
          <FilterSelect
            value={marketFilter}
            onChange={setMarketFilter}
            options={[
              { value: "ML", label: "ML" },
              { value: "Spread", label: "Spread" },
              { value: "Total", label: "Total" },
            ]}
          />
        </div>

        {/* Game Cards */}
        <div className="space-y-3">
          {filteredGames.map((game) => (
            <GameCard 
              key={game.id} 
              game={game} 
              market={marketFilter}
              mode={feedMode}
            />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: "var(--ma-text-secondary)" }}>
              No games match your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ value, onChange, options }: { 
  value: string; 
  onChange: (v: any) => void; 
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="font-['Inter',_sans-serif] px-3 py-2 rounded-lg text-sm"
      style={{
        background: "var(--ma-surface)",
        border: "1px solid var(--ma-stroke)",
        color: "var(--ma-text-primary)",
        outline: "none"
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function GameCard({ game, market, mode }: { game: Game; market: Market; mode: FeedMode }) {
  const [selectedMarket, setSelectedMarket] = useState<Market>("ML");
  const analysis = analyzeGame(game, selectedMarket);
  const startTime = new Date(game.startTime);

  // Mock betting splits data
  const splits = useMemo(() => ({
    tickets: { away: 48, home: 52 },
    money: { away: 70, home: 30 }
  }), []);

  const divergence = splits.money.home - splits.tickets.home;

  return (
    <div 
      className="w-full mb-3 rounded-3xl p-4"
      style={{
        border: "1px solid var(--ma-stroke)",
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(2px)"
      }}
    >
      {/* Game Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div 
            className="text-sm font-semibold font-['Inter',_sans-serif] truncate"
            style={{ color: "var(--ma-text-primary)" }}
          >
            {game.away}
          </div>
          <span style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "12px" }}>@</span>
          <div className="flex items-center gap-2 min-w-0">
            <div 
              className="text-sm font-semibold font-['Inter',_sans-serif] truncate"
              style={{ color: "var(--ma-text-primary)" }}
            >
              {game.home}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="text-xs px-2 py-1 rounded-md font-['Inter',_sans-serif]"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--ma-stroke)"
            }}
          >
            {format(startTime, "h:mm a")}
          </div>
          <Badge 
            style={{
              background: analysis.angle === "Sharp" 
                ? "var(--ma-accent-cyan)" 
                : analysis.angle === "Public"
                ? "var(--ma-accent-red)"
                : "var(--ma-accent-amber)",
              color: "white",
              fontSize: "10px",
              padding: "2px 8px"
            }}
          >
            {analysis.angle}
          </Badge>
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
        {/* Selection indicator */}
        <motion.div
          className="absolute top-[4px] bottom-[4px] rounded-[10px]"
          initial={false}
          animate={{
            left: selectedMarket === "ML" ? "4px" : selectedMarket === "Spread" ? "calc(33.33% + 1px)" : "calc(66.66% + 2px)",
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
            color: selectedMarket === "ML" ? "var(--ma-text-primary)" : "var(--ma-text-secondary)",
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

      {mode === "splits" && (
        <BettingSplitsView 
          splits={splits} 
          game={game}
          divergence={divergence}
        />
      )}

      {mode === "movement" && (
        <LineMovementView game={game} analysis={analysis} />
      )}
    </div>
  );
}

function BettingSplitsView({ splits, game, divergence }: any) {
  return (
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
            style={{ background: "var(--ma-accent-cyan)" }}
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
            {game.away}
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
            {game.home}
          </span>
          <div 
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--ma-accent-indigo)" }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <MirrorBar
          label="Tickets"
          leftPercent={splits.tickets.away}
          rightPercent={splits.tickets.home}
        />
        <MirrorBar
          label="Money"
          leftPercent={splits.money.away}
          rightPercent={splits.money.home}
        />
      </div>

      <div 
        className="mt-3 pt-3 text-center text-xs font-['Inter',_sans-serif]"
        style={{
          borderTop: "1px solid var(--ma-stroke)",
          color: Math.abs(divergence) > 15 
            ? "var(--ma-accent-green)" 
            : "var(--ma-text-secondary)"
        }}
      >
        {Math.abs(divergence) > 15 
          ? `${Math.abs(divergence).toFixed(0)}% divergence - Sharp money detected`
          : "Balanced action"}
      </div>
    </div>
  );
}

function MirrorBar({ label, leftPercent, rightPercent }: any) {
  return (
    <div>
      <div 
        className="flex items-center justify-between mb-1 text-xs font-['Inter',_sans-serif]"
        style={{ color: "var(--ma-text-secondary)" }}
      >
        <span>{label}</span>
        <div className="flex gap-2">
          <span>{leftPercent}%</span>
          <span>{rightPercent}%</span>
        </div>
      </div>
      <div className="flex gap-1 h-2">
        <div 
          className="rounded-l"
          style={{
            width: `${leftPercent}%`,
            background: "var(--ma-accent-cyan)"
          }}
        />
        <div 
          className="rounded-r"
          style={{
            width: `${rightPercent}%`,
            background: "var(--ma-accent-indigo)"
          }}
        />
      </div>
    </div>
  );
}

function LineMovementView({ game, analysis }: any) {
  return (
    <div 
      className="rounded-[14px] p-4"
      style={{
        background: "#16171D",
        border: "1px solid var(--ma-stroke)"
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp 
          className="w-4 h-4" 
          style={{ color: "var(--ma-accent-green)" }} 
        />
        <p 
          className="text-sm font-['Inter',_sans-serif]"
          style={{ color: "var(--ma-text-primary)" }}
        >
          {analysis.explanation}
        </p>
      </div>

      <div 
        className="flex items-center justify-between pt-3"
        style={{ borderTop: "1px solid var(--ma-stroke)" }}
      >
        <div>
          <p 
            className="text-xs font-['Inter',_sans-serif]"
            style={{ color: "var(--ma-text-secondary)" }}
          >
            Best Book
          </p>
          <p 
            className="font-semibold text-sm font-['Inter',_sans-serif]"
            style={{ color: "var(--ma-text-primary)" }}
          >
            {analysis.bestBook.book}: {analysis.bestBook.price}
          </p>
        </div>
        <button
          className="px-3 py-1.5 text-xs rounded-md font-['Inter',_sans-serif]"
          style={{
            background: "var(--ma-surface)",
            border: "1px solid var(--ma-stroke)",
            color: "var(--ma-text-primary)"
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
