import { games } from "@/data/games";
import { Game } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

export default function Splits() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Splits & Movement</h1>
          <p className="text-sm text-muted-foreground">
            Betting patterns and line history
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {games.map((game) => (
          <SplitsCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

function SplitsCard({ game }: { game: Game }) {
  const homeDivergence = game.splits.home.moneyPct - game.splits.home.betsPct;
  const awayDivergence = game.splits.away.moneyPct - game.splits.away.betsPct;

  const getBadgeInfo = (divergence: number) => {
    if (divergence >= 15) return { label: "Sharp Money", color: "bg-sharp" };
    if (divergence <= -15) return { label: "Public Play", color: "bg-public" };
    return { label: "Balanced", color: "bg-balanced" };
  };

  const homeBadge = getBadgeInfo(homeDivergence);
  const awayBadge = getBadgeInfo(awayDivergence);

  // Transform movement data for chart
  const chartData = game.movement.map((m) => ({
    time: format(new Date(m.t), "HH:mm"),
    price: m.price,
  }));

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {game.away} @ {game.home}
          </CardTitle>
          <Badge variant="outline">{game.league}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Splits Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Betting Splits
          </h4>

          {/* Home Team */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{game.home}</span>
                <Badge className={cn("text-xs", homeBadge.color)}>
                  {homeBadge.label}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {homeDivergence > 0 ? "+" : ""}
                {homeDivergence.toFixed(1)}% divergence
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Bets
                  </span>
                  <span className="font-semibold">
                    {game.splits.home.betsPct}%
                  </span>
                </div>
                <Progress value={game.splits.home.betsPct} className="h-2" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Money
                  </span>
                  <span className="font-semibold">
                    {game.splits.home.moneyPct}%
                  </span>
                </div>
                <Progress value={game.splits.home.moneyPct} className="h-2" />
              </div>
            </div>
          </div>

          {/* Away Team */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{game.away}</span>
                <Badge className={cn("text-xs", awayBadge.color)}>
                  {awayBadge.label}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {awayDivergence > 0 ? "+" : ""}
                {awayDivergence.toFixed(1)}% divergence
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Bets
                  </span>
                  <span className="font-semibold">
                    {game.splits.away.betsPct}%
                  </span>
                </div>
                <Progress value={game.splits.away.betsPct} className="h-2" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Money
                  </span>
                  <span className="font-semibold">
                    {game.splits.away.moneyPct}%
                  </span>
                </div>
                <Progress value={game.splits.away.moneyPct} className="h-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Movement Chart */}
        {game.movement.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Line Movement
            </h4>
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="time"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground">
              {game.movement[0].market} — Last 24 hours
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
