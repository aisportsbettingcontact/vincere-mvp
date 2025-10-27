import type { GameOdds } from "@/data/oddsData";
import { NFL_TEAM_COLORS, NFL_TEAM_SECONDARY_COLORS } from "@/data/oddsData";
import { getTeamInfo } from "./teamMappings";
import rawSplitsData from "@/data/nfl-splits-raw.json";

interface RawSplitGame {
  id: string;
  d: string; // date YYYYMMDD
  a: string; // away team slug
  h: string; // home team slug
  spr: [number, number, [number, number], [number, number]]; // [awayLine, homeLine, [awayTickets%, homeTickets%], [awayMoney%, homeMoney%]]
  tot: [number, [number, number], [number, number]]; // [line, [overTickets%, underTickets%], [overMoney%, underMoney%]]
  ml: [number, number, [number, number], [number, number]]; // [awayOdds, homeOdds, [awayTickets%, homeTickets%], [awayMoney%, homeMoney%]]
}

function formatDate(dateStr: string): string {
  // Convert YYYYMMDD to ISO format for Date constructor
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  
  // Return ISO format date string that will be parsed by formatGameTime in Feed.tsx
  return `${year}-${month}-${day}T13:00:00`;
}

export function parseRawSplits(): GameOdds[] {
  const games = rawSplitsData as RawSplitGame[];
  
  return games.map((game) => {
    const awayTeam = getTeamInfo(game.a);
    const homeTeam = getTeamInfo(game.h);
    
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
      sport: "NFL" as const,
      kickoff: formatDate(game.d),
      away: {
        name: awayTeam.name,
        abbr: awayTeam.abbr,
        espnAbbr: awayTeam.espnAbbr,
        color: NFL_TEAM_COLORS[awayTeam.fullName] || "#6395EE"
      },
      home: {
        name: homeTeam.name,
        abbr: homeTeam.abbr,
        espnAbbr: homeTeam.espnAbbr,
        color: NFL_TEAM_COLORS[homeTeam.fullName] || "#39ff14"
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
  });
}
