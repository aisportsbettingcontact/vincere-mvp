import { useQuery } from "@tanstack/react-query";
import type { EdgeGuideLatestResponse } from "@/lib/edgeguide";
import type { GameOdds } from "@/data/oddsData";
import { getTeamInfo } from "@/utils/teamMappings";
import { getTeamColors } from "@/utils/teamColors";
import latestOddsData from "@/data/latest-odds.json";

// Map specific game IDs to their metadata
const GAME_METADATA: Record<string, { time: string; tv: string; primetime?: string; stadium: string; specialLogo?: string }> = {
  // Week 9 - Nov 2-3, 2025
  "20251102NFL00001": { time: "13:00", tv: "CBS", stadium: "Paycor Stadium, Cincinnati, OH" },
  "20251102NFL00002": { time: "13:00", tv: "FOX", stadium: "Ford Field, Detroit, MI" },
  "20251102NFL00003": { time: "13:00", tv: "FOX", stadium: "Lambeau Field, Green Bay, WI" },
  "20251102NFL00004": { time: "13:00", tv: "CBS", stadium: "Nissan Stadium, Nashville, TN" },
  "20251102NFL00005": { time: "13:00", tv: "CBS", stadium: "Gillette Stadium, Foxborough, MA" },
  "20251102NFL00006": { time: "13:00", tv: "CBS", stadium: "MetLife Stadium, East Rutherford, NJ" },
  "20251102NFL00007": { time: "13:00", tv: "CBS", stadium: "Acrisure Stadium, Pittsburgh, PA" },
  "20251102NFL00008": { time: "13:00", tv: "FOX", stadium: "NRG Stadium, Houston, TX" },
  "20251102NFL00009": { time: "16:05", tv: "FOX", stadium: "Allegiant Stadium, Las Vegas, NV" },
  "20251102NFL00010": { time: "16:05", tv: "FOX", stadium: "SoFi Stadium, Inglewood, CA" },
  "20251102NFL00011": { time: "16:25", tv: "CBS", stadium: "Highmark Stadium, Orchard Park, NY" },
  "20251102NFL00012": { time: "20:20", tv: "NBC", primetime: "SNF", stadium: "Northwest Stadium, Landover, MD" },
  "20251103NFL00001": { time: "20:15", tv: "ABC", primetime: "MNF", stadium: "AT&T Stadium, Arlington, TX" },
  
  // Week 10 - Nov 6-10, 2025
  "20251106NFL00043": { time: "20:15", tv: "Prime Video", primetime: "TNF", stadium: "Empower Field at Mile High, Denver, CO" },
  "20251109NFL00040": { time: "09:30", tv: "NFL Network", stadium: "Olympic Stadium, Berlin, Germany", specialLogo: "nfl-berlin" },
  "20251109NFL00051": { time: "13:00", tv: "FOX", stadium: "Soldier Field, Chicago, IL" },
  "20251109NFL00032": { time: "13:00", tv: "CBS", stadium: "Hard Rock Stadium, Miami Gardens, FL" },
  "20251109NFL00054": { time: "13:00", tv: "FOX", stadium: "U.S. Bank Stadium, Minneapolis, MN" },
  "20251109NFL00034": { time: "13:00", tv: "CBS", stadium: "MetLife Stadium, East Rutherford, NJ" },
  "20251109NFL00058": { time: "13:00", tv: "CBS", stadium: "Raymond James Stadium, Tampa, FL" },
  "20251109NFL00056": { time: "13:00", tv: "FOX", stadium: "Bank of America Stadium, Charlotte, NC" },
  "20251109NFL00039": { time: "13:00", tv: "CBS", stadium: "NRG Stadium, Houston, TX" },
  "20251109NFL00061": { time: "16:05", tv: "CBS", stadium: "Lumen Field, Seattle, WA" },
  "20251109NFL00060": { time: "16:25", tv: "FOX", stadium: "Levi's Stadium, Santa Clara, CA" },
  "20251109NFL00050": { time: "16:25", tv: "FOX", stadium: "Northwest Stadium, Landover, MD" },
  "20251109NFL00046": { time: "20:20", tv: "NBC", primetime: "SNF", stadium: "SoFi Stadium, Inglewood, CA" },
  "20251110NFL00053": { time: "20:15", tv: "ABC", primetime: "MNF", stadium: "Lambeau Field, Green Bay, WI" },
};

function formatDate(dateStr: string, gameId: string, sport: string): string {
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  const metadata = GAME_METADATA[gameId];
  const time = metadata?.time || (sport === "NBA" ? "19:00" : sport === "NHL" ? "19:00" : sport === "CFB" ? "12:00" : sport === "CBB" ? "19:00" : sport === "MLB" ? "19:00" : "13:00");
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
  
  const metadata = GAME_METADATA[game.id];
  
  return {
    gameId: game.id,
    sport: sport as "NFL" | "CFB" | "NBA" | "NHL",
    kickoff: formatDate(game.d, game.id, sport),
    book: book,
    tvInfo: metadata?.tv,
    primetime: metadata?.primetime,
    stadium: metadata?.stadium,
    specialLogo: metadata?.specialLogo,
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
  
  // Parse DK games for all sports
  if (data.books.DK?.NFL) {
    Object.values(data.books.DK.NFL).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "DK"));
      });
    });
  }
  
  if (data.books.DK?.MLB) {
    Object.values(data.books.DK.MLB).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "DK"));
      });
    });
  }
  
  if (data.books.DK?.CFB) {
    Object.values(data.books.DK.CFB).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "DK"));
      });
    });
  }
  
  if (data.books.DK?.NBA) {
    Object.entries(data.books.DK.NBA).forEach(([date, dateGames]) => {
      if (date !== "20251029") {
        dateGames.forEach(game => {
          allGames.push(parseGame(game, "DK"));
        });
      }
    });
  }
  
  if (data.books.DK?.NHL) {
    Object.values(data.books.DK.NHL).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "DK"));
      });
    });
  }
  
  if (data.books.DK?.CBB) {
    Object.values(data.books.DK.CBB).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "DK"));
      });
    });
  }
  
  // Parse CIRCA games for all sports (using their own data, not duplicating DK)
  if (data.books.CIRCA?.NFL) {
    Object.values(data.books.CIRCA.NFL).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "CIRCA"));
      });
    });
  }
  
  if (data.books.CIRCA?.MLB) {
    Object.values(data.books.CIRCA.MLB).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "CIRCA"));
      });
    });
  }
  
  if (data.books.CIRCA?.CFB) {
    Object.values(data.books.CIRCA.CFB).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "CIRCA"));
      });
    });
  }
  
  if (data.books.CIRCA?.NHL) {
    Object.values(data.books.CIRCA.NHL).forEach(dateGames => {
      dateGames.forEach(game => {
        allGames.push(parseGame(game, "CIRCA"));
      });
    });
  }
  
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
      console.log("📊 Using latest odds data from 1030-VSiN-Splits-8.json");
      const mockData = latestOddsData as unknown as EdgeGuideLatestResponse;
      return parseEdgeGuideData(mockData);
    },
    staleTime: Infinity, // Static data never goes stale
    throwOnError: false,
  });
}
