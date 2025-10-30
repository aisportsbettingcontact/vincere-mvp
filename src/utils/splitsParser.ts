import type { GameOdds } from "@/data/oddsData";
import { getTeamInfo } from "./teamMappings";
import { getTeamPrimaryColor, getTeamSecondaryColor } from "./teamColors";
import rawSplitsDataImport from "@/data/nfl-splits-raw.json";

interface RawSplitGame {
  id: string;
  d: string; // date YYYYMMDD
  a: string; // away team slug
  h: string; // home team slug
  spr: [number, number, [number, number], [number, number]]; // [awayLine, homeLine, [awayTickets%, homeTickets%], [awayMoney%, homeMoney%]]
  tot: [number, [number, number], [number, number]]; // [line, [overTickets%, underTickets%], [overMoney%, underMoney%]]
  ml: [number, number, [number, number], [number, number]]; // [awayOdds, homeOdds, [awayTickets%, homeTickets%], [awayMoney%, homeMoney%]]
  b: string; // book
  s: string; // sport
}

interface RawSplitsDataFormat {
  generated_at: string;
  books: {
    DK: {
      NFL: Record<string, RawSplitGame[]>;
      NBA: Record<string, RawSplitGame[]>;
    };
    CIRCA: {
      NFL: Record<string, RawSplitGame[]>;
    };
  };
}

// Map specific game IDs to their actual kickoff times (ET in 24h format)
const GAME_TIMES: Record<string, string> = {
  "20251030NFL00032": "20:15", // BAL @ MIA - Thursday Night Football
  "20251102NFL00036": "13:00", // CHI @ CIN - Sunday afternoon
  "20251102NFL00048": "13:00", // SF @ NYG - Sunday afternoon
  "20251102NFL00033": "13:00", // ATL @ NE - Sunday afternoon
  "20251102NFL00038": "13:00", // IND @ PIT - Sunday afternoon
  "20251102NFL00053": "13:00", // CAR @ GB - Sunday afternoon
  "20251102NFL00052": "13:00", // MIN @ DET - Sunday afternoon
  "20251102NFL00039": "13:00", // DEN @ HOU - Sunday afternoon
  "20251102NFL00042": "13:00", // LAC @ TEN - Sunday afternoon
  "20251102NFL00045": "13:00", // JAX @ LV - Sunday afternoon
  "20251102NFL00062": "16:05", // NO @ LAR - Sunday late afternoon
  "20251102NFL00031": "16:25", // KC @ BUF - Sunday late afternoon
  "20251102NFL00050": "16:25", // SEA @ WAS - Sunday late afternoon
  "20251102NFL00047": "20:20", // NYJ @ ARI - Sunday Night Football
  "20251103NFL00040": "20:15", // TB @ KC - Monday Night Football
};

function formatDate(dateStr: string, gameId: string, sport: string): string {
  // Convert YYYYMMDD to ISO format for Date constructor
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  
  // NBA games default to 7:00pm ET, NFL uses specific times or 1:00pm default
  const time = GAME_TIMES[gameId] || (sport === "NBA" ? "19:00" : "13:00");
  
  // Return ISO format date string that will be parsed by formatGameTime in Feed.tsx
  return `${year}-${month}-${day}T${time}:00`;
}

export function parseRawSplits(): GameOdds[] {
  const rawData = rawSplitsDataImport as unknown as RawSplitsDataFormat;
  const allGames: GameOdds[] = [];
  
  // Parse DK NFL games
  if (rawData.books.DK.NFL) {
    Object.values(rawData.books.DK.NFL).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "DK"));
      });
    });
  }
  
  // Parse DK NBA games
  if (rawData.books.DK.NBA) {
    Object.values(rawData.books.DK.NBA).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "DK"));
      });
    });
  }
  
  // Parse CIRCA NFL games
  if (rawData.books.CIRCA?.NFL) {
    Object.values(rawData.books.CIRCA.NFL).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "CIRCA"));
      });
    });
  }
  
  // Sort by date/time chronologically
  allGames.sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
  
  return allGames;
}

function parseGame(game: RawSplitGame, book: string): GameOdds {
    const sport = game.s || "NFL";
    const awayTeam = getTeamInfo(game.a, sport);
    const homeTeam = getTeamInfo(game.h, sport);
    
    // Convert decimal percentages to whole numbers (0.35 -> 35)
    const spreadTickets = {
      away: Math.round(game.spr[2][0] * 100),
      home: Math.round(game.spr[2][1] * 100)
    };
    const spreadMoney = {
      away: Math.round(game.spr[3][0] * 100),
      home: Math.round(game.spr[3][1] * 100)
    };
    
    const totalTickets = {
      over: Math.round(game.tot[1][0] * 100),
      under: Math.round(game.tot[1][1] * 100)
    };
    const totalMoney = {
      over: Math.round(game.tot[2][0] * 100),
      under: Math.round(game.tot[2][1] * 100)
    };
    
    const mlTickets = {
      away: Math.round(game.ml[2][0] * 100),
      home: Math.round(game.ml[2][1] * 100)
    };
    const mlMoney = {
      away: Math.round(game.ml[3][0] * 100),
      home: Math.round(game.ml[3][1] * 100)
    };
    
    return {
      gameId: game.id,
      sport: sport as "NFL" | "NBA",
      kickoff: formatDate(game.d, game.id, sport),
      book: book,
      away: {
        name: awayTeam.name,
        abbr: awayTeam.abbr,
        espnAbbr: awayTeam.espnAbbr,
        color: getTeamPrimaryColor(awayTeam.fullName, sport),
        secondaryColor: getTeamSecondaryColor(awayTeam.fullName, sport)
      },
      home: {
        name: homeTeam.name,
        abbr: homeTeam.abbr,
        espnAbbr: homeTeam.espnAbbr,
        color: getTeamPrimaryColor(homeTeam.fullName, sport),
        secondaryColor: getTeamSecondaryColor(homeTeam.fullName, sport)
      },
      odds: [
        {
          book: "consensus",
          timestamp: new Date().toISOString(),
          moneyline: {
            away: { american: game.ml[0], decimal: 0, implied: 0 },
            home: { american: game.ml[1], decimal: 0, implied: 0 }
          },
          spread: {
            away: {
              line: game.spr[0],
              odds: { american: -110, decimal: 0, implied: 0 }
            },
            home: {
              line: game.spr[1],
              odds: { american: -110, decimal: 0, implied: 0 }
            }
          },
          total: {
            over: {
              line: game.tot[0],
              odds: { american: -110, decimal: 0, implied: 0 }
            },
            under: {
              line: game.tot[0],
              odds: { american: -110, decimal: 0, implied: 0 }
            }
          }
        }
      ],
      splits: {
        spread: {
          away: {
            tickets: spreadTickets.away,
            handle: spreadMoney.away
          },
          home: {
            tickets: spreadTickets.home,
            handle: spreadMoney.home
          }
        },
        total: {
          over: {
            tickets: totalTickets.over,
            handle: totalMoney.over
          },
          under: {
            tickets: totalTickets.under,
            handle: totalMoney.under
          }
        },
        moneyline: {
          away: {
            tickets: mlTickets.away,
            handle: mlMoney.away
          },
          home: {
            tickets: mlTickets.home,
            handle: mlMoney.home
          }
        }
      }
    };
}
