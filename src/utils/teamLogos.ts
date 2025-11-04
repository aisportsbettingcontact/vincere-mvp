// Map team slugs to logo paths
const NFL_LOGO_PATHS: Record<string, string> = {
  "arizona-cardinals": "/logos/NFL/NFC/West/arizona-cardinals.png",
  "atlanta-falcons": "/logos/NFL/NFC/South/atlanta-falcons.png",
  "baltimore-ravens": "/logos/NFL/AFC/North/baltimore-ravens.png",
  "buffalo-bills": "/logos/NFL/AFC/East/buffalo-bills.png",
  "carolina-panthers": "/logos/NFL/NFC/South/carolina-panthers.png",
  "chicago-bears": "/logos/NFL/NFC/North/chicago-bears.png",
  "cincinnati-bengals": "/logos/NFL/AFC/North/cincinnati-bengals.png",
  "cleveland-browns": "/logos/NFL/AFC/North/cleveland-browns.png",
  "dallas-cowboys": "/logos/NFL/NFC/East/dallas-cowboys.png",
  "denver-broncos": "/logos/NFL/AFC/West/denver-broncos.png",
  "detroit-lions": "/logos/NFL/NFC/North/detroit-lions.png",
  "green-bay-packers": "/logos/NFL/NFC/North/green-bay-packers.png",
  "houston-texans": "/logos/NFL/AFC/South/houston-texans.png",
  "indianapolis-colts": "/logos/NFL/AFC/South/indianapolis-colts.png",
  "jacksonville-jaguars": "/logos/NFL/AFC/South/jacksonville-jaguars.png",
  "kansas-city-chiefs": "/logos/NFL/AFC/West/kansas-city-chiefs.png",
  "las-vegas-raiders": "/logos/NFL/AFC/West/las-vegas-raiders.png",
  "los-angeles-chargers": "/logos/NFL/AFC/West/los-angeles-chargers.png",
  "los-angeles-rams": "/logos/NFL/NFC/West/los-angeles-rams.png",
  "miami-dolphins": "/logos/NFL/AFC/East/miami-dolphins.png",
  "minnesota-vikings": "/logos/NFL/NFC/North/minnesota-vikings.png",
  "new-england-patriots": "/logos/NFL/AFC/East/new-england-patriots.png",
  "new-orleans-saints": "/logos/NFL/NFC/South/new-orleans-saints.png",
  "new-york-giants": "/logos/NFL/NFC/East/new-york-giants.png",
  "new-york-jets": "/logos/NFL/AFC/East/new-york-jets.png",
  "philadelphia-eagles": "/logos/NFL/NFC/East/philadelphia-eagles.png",
  "pittsburgh-steelers": "/logos/NFL/AFC/North/pittsburgh-steelers.png",
  "san-francisco-49ers": "/logos/NFL/NFC/West/san-francisco-49ers.png",
  "seattle-seahawks": "/logos/NFL/NFC/West/seattle-seahawks.png",
  "tampa-bay-buccaneers": "/logos/NFL/NFC/South/tampa-bay-buccaneers.png",
  "tennessee-titans": "/logos/NFL/AFC/South/tennessee-titans.png",
  "washington-commanders": "/logos/NFL/NFC/East/washington-commanders.png"
};

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

const NHL_LOGO_PATHS: Record<string, string> = {
  "anaheim-ducks": "/logos/NHL/Western/Pacific/anaheim-ducks.png",
  "boston-bruins": "/logos/NHL/Eastern/Atlantic/boston-bruins.png",
  "buffalo-sabres": "/logos/NHL/Eastern/Atlantic/buffalo-sabres.png",
  "calgary-flames": "/logos/NHL/Western/Pacific/calgary-flames.png",
  "carolina-hurricanes": "/logos/NHL/Eastern/Metropolitan/carolina-hurricanes.png",
  "chicago-blackhawks": "/logos/NHL/Western/Central/chicago-blackhawks.png",
  "colorado-avalanche": "/logos/NHL/Western/Central/colorado-avalanche.png",
  "columbus-blue-jackets": "/logos/NHL/Eastern/Metropolitan/columbus-blue-jackets.png",
  "dallas-stars": "/logos/NHL/Western/Central/dallas-stars.png",
  "detroit-red-wings": "/logos/NHL/Eastern/Atlantic/detroit-red-wings.png",
  "edmonton-oilers": "/logos/NHL/Western/Pacific/edmonton-oilers.png",
  "florida-panthers": "/logos/NHL/Eastern/Atlantic/florida-panthers.png",
  "los-angeles-kings": "/logos/NHL/Western/Pacific/los-angeles-kings.png",
  "minnesota-wild": "/logos/NHL/Western/Central/minnesota-wild.png",
  "montreal-canadiens": "/logos/NHL/Eastern/Atlantic/montreal-canadiens.png",
  "nashville-predators": "/logos/NHL/Western/Central/nashville-predators.png",
  "new-jersey-devils": "/logos/NHL/Eastern/Metropolitan/new-jersey-devils.png",
  "ny-islanders": "/logos/NHL/Eastern/Metropolitan/new-york-islanders.png",
  "ny-rangers": "/logos/NHL/Eastern/Metropolitan/new-york-rangers.png",
  "ottawa-senators": "/logos/NHL/Eastern/Atlantic/ottawa-senators.png",
  "philadelphia-flyers": "/logos/NHL/Eastern/Metropolitan/philadelphia-flyers.png",
  "pittsburgh-penguins": "/logos/NHL/Eastern/Metropolitan/pittsburgh-penguins.png",
  "san-jose-sharks": "/logos/NHL/Western/Pacific/san-jose-sharks.png",
  "seattle-kraken": "/logos/NHL/Western/Pacific/seattle-kraken.png",
  "st-louis-blues": "/logos/NHL/Western/Central/st-louis-blues.png",
  "tampa-bay-lightning": "/logos/NHL/Eastern/Atlantic/tampa-bay-lightning.png",
  "toronto-maple-leafs": "/logos/NHL/Eastern/Atlantic/toronto-maple-leafs.png",
  "utah-hockey-club": "/logos/NHL/Western/Central/utah-mammoth.png",
  "utah-mammoth": "/logos/NHL/Western/Central/utah-mammoth.png",
  "vancouver-canucks": "/logos/NHL/Western/Pacific/vancouver-canucks.png",
  "vegas-golden-knights": "/logos/NHL/Western/Pacific/vegas-golden-knights.png",
  "washington-capitals": "/logos/NHL/Eastern/Metropolitan/washington-capitals.png",
  "winnipeg-jets": "/logos/NHL/Western/Central/winnipeg-jets.png"
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
