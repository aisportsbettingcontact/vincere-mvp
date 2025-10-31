import { useQuery } from "@tanstack/react-query";
import type { GameOdds } from "@/types/odds";
import latestOddsData from "@/data/latest-odds.json";
import { parseBookData, compareGames } from "@/utils/oddsParser";
import { validateResponse, type EdgeGuideLatestResponse } from "@/utils/oddsValidation";

/**
 * Parse EdgeGuide data from all books and sports
 * Automatically filters out past games using dynamic date detection
 */
function parseEdgeGuideData(data: EdgeGuideLatestResponse): GameOdds[] {
  console.log("📊 Parsing live VSIN odds data...");
  
  const allGames: GameOdds[] = [];
  
  // Parse DK data for all sports
  if (data.books.DK) {
    const sports = ['NFL', 'MLB', 'CFB', 'NBA', 'NHL', 'CBB'] as const;
    sports.forEach(sport => {
      const sportData = data.books.DK?.[sport];
      if (sportData) {
        const games = parseBookData(sportData, "DK", sport);
        allGames.push(...games);
      }
    });
  }
  
  // Parse CIRCA data for all sports
  if (data.books.CIRCA) {
    const sports = ['NFL', 'MLB', 'CFB', 'NHL', 'CBB'] as const;
    sports.forEach(sport => {
      const sportData = data.books.CIRCA?.[sport];
      if (sportData) {
        const games = parseBookData(sportData, "CIRCA", sport);
        allGames.push(...games);
      }
    });
  }
  
  // Sort games by date/time with sport priority on same day
  allGames.sort(compareGames);
  
  console.log(`✅ Successfully parsed ${allGames.length} live games`);
  console.log(`📅 Data generated at: ${data.generated_at}`);
  
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
        console.log("📊 Loading latest VSIN odds data...");
        const data = latestOddsData as unknown as EdgeGuideLatestResponse;
        
        // Validate data structure
        if (!validateResponse(data)) {
          throw new Error("Invalid data structure: Failed validation checks");
        }
        
        if (!data.books || !data.generated_at) {
          throw new Error("Invalid data structure: Missing required fields");
        }
        
        const parsed = parseEdgeGuideData(data);
        
        if (parsed.length === 0) {
          console.warn("⚠️ No games found - all games may be in the past");
        }
        
        return parsed;
        
      } catch (error) {
        console.error("❌ Error parsing odds data:", error);
        throw error;
      }
    },
    staleTime: Infinity,   // Static uploaded data never goes stale
    retry: 2,              // Retry failed requests twice
    throwOnError: false,   // Don't throw on error, let UI handle it
  });
}
