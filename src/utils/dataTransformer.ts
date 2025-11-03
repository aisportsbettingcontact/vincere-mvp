import type { EdgeGuideLatestResponse } from "@/utils/oddsValidation";

/**
 * Raw format from VSiN with rows array
 */
interface VSiNRawFormat {
  generated_at: string;
  tz_anchor: string;
  headers: string[];
  books: {
    [bookName: string]: {
      rows: Array<Array<string | number>>;
    };
  };
}

/**
 * Transform VSiN raw format to EdgeGuide format
 */
export function transformVSiNData(rawData: VSiNRawFormat): EdgeGuideLatestResponse {
  console.log("🔄 [TRANSFORMER] Starting data transformation...");
  
  const transformed: EdgeGuideLatestResponse = {
    generated_at: rawData.generated_at,
    tz_anchor: rawData.tz_anchor,
    books: {}
  };

  // Process each book
  Object.entries(rawData.books).forEach(([bookName, bookData]) => {
    console.log(`📚 [TRANSFORMER] Processing book: ${bookName}`);
    
    // Map book name (DraftKings -> DK, Circa -> CIRCA)
    const normalizedBookName = bookName === "DraftKings" ? "DK" : "CIRCA";
    
    // Initialize book structure
    transformed.books[normalizedBookName] = {};
    
    // Group rows by sport and date
    const sportGroups: Record<string, Record<string, any[]>> = {};
    
    bookData.rows.forEach((row) => {
      const [
        market,
        yyyymmdd,
        game_id,
        away_slug,
        away_name,
        home_slug,
        home_name,
        spread_away,
        spread_home,
        spread_handle_away,
        spread_handle_home,
        spread_bets_away,
        spread_bets_home,
        total,
        total_handle_over,
        total_handle_under,
        total_bets_over,
        total_bets_under,
        money_away,
        money_home,
        money_handle_away,
        money_handle_home,
        money_bets_away,
        money_bets_home,
        book
      ] = row;
      
      // Normalize sport name
      const sport = String(market).toUpperCase();
      const date = String(yyyymmdd);
      
      // Initialize sport group if needed
      if (!sportGroups[sport]) {
        sportGroups[sport] = {};
      }
      if (!sportGroups[sport][date]) {
        sportGroups[sport][date] = [];
      }
      
      // Transform to expected format
      const gameData = {
        id: String(game_id),
        d: date,
        a: String(away_slug),
        h: String(home_slug),
        spr: [
          Number(spread_away),
          Number(spread_home),
          [Number(spread_handle_away), Number(spread_handle_home)],
          [Number(spread_bets_away), Number(spread_bets_home)]
        ],
        tot: [
          Number(total),
          [Number(total_handle_over), Number(total_handle_under)],
          [Number(total_bets_over), Number(total_bets_under)]
        ],
        ml: [
          money_away !== null ? Number(money_away) : null,
          money_home !== null ? Number(money_home) : null,
          [Number(money_handle_away), Number(money_handle_home)],
          [Number(money_bets_away), Number(money_bets_home)]
        ],
        b: normalizedBookName,
        s: sport
      };
      
      sportGroups[sport][date].push(gameData);
    });
    
    // Add grouped data to transformed structure
    Object.entries(sportGroups).forEach(([sport, dates]) => {
      transformed.books[normalizedBookName]![sport] = dates;
      console.log(`  ✅ ${sport}: ${Object.keys(dates).length} dates, ${Object.values(dates).flat().length} games`);
    });
  });
  
  console.log("✅ [TRANSFORMER] Transformation complete");
  return transformed;
}
