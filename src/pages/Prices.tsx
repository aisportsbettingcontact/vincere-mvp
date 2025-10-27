import { games } from "@/data/games";
import { Book, Game, Market } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Prices() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Best Prices</h1>
          <p className="text-sm text-muted-foreground">
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

  const getBestSpread = (side: "home" | "away") => {
    let bestLine = side === "home" ? Infinity : -Infinity;
    let bestPrice = 0;
    books.forEach((book) => {
      const spread = game.odds[book].Spread;
      if (spread) {
        const line = side === "home" ? spread.line : -spread.line;
        const price = side === "home" ? spread.home : spread.away;
        if (
          (side === "home" && line < bestLine) ||
          (side === "away" && line > bestLine)
        ) {
          bestLine = line;
          bestPrice = price;
        } else if (line === bestLine && price > bestPrice) {
          bestPrice = price;
        }
      }
    });
    return { line: bestLine, price: bestPrice };
  };

  const getBestTotal = (side: "over" | "under") => {
    let bestLine = side === "over" ? -Infinity : Infinity;
    let bestPrice = 0;
    books.forEach((book) => {
      const total = game.odds[book].Total;
      if (total) {
        const price = side === "over" ? total.over : total.under;
        if (
          (side === "over" && total.line < bestLine) ||
          (side === "under" && total.line > bestLine)
        ) {
          bestLine = total.line;
          bestPrice = price;
        } else if (total.line === bestLine && price > bestPrice) {
          bestPrice = price;
        }
      }
    });
    return { line: bestLine, price: bestPrice };
  };

  const bestHomeML = getBestML("home");
  const bestAwayML = getBestML("away");
  const bestHomeSpread = getBestSpread("home");
  const bestAwaySpread = getBestSpread("away");
  const bestOver = getBestTotal("over");
  const bestUnder = getBestTotal("under");

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
      <CardContent className="space-y-4">
        {/* Moneyline */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
            Moneyline
          </h4>
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
                    <TableCell
                      className={cn(
                        "text-right tabular-nums",
                        ml.away === bestAwayML && "text-primary font-bold"
                      )}
                    >
                      {ml.away.toFixed(2)}
                      {ml.away === bestAwayML && (
                        <TrendingUp className="inline h-3 w-3 ml-1" />
                      )}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right tabular-nums",
                        ml.home === bestHomeML && "text-primary font-bold"
                      )}
                    >
                      {ml.home.toFixed(2)}
                      {ml.home === bestHomeML && (
                        <TrendingUp className="inline h-3 w-3 ml-1" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Spread */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
            Spread
          </h4>
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
                const spread = game.odds[book].Spread;
                if (!spread) return null;
                const awayLine = -spread.line;
                const homeLine = spread.line;
                return (
                  <TableRow key={book}>
                    <TableCell className="font-medium">{book}</TableCell>
                    <TableCell
                      className={cn(
                        "text-right tabular-nums",
                        awayLine === -bestHomeSpread.line &&
                          "text-primary font-bold"
                      )}
                    >
                      {awayLine > 0 ? "+" : ""}
                      {awayLine.toFixed(1)} ({spread.away.toFixed(2)})
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right tabular-nums",
                        homeLine === bestHomeSpread.line &&
                          "text-primary font-bold"
                      )}
                    >
                      {homeLine > 0 ? "+" : ""}
                      {homeLine.toFixed(1)} ({spread.home.toFixed(2)})
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Total */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
            Total
          </h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Book</TableHead>
                <TableHead className="text-right">Over</TableHead>
                <TableHead className="text-right">Under</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => {
                const total = game.odds[book].Total;
                if (!total) return null;
                return (
                  <TableRow key={book}>
                    <TableCell className="font-medium">{book}</TableCell>
                    <TableCell
                      className={cn(
                        "text-right tabular-nums",
                        total.line === bestOver.line &&
                          total.over === bestOver.price &&
                          "text-primary font-bold"
                      )}
                    >
                      O{total.line} ({total.over.toFixed(2)})
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right tabular-nums",
                        total.line === bestUnder.line &&
                          total.under === bestUnder.price &&
                          "text-primary font-bold"
                      )}
                    >
                      U{total.line} ({total.under.toFixed(2)})
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
