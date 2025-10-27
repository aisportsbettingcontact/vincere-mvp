import { useState } from "react";
import { games } from "@/data/games";
import { analyzeGame } from "@/lib/edge";
import { League, Market, DateTag, Game } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, TrendingUp, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function Feed() {
  const [leagueFilter, setLeagueFilter] = useState<League | "All">("All");
  const [dateFilter, setDateFilter] = useState<DateTag | "All">("All");
  const [marketFilter, setMarketFilter] = useState<Market>("Spread");

  const filteredGames = games.filter((game) => {
    if (leagueFilter !== "All" && game.league !== leagueFilter) return false;
    if (dateFilter !== "All" && game.dateTag !== dateFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            EdgeGuide
          </h1>
          <p className="text-sm text-muted-foreground">
            Decision-first betting analysis
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Select
            value={leagueFilter}
            onValueChange={(v) => setLeagueFilter(v as League | "All")}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="League" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Leagues</SelectItem>
              <SelectItem value="NFL">NFL</SelectItem>
              <SelectItem value="NBA">NBA</SelectItem>
              <SelectItem value="NHL">NHL</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={dateFilter}
            onValueChange={(v) => setDateFilter(v as DateTag | "All")}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Dates</SelectItem>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="Tomorrow">Tomorrow</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={marketFilter}
            onValueChange={(v) => setMarketFilter(v as Market)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Market" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ML">Moneyline</SelectItem>
              <SelectItem value="Spread">Spread</SelectItem>
              <SelectItem value="Total">Total</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Game Cards */}
        <div className="space-y-4">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} market={marketFilter} />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No games match your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function GameCard({ game, market }: { game: Game; market: Market }) {
  const analysis = analyzeGame(game, market);
  const startTime = new Date(game.startTime);

  const angleColors = {
    Sharp: "bg-sharp text-sharp-foreground",
    Public: "bg-public text-public-foreground",
    Balanced: "bg-balanced text-balanced-foreground",
  };

  const confidenceColors = {
    High: "bg-confidence-high",
    Medium: "bg-confidence-medium",
    Low: "bg-confidence-low",
  };

  return (
    <Card className="overflow-hidden bg-gradient-card border-border/50 hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {game.league}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {market}
              </Badge>
            </div>
            <h3 className="text-lg font-bold">
              {game.away} @ {game.home}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                confidenceColors[analysis.confidence]
              )}
              title={`${analysis.confidence} confidence`}
            />
            <Badge className={angleColors[analysis.angle]}>
              {analysis.angle}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>
            {format(startTime, "MMM d, h:mm a")} • {game.dateTag}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-primary" />
          <p className="text-foreground/90">{analysis.explanation}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground">Best Book</p>
            <p className="font-semibold text-sm">
              {analysis.bestBook.book}: {analysis.bestBook.price}
            </p>
          </div>
          <Button size="sm" variant="outline" asChild>
            <a href="#" className="gap-1">
              View <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
