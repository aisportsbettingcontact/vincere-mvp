// Type definitions for odds data

export interface GameOdds {
  gameId: string;
  sport: "NFL" | "NCAAF" | "NBA" | "NHL" | "MLB" | "NCAAM";
  kickoff: string;
  book: string; // DK or CIRCA
  away: {
    name: string;
    fullName?: string;
    abbr: string;
    espnAbbr: string;
    slug?: string;
    color: string;
    secondaryColor: string;
    tertiaryColor: string;
  };
  home: {
    name: string;
    fullName?: string;
    abbr: string;
    espnAbbr: string;
    slug?: string;
    color: string;
    secondaryColor: string;
    tertiaryColor: string;
  };
  tvInfo?: string;
  primetime?: string;
  stadium?: string;
  specialLogo?: string;
  odds: Array<{
    book?: string;
    timestamp?: string;
    moneyline?: {
      away: { american: number; decimal?: number; implied?: number };
      home: { american: number; decimal?: number; implied?: number };
    };
    spread?: {
      away: { line: number; odds: { american: number; decimal?: number; implied?: number } };
      home: { line: number; odds: { american: number; decimal?: number; implied?: number } };
    };
    total?: {
      over: { line: number; odds: { american: number; decimal?: number; implied?: number } };
      under: { line: number; odds: { american: number; decimal?: number; implied?: number } };
    };
  }>;
  splits: {
    moneyline: {
      away: { tickets: number; handle: number };
      home: { tickets: number; handle: number };
    };
    spread: {
      away: { tickets: number; handle: number };
      home: { tickets: number; handle: number };
    };
    total: {
      over: { tickets: number; handle: number };
      under: { tickets: number; handle: number };
    };
  };
}
