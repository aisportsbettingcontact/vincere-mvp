export type League = "NFL" | "CFB" | "NBA" | "NHL" | "MLB";
export type Market = "ML" | "Spread" | "Total";
export type Book = "DK" | "FD" | "MGM" | "Caesars";
export type Angle = "Sharp" | "Public" | "Balanced";
export type Confidence = "High" | "Medium" | "Low";
export type DateTag = "Today" | "Tomorrow";

export interface Game {
  id: string;
  league: League;
  startTime: string;
  home: string;
  away: string;
  dateTag: DateTag;
  odds: Record<
    Book,
    {
      ML?: { home: number; away: number };
      Spread?: { line: number; home: number; away: number };
      Total?: { line: number; over: number; under: number };
    }
  >;
  splits: {
    home: { betsPct: number; moneyPct: number };
    away: { betsPct: number; moneyPct: number };
  };
  movement: Array<{
    t: string;
    market: Market;
    side: "home" | "away" | "over" | "under";
    price: number;
  }>;
  open?: {
    ML?: { home?: number; away?: number };
    Spread?: { line?: number };
    Total?: { line?: number };
  };
}

export interface GameAnalysis {
  angle: Angle;
  confidence: Confidence;
  divergence: number;
  explanation: string;
  bestBook: {
    book: Book;
    price: number | string;
  };
}
