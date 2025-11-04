import { CFB_TEAM_MAPPINGS } from "./cfbTeamMappings";
import { teamMappingLogger } from "./teamMappingLogger";

// Map team slugs to display names and ESPN abbreviations
export const NFL_TEAM_MAPPINGS: Record<string, { name: string; abbr: string; espnAbbr: string; fullName: string; logoSlug: string }> = {
  "arizona-cardinals": { name: "Cardinals", abbr: "ARI", espnAbbr: "ari", fullName: "Arizona Cardinals", logoSlug: "arizona-cardinals" },
  "atlanta-falcons": { name: "Falcons", abbr: "ATL", espnAbbr: "atl", fullName: "Atlanta Falcons", logoSlug: "atlanta-falcons" },
  "baltimore-ravens": { name: "Ravens", abbr: "BAL", espnAbbr: "bal", fullName: "Baltimore Ravens", logoSlug: "baltimore-ravens" },
  "buffalo-bills": { name: "Bills", abbr: "BUF", espnAbbr: "buf", fullName: "Buffalo Bills", logoSlug: "buffalo-bills" },
  "carolina-panthers": { name: "Panthers", abbr: "CAR", espnAbbr: "car", fullName: "Carolina Panthers", logoSlug: "carolina-panthers" },
  "chicago-bears": { name: "Bears", abbr: "CHI", espnAbbr: "chi", fullName: "Chicago Bears", logoSlug: "chicago-bears" },
  "cincinnati-bengals": { name: "Bengals", abbr: "CIN", espnAbbr: "cin", fullName: "Cincinnati Bengals", logoSlug: "cincinnati-bengals" },
  "cleveland-browns": { name: "Browns", abbr: "CLE", espnAbbr: "cle", fullName: "Cleveland Browns", logoSlug: "cleveland-browns" },
  "dallas-cowboys": { name: "Cowboys", abbr: "DAL", espnAbbr: "dal", fullName: "Dallas Cowboys", logoSlug: "dallas-cowboys" },
  "denver-broncos": { name: "Broncos", abbr: "DEN", espnAbbr: "den", fullName: "Denver Broncos", logoSlug: "denver-broncos" },
  "detroit-lions": { name: "Lions", abbr: "DET", espnAbbr: "det", fullName: "Detroit Lions", logoSlug: "detroit-lions" },
  "green-bay-packers": { name: "Packers", abbr: "GB", espnAbbr: "gb", fullName: "Green Bay Packers", logoSlug: "green-bay-packers" },
  "houston-texans": { name: "Texans", abbr: "HOU", espnAbbr: "hou", fullName: "Houston Texans", logoSlug: "houston-texans" },
  "indianapolis-colts": { name: "Colts", abbr: "IND", espnAbbr: "ind", fullName: "Indianapolis Colts", logoSlug: "indianapolis-colts" },
  "jacksonville-jaguars": { name: "Jaguars", abbr: "JAX", espnAbbr: "jax", fullName: "Jacksonville Jaguars", logoSlug: "jacksonville-jaguars" },
  "kansas-city-chiefs": { name: "Chiefs", abbr: "KC", espnAbbr: "kc", fullName: "Kansas City Chiefs", logoSlug: "kansas-city-chiefs" },
  "las-vegas-raiders": { name: "Raiders", abbr: "LV", espnAbbr: "lv", fullName: "Las Vegas Raiders", logoSlug: "las-vegas-raiders" },
  "los-angeles-chargers": { name: "Chargers", abbr: "LAC", espnAbbr: "lac", fullName: "Los Angeles Chargers", logoSlug: "los-angeles-chargers" },
  "los-angeles-rams": { name: "Rams", abbr: "LAR", espnAbbr: "lar", fullName: "Los Angeles Rams", logoSlug: "los-angeles-rams" },
  "miami-dolphins": { name: "Dolphins", abbr: "MIA", espnAbbr: "mia", fullName: "Miami Dolphins", logoSlug: "miami-dolphins" },
  "minnesota-vikings": { name: "Vikings", abbr: "MIN", espnAbbr: "min", fullName: "Minnesota Vikings", logoSlug: "minnesota-vikings" },
  "new-england-patriots": { name: "Patriots", abbr: "NE", espnAbbr: "ne", fullName: "New England Patriots", logoSlug: "new-england-patriots" },
  "new-orleans-saints": { name: "Saints", abbr: "NO", espnAbbr: "no", fullName: "New Orleans Saints", logoSlug: "new-orleans-saints" },
  "new-york-giants": { name: "Giants", abbr: "NYG", espnAbbr: "nyg", fullName: "New York Giants", logoSlug: "new-york-giants" },
  "new-york-jets": { name: "Jets", abbr: "NYJ", espnAbbr: "nyj", fullName: "New York Jets", logoSlug: "new-york-jets" },
  "philadelphia-eagles": { name: "Eagles", abbr: "PHI", espnAbbr: "phi", fullName: "Philadelphia Eagles", logoSlug: "philadelphia-eagles" },
  "pittsburgh-steelers": { name: "Steelers", abbr: "PIT", espnAbbr: "pit", fullName: "Pittsburgh Steelers", logoSlug: "pittsburgh-steelers" },
  "san-francisco-49ers": { name: "49ers", abbr: "SF", espnAbbr: "sf", fullName: "San Francisco 49ers", logoSlug: "san-francisco-49ers" },
  "seattle-seahawks": { name: "Seahawks", abbr: "SEA", espnAbbr: "sea", fullName: "Seattle Seahawks", logoSlug: "seattle-seahawks" },
  "tampa-bay-buccaneers": { name: "Buccaneers", abbr: "TB", espnAbbr: "tb", fullName: "Tampa Bay Buccaneers", logoSlug: "tampa-bay-buccaneers" },
  "tennessee-titans": { name: "Titans", abbr: "TEN", espnAbbr: "ten", fullName: "Tennessee Titans", logoSlug: "tennessee-titans" },
  "washington-commanders": { name: "Commanders", abbr: "WAS", espnAbbr: "wsh", fullName: "Washington Commanders", logoSlug: "washington-commanders" }
};

