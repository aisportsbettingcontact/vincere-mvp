// Map team slugs to logo paths
// Paths must match exact GitHub directory structure

// NFL Logo Paths - Using URL encoded spaces for directory names
const NFL_LOGO_PATHS: Record<string, string> = {
  // AFC East
  "buffalo-bills": "/logos/Leagues/NFL/AFC/AFC%20East/buffalo-bills.png",
  "miami-dolphins": "/logos/Leagues/NFL/AFC/AFC%20East/miami-dolphins.png",
  "new-england-patriots": "/logos/Leagues/NFL/AFC/AFC%20East/new-england-patriots.png",
  "new-york-jets": "/logos/Leagues/NFL/AFC/AFC%20East/new-york-jets.png",
  
  // AFC North
  "baltimore-ravens": "/logos/Leagues/NFL/AFC/AFC%20North/baltimore-ravens.png",
  "cincinnati-bengals": "/logos/Leagues/NFL/AFC/AFC%20North/cincinnati-bengals.png",
  "cleveland-browns": "/logos/Leagues/NFL/AFC/AFC%20North/cleveland-browns.png",
  "pittsburgh-steelers": "/logos/Leagues/NFL/AFC/AFC%20North/pittsburgh-steelers.png",
  
  // AFC South
  "houston-texans": "/logos/Leagues/NFL/AFC/AFC%20South/houston-texans.png",
  "indianapolis-colts": "/logos/Leagues/NFL/AFC/AFC%20South/indianapolis-colts.png",
  "jacksonville-jaguars": "/logos/Leagues/NFL/AFC/AFC%20South/jacksonville-jaguars.png",
  "tennessee-titans": "/logos/Leagues/NFL/AFC/AFC%20South/tennessee-titans.png",
  
  // AFC West
  "denver-broncos": "/logos/Leagues/NFL/AFC/AFC%20West/denver-broncos.png",
  "kansas-city-chiefs": "/logos/Leagues/NFL/AFC/AFC%20West/kansas-city-chiefs.png",
  "las-vegas-raiders": "/logos/Leagues/NFL/AFC/AFC%20West/las-vegas-raiders.png",
  "los-angeles-chargers": "/logos/Leagues/NFL/AFC/AFC%20West/los-angeles-chargers.png",
  
  // NFC East
  "dallas-cowboys": "/logos/Leagues/NFL/NFC/NFC%20East/dallas-cowboys.png",
  "new-york-giants": "/logos/Leagues/NFL/NFC/NFC%20East/new-york-giants.png",
  "philadelphia-eagles": "/logos/Leagues/NFL/NFC/NFC%20East/philadelphia-eagles.png",
  "washington-commanders": "/logos/Leagues/NFL/NFC/NFC%20East/washington-commanders.png",
  
  // NFC North
  "chicago-bears": "/logos/Leagues/NFL/NFC/NFC%20North/chicago-bears.png",
  "detroit-lions": "/logos/Leagues/NFL/NFC/NFC%20North/detroit-lions.png",
  "green-bay-packers": "/logos/Leagues/NFL/NFC/NFC%20North/green-bay-packers.png",
  "minnesota-vikings": "/logos/Leagues/NFL/NFC/NFC%20North/minnesota-vikings.png",
  
  // NFC South
  "atlanta-falcons": "/logos/Leagues/NFL/NFC/NFC%20South/atlanta-falcons.png",
  "carolina-panthers": "/logos/Leagues/NFL/NFC/NFC%20South/carolina-panthers.png",
  "new-orleans-saints": "/logos/Leagues/NFL/NFC/NFC%20South/new-orleans-saints.png",
  "tampa-bay-buccaneers": "/logos/Leagues/NFL/NFC/NFC%20South/tampa-bay-buccaneers.png",
  
  // NFC West
  "arizona-cardinals": "/logos/Leagues/NFL/NFC/NFC%20West/arizona-cardinals.png",
  "los-angeles-rams": "/logos/Leagues/NFL/NFC/NFC%20West/los-angeles-rams.png",
  "san-francisco-49ers": "/logos/Leagues/NFL/NFC/NFC%20West/san-francisco-49ers.png",
  "seattle-seahawks": "/logos/Leagues/NFL/NFC/NFC%20West/seattle-seahawks.png",
};

