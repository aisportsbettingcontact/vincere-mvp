import type { GameOdds } from "@/types/odds";
import type { RawSplitGame } from "@/utils/oddsValidation";
import { safeParseGames } from "@/utils/oddsValidation";
import { isGameInFuture } from "@/utils/gameFilters";
import { GAME_METADATA, getDefaultGameTime, getDefaultNetwork, isPrimeTimeSlot, getPrimeTimeLabel } from "@/config/gameMetadata";
import { getTeamInfo } from "@/utils/teamMappings";
import { getTeamColors } from "@/utils/teamColors";
import { CFB_TEAM_MAPPINGS } from "@/utils/cfbTeamMappings";
import { getCFBTeamColors } from "@/utils/cfbTeamColors";

// Sport priority for sorting
const SPORT_PRIORITY = { 
  NFL: 1, 
  MLB: 2, 
  NCAAF: 3, 
  NBA: 4, 
  NHL: 5, 
  NCAAM: 6 
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
    console.log(`[PARSER] ⚠️ No ${sport} data for ${book}`);
    return [];
  }
  
  console.log(`[PARSER] 🔍 Processing ${sport} data for ${book}...`);
  
  const allGames: GameOdds[] = [];
  
  Object.entries(bookData).forEach(([date, games]) => {
    console.log(`[PARSER] 📅 Date: ${date} has ${games.length} games`);
    
    // Validate and filter games
    const validGames = safeParseGames(games);
    console.log(`[PARSER] ✅ Validated ${validGames.length}/${games.length} games`);
    
    // Filter to future games only
    const futureGames = validGames.filter(game => {
      const metadata = getGameMetadata(game.id, sport, game.d);
      const isFuture = isGameInFuture(game.d, metadata.time);
      if (!isFuture) {
        console.log(`[PARSER] ⏭️ Filtered out past game: ${game.id} ${game.a} @ ${game.h}`);
      }
      return isFuture;
    });
    
    console.log(`[PARSER] 🎯 ${futureGames.length} future games for ${date}`);
    
    // Parse each game
    futureGames.forEach(game => {
      try {
        console.log(`[PARSER] 🏈 Parsing game: ${game.id} - ${game.a} @ ${game.h}`);
        const parsed = parseGame(game, book);
        allGames.push(parsed);
      } catch (error) {
        console.error(`[PARSER] ❌ Failed to parse game ${game.id}:`, error);
      }
    });
  });
  
  console.log(`[PARSER] ✅ Parsed ${allGames.length} ${sport} games from ${book}`);
  return allGames;
}

/**
 * Parse individual game
 */
