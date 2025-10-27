import type { GameOdds } from "./oddsData";

export type BetType = "spread" | "moneyline" | "total";
export type BetStatus = "pending" | "won" | "lost" | "push";

export interface TrackedGame {
  id: string;
  gameId: string;
  awayTeam: string;
  homeTeam: string;
  gameTime: Date;
  trackedAt: Date;
  odds?: GameOdds;
}

export interface Bet {
  id: string;
  gameId: string;
  awayTeam: string;
  homeTeam: string;
  gameTime: Date;
  betType: BetType;
  selection: string; // Team name or "over"/"under"
  odds: number; // American odds (e.g., -110)
  stake: number; // In units
  sportsbook: string;
  placedAt: Date;
  status: BetStatus;
  payout?: number; // Calculated payout in units
  notes?: string;
}

export interface BettingStats {
  totalBets: number;
  wonBets: number;
  lostBets: number;
  pushBets: number;
  pendingBets: number;
  totalStaked: number;
  totalProfit: number;
  winRate: number;
  roi: number;
  averageOdds: number;
  bestWin?: Bet;
  worstLoss?: Bet;
}

// Helper function to calculate payout from American odds
export function calculatePayout(stake: number, americanOdds: number): number {
  if (americanOdds > 0) {
    return stake * (americanOdds / 100);
  } else {
    return stake * (100 / Math.abs(americanOdds));
  }
}

// Helper function to calculate betting stats
export function calculateBettingStats(bets: Bet[], unitSize: number = 100): BettingStats {
  const totalBets = bets.length;
  const wonBets = bets.filter((b) => b.status === "won").length;
  const lostBets = bets.filter((b) => b.status === "lost").length;
  const pushBets = bets.filter((b) => b.status === "push").length;
  const pendingBets = bets.filter((b) => b.status === "pending").length;

  const totalStaked = bets.reduce((sum, bet) => sum + bet.stake, 0);
  
  const totalProfit = bets.reduce((sum, bet) => {
    if (bet.status === "won" && bet.payout) {
      return sum + bet.payout;
    } else if (bet.status === "lost") {
      return sum - bet.stake;
    }
    return sum;
  }, 0);

  const winRate = totalBets > 0 ? (wonBets / (wonBets + lostBets)) * 100 : 0;
  const roi = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;

  const settledBets = bets.filter((b) => b.status !== "pending" && b.status !== "push");
  const averageOdds = settledBets.length > 0
    ? settledBets.reduce((sum, bet) => sum + bet.odds, 0) / settledBets.length
    : 0;

  const wonBetsList = bets.filter((b) => b.status === "won" && b.payout);
  const bestWin = wonBetsList.length > 0
    ? wonBetsList.reduce((max, bet) => (bet.payout! > (max.payout || 0) ? bet : max))
    : undefined;

  const lostBetsList = bets.filter((b) => b.status === "lost");
  const worstLoss = lostBetsList.length > 0
    ? lostBetsList.reduce((max, bet) => (bet.stake > max.stake ? bet : max))
    : undefined;

  return {
    totalBets,
    wonBets,
    lostBets,
    pushBets,
    pendingBets,
    totalStaked,
    totalProfit,
    winRate,
    roi,
    averageOdds,
    bestWin,
    worstLoss,
  };
}

// Mock data for demonstration
export const mockTrackedGames: TrackedGame[] = [];

export const mockBets: Bet[] = [
  {
    id: "bet-1",
    gameId: "game-1",
    awayTeam: "Chiefs",
    homeTeam: "Bills",
    gameTime: new Date("2025-01-27T20:00:00"),
    betType: "spread",
    selection: "Chiefs",
    odds: -110,
    stake: 1,
    sportsbook: "fanduel",
    placedAt: new Date("2025-01-26T14:30:00"),
    status: "won",
    payout: 0.91,
    notes: "Chiefs covering in playoffs",
  },
  {
    id: "bet-2",
    gameId: "game-2",
    awayTeam: "Ravens",
    homeTeam: "Bengals",
    gameTime: new Date("2025-01-28T13:00:00"),
    betType: "total",
    selection: "over",
    odds: -105,
    stake: 1.5,
    sportsbook: "draftkings",
    placedAt: new Date("2025-01-27T10:15:00"),
    status: "lost",
    notes: "Defensive battle, went under",
  },
  {
    id: "bet-3",
    gameId: "game-3",
    awayTeam: "49ers",
    homeTeam: "Packers",
    gameTime: new Date("2025-01-28T16:30:00"),
    betType: "moneyline",
    selection: "49ers",
    odds: -165,
    stake: 2,
    sportsbook: "betmgm",
    placedAt: new Date("2025-01-27T18:45:00"),
    status: "won",
    payout: 1.21,
  },
];