export const NBA_TEAM_MAPPINGS: Record<string, { name: string; abbr: string; espnAbbr: string; fullName: string }> = {
  "atlanta-hawks": { name: "Hawks", abbr: "ATL", espnAbbr: "atl", fullName: "Atlanta Hawks" },
  "boston-celtics": { name: "Celtics", abbr: "BOS", espnAbbr: "bos", fullName: "Boston Celtics" },
  "brooklyn-nets": { name: "Nets", abbr: "BKN", espnAbbr: "bkn", fullName: "Brooklyn Nets" },
  "charlotte-hornets": { name: "Hornets", abbr: "CHA", espnAbbr: "cha", fullName: "Charlotte Hornets" },
  "chicago-bulls": { name: "Bulls", abbr: "CHI", espnAbbr: "chi", fullName: "Chicago Bulls" },
  "cleveland-cavaliers": { name: "Cavaliers", abbr: "CLE", espnAbbr: "cle", fullName: "Cleveland Cavaliers" },
  "dallas-mavericks": { name: "Mavericks", abbr: "DAL", espnAbbr: "dal", fullName: "Dallas Mavericks" },
  "denver-nuggets": { name: "Nuggets", abbr: "DEN", espnAbbr: "den", fullName: "Denver Nuggets" },
  "detroit-pistons": { name: "Pistons", abbr: "DET", espnAbbr: "det", fullName: "Detroit Pistons" },
  "golden-state-warriors": { name: "Warriors", abbr: "GS", espnAbbr: "gs", fullName: "Golden State Warriors" },
  "houston-rockets": { name: "Rockets", abbr: "HOU", espnAbbr: "hou", fullName: "Houston Rockets" },
  "indiana-pacers": { name: "Pacers", abbr: "IND", espnAbbr: "ind", fullName: "Indiana Pacers" },
  "la-lakers": { name: "Lakers", abbr: "LAL", espnAbbr: "lal", fullName: "Los Angeles Lakers" },
  "la-clippers": { name: "Clippers", abbr: "LAC", espnAbbr: "lac", fullName: "Los Angeles Clippers" },
  "memphis-grizzlies": { name: "Grizzlies", abbr: "MEM", espnAbbr: "mem", fullName: "Memphis Grizzlies" },
  "miami-heat": { name: "Heat", abbr: "MIA", espnAbbr: "mia", fullName: "Miami Heat" },
  "milwaukee-bucks": { name: "Bucks", abbr: "MIL", espnAbbr: "mil", fullName: "Milwaukee Bucks" },
  "minnesota-timberwolves": { name: "Timberwolves", abbr: "MIN", espnAbbr: "min", fullName: "Minnesota Timberwolves" },
  "new-orleans-pelicans": { name: "Pelicans", abbr: "NO", espnAbbr: "no", fullName: "New Orleans Pelicans" },
  "new-york-knicks": { name: "Knicks", abbr: "NY", espnAbbr: "ny", fullName: "New York Knicks" },
  "oklahoma-city-thunder": { name: "Thunder", abbr: "OKC", espnAbbr: "okc", fullName: "Oklahoma City Thunder" },
  "orlando-magic": { name: "Magic", abbr: "ORL", espnAbbr: "orl", fullName: "Orlando Magic" },
  "philadelphia-76ers": { name: "76ers", abbr: "PHI", espnAbbr: "phi", fullName: "Philadelphia 76ers" },
  "phoenix-suns": { name: "Suns", abbr: "PHX", espnAbbr: "phx", fullName: "Phoenix Suns" },
  "portland-trail-blazers": { name: "Trail Blazers", abbr: "POR", espnAbbr: "por", fullName: "Portland Trail Blazers" },
  "sacramento-kings": { name: "Kings", abbr: "SAC", espnAbbr: "sac", fullName: "Sacramento Kings" },
  "san-antonio-spurs": { name: "Spurs", abbr: "SA", espnAbbr: "sa", fullName: "San Antonio Spurs" },
  "toronto-raptors": { name: "Raptors", abbr: "TOR", espnAbbr: "tor", fullName: "Toronto Raptors" },
  "utah-jazz": { name: "Jazz", abbr: "UTA", espnAbbr: "utah", fullName: "Utah Jazz" },
  "washington-wizards": { name: "Wizards", abbr: "WAS", espnAbbr: "wsh", fullName: "Washington Wizards" }
};

