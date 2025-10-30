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

// NBA Team Colors - Official hex codes
export const NBA_TEAM_COLORS: Record<string, {
  primary: string;
  secondary: string;
  tertiary: string;
}> = {
  "Atlanta Hawks": { primary: "#E03A3E", secondary: "#C1D32F", tertiary: "#26282A" },
  "Boston Celtics": { primary: "#007A33", secondary: "#BA9653", tertiary: "#000000" },
  "Brooklyn Nets": { primary: "#000000", secondary: "#FFFFFF", tertiary: "#C4CED4" },
  "Charlotte Hornets": { primary: "#00788C", secondary: "#1D1160", tertiary: "#A1A1A4" },
  "Chicago Bulls": { primary: "#CE1141", secondary: "#000000", tertiary: "#FFFFFF" },
  "Cleveland Cavaliers": { primary: "#6F263D", secondary: "#FFB81C", tertiary: "#041E42" },
  "Dallas Mavericks": { primary: "#00538C", secondary: "#002B5E", tertiary: "#B8C4CA" },
  "Denver Nuggets": { primary: "#0E2240", secondary: "#FEC524", tertiary: "#8B2131" },
  "Detroit Pistons": { primary: "#C8102E", secondary: "#1D42BA", tertiary: "#BEC0C2" },
  "Golden State Warriors": { primary: "#1D428A", secondary: "#FFC72C", tertiary: "#FFFFFF" },
  "Houston Rockets": { primary: "#CE1141", secondary: "#000000", tertiary: "#C4CED4" },
  "Indiana Pacers": { primary: "#002D62", secondary: "#FDBB30", tertiary: "#BEC0C2" },
  "Los Angeles Clippers": { primary: "#1D428A", secondary: "#C8102E", tertiary: "#000000" },
  "Los Angeles Lakers": { primary: "#552583", secondary: "#F9A01B", tertiary: "#000000" },
  "Memphis Grizzlies": { primary: "#12173F", secondary: "#5D76A9", tertiary: "#707271" },
  "Miami Heat": { primary: "#98002E", secondary: "#F9A01B", tertiary: "#000000" },
  "Milwaukee Bucks": { primary: "#00471B", secondary: "#EEE1C6", tertiary: "#0077C0" },
  "Minnesota Timberwolves": { primary: "#0C2340", secondary: "#236192", tertiary: "#78BE20" },
  "New Orleans Pelicans": { primary: "#002B5C", secondary: "#E31837", tertiary: "#B4975A" },
  "New York Knicks": { primary: "#006BB6", secondary: "#F58426", tertiary: "#BEC0C2" },
  "Oklahoma City Thunder": { primary: "#007AC1", secondary: "#F05133", tertiary: "#FDBB30" },
  "Orlando Magic": { primary: "#0077C0", secondary: "#000000", tertiary: "#C4CED4" },
  "Philadelphia 76ers": { primary: "#006BB6", secondary: "#ED174C", tertiary: "#C4CED4" },
  "Phoenix Suns": { primary: "#1D1160", secondary: "#E56020", tertiary: "#000000" },
  "Portland Trail Blazers": { primary: "#E03A3E", secondary: "#000000", tertiary: "#C4CED4" },
  "Sacramento Kings": { primary: "#5A2D81", secondary: "#63727A", tertiary: "#000000" },
  "San Antonio Spurs": { primary: "#000000", secondary: "#C4CED4", tertiary: "#FFFFFF" },
  "Toronto Raptors": { primary: "#CE1141", secondary: "#000000", tertiary: "#A1A1A4" },
  "Utah Jazz": { primary: "#002B5C", secondary: "#F9A01B", tertiary: "#00471B" },
  "Washington Wizards": { primary: "#E31837", secondary: "#002B5C", tertiary: "#C4CED4" },
};

