import { useQuery } from "@tanstack/react-query";
import type { EdgeGuideLatestResponse } from "@/lib/edgeguide";
import type { GameOdds } from "@/data/oddsData";
import { getTeamInfo } from "@/utils/teamMappings";
import { getTeamColors } from "@/utils/teamColors";
import rawSplitsDataImport from "@/data/nfl-splits-raw.json";

// Map specific game IDs to their actual kickoff times (ET in 24h format)
const GAME_TIMES: Record<string, string> = {
  "20251030NFL00032": "20:15",
  "20251102NFL00036": "13:00",
  "20251102NFL00048": "13:00",
  "20251102NFL00033": "13:00",
  "20251102NFL00038": "13:00",
  "20251102NFL00053": "13:00",
  "20251102NFL00052": "13:00",
  "20251102NFL00039": "13:00",
  "20251102NFL00042": "13:00",
  "20251102NFL00045": "13:00",
  "20251102NFL00062": "16:05",
  "20251102NFL00031": "16:25",
  "20251102NFL00050": "16:25",
  "20251102NFL00047": "20:20",
  "20251103NFL00040": "20:15",
};

function formatDate(dateStr: string, gameId: string, sport: string): string {
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  const time = GAME_TIMES[gameId] || (sport === "NBA" ? "19:00" : sport === "NHL" ? "19:00" : sport === "CFB" ? "12:00" : sport === "CBB" ? "19:00" : sport === "MLB" ? "19:00" : "13:00");
  return `${year}-${month}-${day}T${time}:00`;
}

function parseGame(game: any, book: string): GameOdds {
  const sport = game.s || "NFL";
  const awayTeam = getTeamInfo(game.a, sport);
  const homeTeam = getTeamInfo(game.h, sport);
  const awayColors = getTeamColors(awayTeam.fullName, sport);
  const homeColors = getTeamColors(homeTeam.fullName, sport);
  
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
    sport: sport as "NFL" | "CFB" | "NBA" | "NHL",
    kickoff: formatDate(game.d, game.id, sport),
    book: book,
    away: {
      name: awayTeam.name,
      fullName: awayTeam.fullName,
      abbr: awayTeam.abbr,
      espnAbbr: awayTeam.espnAbbr,
      color: awayColors.primary,
      secondaryColor: awayColors.secondary,
      tertiaryColor: awayColors.tertiary
    },
    home: {
      name: homeTeam.name,
      fullName: homeTeam.fullName,
      abbr: homeTeam.abbr,
      espnAbbr: homeTeam.espnAbbr,
      color: homeColors.primary,
      secondaryColor: homeColors.secondary,
      tertiaryColor: homeColors.tertiary
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
        away: { tickets: spreadTickets.away, handle: spreadMoney.away },
        home: { tickets: spreadTickets.home, handle: spreadMoney.home }
      },
      total: {
        over: { tickets: totalTickets.over, handle: totalMoney.over },
        under: { tickets: totalTickets.under, handle: totalMoney.under }
      },
      moneyline: {
        away: { tickets: mlTickets.away, handle: mlMoney.away },
        home: { tickets: mlTickets.home, handle: mlMoney.home }
      }
    }
  };
}

function parseEdgeGuideData(data: EdgeGuideLatestResponse): GameOdds[] {
  const allGames: GameOdds[] = [];
  
  // Parse DK NFL games
  if (data.books.DK?.NFL) {
    Object.values(data.books.DK.NFL).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "DK"));
      });
    });
  }
  
  // Parse DK MLB games
  if (data.books.DK?.MLB) {
    Object.values(data.books.DK.MLB).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "DK"));
      });
    });
  }
  
  // Parse CIRCA MLB games
  if (data.books.CIRCA?.MLB) {
    Object.values(data.books.CIRCA.MLB).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "CIRCA"));
      });
    });
  }
  
  // Parse DK CFB games
  if (data.books.DK?.CFB) {
    Object.values(data.books.DK.CFB).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "DK"));
      });
    });
  }
  
  // Parse CIRCA CFB games
  if (data.books.CIRCA?.CFB) {
    Object.values(data.books.CIRCA.CFB).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "CIRCA"));
      });
    });
  }
  
  // Parse DK NBA games (exclude 20251029)
  if (data.books.DK?.NBA) {
    Object.entries(data.books.DK.NBA).forEach(([date, dateGames]) => {
      if (date !== "20251029") {
        dateGames.forEach(game => {
          allGames.push(parseGame(game, "DK"));
        });
      }
    });
  }
  
  // Parse CIRCA NFL games
  if (data.books.CIRCA?.NFL) {
    Object.values(data.books.CIRCA.NFL).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "CIRCA"));
      });
    });
  }
  
  // Parse DK NHL games
  if (data.books.DK?.NHL) {
    Object.values(data.books.DK.NHL).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "DK"));
      });
    });
  }
  
  // Parse CIRCA NHL games
  if (data.books.CIRCA?.NHL) {
    Object.values(data.books.CIRCA.NHL).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "CIRCA"));
      });
    });
  }
  
  // Parse DK CBB games
  if (data.books.DK?.CBB) {
    Object.values(data.books.DK.CBB).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "DK"));
      });
    });
  }
  
  // Parse CIRCA CBB games
  if (data.books.CIRCA?.CBB) {
    Object.values(data.books.CIRCA.CBB).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "CIRCA"));
      });
    });
  }
  
  // Sort by date/time chronologically, with NFL > MLB (World Series) > CFB > NBA > NHL > CBB on the same day
  allGames.sort((a, b) => {
    const aDate = new Date(a.kickoff);
    const bDate = new Date(b.kickoff);
    const aDay = aDate.toISOString().split('T')[0];
    const bDay = bDate.toISOString().split('T')[0];
    
    // If same day, prioritize NFL > MLB > CFB > NBA > NHL > CBB
    if (aDay === bDay && a.sport !== b.sport) {
      const sportOrder = { NFL: 1, MLB: 2, CFB: 3, NBA: 4, NHL: 5, CBB: 6 };
      return sportOrder[a.sport] - sportOrder[b.sport];
    }
    
    // Otherwise sort by time
    return aDate.getTime() - bDate.getTime();
  });
  
  return allGames;
}

export function useEdgeGuideData() {
  return useQuery({
    queryKey: ["edgeguide-data"],
    queryFn: async () => {
      console.log("📊 Using static data from uploaded file");
      const mockData = rawSplitsDataImport as unknown as EdgeGuideLatestResponse;
      return parseEdgeGuideData(mockData);
    },
    staleTime: Infinity, // Static data never goes stale
    throwOnError: false,
  });
}