export const NHL_TEAM_MAPPINGS: Record<string, { name: string; abbr: string; espnAbbr: string; fullName: string }> = {
  "anaheim-ducks": { name: "Ducks", abbr: "ANA", espnAbbr: "ana", fullName: "Anaheim Ducks" },
  "boston-bruins": { name: "Bruins", abbr: "BOS", espnAbbr: "bos", fullName: "Boston Bruins" },
  "buffalo-sabres": { name: "Sabres", abbr: "BUF", espnAbbr: "buf", fullName: "Buffalo Sabres" },
  "calgary-flames": { name: "Flames", abbr: "CGY", espnAbbr: "cgy", fullName: "Calgary Flames" },
  "carolina-hurricanes": { name: "Hurricanes", abbr: "CAR", espnAbbr: "car", fullName: "Carolina Hurricanes" },
  "chicago-blackhawks": { name: "Blackhawks", abbr: "CHI", espnAbbr: "chi", fullName: "Chicago Blackhawks" },
  "colorado-avalanche": { name: "Avalanche", abbr: "COL", espnAbbr: "col", fullName: "Colorado Avalanche" },
  "columbus-blue-jackets": { name: "Blue Jackets", abbr: "CBJ", espnAbbr: "cbj", fullName: "Columbus Blue Jackets" },
  "dallas-stars": { name: "Stars", abbr: "DAL", espnAbbr: "dal", fullName: "Dallas Stars" },
  "detroit-red-wings": { name: "Red Wings", abbr: "DET", espnAbbr: "det", fullName: "Detroit Red Wings" },
  "edmonton-oilers": { name: "Oilers", abbr: "EDM", espnAbbr: "edm", fullName: "Edmonton Oilers" },
  "florida-panthers": { name: "Panthers", abbr: "FLA", espnAbbr: "fla", fullName: "Florida Panthers" },
  "los-angeles-kings": { name: "Kings", abbr: "LAK", espnAbbr: "la", fullName: "Los Angeles Kings" },
  "minnesota-wild": { name: "Wild", abbr: "MIN", espnAbbr: "min", fullName: "Minnesota Wild" },
  "montreal-canadiens": { name: "Canadiens", abbr: "MTL", espnAbbr: "mtl", fullName: "Montreal Canadiens" },
  "nashville-predators": { name: "Predators", abbr: "NSH", espnAbbr: "nsh", fullName: "Nashville Predators" },
  "new-jersey-devils": { name: "Devils", abbr: "NJD", espnAbbr: "nj", fullName: "New Jersey Devils" },
  "ny-islanders": { name: "Islanders", abbr: "NYI", espnAbbr: "nyi", fullName: "New York Islanders" },
  "ny-rangers": { name: "Rangers", abbr: "NYR", espnAbbr: "nyr", fullName: "New York Rangers" },
  "ottawa-senators": { name: "Senators", abbr: "OTT", espnAbbr: "ott", fullName: "Ottawa Senators" },
  "philadelphia-flyers": { name: "Flyers", abbr: "PHI", espnAbbr: "phi", fullName: "Philadelphia Flyers" },
  "pittsburgh-penguins": { name: "Penguins", abbr: "PIT", espnAbbr: "pit", fullName: "Pittsburgh Penguins" },
  "san-jose-sharks": { name: "Sharks", abbr: "SJS", espnAbbr: "sj", fullName: "San Jose Sharks" },
  "seattle-kraken": { name: "Kraken", abbr: "SEA", espnAbbr: "sea", fullName: "Seattle Kraken" },
  "st-louis-blues": { name: "Blues", abbr: "STL", espnAbbr: "stl", fullName: "St. Louis Blues" },
  "tampa-bay-lightning": { name: "Lightning", abbr: "TBL", espnAbbr: "tb", fullName: "Tampa Bay Lightning" },
  "toronto-maple-leafs": { name: "Maple Leafs", abbr: "TOR", espnAbbr: "tor", fullName: "Toronto Maple Leafs" },
  "utah-hockey-club": { name: "Hockey Club", abbr: "UTA", espnAbbr: "uta", fullName: "Utah Hockey Club" },
  "utah-mammoth": { name: "Mammoth", abbr: "UTA", espnAbbr: "uta", fullName: "Utah Mammoth" },
  "vancouver-canucks": { name: "Canucks", abbr: "VAN", espnAbbr: "van", fullName: "Vancouver Canucks" },
  "vegas-golden-knights": { name: "Golden Knights", abbr: "VGK", espnAbbr: "vgk", fullName: "Vegas Golden Knights" },
  "washington-capitals": { name: "Capitals", abbr: "WSH", espnAbbr: "wsh", fullName: "Washington Capitals" },
  "winnipeg-jets": { name: "Jets", abbr: "WPG", espnAbbr: "wpg", fullName: "Winnipeg Jets" }
};

