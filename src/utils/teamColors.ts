// NFL Team Colors - Official hex codes
export const NFL_TEAM_COLORS: Record<string, {
  primary: string;
  secondary: string;
  tertiary: string;
}> = {
  // AFC North
  "Baltimore Ravens": { primary: "#241773", secondary: "#000000", tertiary: "#9E7C0C" },
  "Cincinnati Bengals": { primary: "#FB4F14", secondary: "#000000", tertiary: "#FFFFFF" },
  "Cleveland Browns": { primary: "#311D00", secondary: "#FF3C00", tertiary: "#FFFFFF" },
  "Pittsburgh Steelers": { primary: "#FFB612", secondary: "#101820", tertiary: "#003087" },
  
  // AFC East
  "Buffalo Bills": { primary: "#00338D", secondary: "#C60C30", tertiary: "#FFFFFF" },
  "Miami Dolphins": { primary: "#008E97", secondary: "#FC4C02", tertiary: "#005778" },
  "New England Patriots": { primary: "#002244", secondary: "#C60C30", tertiary: "#B0B7BC" },
  "New York Jets": { primary: "#125740", secondary: "#000000", tertiary: "#FFFFFF" },
  
  // AFC South
  "Houston Texans": { primary: "#03202F", secondary: "#A71930", tertiary: "#FFFFFF" },
  "Indianapolis Colts": { primary: "#002C5F", secondary: "#FFFFFF", tertiary: "#A2AAAD" },
  "Jacksonville Jaguars": { primary: "#006778", secondary: "#101820", tertiary: "#D7A22A" },
  "Tennessee Titans": { primary: "#0C2340", secondary: "#4B92DB", tertiary: "#C8102E" },
  
  // AFC West
  "Denver Broncos": { primary: "#FB4F14", secondary: "#002244", tertiary: "#FFFFFF" },
  "Kansas City Chiefs": { primary: "#E31837", secondary: "#FFB81C", tertiary: "#FFFFFF" },
  "Las Vegas Raiders": { primary: "#000000", secondary: "#A5ACAF", tertiary: "#FFFFFF" },
  "Los Angeles Chargers": { primary: "#0080C6", secondary: "#FFC20E", tertiary: "#FFFFFF" },
  
  // NFC North
  "Chicago Bears": { primary: "#0B162A", secondary: "#C83803", tertiary: "#FFFFFF" },
  "Detroit Lions": { primary: "#0076B6", secondary: "#B0B7BC", tertiary: "#000000" },
  "Green Bay Packers": { primary: "#203731", secondary: "#FFB612", tertiary: "#FFFFFF" },
  "Minnesota Vikings": { primary: "#4F2683", secondary: "#FFC62F", tertiary: "#FFFFFF" },
  
  // NFC East
  "Dallas Cowboys": { primary: "#003594", secondary: "#041E42", tertiary: "#869397" },
  "New York Giants": { primary: "#0B2265", secondary: "#A71930", tertiary: "#A5ACAF" },
  "Philadelphia Eagles": { primary: "#004C54", secondary: "#A5ACAF", tertiary: "#000000" },
  "Washington Commanders": { primary: "#5A1414", secondary: "#FFB612", tertiary: "#000000" },
  
  // NFC South
  "Atlanta Falcons": { primary: "#A71930", secondary: "#000000", tertiary: "#A5ACAF" },
  "Carolina Panthers": { primary: "#0085CA", secondary: "#101820", tertiary: "#BFC0BF" },
  "New Orleans Saints": { primary: "#D3BC8D", secondary: "#101820", tertiary: "#FFFFFF" },
  "Tampa Bay Buccaneers": { primary: "#D50A0A", secondary: "#34302B", tertiary: "#FF7900" },
  
  // NFC West
  "Arizona Cardinals": { primary: "#97233F", secondary: "#000000", tertiary: "#FFB612" },
  "Los Angeles Rams": { primary: "#003594", secondary: "#FFD100", tertiary: "#FFFFFF" },
  "San Francisco 49ers": { primary: "#AA0000", secondary: "#B3995D", tertiary: "#000000" },
  "Seattle Seahawks": { primary: "#002244", secondary: "#69BE28", tertiary: "#A5ACAF" },
};

/**
 * Get the primary team color by team name
 */
export function getTeamPrimaryColor(teamName: string): string {
  return NFL_TEAM_COLORS[teamName]?.primary || "#6F74FF"; // Fallback to app primary color
}

/**
 * Get the secondary team color by team name
 */
export function getTeamSecondaryColor(teamName: string): string {
  return NFL_TEAM_COLORS[teamName]?.secondary || "#000000";
}

/**
 * Get all colors for a team
 */
export function getTeamColors(teamName: string) {
  return NFL_TEAM_COLORS[teamName] || {
    primary: "#6F74FF",
    secondary: "#000000",
    tertiary: "#FFFFFF"
  };
}
