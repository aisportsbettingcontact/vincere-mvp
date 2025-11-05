import { useQuery } from "@tanstack/react-query";
import type { GameOdds } from "@/types/odds";
import vsinRawData from "@/data/vsin-splits-raw.json";
import { parseBookData, compareGames } from "@/utils/oddsParser";
import { validateResponse, type EdgeGuideLatestResponse } from "@/utils/oddsValidation";
import { transformVSiNData } from "@/utils/dataTransformer";

/**
 * Parse EdgeGuide data from all books and sports
 * Automatically filters out past games using dynamic date detection
 */
function parseEdgeGuideData(data: EdgeGuideLatestResponse): GameOdds[] {
  console.log("📊 ========== STARTING VSIN ODDS PARSING ==========");
  console.log(`📅 Data generated at: ${data.generated_at}`);
  console.log(`🌍 Timezone anchor: ${data.tz_anchor || 'Not provided'}`);
  
  const allGames: GameOdds[] = [];
  
  // Parse DK data for all sports
  if (data.books.DK) {
    console.log("🎰 Processing DraftKings (DK) data...");
    // IMPORTANT: After transformation, CFB→NCAAF and CBB→NCAAM
    const sports = ['NFL', 'MLB', 'NCAAF', 'NBA', 'NHL', 'NCAAM'] as const;
    sports.forEach(sport => {
      const sportData = data.books.DK?.[sport];
      if (sportData) {
        console.log(`\n--- ${sport} (DK) ---`);
        const games = parseBookData(sportData, "DK", sport);
        allGames.push(...games);
        console.log(`📊 Total DK ${sport} games: ${games.length}`);
      } else {
        console.log(`⚠️ No ${sport} data in DK`);
      }
    });
  } else {
    console.warn("⚠️ No DK data found in response");
  }
  
  // Parse CIRCA data for all sports
  if (data.books.CIRCA) {
    console.log("\n🎰 Processing Circa data...");
    // IMPORTANT: After transformation, CFB→NCAAF and CBB→NCAAM
    const sports = ['NFL', 'MLB', 'NCAAF', 'NBA', 'NHL', 'NCAAM'] as const;
    sports.forEach(sport => {
      const sportData = data.books.CIRCA?.[sport];
      if (sportData) {
        console.log(`\n--- ${sport} (CIRCA) ---`);
        const games = parseBookData(sportData, "CIRCA", sport);
        allGames.push(...games);
        console.log(`📊 Total CIRCA ${sport} games: ${games.length}`);
      } else {
        console.log(`⚠️ No ${sport} data in CIRCA`);
      }
    });
  } else {
    console.warn("⚠️ No CIRCA data found in response");
  }
  
  console.log(`\n🔢 Total games before sorting: ${allGames.length}`);
  
  // Sort games by date/time with sport priority on same day
  allGames.sort(compareGames);
  
  console.log(`\n✅ ========== PARSING COMPLETE ==========`);
  console.log(`✅ Successfully parsed ${allGames.length} live games`);
  console.log(`📊 Current time: ${new Date().toLocaleString()}`);
  
  if (allGames.length > 0) {
    console.log(`\n📋 First 3 games:`);
    allGames.slice(0, 3).forEach((game, i) => {
      console.log(`${i + 1}. [${game.sport}] ${game.away.name} @ ${game.home.name} - ${new Date(game.kickoff).toLocaleString()}`);
    });
  }
  
  return allGames;
}

/**
 * React Query hook for fetching live EdgeGuide odds data
 * 
 * Features:
 * - Automatic filtering of past games (no manual date updates needed)
 * - Data validation with Zod schemas
 * - Smart error handling and logging
 * - Intelligent metadata fallbacks
 */
export function useEdgeGuideData() {
  return useQuery({
    queryKey: ["edgeguide-data"],
    queryFn: async () => {
      try {
        console.log("\n🚀 ========== EDGEGUIDE DATA HOOK TRIGGERED ==========");
        console.log("📊 Loading and transforming latest VSIN odds data...");
        
        // Transform raw VSiN data to expected format
        const data = transformVSiNData(vsinRawData as any);
        
        console.log("🔍 Validating data structure...");
        // Validate data structure
        if (!validateResponse(data)) {
          console.error("❌ Validation failed!");
          throw new Error("Invalid data structure: Failed validation checks");
        }
        console.log("✅ Data structure validated");
        
        if (!data.books || !data.generated_at) {
          console.error("❌ Missing required fields");
          throw new Error("Invalid data structure: Missing required fields");
        }
        
        console.log("🎯 Starting data parsing...");
        const parsed = parseEdgeGuideData(data);
        
        console.log(`\n📊 Final result: ${parsed.length} games`);
        
        if (parsed.length === 0) {
          console.warn("⚠️ ========== WARNING: NO GAMES FOUND ==========");
          console.warn("⚠️ All games may be filtered out as past games");
          console.warn("⚠️ Check date filtering logic in gameFilters.ts");
        } else {
          console.log(`✅ Successfully returning ${parsed.length} games to UI`);
        }
        
        return parsed;
        
      } catch (error) {
        console.error("\n❌ ========== ERROR IN EDGEGUIDE HOOK ==========");
        console.error("❌ Error parsing odds data:", error);
        throw error;
      }
    },
    staleTime: Infinity,   // Static uploaded data never goes stale
    retry: 2,              // Retry failed requests twice
    throwOnError: false,   // Don't throw on error, let UI handle it
  });
}
