export type NotificationType = "bet_placed" | "line_movement" | "game_starting" | "bet_settled";

export interface Notification {
  id: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  title: string;
  message: string;
  data?: {
    gameId?: string;
    betId?: string;
    awayTeam?: string;
    homeTeam?: string;
    oldLine?: string;
    newLine?: string;
    movement?: number;
    market?: string;
    stake?: number;
    odds?: number;
    result?: "won" | "lost" | "push";
    payout?: number;
    moveCount?: number;
  };
}

// Mock notifications - exactly as specified in the design
export const mockNotifications: Notification[] = [
  // Row 1: Result / Unread - TODAY
  {
    id: "notif-1",
    type: "bet_settled",
    timestamp: new Date(Date.now() - 9 * 60 * 1000), // 9m ago
    read: false,
    title: "Won +$182",
    message: "Won +$182",
    data: {
      gameId: "game-1",
      betId: "bet-1",
      awayTeam: "Lions",
      homeTeam: "49ers",
      result: "won",
      payout: 1.82,
      stake: 2,
    },
  },
  // Row 2: Placed / Unread - TODAY
  {
    id: "notif-2",
    type: "bet_placed",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15m ago
    read: false,
    title: "Chiefs −2.5 (−110) placed · 1u",
    message: "Chiefs −2.5 (−110) placed · 1u",
    data: {
      gameId: "game-2",
      betId: "bet-2",
      awayTeam: "Chiefs",
      homeTeam: "Bills",
      stake: 1,
      odds: -110,
      market: "spread",
      oldLine: "−2.5",
    },
  },
  // Row 3: Move / Unread - TODAY
  {
    id: "notif-3",
    type: "line_movement",
    timestamp: new Date(Date.now() - 33 * 60 * 1000), // 33m ago
    read: false,
    title: "Ravens–Bengals total → 47.5 (−1)",
    message: "Ravens–Bengals total → 47.5 (−1)",
    data: {
      gameId: "game-3",
      awayTeam: "Ravens",
      homeTeam: "Bengals",
      oldLine: "48.5",
      newLine: "47.5",
      movement: -1,
      market: "total",
    },
  },
  // Row 4: Move / Read - TODAY
  {
    id: "notif-4",
    type: "line_movement",
    timestamp: new Date(Date.now() - 59 * 60 * 1000), // 59m ago
    read: true,
    title: "49ers–Packers spread → −5 (−1.5)",
    message: "49ers–Packers spread → −5 (−1.5)",
    data: {
      gameId: "game-4",
      awayTeam: "49ers",
      homeTeam: "Packers",
      oldLine: "-3.5",
      newLine: "-5",
      movement: -1.5,
      market: "spread",
    },
  },
  // Row 5: Placed / Read - TODAY
  {
    id: "notif-5",
    type: "bet_placed",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
    read: true,
    title: "Lions ML (+145) placed · 2u",
    message: "Lions ML (+145) placed · 2u",
    data: {
      gameId: "game-5",
      betId: "bet-5",
      awayTeam: "Lions",
      homeTeam: "49ers",
      stake: 2,
      odds: 145,
      market: "moneyline",
    },
  },
  // Row 6: Result / Read - YESTERDAY
  {
    id: "notif-6",
    type: "bet_settled",
    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22h ago (yesterday)
    read: true,
    title: "Won +$91",
    message: "Won +$91",
    data: {
      gameId: "game-6",
      betId: "bet-6",
      awayTeam: "Chiefs",
      homeTeam: "Bills",
      result: "won",
      payout: 0.91,
      stake: 1,
    },
  },
];
