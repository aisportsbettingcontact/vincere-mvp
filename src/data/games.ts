import { Game } from "@/types";

export const games: Game[] = [
  {
    id: "NFL-KCBUF-002",
    league: "NFL",
    startTime: "2025-03-02T01:15:00Z",
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
];
