import { Game } from "@/types";

export const games: Game[] = [
  {
    id: "NBA-BOSPHI-001",
    league: "NBA",
    startTime: "2025-03-01T00:30:00Z",
    dateTag: "Today",
    home: "BOS",
    away: "PHI",
    odds: {
      DK: {
        ML: { home: 1.62, away: 2.35 },
        Spread: { line: -4.5, home: 1.9, away: 1.95 },
        Total: { line: 226.5, over: 1.91, under: 1.91 },
      },
      FD: {
        ML: { home: 1.65, away: 2.3 },
        Spread: { line: -4.0, home: 1.88, away: 1.98 },
        Total: { line: 226.0, over: 1.9, under: 1.92 },
      },
      MGM: {
        ML: { home: 1.6, away: 2.4 },
        Spread: { line: -4.5, home: 1.92, away: 1.92 },
        Total: { line: 227.0, over: 1.93, under: 1.89 },
      },
      Caesars: {
        ML: { home: 1.63, away: 2.37 },
        Spread: { line: -5.0, home: 1.96, away: 1.86 },
        Total: { line: 226.5, over: 1.92, under: 1.9 },
      },
    },
    splits: {
      home: { betsPct: 48, moneyPct: 70 },
      away: { betsPct: 52, moneyPct: 30 },
    },
    movement: [
      { t: "2025-02-28T18:00:00Z", market: "Spread", side: "home", price: -4.0 },
      { t: "2025-02-28T22:00:00Z", market: "Spread", side: "home", price: -4.5 },
    ],
    open: { Spread: { line: -4.0 }, Total: { line: 226.0 } },
  },
  {
    id: "NFL-KCBUF-002",
    league: "NFL",
    startTime: "2025-03-01T18:00:00Z",
    dateTag: "Today",
    home: "KC",
    away: "BUF",
    odds: {
      DK: {
        ML: { home: 1.45, away: 2.8 },
        Spread: { line: -7.0, home: 1.91, away: 1.91 },
        Total: { line: 48.5, over: 1.87, under: 1.95 },
      },
      FD: {
        ML: { home: 1.47, away: 2.75 },
        Spread: { line: -6.5, home: 1.95, away: 1.87 },
        Total: { line: 48.0, over: 1.9, under: 1.92 },
      },
      MGM: {
        ML: { home: 1.43, away: 2.85 },
        Spread: { line: -7.0, home: 1.88, away: 1.94 },
        Total: { line: 49.0, over: 1.91, under: 1.91 },
      },
      Caesars: {
        ML: { home: 1.46, away: 2.77 },
        Spread: { line: -7.5, home: 1.93, away: 1.89 },
        Total: { line: 48.5, over: 1.89, under: 1.93 },
      },
    },
    splits: {
      home: { betsPct: 65, moneyPct: 55 },
      away: { betsPct: 35, moneyPct: 45 },
    },
    movement: [
      { t: "2025-02-28T12:00:00Z", market: "Spread", side: "home", price: -6.5 },
      { t: "2025-02-28T20:00:00Z", market: "Spread", side: "home", price: -7.0 },
    ],
    open: { Spread: { line: -6.5 }, Total: { line: 48.0 }, ML: { home: 1.5 } },
  },
  {
    id: "NHL-TORBOS-003",
    league: "NHL",
    startTime: "2025-03-01T19:00:00Z",
    dateTag: "Today",
    home: "BOS",
    away: "TOR",
    odds: {
      DK: {
        ML: { home: 1.95, away: 1.9 },
        Spread: { line: -1.5, home: 2.85, away: 1.42 },
        Total: { line: 6.5, over: 2.1, under: 1.74 },
      },
      FD: {
        ML: { home: 1.97, away: 1.88 },
        Spread: { line: -1.5, home: 2.8, away: 1.44 },
        Total: { line: 6.5, over: 2.15, under: 1.71 },
      },
      MGM: {
        ML: { home: 1.93, away: 1.92 },
        Spread: { line: -1.5, home: 2.9, away: 1.4 },
        Total: { line: 6.0, over: 1.95, under: 1.87 },
      },
      Caesars: {
        ML: { home: 1.96, away: 1.89 },
        Spread: { line: -1.5, home: 2.87, away: 1.41 },
        Total: { line: 6.5, over: 2.12, under: 1.72 },
      },
    },
    splits: {
      home: { betsPct: 42, moneyPct: 58 },
      away: { betsPct: 58, moneyPct: 42 },
    },
    movement: [
      { t: "2025-02-28T14:00:00Z", market: "Total", side: "over", price: 2.2 },
      { t: "2025-03-01T10:00:00Z", market: "Total", side: "over", price: 2.1 },
    ],
    open: { Total: { line: 6.5 } },
  },
  {
    id: "NBA-LALGAL-004",
    league: "NBA",
    startTime: "2025-03-02T02:30:00Z",
    dateTag: "Tomorrow",
    home: "LAL",
    away: "GSW",
    odds: {
      DK: {
        ML: { home: 2.15, away: 1.72 },
        Spread: { line: 3.5, home: 1.91, away: 1.91 },
        Total: { line: 231.5, over: 1.95, under: 1.87 },
      },
      FD: {
        ML: { home: 2.2, away: 1.69 },
        Spread: { line: 4.0, home: 1.87, away: 1.95 },
        Total: { line: 231.0, over: 1.92, under: 1.9 },
      },
      MGM: {
        ML: { home: 2.1, away: 1.75 },
        Spread: { line: 3.5, home: 1.88, away: 1.94 },
        Total: { line: 232.0, over: 1.91, under: 1.91 },
      },
      Caesars: {
        ML: { home: 2.17, away: 1.71 },
        Spread: { line: 3.0, home: 1.93, away: 1.89 },
        Total: { line: 231.5, over: 1.94, under: 1.88 },
      },
    },
    splits: {
      home: { betsPct: 38, moneyPct: 25 },
      away: { betsPct: 62, moneyPct: 75 },
    },
    movement: [
      { t: "2025-03-01T08:00:00Z", market: "Spread", side: "away", price: -3.0 },
      { t: "2025-03-01T14:00:00Z", market: "Spread", side: "away", price: -3.5 },
    ],
    open: { Spread: { line: 3.0 } },
  },
  {
    id: "NFL-SFDET-005",
    league: "NFL",
    startTime: "2025-03-02T21:00:00Z",
    dateTag: "Tomorrow",
    home: "SF",
    away: "DET",
    odds: {
      DK: {
        ML: { home: 1.8, away: 2.05 },
        Spread: { line: -2.5, home: 1.87, away: 1.95 },
        Total: { line: 52.5, over: 1.91, under: 1.91 },
      },
      FD: {
        ML: { home: 1.83, away: 2.0 },
        Spread: { line: -3.0, home: 1.91, away: 1.91 },
        Total: { line: 52.0, over: 1.88, under: 1.94 },
      },
      MGM: {
        ML: { home: 1.77, away: 2.1 },
        Spread: { line: -2.5, home: 1.9, away: 1.92 },
        Total: { line: 53.0, over: 1.95, under: 1.87 },
      },
      Caesars: {
        ML: { home: 1.82, away: 2.02 },
        Spread: { line: -2.0, home: 1.96, away: 1.86 },
        Total: { line: 52.5, over: 1.92, under: 1.9 },
      },
    },
    splits: {
      home: { betsPct: 72, moneyPct: 68 },
      away: { betsPct: 28, moneyPct: 32 },
    },
    movement: [
      { t: "2025-03-01T10:00:00Z", market: "Spread", side: "home", price: -2.0 },
      { t: "2025-03-01T16:00:00Z", market: "Spread", side: "home", price: -2.5 },
    ],
    open: { Spread: { line: -2.0 }, Total: { line: 52.0 } },
  },
  {
    id: "NHL-NYCEDM-006",
    league: "NHL",
    startTime: "2025-03-02T01:00:00Z",
    dateTag: "Tomorrow",
    home: "EDM",
    away: "NYR",
    odds: {
      DK: {
        ML: { home: 1.7, away: 2.2 },
        Spread: { line: -1.5, home: 2.5, away: 1.54 },
        Total: { line: 6.5, over: 1.87, under: 1.95 },
      },
      FD: {
        ML: { home: 1.68, away: 2.25 },
        Spread: { line: -1.5, home: 2.45, away: 1.57 },
        Total: { line: 6.0, over: 1.83, under: 1.99 },
      },
      MGM: {
        ML: { home: 1.72, away: 2.15 },
        Spread: { line: -1.5, home: 2.55, away: 1.52 },
        Total: { line: 6.5, over: 1.9, under: 1.92 },
      },
      Caesars: {
        ML: { home: 1.69, away: 2.22 },
        Spread: { line: -1.5, home: 2.48, away: 1.56 },
        Total: { line: 6.5, over: 1.88, under: 1.94 },
      },
    },
    splits: {
      home: { betsPct: 55, moneyPct: 72 },
      away: { betsPct: 45, moneyPct: 28 },
    },
    movement: [
      { t: "2025-03-01T12:00:00Z", market: "ML", side: "home", price: 1.75 },
      { t: "2025-03-01T18:00:00Z", market: "ML", side: "home", price: 1.7 },
    ],
    open: { ML: { home: 1.75 } },
  },
];