export function parseGame(game: RawSplitGame, book: string): GameOdds {
  // CRITICAL: Normalize sport name - convert legacy CFB/CBB to NCAAF/NCAAM
  let sportStr = game.s.toUpperCase();
  if (sportStr === 'CFB') sportStr = 'NCAAF';
  if (sportStr === 'CBB') sportStr = 'NCAAM';
  const sport = sportStr as GameOdds["sport"];
  
  const kickoff = formatDate(game.d, game.id, sport);
  const metadata = getGameMetadata(game.id, sport, game.d);
  
  // Get team info based on sport (CFB→NCAAF, CBB→NCAAM already converted above)
  let awayInfo, homeInfo, awayColors, homeColors;
  
  if (sport === "NCAAF" || sport === "NCAAM") {
    // Use CFB mappings
    awayInfo = CFB_TEAM_MAPPINGS[game.a];
    if (!awayInfo) {
      console.error(`🚨🚨🚨 [CFB MAPPING MISSING] Away team slug not found: "${game.a}" in game ${game.id}`);
      console.error(`Available CFB team slugs sample:`, Object.keys(CFB_TEAM_MAPPINGS).slice(0, 10));
      awayInfo = { 
        name: game.a, 
        abbr: game.a.toUpperCase().slice(0, 4), 
        espnAbbr: game.a, 
        fullName: game.a 
      };
    }
    
    homeInfo = CFB_TEAM_MAPPINGS[game.h];
    if (!homeInfo) {
      console.error(`🚨🚨🚨 [CFB MAPPING MISSING] Home team slug not found: "${game.h}" in game ${game.id}`);
      console.error(`Available CFB team slugs sample:`, Object.keys(CFB_TEAM_MAPPINGS).slice(0, 10));
      homeInfo = { 
        name: game.h, 
        abbr: game.h.toUpperCase().slice(0, 4), 
        espnAbbr: game.h, 
        fullName: game.h 
      };
    }
    
    console.log(`[CFB TEAM LOOKUP] Game: ${game.id}`);
    console.log(`  Away: slug="${game.a}" → name="${awayInfo.name}" espnAbbr="${awayInfo.espnAbbr}" fullName="${awayInfo.fullName}"`);
    console.log(`  Home: slug="${game.h}" → name="${homeInfo.name}" espnAbbr="${homeInfo.espnAbbr}" fullName="${homeInfo.fullName}"`);
    
    awayColors = getCFBTeamColors(awayInfo.fullName);
    homeColors = getCFBTeamColors(homeInfo.fullName);
    
    console.log(`[CFB COLORS] Away colors for "${awayInfo.fullName}":`, awayColors);
    console.log(`[CFB COLORS] Home colors for "${homeInfo.fullName}":`, homeColors);
  } else {
    // Use standard team mappings with correct sport parameter
    awayInfo = getTeamInfo(game.a, sport);
    homeInfo = getTeamInfo(game.h, sport);
    awayColors = getTeamColors(awayInfo.fullName, sport);
    homeColors = getTeamColors(homeInfo.fullName, sport);
  }

  return {
    gameId: game.id,
    sport,
    kickoff,
    book,
    away: {
      name: awayInfo.name || awayInfo.shortName,
      fullName: awayInfo.fullName,
      abbr: awayInfo.abbr,
      espnAbbr: awayInfo.espnAbbr,
      slug: game.a,
      color: awayColors.primary,
      secondaryColor: awayColors.secondary,
      tertiaryColor: awayColors.tertiary,
    },
    home: {
      name: homeInfo.name || homeInfo.shortName,
      fullName: homeInfo.fullName,
      abbr: homeInfo.abbr,
      espnAbbr: homeInfo.espnAbbr,
      slug: game.h,
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
        moneyline: (game.ml[0] !== null && game.ml[0] !== 0 && game.ml[1] !== null && game.ml[1] !== 0) ? {
          away: { american: game.ml[0], implied: Math.abs(game.ml[0]) / (Math.abs(game.ml[0]) + 100) * 100 },
          home: { american: game.ml[1], implied: Math.abs(game.ml[1]) / (Math.abs(game.ml[1]) + 100) * 100 },
        } : undefined,
        spread: (game.spr[0] !== null && game.spr[0] !== 0) ? {
          away: { line: game.spr[0], odds: { american: game.spr[1] || -110 } },
          home: { line: -game.spr[0], odds: { american: game.spr[1] === -110 ? -110 : (game.spr[1] === 110 ? -110 : game.spr[1] || -110) } },
        } : undefined,
        total: (game.tot[0] !== null && game.tot[0] !== 0) ? {
          over: { line: game.tot[0], odds: { american: -110 } },
          under: { line: game.tot[0], odds: { american: -110 } },
        } : undefined,
      },
    ],
    splits: {
      moneyline: {
        away: { handle: game.ml[2][0], tickets: game.ml[3][0] },
        home: { handle: game.ml[2][1], tickets: game.ml[3][1] },
      },
      spread: {
        away: { handle: game.spr[2][0], tickets: game.spr[3][0] },
        home: { handle: game.spr[2][1], tickets: game.spr[3][1] },
      },
      total: {
        over: { handle: game.tot[1][0], tickets: game.tot[2][0] },
        under: { handle: game.tot[1][1], tickets: game.tot[2][1] },
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
