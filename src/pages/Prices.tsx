import { games } from "@/data/games";
import { Book, Game } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Prices() {
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
            Best Prices
          </h1>
          <p className="text-sm font-['Inter',_sans-serif]" style={{ color: "var(--ma-text-secondary)" }}>
            Compare odds across books
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {games.map((game) => (
          <PriceCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

function PriceCard({ game }: { game: Game }) {
  const books: Book[] = ["DK", "FD", "MGM", "Caesars"];

  const getBestML = (side: "home" | "away") => {
    let best = 0;
    books.forEach((book) => {
      const ml = game.odds[book].ML;
      if (ml) {
        const price = side === "home" ? ml.home : ml.away;
        if (price > best) best = price;
      }
    });
    return best;
  };

  const bestHomeML = getBestML("home");
  const bestAwayML = getBestML("away");

  return (
    <Card style={{ background: "var(--ma-card)", border: "1px solid var(--ma-stroke)" }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle style={{ color: "var(--ma-text-primary)" }}>{game.away} @ {game.home}</CardTitle>
          <Badge style={{ background: "var(--ma-accent-indigo)", color: "white" }}>{game.league}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--ma-text-secondary)" }}>Moneyline</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Book</TableHead>
              <TableHead className="text-right">{game.away}</TableHead>
              <TableHead className="text-right">{game.home}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => {
              const ml = game.odds[book].ML;
              if (!ml) return null;
              return (
                <TableRow key={book}>
                  <TableCell className="font-medium">{book}</TableCell>
                  <TableCell className={cn("text-right tabular-nums", ml.away === bestAwayML && "text-primary font-bold")}>
                    {ml.away.toFixed(2)}
                  </TableCell>
                  <TableCell className={cn("text-right tabular-nums", ml.home === bestHomeML && "text-primary font-bold")}>
                    {ml.home.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