export const MLB_TEAM_MAPPINGS: Record<string, { name: string; abbr: string; espnAbbr: string; fullName: string }> = {
  "arizona-diamondbacks": { name: "Diamondbacks", abbr: "ARI", espnAbbr: "ari", fullName: "Arizona Diamondbacks" },
  "atlanta-braves": { name: "Braves", abbr: "ATL", espnAbbr: "atl", fullName: "Atlanta Braves" },
  "baltimore-orioles": { name: "Orioles", abbr: "BAL", espnAbbr: "bal", fullName: "Baltimore Orioles" },
  "boston-red-sox": { name: "Red Sox", abbr: "BOS", espnAbbr: "bos", fullName: "Boston Red Sox" },
  "chicago-cubs": { name: "Cubs", abbr: "CHC", espnAbbr: "chc", fullName: "Chicago Cubs" },
  "chicago-white-sox": { name: "White Sox", abbr: "CWS", espnAbbr: "chw", fullName: "Chicago White Sox" },
  "cincinnati-reds": { name: "Reds", abbr: "CIN", espnAbbr: "cin", fullName: "Cincinnati Reds" },
  "cleveland-guardians": { name: "Guardians", abbr: "CLE", espnAbbr: "cle", fullName: "Cleveland Guardians" },
  "colorado-rockies": { name: "Rockies", abbr: "COL", espnAbbr: "col", fullName: "Colorado Rockies" },
  "detroit-tigers": { name: "Tigers", abbr: "DET", espnAbbr: "det", fullName: "Detroit Tigers" },
  "houston-astros": { name: "Astros", abbr: "HOU", espnAbbr: "hou", fullName: "Houston Astros" },
  "kansas-city-royals": { name: "Royals", abbr: "KC", espnAbbr: "kc", fullName: "Kansas City Royals" },
  "los-angeles-angels": { name: "Angels", abbr: "LAA", espnAbbr: "laa", fullName: "Los Angeles Angels" },
  "los-angeles-dodgers": { name: "Dodgers", abbr: "LAD", espnAbbr: "lad", fullName: "Los Angeles Dodgers" },
  "miami-marlins": { name: "Marlins", abbr: "MIA", espnAbbr: "mia", fullName: "Miami Marlins" },
  "milwaukee-brewers": { name: "Brewers", abbr: "MIL", espnAbbr: "mil", fullName: "Milwaukee Brewers" },
  "minnesota-twins": { name: "Twins", abbr: "MIN", espnAbbr: "min", fullName: "Minnesota Twins" },
  "new-york-mets": { name: "Mets", abbr: "NYM", espnAbbr: "nym", fullName: "New York Mets" },
  "new-york-yankees": { name: "Yankees", abbr: "NYY", espnAbbr: "nyy", fullName: "New York Yankees" },
  "oakland-athletics": { name: "Athletics", abbr: "OAK", espnAbbr: "oak", fullName: "Oakland Athletics" },
  "philadelphia-phillies": { name: "Phillies", abbr: "PHI", espnAbbr: "phi", fullName: "Philadelphia Phillies" },
  "pittsburgh-pirates": { name: "Pirates", abbr: "PIT", espnAbbr: "pit", fullName: "Pittsburgh Pirates" },
  "san-diego-padres": { name: "Padres", abbr: "SD", espnAbbr: "sd", fullName: "San Diego Padres" },
  "san-francisco-giants": { name: "Giants", abbr: "SF", espnAbbr: "sf", fullName: "San Francisco Giants" },
  "seattle-mariners": { name: "Mariners", abbr: "SEA", espnAbbr: "sea", fullName: "Seattle Mariners" },
  "st-louis-cardinals": { name: "Cardinals", abbr: "STL", espnAbbr: "stl", fullName: "St. Louis Cardinals" },
  "tampa-bay-rays": { name: "Rays", abbr: "TB", espnAbbr: "tb", fullName: "Tampa Bay Rays" },
  "texas-rangers": { name: "Rangers", abbr: "TEX", espnAbbr: "tex", fullName: "Texas Rangers" },
  "toronto-blue-jays": { name: "Blue Jays", abbr: "TOR", espnAbbr: "tor", fullName: "Toronto Blue Jays" },
  "washington-nationals": { name: "Nationals", abbr: "WSH", espnAbbr: "wsh", fullName: "Washington Nationals" }
};

