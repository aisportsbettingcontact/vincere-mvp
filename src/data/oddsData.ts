// Mock odds data for betting interface
export interface GameOdds {
  gameId: string;
  sport: string;
  kickoff: string;
  away: {
    name: string;
    abbr: string;
    espnAbbr: string;
    color: string;
  };
  home: {
    name: string;
    abbr: string;
    espnAbbr: string;
    color: string;
  };
  tvInfo?: string;
  odds: Array<{
    moneyline?: {
      away: { american: number };
      home: { american: number };
    };
    spread?: {
      away: { line: number; odds: { american: number } };
      home: { line: number; odds: { american: number } };
    };
    total?: {
      over: { line: number; odds: { american: number } };
      under: { line: number; odds: { american: number } };
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

export const mockGameOdds: GameOdds[] = [
  {
    gameId: "MIN-LAC-001",
    sport: "NFL",
    kickoff: "2025-03-01T15:00:00Z",
    away: {
      name: "Vikings",
      abbr: "MIN",
      espnAbbr: "min",
      color: "#4F2683"
    },
    home: {
      name: "Chargers",
      abbr: "LAC",
      espnAbbr: "lac",
      color: "#0080C6"
    },
    tvInfo: "NFL",
    odds: [{
      moneyline: {
        away: { american: -110 },
        home: { american: -110 }
      },
      spread: {
        away: { line: 2.5, odds: { american: -110 } },
        home: { line: -2.5, odds: { american: -110 } }
      },
      total: {
        over: { line: 47.5, odds: { american: -110 } },
        under: { line: 47.5, odds: { american: -110 } }
      }
    }],
    splits: {
      moneyline: {
        away: { tickets: 48, handle: 70 },
        home: { tickets: 52, handle: 30 }
      },
      spread: {
        away: { tickets: 30, handle: 29 },
        home: { tickets: 70, handle: 71 }
      },
      total: {
        over: { tickets: 58, handle: 52 },
        under: { tickets: 42, handle: 48 }
      }
    }
  },
  {
    gameId: "NYJ-CIN-002",
    sport: "NFL",
    kickoff: "2025-03-01T15:00:00Z",
    away: {
      name: "Jets",
      abbr: "NYJ",
      espnAbbr: "nyj",
      color: "#125740"
    },
    home: {
      name: "Bengals",
      abbr: "CIN",
      espnAbbr: "cin",
      color: "#FB4F14"
    },
    tvInfo: "NFL",
    odds: [{
      moneyline: {
        away: { american: 150 },
        home: { american: -170 }
      },
      spread: {
        away: { line: 3.5, odds: { american: -110 } },
        home: { line: -3.5, odds: { american: -110 } }
      },
      total: {
        over: { line: 44.5, odds: { american: -110 } },
        under: { line: 44.5, odds: { american: -110 } }
      }
    }],
    splits: {
      moneyline: {
        away: { tickets: 17, handle: 83 },
        home: { tickets: 83, handle: 17 }
      },
      spread: {
        away: { tickets: 17, handle: 83 },
        home: { tickets: 83, handle: 17 }
      },
      total: {
        over: { tickets: 45, handle: 55 },
        under: { tickets: 55, handle: 45 }
      }
    }
  }
];

export const NFL_TEAM_SECONDARY_COLORS: Record<string, string> = {
  "Minnesota Vikings": "#FFC62F",
  "Los Angeles Chargers": "#FFC20E",
  "New York Jets": "#FFFFFF",
  "Cincinnati Bengals": "#000000"
};