// NHL Team Colors - Official hex codes
export const NHL_TEAM_COLORS: Record<string, {
  primary: string;
  secondary: string;
  tertiary: string;
}> = {
  "Anaheim Ducks": { primary: "#F47A38", secondary: "#B9975B", tertiary: "#000000" },
  "Boston Bruins": { primary: "#FFB81C", secondary: "#000000", tertiary: "#FFFFFF" },
  "Buffalo Sabres": { primary: "#002654", secondary: "#FCB514", tertiary: "#FFFFFF" },
  "Calgary Flames": { primary: "#C8102E", secondary: "#F1BE48", tertiary: "#111111" },
  "Carolina Hurricanes": { primary: "#CC0000", secondary: "#000000", tertiary: "#A2AAAD" },
  "Chicago Blackhawks": { primary: "#CF0A2C", secondary: "#000000", tertiary: "#FFFFFF" },
  "Colorado Avalanche": { primary: "#6F263D", secondary: "#236192", tertiary: "#A2AAAD" },
  "Columbus Blue Jackets": { primary: "#002654", secondary: "#CE1126", tertiary: "#A4A9AD" },
  "Dallas Stars": { primary: "#006847", secondary: "#8F8F8C", tertiary: "#111111" },
  "Detroit Red Wings": { primary: "#CE1126", secondary: "#FFFFFF", tertiary: "#000000" },
  "Edmonton Oilers": { primary: "#041E42", secondary: "#FF4C00", tertiary: "#FFFFFF" },
  "Florida Panthers": { primary: "#041E42", secondary: "#C8102E", tertiary: "#B9975B" },
  "Los Angeles Kings": { primary: "#111111", secondary: "#A2AAAD", tertiary: "#FFFFFF" },
  "Minnesota Wild": { primary: "#154734", secondary: "#DDCBA4", tertiary: "#A6192E" },
  "Montreal Canadiens": { primary: "#AF1E2D", secondary: "#192168", tertiary: "#FFFFFF" },
  "Nashville Predators": { primary: "#FFB81C", secondary: "#041E42", tertiary: "#FFFFFF" },
  "New Jersey Devils": { primary: "#CE1126", secondary: "#000000", tertiary: "#FFFFFF" },
  "New York Islanders": { primary: "#00539B", secondary: "#F47D30", tertiary: "#FFFFFF" },
  "New York Rangers": { primary: "#0038A8", secondary: "#CE1126", tertiary: "#FFFFFF" },
  "Ottawa Senators": { primary: "#C52032", secondary: "#C2912C", tertiary: "#000000" },
  "Philadelphia Flyers": { primary: "#F74902", secondary: "#000000", tertiary: "#FFFFFF" },
  "Pittsburgh Penguins": { primary: "#000000", secondary: "#CFC493", tertiary: "#FCB514" },
  "San Jose Sharks": { primary: "#006D75", secondary: "#EA7200", tertiary: "#000000" },
  "Seattle Kraken": { primary: "#001628", secondary: "#99D9D9", tertiary: "#E9072B" },
  "St. Louis Blues": { primary: "#002F87", secondary: "#FCB514", tertiary: "#041E42" },
  "Tampa Bay Lightning": { primary: "#002868", secondary: "#FFFFFF", tertiary: "#000000" },
  "Toronto Maple Leafs": { primary: "#00205B", secondary: "#FFFFFF", tertiary: "#000000" },
  "Utah Hockey Club": { primary: "#69B3E7", secondary: "#000000", tertiary: "#FFFFFF" },
  "Vancouver Canucks": { primary: "#00205B", secondary: "#00843D", tertiary: "#041C2C" },
  "Vegas Golden Knights": { primary: "#B4975A", secondary: "#333F42", tertiary: "#C8102E" },
  "Washington Capitals": { primary: "#041E42", secondary: "#C8102E", tertiary: "#FFFFFF" },
  "Winnipeg Jets": { primary: "#041E42", secondary: "#004C97", tertiary: "#A2AAAD" }
};

/**
 * Get the primary team color by team name
 */
export function getTeamPrimaryColor(teamName: string, sport: string = "NFL"): string {
  const colors = sport === "NBA" ? NBA_TEAM_COLORS : sport === "NHL" ? NHL_TEAM_COLORS : NFL_TEAM_COLORS;
  return colors[teamName]?.primary || "#6F74FF"; // Fallback to app primary color
}

/**
 * Get the secondary team color by team name
 */
export function getTeamSecondaryColor(teamName: string, sport: string = "NFL"): string {
  const colors = sport === "NBA" ? NBA_TEAM_COLORS : sport === "NHL" ? NHL_TEAM_COLORS : NFL_TEAM_COLORS;
  return colors[teamName]?.secondary || "#000000";
}

/**
 * Get all colors for a team
 */
export function getTeamColors(teamName: string, sport: string = "NFL") {
  const colors = sport === "NBA" ? NBA_TEAM_COLORS : sport === "NHL" ? NHL_TEAM_COLORS : NFL_TEAM_COLORS;
  return colors[teamName] || {
    primary: "#6F74FF",
    secondary: "#000000",
    tertiary: "#FFFFFF"
  };
}