// CBB (NCAAM) Team Mappings - Expanded coverage
export const CBB_TEAM_MAPPINGS: Record<string, { name: string; abbr: string; espnAbbr: string; fullName: string }> = {
  // Major Conference Teams
  "florida": { name: "Florida", abbr: "FLA", espnAbbr: "57", fullName: "Florida Gators" },
  "arizona": { name: "Arizona", abbr: "ARIZ", espnAbbr: "12", fullName: "Arizona Wildcats" },
  "villanova": { name: "Villanova", abbr: "NOVA", espnAbbr: "222", fullName: "Villanova Wildcats" },
  "byu": { name: "BYU", abbr: "BYU", espnAbbr: "252", fullName: "BYU Cougars" },
  "texas": { name: "Texas", abbr: "TEX", espnAbbr: "251", fullName: "Texas Longhorns" },
  "duke": { name: "Duke", abbr: "DUKE", espnAbbr: "150", fullName: "Duke Blue Devils" },
  "kansas": { name: "Kansas", abbr: "KU", espnAbbr: "2305", fullName: "Kansas Jayhawks" },
  "north-carolina": { name: "North Carolina", abbr: "UNC", espnAbbr: "153", fullName: "North Carolina Tar Heels" },
  "kentucky": { name: "Kentucky", abbr: "UK", espnAbbr: "96", fullName: "Kentucky Wildcats" },
  "gonzaga": { name: "Gonzaga", abbr: "GONZ", espnAbbr: "2250", fullName: "Gonzaga Bulldogs" },
  "uconn": { name: "UConn", abbr: "CONN", espnAbbr: "41", fullName: "UConn Huskies" },
  "connecticut": { name: "UConn", abbr: "CONN", espnAbbr: "41", fullName: "UConn Huskies" },
  "oregon": { name: "Oregon", abbr: "ORE", espnAbbr: "2483", fullName: "Oregon Ducks" },
  "hawaii": { name: "Hawaii", abbr: "HAW", espnAbbr: "62", fullName: "Hawaii Rainbow Warriors" },
  "michigan": { name: "Michigan", abbr: "MICH", espnAbbr: "130", fullName: "Michigan Wolverines" },
  "michigan-state": { name: "Michigan State", abbr: "MSU", espnAbbr: "127", fullName: "Michigan State Spartans" },
  "ohio-state": { name: "Ohio State", abbr: "OSU", espnAbbr: "194", fullName: "Ohio State Buckeyes" },
  "purdue": { name: "Purdue", abbr: "PUR", espnAbbr: "2509", fullName: "Purdue Boilermakers" },
  "illinois": { name: "Illinois", abbr: "ILL", espnAbbr: "356", fullName: "Illinois Fighting Illini" },
  "indiana": { name: "Indiana", abbr: "IND", espnAbbr: "84", fullName: "Indiana Hoosiers" },
  "iowa": { name: "Iowa", abbr: "IOWA", espnAbbr: "2294", fullName: "Iowa Hawkeyes" },
  "wisconsin": { name: "Wisconsin", abbr: "WISC", espnAbbr: "275", fullName: "Wisconsin Badgers" },
  "maryland": { name: "Maryland", abbr: "MD", espnAbbr: "120", fullName: "Maryland Terrapins" },
  "nebraska": { name: "Nebraska", abbr: "NEB", espnAbbr: "158", fullName: "Nebraska Cornhuskers" },
  "northwestern": { name: "Northwestern", abbr: "NU", espnAbbr: "77", fullName: "Northwestern Wildcats" },
  "penn-state": { name: "Penn State", abbr: "PSU", espnAbbr: "213", fullName: "Penn State Nittany Lions" },
  "rutgers": { name: "Rutgers", abbr: "RUTG", espnAbbr: "164", fullName: "Rutgers Scarlet Knights" },
  "ucla": { name: "UCLA", abbr: "UCLA", espnAbbr: "26", fullName: "UCLA Bruins" },
  "usc": { name: "USC", abbr: "USC", espnAbbr: "30", fullName: "USC Trojans" },
  "washington": { name: "Washington", abbr: "WASH", espnAbbr: "264", fullName: "Washington Huskies" },
};