// NBA Logo Paths
const NBA_LOGO_PATHS: Record<string, string> = {
  // Eastern Conference - Atlantic Division
  "boston-celtics": "/logos/Leagues/NBA/Eastern/Atlantic/boston-celtics.png",
  "brooklyn-nets": "/logos/Leagues/NBA/Eastern/Atlantic/brooklyn-nets.png",
  "new-york-knicks": "/logos/Leagues/NBA/Eastern/Atlantic/new-york-knicks.png",
  "philadelphia-76ers": "/logos/Leagues/NBA/Eastern/Atlantic/philadelphia-76ers.png",
  "toronto-raptors": "/logos/Leagues/NBA/Eastern/Atlantic/toronto-raptors.png",
  
  // Eastern Conference - Central Division
  "chicago-bulls": "/logos/Leagues/NBA/Eastern/Central/chicago-bulls.png",
  "cleveland-cavaliers": "/logos/Leagues/NBA/Eastern/Central/cleveland-cavaliers.png",
  "detroit-pistons": "/logos/Leagues/NBA/Eastern/Central/detroit-pistons.png",
  "indiana-pacers": "/logos/Leagues/NBA/Eastern/Central/indiana-pacers.png",
  "milwaukee-bucks": "/logos/Leagues/NBA/Eastern/Central/milwaukee-bucks.png",
  
  // Eastern Conference - Southeast Division
  "atlanta-hawks": "/logos/Leagues/NBA/Eastern/Southeast/atlanta-hawks.png",
  "charlotte-hornets": "/logos/Leagues/NBA/Eastern/Southeast/charlotte-hornets.png",
  "miami-heat": "/logos/Leagues/NBA/Eastern/Southeast/miami-heat.png",
  "orlando-magic": "/logos/Leagues/NBA/Eastern/Southeast/orlando-magic.png",
  "washington-wizards": "/logos/Leagues/NBA/Eastern/Southeast/washington-wizards.png",
  
  // Western Conference - Southwest Division
  "dallas-mavericks": "/logos/Leagues/NBA/Western/Southwest/dallas-mavericks.png",
  "houston-rockets": "/logos/Leagues/NBA/Western/Southwest/houston-rockets.png",
  "memphis-grizzlies": "/logos/Leagues/NBA/Western/Southwest/memphis-grizzlies.png",
  "new-orleans-pelicans": "/logos/Leagues/NBA/Western/Southwest/new-orleans-pelicans.png",
  "san-antonio-spurs": "/logos/Leagues/NBA/Western/Southwest/san-antonio-spurs.png",
  
  // Western Conference - Northwest Division
  "denver-nuggets": "/logos/Leagues/NBA/Western/Northwest/denver-nuggets.png",
  "minnesota-timberwolves": "/logos/Leagues/NBA/Western/Northwest/minnesota-timberwolves.png",
  "oklahoma-city-thunder": "/logos/Leagues/NBA/Western/Northwest/oklahoma-city-thunder.png",
  "portland-trail-blazers": "/logos/Leagues/NBA/Western/Northwest/portland-trail-blazers.png",
  "utah-jazz": "/logos/Leagues/NBA/Western/Northwest/utah-jazz.png",
  
  // Western Conference - Pacific Division
  "golden-state-warriors": "/logos/Leagues/NBA/Western/Pacific/golden-state-warriors.png",
  "la-clippers": "/logos/Leagues/NBA/Western/Pacific/la-clippers.png",
  "los-angeles-lakers": "/logos/Leagues/NBA/Western/Pacific/los-angeles-lakers.png",
  "phoenix-suns": "/logos/Leagues/NBA/Western/Pacific/phoenix-suns.png",
  "sacramento-kings": "/logos/Leagues/NBA/Western/Pacific/sacramento-kings.png"
};

