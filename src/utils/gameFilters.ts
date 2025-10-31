// Dynamic date and time filtering utilities

/**
 * Check if a game is in the future based on date string and time
 * @param dateStr - Date in YYYYMMDD format (e.g., "20251030")
 * @param gameTime - Time in HH:MM format (e.g., "13:00")
 * @returns true if game is in the future
 */
export function isGameInFuture(dateStr: string, gameTime: string = "13:00"): boolean {
  if (!dateStr || dateStr.length !== 8) {
    console.warn(`Invalid date format: ${dateStr}`);
    return false;
  }
  
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  
  // Create date in UTC to avoid timezone issues
  const gameDateTime = new Date(`${year}-${month}-${day}T${gameTime}:00Z`);
  
  // Add buffer of 4 hours after game start to keep recently finished games
  const bufferMs = 4 * 60 * 60 * 1000;
  const gameWithBuffer = gameDateTime.getTime() + bufferMs;
  
  return gameWithBuffer > Date.now();
}

/**
 * Filter games to only include future games
 * @param games - Array of games with a 'd' (date) property
 * @param getGameTime - Function to get the game time for a specific game
 * @returns Filtered array of future games
 */
export function filterFutureGames<T extends { d: string; id?: string }>(
  games: T[],
  getGameTime: (game: T) => string = () => "13:00"
): T[] {
  return games.filter(game => isGameInFuture(game.d, getGameTime(game)));
}

/**
 * Check if a date string represents today
 * @param dateStr - Date in YYYYMMDD format
 * @returns true if date is today
 */
export function isToday(dateStr: string): boolean {
  if (!dateStr || dateStr.length !== 8) return false;
  
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  
  return dateStr === todayStr;
}

/**
 * Check if a date string represents tomorrow
 * @param dateStr - Date in YYYYMMDD format
 * @returns true if date is tomorrow
 */
export function isTomorrow(dateStr: string): boolean {
  if (!dateStr || dateStr.length !== 8) return false;
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10).replace(/-/g, '');
  
  return dateStr === tomorrowStr;
}
