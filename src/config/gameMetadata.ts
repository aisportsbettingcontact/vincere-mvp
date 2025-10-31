// Special game metadata - only add entries for games with specific TV info, stadiums, or primetime designations
// Most games will use intelligent defaults based on sport and day of week

export const GAME_METADATA: Record<string, {
  time?: string;
  tv?: string;
  stadium?: string;
  primetime?: string;
  specialLogo?: string;
}> = {
  // World Series Games
  "400127111": {
    time: "20:08",
    tv: "FOX",
    stadium: "Dodger Stadium",
    primetime: "World Series Game 5",
    specialLogo: "/worldseries.png"
  },
  // NFL International Games
  "401671705": {
    time: "09:30",
    tv: "NFL Network",
    stadium: "Allianz Arena • Munich, Germany",
    primetime: "NFL in Germany",
    specialLogo: "/nfl-berlin.png"
  },
  // Add more special games as needed
};

// Default game times by sport and day of week
export function getDefaultGameTime(sport: string, dayOfWeek: number): string {
  if (sport === "NFL") {
    if (dayOfWeek === 0) return "13:00"; // Sunday afternoon
    if (dayOfWeek === 1) return "20:15"; // Monday Night
    if (dayOfWeek === 4) return "20:15"; // Thursday Night
    return "13:00";
  }
  
  if (sport === "CFB") {
    if (dayOfWeek === 6) return "12:00"; // Saturday
    return "19:00";
  }
  
  if (sport === "NBA" || sport === "NHL") {
    return "19:00"; // Evening games
  }
  
  if (sport === "MLB") {
    if (dayOfWeek === 0) return "13:00"; // Sunday day games
    return "19:00";
  }
  
  if (sport === "CBB") {
    return "19:00";
  }
  
  return "13:00";
}

// Default TV networks by sport and day of week
export function getDefaultNetwork(sport: string, dayOfWeek: number): string {
  if (sport === "NFL") {
    if (dayOfWeek === 0) return "CBS/FOX";
    if (dayOfWeek === 1) return "ESPN";
    if (dayOfWeek === 4) return "Amazon Prime";
    return "TBD";
  }
  
  if (sport === "CFB") {
    return dayOfWeek === 6 ? "ABC/ESPN/FOX" : "ESPN";
  }
  
  if (sport === "NBA") return "TNT/ESPN";
  if (sport === "NHL") return "ESPN/TNT";
  if (sport === "MLB") return "TBS/ESPN";
  if (sport === "CBB") return "ESPN/CBS";
  
  return "TBD";
}

// Check if game is in primetime slot
export function isPrimeTimeSlot(sport: string, date: Date): boolean {
  const hour = date.getHours();
  const dayOfWeek = date.getDay();
  
  if (sport === "NFL") {
    return (dayOfWeek === 0 && hour >= 20) || dayOfWeek === 1 || dayOfWeek === 4;
  }
  
  if (sport === "CFB") {
    return hour >= 19;
  }
  
  return hour >= 19;
}

// Get primetime label
export function getPrimeTimeLabel(date: Date): string {
  const dayOfWeek = date.getDay();
  
  if (dayOfWeek === 1) return "Monday Night Football";
  if (dayOfWeek === 4) return "Thursday Night Football";
  if (dayOfWeek === 0) return "Sunday Night Football";
  
  return "Primetime";
}