// NHL Logo Paths
const NHL_LOGO_PATHS: Record<string, string> = {
  "anaheim-ducks": "/logos/Leagues/NHL/Western/Pacific/anaheim-ducks.png",
  "boston-bruins": "/logos/Leagues/NHL/Eastern/Atlantic/boston-bruins.png",
  "buffalo-sabres": "/logos/Leagues/NHL/Eastern/Atlantic/buffalo-sabres.png",
  "calgary-flames": "/logos/Leagues/NHL/Western/Pacific/calgary-flames.png",
  "carolina-hurricanes": "/logos/Leagues/NHL/Eastern/Metropolitan/carolina-hurricanes.png",
  "chicago-blackhawks": "/logos/Leagues/NHL/Western/Central/chicago-blackhawks.png",
  "colorado-avalanche": "/logos/Leagues/NHL/Western/Central/colorado-avalanche.png",
  "columbus-blue-jackets": "/logos/Leagues/NHL/Eastern/Metropolitan/columbus-blue-jackets.png",
  "dallas-stars": "/logos/Leagues/NHL/Western/Central/dallas-stars.png",
  "detroit-red-wings": "/logos/Leagues/NHL/Eastern/Atlantic/detroit-red-wings.png",
  "edmonton-oilers": "/logos/Leagues/NHL/Western/Pacific/edmonton-oilers.png",
  "florida-panthers": "/logos/Leagues/NHL/Eastern/Atlantic/florida-panthers.png",
  "los-angeles-kings": "/logos/Leagues/NHL/Western/Pacific/los-angeles-kings.png",
  "minnesota-wild": "/logos/Leagues/NHL/Western/Central/minnesota-wild.png",
  "montreal-canadiens": "/logos/Leagues/NHL/Eastern/Atlantic/montreal-canadiens.png",
  "nashville-predators": "/logos/Leagues/NHL/Western/Central/nashville-predators.png",
  "new-jersey-devils": "/logos/Leagues/NHL/Eastern/Metropolitan/new-jersey-devils.png",
  "ny-islanders": "/logos/Leagues/NHL/Eastern/Metropolitan/new-york-islanders.png",
  "ny-rangers": "/logos/Leagues/NHL/Eastern/Metropolitan/new-york-rangers.png",
  "ottawa-senators": "/logos/Leagues/NHL/Eastern/Atlantic/ottawa-senators.png",
  "philadelphia-flyers": "/logos/Leagues/NHL/Eastern/Metropolitan/philadelphia-flyers.png",
  "pittsburgh-penguins": "/logos/Leagues/NHL/Eastern/Metropolitan/pittsburgh-penguins.png",
  "san-jose-sharks": "/logos/Leagues/NHL/Western/Pacific/san-jose-sharks.png",
  "seattle-kraken": "/logos/Leagues/NHL/Western/Pacific/seattle-kraken.png",
  "st-louis-blues": "/logos/Leagues/NHL/Western/Central/st-louis-blues.png",
  "tampa-bay-lightning": "/logos/Leagues/NHL/Eastern/Atlantic/tampa-bay-lightning.png",
  "toronto-maple-leafs": "/logos/Leagues/NHL/Eastern/Atlantic/toronto-maple-leafs.png",
  "utah-hockey-club": "/logos/Leagues/NHL/Western/Central/utah-mammoth.png",
  "utah-mammoth": "/logos/Leagues/NHL/Western/Central/utah-mammoth.png",
  "vancouver-canucks": "/logos/Leagues/NHL/Western/Pacific/vancouver-canucks.png",
  "vegas-golden-knights": "/logos/Leagues/NHL/Western/Pacific/vegas-golden-knights.png",
  "washington-capitals": "/logos/Leagues/NHL/Eastern/Metropolitan/washington-capitals.png",
  "winnipeg-jets": "/logos/Leagues/NHL/Western/Central/winnipeg-jets.png"
};

export function getTeamLogo(sport: string, espnAbbr: string, teamSlug?: string): string {
  console.log(`🖼️ [TEAM LOGO] Looking up logo - Sport: ${sport}, Slug: "${teamSlug}", ESPN: ${espnAbbr}`);
  
  // For NFL, NBA, NHL, NCAAF, NCAAM - use local logos if we have the team slug
  if (teamSlug) {
    if (sport === "NFL" && NFL_LOGO_PATHS[teamSlug]) {
      console.log(`✅ [TEAM LOGO] NFL local logo found: ${NFL_LOGO_PATHS[teamSlug]}`);
      return NFL_LOGO_PATHS[teamSlug];
    }
    if (sport === "NBA" && NBA_LOGO_PATHS[teamSlug]) {
      console.log(`✅ [TEAM LOGO] NBA local logo found: ${NBA_LOGO_PATHS[teamSlug]}`);
      return NBA_LOGO_PATHS[teamSlug];
    }
    if (sport === "NHL" && NHL_LOGO_PATHS[teamSlug]) {
      console.log(`✅ [TEAM LOGO] NHL local logo found: ${NHL_LOGO_PATHS[teamSlug]}`);
      return NHL_LOGO_PATHS[teamSlug];
    }
    
    // For college sports, construct path from structure
    if (sport === "NCAAF" || sport === "NCAAM") {
      console.log(`⚠️ [TEAM LOGO] No local logo mapped for ${sport} team "${teamSlug}"`);
      console.log(`🔄 [TEAM LOGO] Falling back to ESPN CDN`);
    }
  }
  
  // Fallback to ESPN CDN for teams not in our local logos
  const cdnUrl = (sport === "NCAAF" || sport === "NCAAM")
    ? `https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${espnAbbr}.png&h=200&w=200`
    : `https://a.espncdn.com/combiner/i?img=/i/teamlogos/${sport.toLowerCase()}/500/${espnAbbr}.png&h=200&w=200`;
  
  console.log(`🔄 [TEAM LOGO] Using ESPN CDN: ${cdnUrl}`);
  return cdnUrl;
}
