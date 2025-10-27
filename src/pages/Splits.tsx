import { games } from "@/data/games";
import { Game } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

export default function Splits() {
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
          <h1 className="text-2xl font-bold font-['Inter',_sans-serif]" style={{ color: "var(--ma-text-primary)" }}>
            Splits & Movement
          </h1>
          <p className="text-sm font-['Inter',_sans-serif]" style={{ color: "var(--ma-text-secondary)" }}>
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
  const chartData = game.movement.map((m) => ({ time: format(new Date(m.t), "HH:mm"), price: m.price }));

  return (
    <Card style={{ background: "var(--ma-card)", border: "1px solid var(--ma-stroke)" }}>
      <CardHeader>
        <CardTitle style={{ color: "var(--ma-text-primary)" }}>{game.away} @ {game.home}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div><Progress value={game.splits.home.betsPct} className="h-2" /></div>
        {chartData.length > 0 && (
          <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="time" stroke="var(--ma-text-secondary)" fontSize={10} />
                <YAxis stroke="var(--ma-text-secondary)" fontSize={10} width={40} />
                <Line type="monotone" dataKey="price" stroke="var(--ma-accent-cyan)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