export function getTeamInfo(slug: string, sport: string = "NFL") {
  console.log(`🔍 [TEAM MAPPING] Looking up slug: "${slug}" for sport: ${sport}`);
  
  const mappings = sport === "NBA" ? NBA_TEAM_MAPPINGS 
    : sport === "NHL" ? NHL_TEAM_MAPPINGS 
    : sport === "NCAAF" ? CFB_TEAM_MAPPINGS 
    : sport === "MLB" ? MLB_TEAM_MAPPINGS 
    : sport === "NCAAM" ? CBB_TEAM_MAPPINGS 
    : NFL_TEAM_MAPPINGS;
  
  const result = mappings[slug];
  
  // If team found, return it
  if (result) {
    console.log(`✅ [TEAM MAPPING] Direct match found: ${result.fullName} (${result.abbr})`);
    return result;
  }
  
  // Log missing team for reporting
  teamMappingLogger.logMissing(slug, sport);
  
  // Try fuzzy matching before falling back to generated name
  console.warn(`⚠️ [TEAM MAPPING] No direct match for "${slug}" in ${sport}`);
  console.warn(`⚠️ [TEAM MAPPING] Available ${sport} teams: ${Object.keys(mappings).length} total`);
  console.warn(`⚠️ [TEAM MAPPING] Sample slugs:`, Object.keys(mappings).slice(0, 5));
  
  // Could add fuzzy matching here in the future
  
  // Create fallback from slug
  const formattedName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  const abbreviation = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 3);
  
  console.error(`🚨 [TEAM MAPPING] Using fallback for "${slug}" → "${formattedName}" (${abbreviation})`);
  console.error(`🚨 [TEAM MAPPING] This team should be added to ${sport}_TEAM_MAPPINGS`);
  
  return { 
    name: formattedName, 
    abbr: abbreviation, 
    espnAbbr: slug,
    fullName: formattedName,
    logoSlug: slug
  };
}
