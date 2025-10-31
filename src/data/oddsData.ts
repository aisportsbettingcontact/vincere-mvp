// Mock odds data for betting interface

// NFL Team Official Primary Colors
export const NFL_TEAM_COLORS: Record<string, string> = {
  "Arizona Cardinals": "#97233F",
  "Atlanta Falcons": "#A71930",
  "Baltimore Ravens": "#241773",
  "Buffalo Bills": "#00338D",
  "Carolina Panthers": "#0085CA",
  "Chicago Bears": "#0B162A",
  "Cincinnati Bengals": "#FB4F14",
  "Cleveland Browns": "#311D00",
  "Dallas Cowboys": "#041E42",
  "Denver Broncos": "#FB4F14",
  "Detroit Lions": "#0076B6",
  "Green Bay Packers": "#203731",
  "Houston Texans": "#03202F",
  "Indianapolis Colts": "#002C5F",
  "Jacksonville Jaguars": "#006778",
  "Kansas City Chiefs": "#E31837",
  "Las Vegas Raiders": "#000000",
  "Los Angeles Chargers": "#0080C6",
  "Los Angeles Rams": "#003594",
  "Miami Dolphins": "#008E97",
  "Minnesota Vikings": "#4F2683",
  "New England Patriots": "#002244",
  "New Orleans Saints": "#D3BC8D",
  "New York Giants": "#0B2265",
  "New York Jets": "#125740",
  "Philadelphia Eagles": "#004C54",
  "Pittsburgh Steelers": "#FFB612",
  "San Francisco 49ers": "#AA0000",
  "Seattle Seahawks": "#002244",
  "Tampa Bay Buccaneers": "#D50A0A",
  "Tennessee Titans": "#0C2340",
  "Washington Commanders": "#5A1414"
};

export const NFL_TEAM_SECONDARY_COLORS: Record<string, string> = {
  "Arizona Cardinals": "#FFB612",
  "Atlanta Falcons": "#000000",
  "Baltimore Ravens": "#9E7C0C",
  "Buffalo Bills": "#C60C30",
  "Carolina Panthers": "#101820",
  "Chicago Bears": "#C83803",
  "Cincinnati Bengals": "#000000",
  "Cleveland Browns": "#FF3C00",
  "Dallas Cowboys": "#869397",
  "Denver Broncos": "#002244",
  "Detroit Lions": "#B0B7BC",
  "Green Bay Packers": "#FFB612",
  "Houston Texans": "#A71930",
  "Indianapolis Colts": "#A2AAAD",
  "Jacksonville Jaguars": "#D7A22A",
  "Kansas City Chiefs": "#FFB81C",
  "Las Vegas Raiders": "#A5ACAF",
  "Los Angeles Chargers": "#FFC20E",
  "Los Angeles Rams": "#FFA300",
  "Miami Dolphins": "#FC4C02",
  "Minnesota Vikings": "#FFC62F",
  "New England Patriots": "#C60C30",
  "New Orleans Saints": "#101820",
  "New York Giants": "#A71930",
  "New York Jets": "#000000",
  "Philadelphia Eagles": "#A5ACAF",
  "Pittsburgh Steelers": "#101820",
  "San Francisco 49ers": "#B3995D",
  "Seattle Seahawks": "#69BE28",
  "Tampa Bay Buccaneers": "#FF7900",
  "Tennessee Titans": "#0C2340",
  "Washington Commanders": "#FFB612"
};

export interface GameOdds {
  gameId: string;
  sport: string;
  kickoff: string;
  book: string; // DK or CIRCA
  away: {
    name: string;
    fullName?: string;
    abbr: string;
    espnAbbr: string;
    color: string;
    secondaryColor: string;
    tertiaryColor: string;
  };
  home: {
    name: string;
    fullName?: string;
    abbr: string;
    espnAbbr: string;
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

