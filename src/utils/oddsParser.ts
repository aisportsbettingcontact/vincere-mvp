import type { GameOdds } from "@/types/odds";
import type { RawSplitGame } from "@/utils/oddsValidation";
import { safeParseGames } from "@/utils/oddsValidation";
import { isGameInFuture } from "@/utils/gameFilters";
import { GAME_METADATA, getDefaultGameTime, getDefaultNetwork, isPrimeTimeSlot, getPrimeTimeLabel } from "@/config/gameMetadata";

// Sport priority for sorting
const SPORT_PRIORITY = { 
  NFL: 1, 
  MLB: 2, 
  CFB: 3, 
  NBA: 4, 
  NHL: 5, 
  CBB: 6 
} as const;

/**
 * Format date string with time metadata
 */
export function formatDate(dateStr: string, gameId: string, sport: string): string {
  if (!dateStr || dateStr.length !== 8) {
    console.warn(`Invalid date format: ${dateStr}`);
    return new Date().toISOString();
  }

  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  
  // Get time from metadata or default
  const metadata = GAME_METADATA[gameId];
  const date = new Date(`${year}-${month}-${day}`);
  const time = metadata?.time || getDefaultGameTime(sport, date.getDay());
  
  return `${year}-${month}-${day}T${time}:00`;
}

/**
 * Get game metadata with intelligent fallbacks
 */
export function getGameMetadata(gameId: string, sport: string, dateStr: string) {
  const explicit = GAME_METADATA[gameId];
  if (explicit) return explicit;
  
  // Generate intelligent defaults
  const date = new Date(formatDate(dateStr, gameId, sport));
  const dayOfWeek = date.getDay();
  
  return {
    time: getDefaultGameTime(sport, dayOfWeek),
    tv: getDefaultNetwork(sport, dayOfWeek),
    stadium: undefined,
    primetime: isPrimeTimeSlot(sport, date) ? getPrimeTimeLabel(date) : undefined
  };
}

/**
 * Generic function to parse book data for any sport
 */
export function parseBookData(
  bookData: Record<string, RawSplitGame[]> | undefined,
  book: string,
  sport: string
): GameOdds[] {
  if (!bookData) {
    console.log(`No ${sport} data for ${book}`);
    return [];
  }
  
  const allGames: GameOdds[] = [];
  
  Object.entries(bookData).forEach(([date, games]) => {
    // Validate and filter games
    const validGames = safeParseGames(games);
    
    // Filter to future games only
    const futureGames = validGames.filter(game => {
      const metadata = getGameMetadata(game.id, sport, game.d);
      return isGameInFuture(game.d, metadata.time);
    });
    
    // Parse each game
    futureGames.forEach(game => {
      try {
        const parsed = parseGame(game, book);
        allGames.push(parsed);
      } catch (error) {
        console.warn(`Failed to parse game ${game.id}:`, error);
      }
    });
  });
  
  console.log(`✅ Parsed ${allGames.length} ${sport} games from ${book}`);
  return allGames;
}

/**
 * Parse individual game
 */
export function parseGame(game: RawSplitGame, book: string): GameOdds {
  const sport = game.s as GameOdds["sport"];
  const kickoff = formatDate(game.d, game.id, sport);
  const metadata = getGameMetadata(game.id, sport, game.d);
  
  // Import team mappings
  const { getTeamInfo } = require("@/utils/teamMappings");
  const { getTeamColors } = require("@/utils/teamColors");
  const { getCFBTeamInfo } = require("@/utils/cfbTeamMappings");
  const { getCFBTeamColors } = require("@/utils/cfbTeamColors");
  
  // Get team info based on sport
  const getInfo = (sport === "CFB" || sport === "CBB") ? getCFBTeamInfo : getTeamInfo;
  const getColors = (sport === "CFB" || sport === "CBB") ? getCFBTeamColors : getTeamColors;
  
  const awayInfo = getInfo(game.a);
  const homeInfo = getInfo(game.h);
  const awayColors = getColors(game.a);
  const homeColors = getColors(game.h);

  return {
    gameId: game.id,
    sport,
    kickoff,
    book,
    away: {
      name: awayInfo.shortName,
      fullName: awayInfo.fullName,
      abbr: awayInfo.abbr,
      espnAbbr: awayInfo.espnAbbr,
      color: awayColors.primary,
      secondaryColor: awayColors.secondary,
      tertiaryColor: awayColors.tertiary,
    },
    home: {
      name: homeInfo.shortName,
      fullName: homeInfo.fullName,
      abbr: homeInfo.abbr,
      espnAbbr: homeInfo.espnAbbr,
      color: homeColors.primary,
      secondaryColor: homeColors.secondary,
      tertiaryColor: homeColors.tertiary,
    },
    tvInfo: metadata.tv,
    primetime: metadata.primetime,
    stadium: metadata.stadium,
    specialLogo: metadata.specialLogo,
    odds: [
      {
        book,
        timestamp: new Date().toISOString(),
        moneyline: game.ml[0] !== 0 && game.ml[1] !== 0 ? {
          away: { american: game.ml[0], implied: Math.abs(game.ml[0]) / (Math.abs(game.ml[0]) + 100) * 100 },
          home: { american: game.ml[1], implied: Math.abs(game.ml[1]) / (Math.abs(game.ml[1]) + 100) * 100 },
        } : undefined,
        spread: game.spr[0] !== 0 ? {
          away: { line: game.spr[0], odds: { american: game.spr[1] } },
          home: { line: -game.spr[0], odds: { american: game.spr[1] === -110 ? -110 : (game.spr[1] === 110 ? -110 : game.spr[1]) } },
        } : undefined,
        total: game.tot[0] !== 0 ? {
          over: { line: game.tot[0], odds: { american: -110 } },
          under: { line: game.tot[0], odds: { american: -110 } },
        } : undefined,
      },
    ],
    splits: {
      moneyline: {
        away: { tickets: game.ml[2][0], handle: game.ml[2][1] },
        home: { tickets: game.ml[3][0], handle: game.ml[3][1] },
      },
      spread: {
        away: { tickets: game.spr[2][0], handle: game.spr[2][1] },
        home: { tickets: game.spr[3][0], handle: game.spr[3][1] },
      },
      total: {
        over: { tickets: game.tot[1][0], handle: game.tot[1][1] },
        under: { tickets: game.tot[2][0], handle: game.tot[2][1] },
      },
    },
  };
}

/**
 * Compare games for sorting
 */
export function compareGames(a: GameOdds, b: GameOdds): number {
  const aTime = new Date(a.kickoff).getTime();
  const bTime = new Date(b.kickoff).getTime();
  const aDay = a.kickoff.split('T')[0];
  const bDay = b.kickoff.split('T')[0];
  
  // Same day: sort by sport priority then time
  if (aDay === bDay) {
    const sportDiff = SPORT_PRIORITY[a.sport] - SPORT_PRIORITY[b.sport];
    return sportDiff !== 0 ? sportDiff : aTime - bTime;
  }
  
  // Different days: chronological
  return aTime - bTime;
}
