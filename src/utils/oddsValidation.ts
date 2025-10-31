import { z } from 'zod';

// Zod schema for raw split game data
export const RawSplitGameSchema = z.object({
  id: z.string(),
  d: z.string().length(8), // Date in YYYYMMDD format
  a: z.string(), // Away team
  h: z.string(), // Home team
  spr: z.tuple([
    z.number().nullable(), // Spread line (can be null)
    z.number().nullable(), // Away spread odds (can be null)
    z.tuple([z.number(), z.number()]), // [away tickets%, away handle%]
    z.tuple([z.number(), z.number()])  // [home tickets%, home handle%]
  ]),
  tot: z.tuple([
    z.number().nullable(), // Total line (can be null)
    z.tuple([z.number(), z.number()]), // [over tickets%, over handle%]
    z.tuple([z.number(), z.number()])  // [under tickets%, under handle%]
  ]),
  ml: z.tuple([
    z.number().nullable(), // Away ML (can be null)
    z.number().nullable(), // Home ML (can be null)
    z.tuple([z.number(), z.number()]), // [away tickets%, away handle%]
    z.tuple([z.number(), z.number()])  // [home tickets%, home handle%]
  ]),
  b: z.string(), // Book
  s: z.string()  // Sport
});

export type RawSplitGame = z.infer<typeof RawSplitGameSchema>;

// Schema for the entire response
export const EdgeGuideLatestResponseSchema = z.object({
  generated_at: z.string(),
  tz_anchor: z.string().optional(), // Timezone anchor (e.g., "UTC-10:00")
  books: z.object({
    DK: z.object({
      NFL: z.record(z.string(), z.array(RawSplitGameSchema)).optional(),
      MLB: z.record(z.string(), z.array(RawSplitGameSchema)).optional(),
      CFB: z.record(z.string(), z.array(RawSplitGameSchema)).optional(),
      NBA: z.record(z.string(), z.array(RawSplitGameSchema)).optional(),
      NHL: z.record(z.string(), z.array(RawSplitGameSchema)).optional(),
      CBB: z.record(z.string(), z.array(RawSplitGameSchema)).optional(),
    }).optional(),
    CIRCA: z.object({
      NFL: z.record(z.string(), z.array(RawSplitGameSchema)).optional(),
      MLB: z.record(z.string(), z.array(RawSplitGameSchema)).optional(),
      CFB: z.record(z.string(), z.array(RawSplitGameSchema)).optional(),
      NBA: z.record(z.string(), z.array(RawSplitGameSchema)).optional(),
      NHL: z.record(z.string(), z.array(RawSplitGameSchema)).optional(),
      CBB: z.record(z.string(), z.array(RawSplitGameSchema)).optional(),
    }).optional(),
  })
});

export type EdgeGuideLatestResponse = z.infer<typeof EdgeGuideLatestResponseSchema>;

/**
 * Validate game data structure
 * @param game - Raw game object from API
 * @returns true if valid, false otherwise
 */
export function validateGameData(game: any): game is RawSplitGame {
  try {
    RawSplitGameSchema.parse(game);
    return true;
  } catch (error) {
    console.warn('Invalid game data structure:', game, error);
    return false;
  }
}

/**
 * Validate entire response structure
 * @param data - Raw response from API
 * @returns true if valid, false otherwise
 */
export function validateResponse(data: any): data is EdgeGuideLatestResponse {
  try {
    EdgeGuideLatestResponseSchema.parse(data);
    console.log("✅ Zod validation passed");
    return true;
  } catch (error: any) {
    console.error('❌ Zod validation failed with detailed errors:');
    if (error.errors) {
      error.errors.forEach((err: any) => {
        console.error(`  Path: ${err.path.join('.')} | Message: ${err.message}`);
      });
    }
    console.error('Full error:', error);
    return false;
  }
}

/**
 * Safely parse game data with validation
 * @param games - Array of raw game objects
 * @returns Array of validated games
 */
export function safeParseGames(games: any[]): RawSplitGame[] {
  return games.filter(validateGameData);
}
