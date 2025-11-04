// Complete team logo mappings - Based on logo tree structure
// Comprehensive coverage for all leagues and teams

/**
 * Normalize string for comparison
 */
function normalize(str: string): string {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate Levenshtein distance
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) matrix[i] = [i];
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Multi-strategy similarity scoring
 */
function calculateSimilarity(slug: string, candidate: string): number {
  const s1 = normalize(slug);
  const s2 = normalize(candidate);
  
  if (s1 === s2) return 1.0;
  
  let scores: number[] = [];
  
  if (s2.startsWith(s1) || s1.startsWith(s2)) scores.push(0.95);
  
  if (s1.includes(s2) || s2.includes(s1)) {
    const containScore = Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length);
    scores.push(0.85 * containScore);
  }
  
  const words1 = s1.split(' ').filter(w => w.length > 0);
  const words2 = s2.split(' ').filter(w => w.length > 0);
  let wordMatches = 0;
  for (const w1 of words1) {
    for (const w2 of words2) {
      if (w1 === w2 || w1.includes(w2) || w2.includes(w1)) {
        wordMatches++;
        break;
      }
    }
  }
  if (words1.length > 0 && words2.length > 0) {
    const wordScore = wordMatches / Math.max(words1.length, words2.length);
    scores.push(0.8 * wordScore);
  }
  
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen > 0) {
    const distance = levenshteinDistance(s1, s2);
    const levenScore = 1 - (distance / maxLen);
    scores.push(0.75 * levenScore);
  }
  
  const chars1 = new Set(s1.replace(/\s/g, ''));
  const chars2 = new Set(s2.replace(/\s/g, ''));
  let charOverlap = 0;
  for (const char of chars1) {
    if (chars2.has(char)) charOverlap++;
  }
  const charScore = charOverlap / Math.max(chars1.size, chars2.size);
  scores.push(0.6 * charScore);
  
  return Math.max(...scores, 0);
}

/**
 * Find best matching logo path using multi-strategy fuzzy matching
 */
function findBestMatch(slug: string, logoPaths: Record<string, string>, sport: string): string | null {
  console.log(`🔍 [LOGO MATCH] Searching for "${slug}" in ${Object.keys(logoPaths).length} ${sport} logo paths`);
  
  // Try exact match first
  if (logoPaths[slug]) {
    console.log(`✅ [LOGO MATCH] Exact match found for "${slug}"`);
    return logoPaths[slug];
  }
  
  // Try case-insensitive exact match
  const lowerSlug = slug.toLowerCase();
  for (const [key, path] of Object.entries(logoPaths)) {
    if (key.toLowerCase() === lowerSlug) {
      console.log(`✅ [LOGO MATCH] Case-insensitive match: "${slug}" → "${key}"`);
      return path;
    }
  }
  
  // Multi-strategy fuzzy matching
  let matches: Array<{ key: string; score: number; path: string }> = [];
  
  for (const [key, path] of Object.entries(logoPaths)) {
    const score = calculateSimilarity(slug, key);
    if (score > 0.5) matches.push({ key, score, path });
  }
  
  matches.sort((a, b) => b.score - a.score);
  
  if (matches.length > 0) {
    console.log(`🔍 [LOGO MATCH] Top fuzzy matches for "${slug}":`, matches.slice(0, 3).map(m => `${m.key} (${m.score.toFixed(2)})`));
  }
  
  if (matches.length > 0 && matches[0].score >= 0.6) {
    console.log(`✅ [LOGO MATCH] Fuzzy match: "${slug}" → "${matches[0].key}" (score: ${matches[0].score.toFixed(2)})`);
    return matches[0].path;
  }
  
  console.warn(`❌ [LOGO MATCH] No match found for "${slug}" in ${sport}`);
  return null;
}

// NFL Logo Paths (32 teams)
const NFL_LOGO_PATHS: Record<string, string> = {
  "buffalo-bills": "/logos/leagues/nfl/afc/afc-east/buffalo-bills.png",
  "miami-dolphins": "/logos/leagues/nfl/afc/afc-east/miami-dolphins.png",
  "new-england-patriots": "/logos/leagues/nfl/afc/afc-east/new-england-patriots.png",
  "new-york-jets": "/logos/leagues/nfl/afc/afc-east/new-york-jets.png",
  "baltimore-ravens": "/logos/leagues/nfl/afc/afc-north/baltimore-ravens.png",
  "cincinnati-bengals": "/logos/leagues/nfl/afc/afc-north/cincinnati-bengals.png",
  "cleveland-browns": "/logos/leagues/nfl/afc/afc-north/cleveland-browns.png",
  "pittsburgh-steelers": "/logos/leagues/nfl/afc/afc-north/pittsburgh-steelers.png",
  "houston-texans": "/logos/leagues/nfl/afc/afc-south/houston-texans.png",
  "indianapolis-colts": "/logos/leagues/nfl/afc/afc-south/indianapolis-colts.png",
  "jacksonville-jaguars": "/logos/leagues/nfl/afc/afc-south/jacksonville-jaguars.png",
  "tennessee-titans": "/logos/leagues/nfl/afc/afc-south/tennessee-titans.png",
  "denver-broncos": "/logos/leagues/nfl/afc/afc-west/denver-broncos.png",
  "kansas-city-chiefs": "/logos/leagues/nfl/afc/afc-west/kansas-city-chiefs.png",
  "las-vegas-raiders": "/logos/leagues/nfl/afc/afc-west/las-vegas-raiders.png",
  "los-angeles-chargers": "/logos/leagues/nfl/afc/afc-west/los-angeles-chargers.png",
  "dallas-cowboys": "/logos/leagues/nfl/nfc/nfc-east/dallas-cowboys.png",
  "new-york-giants": "/logos/leagues/nfl/nfc/nfc-east/new-york-giants.png",
  "philadelphia-eagles": "/logos/leagues/nfl/nfc/nfc-east/philadelphia-eagles.png",
  "washington-commanders": "/logos/leagues/nfl/nfc/nfc-east/washington-commanders.png",
  "chicago-bears": "/logos/leagues/nfl/nfc/nfc-north/chicago-bears.png",
  "detroit-lions": "/logos/leagues/nfl/nfc/nfc-north/detroit-lions.png",
  "green-bay-packers": "/logos/leagues/nfl/nfc/nfc-north/green-bay-packers.png",
  "minnesota-vikings": "/logos/leagues/nfl/nfc/nfc-north/minnesota-vikings.png",
  "atlanta-falcons": "/logos/leagues/nfl/nfc/nfc-south/atlanta-falcons.png",
  "carolina-panthers": "/logos/leagues/nfl/nfc/nfc-south/carolina-panthers.png",
  "new-orleans-saints": "/logos/leagues/nfl/nfc/nfc-south/new-orleans-saints.png",
  "tampa-bay-buccaneers": "/logos/leagues/nfl/nfc/nfc-south/tampa-bay-buccaneers.png",
  "arizona-cardinals": "/logos/leagues/nfl/nfc/nfc-west/arizona-cardinals.png",
  "los-angeles-rams": "/logos/leagues/nfl/nfc/nfc-west/los-angeles-rams.png",
  "san-francisco-49ers": "/logos/leagues/nfl/nfc/nfc-west/san-francisco-49ers.png",
  "seattle-seahawks": "/logos/leagues/nfl/nfc/nfc-west/seattle-seahawks.png",
};

// NBA Logo Paths (30 teams)
const NBA_LOGO_PATHS: Record<string, string> = {
  "boston-celtics": "/logos/Logos/Leagues/NBA/Eastern/Atlantic/boston-celtics.png",
  "brooklyn-nets": "/logos/Logos/Leagues/NBA/Eastern/Atlantic/brooklyn-nets.png",
  "new-york-knicks": "/logos/Logos/Leagues/NBA/Eastern/Atlantic/new-york-knicks.png",
  "philadelphia-76ers": "/logos/Logos/Leagues/NBA/Eastern/Atlantic/philadelphia-76ers.png",
  "toronto-raptors": "/logos/Logos/Leagues/NBA/Eastern/Atlantic/toronto-raptors.png",
  "chicago-bulls": "/logos/Logos/Leagues/NBA/Eastern/Central/chicago-bulls.png",
  "cleveland-cavaliers": "/logos/Logos/Leagues/NBA/Eastern/Central/cleveland-cavaliers.png",
  "detroit-pistons": "/logos/Logos/Leagues/NBA/Eastern/Central/detroit-pistons.png",
  "indiana-pacers": "/logos/Logos/Leagues/NBA/Eastern/Central/indiana-pacers.png",
  "milwaukee-bucks": "/logos/Logos/Leagues/NBA/Eastern/Central/milwaukee-bucks.png",
  "atlanta-hawks": "/logos/Logos/Leagues/NBA/Eastern/Southeast/atlanta-hawks.png",
  "charlotte-hornets": "/logos/Logos/Leagues/NBA/Eastern/Southeast/charlotte-hornets.png",
  "miami-heat": "/logos/Logos/Leagues/NBA/Eastern/Southeast/miami-heat.png",
  "orlando-magic": "/logos/Logos/Leagues/NBA/Eastern/Southeast/orlando-magic.png",
  "washington-wizards": "/logos/Logos/Leagues/NBA/Eastern/Southeast/washington-wizards.png",
  "denver-nuggets": "/logos/Logos/Leagues/NBA/Western/Northwest/denver-nuggets.png",
  "minnesota-timberwolves": "/logos/Logos/Leagues/NBA/Western/Northwest/minnesota-timberwolves.png",
  "oklahoma-city-thunder": "/logos/Logos/Leagues/NBA/Western/Northwest/oklahoma-city-thunder.png",
  "portland-trail-blazers": "/logos/Logos/Leagues/NBA/Western/Northwest/portland-trail-blazers.png",
  "utah-jazz": "/logos/Logos/Leagues/NBA/Western/Northwest/utah-jazz.png",
  "golden-state-warriors": "/logos/Logos/Leagues/NBA/Western/Pacific/golden-state-warriors.png",
  "la-clippers": "/logos/Logos/Leagues/NBA/Western/Pacific/la-clippers.png",
  "los-angeles-lakers": "/logos/Logos/Leagues/NBA/Western/Pacific/los-angeles-lakers.png",
  "phoenix-suns": "/logos/Logos/Leagues/NBA/Western/Pacific/phoenix-suns.png",
  "sacramento-kings": "/logos/Logos/Leagues/NBA/Western/Pacific/sacramento-kings.png",
  "dallas-mavericks": "/logos/Logos/Leagues/NBA/Western/Southwest/dallas-mavericks.png",
  "houston-rockets": "/logos/Logos/Leagues/NBA/Western/Southwest/houston-rockets.png",
  "memphis-grizzlies": "/logos/Logos/Leagues/NBA/Western/Southwest/memphis-grizzlies.png",
  "new-orleans-pelicans": "/logos/Logos/Leagues/NBA/Western/Southwest/new-orleans-pelicans.png",
  "san-antonio-spurs": "/logos/Logos/Leagues/NBA/Western/Southwest/san-antonio-spurs.png",
};

// NHL Logo Paths (32 teams)
const NHL_LOGO_PATHS: Record<string, string> = {
  "boston-bruins": "/logos/Logos/Leagues/NHL/Eastern/Atlantic/boston-bruins.png",
  "buffalo-sabres": "/logos/Logos/Leagues/NHL/Eastern/Atlantic/buffalo-sabres.png",
  "detroit-red-wings": "/logos/Logos/Leagues/NHL/Eastern/Atlantic/detroit-red-wings.png",
  "florida-panthers": "/logos/Logos/Leagues/NHL/Eastern/Atlantic/florida-panthers.png",
  "montreal-canadiens": "/logos/Logos/Leagues/NHL/Eastern/Atlantic/montreal-canadiens.png",
  "ottawa-senators": "/logos/Logos/Leagues/NHL/Eastern/Atlantic/ottawa-senators.png",
  "tampa-bay-lightning": "/logos/Logos/Leagues/NHL/Eastern/Atlantic/tampa-bay-lightning.png",
  "toronto-maple-leafs": "/logos/Logos/Leagues/NHL/Eastern/Atlantic/toronto-maple-leafs.png",
  "carolina-hurricanes": "/logos/Logos/Leagues/NHL/Eastern/Metropolitan/carolina-hurricanes.png",
  "columbus-blue-jackets": "/logos/Logos/Leagues/NHL/Eastern/Metropolitan/columbus-blue-jackets.png",
  "new-jersey-devils": "/logos/Logos/Leagues/NHL/Eastern/Metropolitan/new-jersey-devils.png",
  "new-york-islanders": "/logos/Logos/Leagues/NHL/Eastern/Metropolitan/new-york-islanders.png",
  "ny-islanders": "/logos/Logos/Leagues/NHL/Eastern/Metropolitan/new-york-islanders.png",
  "new-york-rangers": "/logos/Logos/Leagues/NHL/Eastern/Metropolitan/new-york-rangers.png",
  "ny-rangers": "/logos/Logos/Leagues/NHL/Eastern/Metropolitan/new-york-rangers.png",
  "philadelphia-flyers": "/logos/Logos/Leagues/NHL/Eastern/Metropolitan/philadelphia-flyers.png",
  "pittsburgh-penguins": "/logos/Logos/Leagues/NHL/Eastern/Metropolitan/pittsburgh-penguins.png",
  "washington-capitals": "/logos/Logos/Leagues/NHL/Eastern/Metropolitan/washington-capitals.png",
  "chicago-blackhawks": "/logos/Logos/Leagues/NHL/Western/Central/chicago-blackhawks.png",
  "colorado-avalanche": "/logos/Logos/Leagues/NHL/Western/Central/colorado-avalanche.png",
  "dallas-stars": "/logos/Logos/Leagues/NHL/Western/Central/dallas-stars.png",
  "minnesota-wild": "/logos/Logos/Leagues/NHL/Western/Central/minnesota-wild.png",
  "nashville-predators": "/logos/Logos/Leagues/NHL/Western/Central/nashville-predators.png",
  "st-louis-blues": "/logos/Logos/Leagues/NHL/Western/Central/st-louis-blues.png",
  "utah-hockey-club": "/logos/Logos/Leagues/NHL/Western/Central/utah-mammoth.png",
  "utah-mammoth": "/logos/Logos/Leagues/NHL/Western/Central/utah-mammoth.png",
  "winnipeg-jets": "/logos/Logos/Leagues/NHL/Western/Central/winnipeg-jets.png",
  "anaheim-ducks": "/logos/Logos/Leagues/NHL/Western/Pacific/anaheim-ducks.png",
  "calgary-flames": "/logos/Logos/Leagues/NHL/Western/Pacific/calgary-flames.png",
  "edmonton-oilers": "/logos/Logos/Leagues/NHL/Western/Pacific/edmonton-oilers.png",
  "los-angeles-kings": "/logos/Logos/Leagues/NHL/Western/Pacific/los-angeles-kings.png",
  "san-jose-sharks": "/logos/Logos/Leagues/NHL/Western/Pacific/san-jose-sharks.png",
  "seattle-kraken": "/logos/Logos/Leagues/NHL/Western/Pacific/seattle-kraken.png",
  "vancouver-canucks": "/logos/Logos/Leagues/NHL/Western/Pacific/vancouver-canucks.png",
  "vegas-golden-knights": "/logos/Logos/Leagues/NHL/Western/Pacific/vegas-golden-knights.png",
};

// MLB Logo Paths (30 teams)
const MLB_LOGO_PATHS: Record<string, string> = {
  "chicago-white-sox": "/logos/Logos/Leagues/MLB/Teams/AL/AL Central/chicago-white-sox.png",
  "cleveland-guardians": "/logos/Logos/Leagues/MLB/Teams/AL/AL Central/cleveland-guardians.png",
  "detroit-tigers": "/logos/Logos/Leagues/MLB/Teams/AL/AL Central/detroit-tigers.png",
  "kansas-city-royals": "/logos/Logos/Leagues/MLB/Teams/AL/AL Central/kansas-city-royals.png",
  "minnesota-twins": "/logos/Logos/Leagues/MLB/Teams/AL/AL Central/minnesota-twins.png",
  "baltimore-orioles": "/logos/Logos/Leagues/MLB/Teams/AL/AL East/baltimore-orioles.png",
  "boston-red-sox": "/logos/Logos/Leagues/MLB/Teams/AL/AL East/boston-red-sox.png",
  "new-york-yankees": "/logos/Logos/Leagues/MLB/Teams/AL/AL East/new-york-yankees.png",
  "tampa-bay-rays": "/logos/Logos/Leagues/MLB/Teams/AL/AL East/tampa-bay-rays.png",
  "toronto-blue-jays": "/logos/Logos/Leagues/MLB/Teams/AL/AL East/toronto-blue-jays.png",
  "athletics": "/logos/Logos/Leagues/MLB/Teams/AL/AL West/athletics.png",
  "oakland-athletics": "/logos/Logos/Leagues/MLB/Teams/AL/AL West/athletics.png",
  "houston-astros": "/logos/Logos/Leagues/MLB/Teams/AL/AL West/houston-astros.png",
  "los-angeles-angels": "/logos/Logos/Leagues/MLB/Teams/AL/AL West/los-angeles-angels.png",
  "seattle-mariners": "/logos/Logos/Leagues/MLB/Teams/AL/AL West/seattle-mariners.png",
  "texas-rangers": "/logos/Logos/Leagues/MLB/Teams/AL/AL West/texas-rangers.png",
  "chicago-cubs": "/logos/Logos/Leagues/MLB/Teams/NL/NL Central/chicago-cubs.png",
  "cincinnati-reds": "/logos/Logos/Leagues/MLB/Teams/NL/NL Central/cincinnati-reds.png",
  "milwaukee-brewers": "/logos/Logos/Leagues/MLB/Teams/NL/NL Central/milwaukee-brewers.png",
  "pittsburgh-pirates": "/logos/Logos/Leagues/MLB/Teams/NL/NL Central/pittsburgh-pirates.png",
  "st-louis-cardinals": "/logos/Logos/Leagues/MLB/Teams/NL/NL Central/st-louis-cardinals.png",
  "atlanta-braves": "/logos/Logos/Leagues/MLB/Teams/NL/NL East/atlanta-braves.png",
  "miami-marlins": "/logos/Logos/Leagues/MLB/Teams/NL/NL East/miami-marlins.png",
  "new-york-mets": "/logos/Logos/Leagues/MLB/Teams/NL/NL East/new-york-mets.png",
  "philadelphia-phillies": "/logos/Logos/Leagues/MLB/Teams/NL/NL East/philadelphia-phillies.png",
  "washington-nationals": "/logos/Logos/Leagues/MLB/Teams/NL/NL East/washington-nationals.png",
  "arizona-diamondbacks": "/logos/Logos/Leagues/MLB/Teams/NL/NL West/arizona-diamondbacks.png",
  "colorado-rockies": "/logos/Logos/Leagues/MLB/Teams/NL/NL West/colorado-rockies.png",
  "los-angeles-dodgers": "/logos/Logos/Leagues/MLB/Teams/NL/NL West/los-angeles-dodgers.png",
  "san-diego-padres": "/logos/Logos/Leagues/MLB/Teams/NL/NL West/san-diego-padres.png",
  "san-francisco-giants": "/logos/Logos/Leagues/MLB/Teams/NL/NL West/san-francisco-giants.png",
};

// NCAAF Logo Paths - All conferences
const NCAAF_LOGO_PATHS: Record<string, string> = {
  "boston-college-eagles": "/logos/Logos/Leagues/NCAAF/ACC/boston-college-eagles.png",
  "california-golden-bears": "/logos/Logos/Leagues/NCAAF/ACC/california-golden-bears.png",
  "clemson-tigers": "/logos/Logos/Leagues/NCAAF/ACC/clemson-tigers.png",
  "duke-blue-devils": "/logos/Logos/Leagues/NCAAF/ACC/duke-blue-devils.png",
  "florida-state-seminoles": "/logos/Logos/Leagues/NCAAF/ACC/florida-state-seminoles.png",
  "georgia-tech-yellow-jackets": "/logos/Logos/Leagues/NCAAF/ACC/georgia-tech-yellow-jackets.png",
  "louisville-cardinals": "/logos/Logos/Leagues/NCAAF/ACC/louisville-cardinals.png",
  "miami-hurricanes": "/logos/Logos/Leagues/NCAAF/ACC/miami-hurricanes.png",
  "nc-state-wolfpack": "/logos/Logos/Leagues/NCAAF/ACC/nc-state-wolfpack.png",
  "north-carolina-tar-heels": "/logos/Logos/Leagues/NCAAF/ACC/north-carolina-tar-heels.png",
  "pittsburgh-panthers": "/logos/Logos/Leagues/NCAAF/ACC/pittsburgh-panthers.png",
  "smu-mustangs": "/logos/Logos/Leagues/NCAAF/ACC/smu-mustangs.png",
  "stanford-cardinal": "/logos/Logos/Leagues/NCAAF/ACC/stanford-cardinal.png",
  "syracuse-orange": "/logos/Logos/Leagues/NCAAF/ACC/syracuse-orange.png",
  "virginia-cavaliers": "/logos/Logos/Leagues/NCAAF/ACC/virginia-cavaliers.png",
  "virginia-tech-hokies": "/logos/Logos/Leagues/NCAAF/ACC/virginia-tech-hokies.png",
  "wake-forest-demon-deacons": "/logos/Logos/Leagues/NCAAF/ACC/wake-forest-demon-deacons.png",
  "army-black-knights": "/logos/Logos/Leagues/NCAAF/American/army-black-knights.png",
  "charlotte-49ers": "/logos/Logos/Leagues/NCAAF/American/charlotte-49ers.png",
  "east-carolina-pirates": "/logos/Logos/Leagues/NCAAF/American/east-carolina-pirates.png",
  "florida-atlantic-owls": "/logos/Logos/Leagues/NCAAF/American/florida-atlantic-owls.png",
  "memphis-tigers": "/logos/Logos/Leagues/NCAAF/American/memphis-tigers.png",
  "navy-midshipmen": "/logos/Logos/Leagues/NCAAF/American/navy-midshipmen.png",
  "north-texas-mean-green": "/logos/Logos/Leagues/NCAAF/American/north-texas-mean-green.png",
  "rice-owls": "/logos/Logos/Leagues/NCAAF/American/rice-owls.png",
  "south-florida-bulls": "/logos/Logos/Leagues/NCAAF/American/south-florida-bulls.png",
  "temple-owls": "/logos/Logos/Leagues/NCAAF/American/temple-owls.png",
  "tulane-green-wave": "/logos/Logos/Leagues/NCAAF/American/tulane-green-wave.png",
  "tulsa-golden-hurricane": "/logos/Logos/Leagues/NCAAF/American/tulsa-golden-hurricane.png",
  "uab-blazers": "/logos/Logos/Leagues/NCAAF/American/uab-blazers.png",
  "utsa-roadrunners": "/logos/Logos/Leagues/NCAAF/American/utsa-roadrunners.png",
  "arizona-state-sun-devils": "/logos/Logos/Leagues/NCAAF/Big 12/arizona-state-sun-devils.png",
  "arizona-wildcats": "/logos/Logos/Leagues/NCAAF/Big 12/arizona-wildcats.png",
  "baylor-bears": "/logos/Logos/Leagues/NCAAF/Big 12/baylor-bears.png",
  "byu-cougars": "/logos/Logos/Leagues/NCAAF/Big 12/byu-cougars.png",
  "cincinnati-bearcats": "/logos/Logos/Leagues/NCAAF/Big 12/cincinnati-bearcats.png",
  "colorado-buffaloes": "/logos/Logos/Leagues/NCAAF/Big 12/colorado-buffaloes.png",
  "houston-cougars": "/logos/Logos/Leagues/NCAAF/Big 12/houston-cougars.png",
  "iowa-state-cyclones": "/logos/Logos/Leagues/NCAAF/Big 12/iowa-state-cyclones.png",
  "kansas-jayhawks": "/logos/Logos/Leagues/NCAAF/Big 12/kansas-jayhawks.png",
  "kansas-state-wildcats": "/logos/Logos/Leagues/NCAAF/Big 12/kansas-state-wildcats.png",
  "oklahoma-state-cowboys": "/logos/Logos/Leagues/NCAAF/Big 12/oklahoma-state-cowboys.png",
  "tcu-horned-frogs": "/logos/Logos/Leagues/NCAAF/Big 12/tcu-horned-frogs.png",
  "texas-tech-red-raiders": "/logos/Logos/Leagues/NCAAF/Big 12/texas-tech-red-raiders.png",
  "ucf-knights": "/logos/Logos/Leagues/NCAAF/Big 12/ucf-knights.png",
  "utah-utes": "/logos/Logos/Leagues/NCAAF/Big 12/utah-utes.png",
  "west-virginia-mountaineers": "/logos/Logos/Leagues/NCAAF/Big 12/west-virginia-mountaineers.png",
  "illinois-fighting-illini": "/logos/Logos/Leagues/NCAAF/Big Ten/illinois-fighting-illini.png",
  "indiana-hoosiers": "/logos/Logos/Leagues/NCAAF/Big Ten/indiana-hoosiers.png",
  "iowa-hawkeyes": "/logos/Logos/Leagues/NCAAF/Big Ten/iowa-hawkeyes.png",
  "maryland-terrapins": "/logos/Logos/Leagues/NCAAF/Big Ten/maryland-terrapins.png",
  "michigan-state-spartans": "/logos/Logos/Leagues/NCAAF/Big Ten/michigan-state-spartans.png",
  "michigan-wolverines": "/logos/Logos/Leagues/NCAAF/Big Ten/michigan-wolverines.png",
  "minnesota-golden-gophers": "/logos/Logos/Leagues/NCAAF/Big Ten/minnesota-golden-gophers.png",
  "nebraska-cornhuskers": "/logos/Logos/Leagues/NCAAF/Big Ten/nebraska-cornhuskers.png",
  "northwestern-wildcats": "/logos/Logos/Leagues/NCAAF/Big Ten/northwestern-wildcats.png",
  "ohio-state-buckeyes": "/logos/Logos/Leagues/NCAAF/Big Ten/ohio-state-buckeyes.png",
  "oregon-ducks": "/logos/Logos/Leagues/NCAAF/Big Ten/oregon-ducks.png",
  "penn-state-nittany-lions": "/logos/Logos/Leagues/NCAAF/Big Ten/penn-state-nittany-lions.png",
  "purdue-boilermakers": "/logos/Logos/Leagues/NCAAF/Big Ten/purdue-boilermakers.png",
  "rutgers-scarlet-knights": "/logos/Logos/Leagues/NCAAF/Big Ten/rutgers-scarlet-knights.png",
  "ucla-bruins": "/logos/Logos/Leagues/NCAAF/Big Ten/ucla-bruins.png",
  "usc-trojans": "/logos/Logos/Leagues/NCAAF/Big Ten/usc-trojans.png",
  "washington-huskies": "/logos/Logos/Leagues/NCAAF/Big Ten/washington-huskies.png",
  "wisconsin-badgers": "/logos/Logos/Leagues/NCAAF/Big Ten/wisconsin-badgers.png",
  "delaware-blue-hens": "/logos/Logos/Leagues/NCAAF/Conference USA/delaware-blue-hens.png",
  "florida-international-panthers": "/logos/Logos/Leagues/NCAAF/Conference USA/florida-international-panthers.png",
  "jacksonville-state-gamecocks": "/logos/Logos/Leagues/NCAAF/Conference USA/jacksonville-state-gamecocks.png",
  "kennesaw-state-owls": "/logos/Logos/Leagues/NCAAF/Conference USA/kennesaw-state-owls.png",
  "liberty-flames": "/logos/Logos/Leagues/NCAAF/Conference USA/liberty-flames.png",
  "louisiana-tech-bulldogs": "/logos/Logos/Leagues/NCAAF/Conference USA/louisiana-tech-bulldogs.png",
  "middle-tennessee-blue-raiders": "/logos/Logos/Leagues/NCAAF/Conference USA/middle-tennessee-blue-raiders.png",
  "missouri-state-bears": "/logos/Logos/Leagues/NCAAF/Conference USA/missouri-state-bears.png",
  "new-mexico-state-aggies": "/logos/Logos/Leagues/NCAAF/Conference USA/new-mexico-state-aggies.png",
  "sam-houston-bearkats": "/logos/Logos/Leagues/NCAAF/Conference USA/sam-houston-bearkats.png",
  "utep-miners": "/logos/Logos/Leagues/NCAAF/Conference USA/utep-miners.png",
  "western-kentucky-hilltoppers": "/logos/Logos/Leagues/NCAAF/Conference USA/western-kentucky-hilltoppers.png",
  "notre-dame-fighting-irish": "/logos/Logos/Leagues/NCAAF/Independents/notre-dame-fighting-irish.png",
  "uconn-huskies": "/logos/Logos/Leagues/NCAAF/Independents/uconn-huskies.png",
  "akron-zips": "/logos/Logos/Leagues/NCAAF/Mid-American/akron-zips.png",
  "ball-state-cardinals": "/logos/Logos/Leagues/NCAAF/Mid-American/ball-state-cardinals.png",
  "bowling-green-falcons": "/logos/Logos/Leagues/NCAAF/Mid-American/bowling-green-falcons.png",
  "buffalo-bulls": "/logos/Logos/Leagues/NCAAF/Mid-American/buffalo-bulls.png",
  "central-michigan-chippewas": "/logos/Logos/Leagues/NCAAF/Mid-American/central-michigan-chippewas.png",
  "eastern-michigan-eagles": "/logos/Logos/Leagues/NCAAF/Mid-American/eastern-michigan-eagles.png",
  "kent-state-golden-flashes": "/logos/Logos/Leagues/NCAAF/Mid-American/kent-state-golden-flashes.png",
  "massachusetts-minutemen": "/logos/Logos/Leagues/NCAAF/Mid-American/massachusetts-minutemen.png",
  "miami-oh-redhawks": "/logos/Logos/Leagues/NCAAF/Mid-American/miami-oh-redhawks.png",
  "northern-illinois-huskies": "/logos/Logos/Leagues/NCAAF/Mid-American/northern-illinois-huskies.png",
  "ohio-bobcats": "/logos/Logos/Leagues/NCAAF/Mid-American/ohio-bobcats.png",
  "toledo-rockets": "/logos/Logos/Leagues/NCAAF/Mid-American/toledo-rockets.png",
  "western-michigan-broncos": "/logos/Logos/Leagues/NCAAF/Mid-American/western-michigan-broncos.png",
  "air-force-falcons": "/logos/Logos/Leagues/NCAAF/Mountain West/air-force-falcons.png",
  "boise-state-broncos": "/logos/Logos/Leagues/NCAAF/Mountain West/boise-state-broncos.png",
  "colorado-state-rams": "/logos/Logos/Leagues/NCAAF/Mountain West/colorado-state-rams.png",
  "fresno-state-bulldogs": "/logos/Logos/Leagues/NCAAF/Mountain West/fresno-state-bulldogs.png",
  "hawaii-rainbow-warriors": "/logos/Logos/Leagues/NCAAF/Mountain West/hawaii-rainbow-warriors.png",
  "nevada-wolf-pack": "/logos/Logos/Leagues/NCAAF/Mountain West/nevada-wolf-pack.png",
  "new-mexico-lobos": "/logos/Logos/Leagues/NCAAF/Mountain West/new-mexico-lobos.png",
  "san-diego-state-aztecs": "/logos/Logos/Leagues/NCAAF/Mountain West/san-diego-state-aztecs.png",
  "san-jose-state-spartans": "/logos/Logos/Leagues/NCAAF/Mountain West/san-jose-state-spartans.png",
  "unlv-rebels": "/logos/Logos/Leagues/NCAAF/Mountain West/unlv-rebels.png",
  "utah-state-aggies": "/logos/Logos/Leagues/NCAAF/Mountain West/utah-state-aggies.png",
  "wyoming-cowboys": "/logos/Logos/Leagues/NCAAF/Mountain West/wyoming-cowboys.png",
  "oregon-state-beavers": "/logos/Logos/Leagues/NCAAF/Pac-12/oregon-state-beavers.png",
  "washington-state-cougars": "/logos/Logos/Leagues/NCAAF/Pac-12/washington-state-cougars.png",
  "alabama-crimson-tide": "/logos/Logos/Leagues/NCAAF/SEC/alabama-crimson-tide.png",
  "arkansas-razorbacks": "/logos/Logos/Leagues/NCAAF/SEC/arkansas-razorbacks.png",
  "auburn-tigers": "/logos/Logos/Leagues/NCAAF/SEC/auburn-tigers.png",
  "florida-gators": "/logos/Logos/Leagues/NCAAF/SEC/florida-gators.png",
  "georgia-bulldogs": "/logos/Logos/Leagues/NCAAF/SEC/georgia-bulldogs.png",
  "kentucky-wildcats": "/logos/Logos/Leagues/NCAAF/SEC/kentucky-wildcats.png",
  "lsu-tigers": "/logos/Logos/Leagues/NCAAF/SEC/lsu-tigers.png",
  "mississippi-state-bulldogs": "/logos/Logos/Leagues/NCAAF/SEC/mississippi-state-bulldogs.png",
  "missouri-tigers": "/logos/Logos/Leagues/NCAAF/SEC/missouri-tigers.png",
  "oklahoma-sooners": "/logos/Logos/Leagues/NCAAF/SEC/oklahoma-sooners.png",
  "ole-miss-rebels": "/logos/Logos/Leagues/NCAAF/SEC/ole-miss-rebels.png",
  "south-carolina-gamecocks": "/logos/Logos/Leagues/NCAAF/SEC/south-carolina-gamecocks.png",
  "tennessee-volunteers": "/logos/Logos/Leagues/NCAAF/SEC/tennessee-volunteers.png",
  "texas-am-aggies": "/logos/Logos/Leagues/NCAAF/SEC/texas-am-aggies.png",
  "texas-longhorns": "/logos/Logos/Leagues/NCAAF/SEC/texas-longhorns.png",
  "vanderbilt-commodores": "/logos/Logos/Leagues/NCAAF/SEC/vanderbilt-commodores.png",
  "app-state-mountaineers": "/logos/Logos/Leagues/NCAAF/Sun Belt/app-state-mountaineers.png",
  "arkansas-state-red-wolves": "/logos/Logos/Leagues/NCAAF/Sun Belt/arkansas-state-red-wolves.png",
  "coastal-carolina-chanticleers": "/logos/Logos/Leagues/NCAAF/Sun Belt/coastal-carolina-chanticleers.png",
  "georgia-southern-eagles": "/logos/Logos/Leagues/NCAAF/Sun Belt/georgia-southern-eagles.png",
  "georgia-state-panthers": "/logos/Logos/Leagues/NCAAF/Sun Belt/georgia-state-panthers.png",
  "james-madison-dukes": "/logos/Logos/Leagues/NCAAF/Sun Belt/james-madison-dukes.png",
  "louisiana-ragin-cajuns": "/logos/Logos/Leagues/NCAAF/Sun Belt/louisiana-ragin-cajuns.png",
  "marshall-thundering-herd": "/logos/Logos/Leagues/NCAAF/Sun Belt/marshall-thundering-herd.png",
  "old-dominion-monarchs": "/logos/Logos/Leagues/NCAAF/Sun Belt/old-dominion-monarchs.png",
  "south-alabama-jaguars": "/logos/Logos/Leagues/NCAAF/Sun Belt/south-alabama-jaguars.png",
  "southern-miss-golden-eagles": "/logos/Logos/Leagues/NCAAF/Sun Belt/southern-miss-golden-eagles.png",
  "texas-state-bobcats": "/logos/Logos/Leagues/NCAAF/Sun Belt/texas-state-bobcats.png",
  "troy-trojans": "/logos/Logos/Leagues/NCAAF/Sun Belt/troy-trojans.png",
  "ul-monroe-warhawks": "/logos/Logos/Leagues/NCAAF/Sun Belt/ul-monroe-warhawks.png",
};

// NCAAM Logo Paths - COMPLETE ALL CONFERENCES
const NCAAM_LOGO_PATHS: Record<string, string> = {
  // A-10
  "davidson-wildcats": "/logos/Logos/Leagues/NCAAM/A-10/davidson-wildcats.png",
  "dayton-flyers": "/logos/Logos/Leagues/NCAAM/A-10/dayton-flyers.png",
  "duquesne-dukes": "/logos/Logos/Leagues/NCAAM/A-10/duquesne-dukes.png",
  "fordham-rams": "/logos/Logos/Leagues/NCAAM/A-10/fordham-rams.png",
  "george-mason-patriots": "/logos/Logos/Leagues/NCAAM/A-10/george-mason-patriots.png",
  "george-washington-revolutionaries": "/logos/Logos/Leagues/NCAAM/A-10/george-washington-revolutionaries.png",
  "la-salle-explorers": "/logos/Logos/Leagues/NCAAM/A-10/la-salle-explorers.png",
  "loyola-chicago-ramblers": "/logos/Logos/Leagues/NCAAM/A-10/loyola-chicago-ramblers.png",
  "rhode-island-rams": "/logos/Logos/Leagues/NCAAM/A-10/rhode-island-rams.png",
  "richmond-spiders": "/logos/Logos/Leagues/NCAAM/A-10/richmond-spiders.png",
  "saint-josephs-hawks": "/logos/Logos/Leagues/NCAAM/A-10/saint-josephs-hawks.png",
  "saint-louis-billikens": "/logos/Logos/Leagues/NCAAM/A-10/saint-louis-billikens.png",
  "st-bonaventure-bonnies": "/logos/Logos/Leagues/NCAAM/A-10/st-bonaventure-bonnies.png",
  "vcu-rams": "/logos/Logos/Leagues/NCAAM/A-10/vcu-rams.png",
  // ACC
  "boston-college-eagles": "/logos/Logos/Leagues/NCAAM/ACC/boston-college-eagles.png",
  "california-golden-bears": "/logos/Logos/Leagues/NCAAM/ACC/california-golden-bears.png",
  "clemson-tigers": "/logos/Logos/Leagues/NCAAM/ACC/clemson-tigers.png",
  "duke-blue-devils": "/logos/Logos/Leagues/NCAAM/ACC/duke-blue-devils.png",
  "florida-state-seminoles": "/logos/Logos/Leagues/NCAAM/ACC/florida-state-seminoles.png",
  "georgia-tech-yellow-jackets": "/logos/Logos/Leagues/NCAAM/ACC/georgia-tech-yellow-jackets.png",
  "louisville-cardinals": "/logos/Logos/Leagues/NCAAM/ACC/louisville-cardinals.png",
  "miami-hurricanes": "/logos/Logos/Leagues/NCAAM/ACC/miami-hurricanes.png",
  "nc-state-wolfpack": "/logos/Logos/Leagues/NCAAM/ACC/nc-state-wolfpack.png",
  "north-carolina-tar-heels": "/logos/Logos/Leagues/NCAAM/ACC/north-carolina-tar-heels.png",
  "notre-dame-fighting-irish": "/logos/Logos/Leagues/NCAAM/ACC/notre-dame-fighting-irish.png",
  "pittsburgh-panthers": "/logos/Logos/Leagues/NCAAM/ACC/pittsburgh-panthers.png",
  "smu-mustangs": "/logos/Logos/Leagues/NCAAM/ACC/smu-mustangs.png",
  "stanford-cardinal": "/logos/Logos/Leagues/NCAAM/ACC/stanford-cardinal.png",
  "syracuse-orange": "/logos/Logos/Leagues/NCAAM/ACC/syracuse-orange.png",
  "virginia-cavaliers": "/logos/Logos/Leagues/NCAAM/ACC/virginia-cavaliers.png",
  "virginia-tech-hokies": "/logos/Logos/Leagues/NCAAM/ACC/virginia-tech-hokies.png",
  "wake-forest-demon-deacons": "/logos/Logos/Leagues/NCAAM/ACC/wake-forest-demon-deacons.png",
  // America East
  "binghamton-bearcats": "/logos/Logos/Leagues/NCAAM/America East/binghamton-bearcats.png",
  "bryant-bulldogs": "/logos/Logos/Leagues/NCAAM/America East/bryant-bulldogs.png",
  "maine-black-bears": "/logos/Logos/Leagues/NCAAM/America East/maine-black-bears.png",
  "new-hampshire-wildcats": "/logos/Logos/Leagues/NCAAM/America East/new-hampshire-wildcats.png",
  "njit-highlanders": "/logos/Logos/Leagues/NCAAM/America East/njit-highlanders.png",
  "ualbany-great-danes": "/logos/Logos/Leagues/NCAAM/America East/ualbany-great-danes.png",
  "umass-lowell-river-hawks": "/logos/Logos/Leagues/NCAAM/America East/umass-lowell-river-hawks.png",
  "umbc-retrievers": "/logos/Logos/Leagues/NCAAM/America East/umbc-retrievers.png",
  "vermont-catamounts": "/logos/Logos/Leagues/NCAAM/America East/vermont-catamounts.png",
  // American
  "charlotte-49ers": "/logos/Logos/Leagues/NCAAM/American/charlotte-49ers.png",
  "east-carolina-pirates": "/logos/Logos/Leagues/NCAAM/American/east-carolina-pirates.png",
  "florida-atlantic-owls": "/logos/Logos/Leagues/NCAAM/American/florida-atlantic-owls.png",
  "memphis-tigers": "/logos/Logos/Leagues/NCAAM/American/memphis-tigers.png",
  "north-texas-mean-green": "/logos/Logos/Leagues/NCAAM/American/north-texas-mean-green.png",
  "rice-owls": "/logos/Logos/Leagues/NCAAM/American/rice-owls.png",
  "south-florida-bulls": "/logos/Logos/Leagues/NCAAM/American/south-florida-bulls.png",
  "temple-owls": "/logos/Logos/Leagues/NCAAM/American/temple-owls.png",
  "tulane-green-wave": "/logos/Logos/Leagues/NCAAM/American/tulane-green-wave.png",
  "tulsa-golden-hurricane": "/logos/Logos/Leagues/NCAAM/American/tulsa-golden-hurricane.png",
  "uab-blazers": "/logos/Logos/Leagues/NCAAM/American/uab-blazers.png",
  "utsa-roadrunners": "/logos/Logos/Leagues/NCAAM/American/utsa-roadrunners.png",
  "wichita-state-shockers": "/logos/Logos/Leagues/NCAAM/American/wichita-state-shockers.png",
  // ASUN
  "austin-peay-governors": "/logos/Logos/Leagues/NCAAM/ASUN/austin-peay-governors.png",
  "bellarmine-knights": "/logos/Logos/Leagues/NCAAM/ASUN/bellarmine-knights.png",
  "central-arkansas-bears": "/logos/Logos/Leagues/NCAAM/ASUN/central-arkansas-bears.png",
  "eastern-kentucky-colonels": "/logos/Logos/Leagues/NCAAM/ASUN/eastern-kentucky-colonels.png",
  "florida-gulf-coast-eagles": "/logos/Logos/Leagues/NCAAM/ASUN/florida-gulf-coast-eagles.png",
  "jacksonville-dolphins": "/logos/Logos/Leagues/NCAAM/ASUN/jacksonville-dolphins.png",
  "lipscomb-bisons": "/logos/Logos/Leagues/NCAAM/ASUN/lipscomb-bisons.png",
  "north-alabama-lions": "/logos/Logos/Leagues/NCAAM/ASUN/north-alabama-lions.png",
  "north-florida-ospreys": "/logos/Logos/Leagues/NCAAM/ASUN/north-florida-ospreys.png",
  "queens-university-royals": "/logos/Logos/Leagues/NCAAM/ASUN/queens-university-royals.png",
  "stetson-hatters": "/logos/Logos/Leagues/NCAAM/ASUN/stetson-hatters.png",
  "west-georgia-wolves": "/logos/Logos/Leagues/NCAAM/ASUN/west-georgia-wolves.png",
  // Big 12
  "arizona-state-sun-devils": "/logos/Logos/Leagues/NCAAM/Big 12/arizona-state-sun-devils.png",
  "arizona-wildcats": "/logos/Logos/Leagues/NCAAM/Big 12/arizona-wildcats.png",
  "baylor-bears": "/logos/Logos/Leagues/NCAAM/Big 12/baylor-bears.png",
  "byu-cougars": "/logos/Logos/Leagues/NCAAM/Big 12/byu-cougars.png",
  "cincinnati-bearcats": "/logos/Logos/Leagues/NCAAM/Big 12/cincinnati-bearcats.png",
  "colorado-buffaloes": "/logos/Logos/Leagues/NCAAM/Big 12/colorado-buffaloes.png",
  "houston-cougars": "/logos/Logos/Leagues/NCAAM/Big 12/houston-cougars.png",
  "iowa-state-cyclones": "/logos/Logos/Leagues/NCAAM/Big 12/iowa-state-cyclones.png",
  "kansas-jayhawks": "/logos/Logos/Leagues/NCAAM/Big 12/kansas-jayhawks.png",
  "kansas-state-wildcats": "/logos/Logos/Leagues/NCAAM/Big 12/kansas-state-wildcats.png",
  "oklahoma-state-cowboys": "/logos/Logos/Leagues/NCAAM/Big 12/oklahoma-state-cowboys.png",
  "tcu-horned-frogs": "/logos/Logos/Leagues/NCAAM/Big 12/tcu-horned-frogs.png",
  "texas-tech-red-raiders": "/logos/Logos/Leagues/NCAAM/Big 12/texas-tech-red-raiders.png",
  "ucf-knights": "/logos/Logos/Leagues/NCAAM/Big 12/ucf-knights.png",
  "utah-utes": "/logos/Logos/Leagues/NCAAM/Big 12/utah-utes.png",
  "west-virginia-mountaineers": "/logos/Logos/Leagues/NCAAM/Big 12/west-virginia-mountaineers.png",
  // Big East
  "butler-bulldogs": "/logos/Logos/Leagues/NCAAM/Big East/butler-bulldogs.png",
  "creighton-bluejays": "/logos/Logos/Leagues/NCAAM/Big East/creighton-bluejays.png",
  "depaul-blue-demons": "/logos/Logos/Leagues/NCAAM/Big East/depaul-blue-demons.png",
  "georgetown-hoyas": "/logos/Logos/Leagues/NCAAM/Big East/georgetown-hoyas.png",
  "marquette-golden-eagles": "/logos/Logos/Leagues/NCAAM/Big East/marquette-golden-eagles.png",
  "providence-friars": "/logos/Logos/Leagues/NCAAM/Big East/providence-friars.png",
  "seton-hall-pirates": "/logos/Logos/Leagues/NCAAM/Big East/seton-hall-pirates.png",
  "st-johns-red-storm": "/logos/Logos/Leagues/NCAAM/Big East/st-johns-red-storm.png",
  "uconn-huskies": "/logos/Logos/Leagues/NCAAM/Big East/uconn-huskies.png",
  "villanova-wildcats": "/logos/Logos/Leagues/NCAAM/Big East/villanova-wildcats.png",
  "xavier-musketeers": "/logos/Logos/Leagues/NCAAM/Big East/xavier-musketeers.png",
  // Big Sky
  "eastern-washington-eagles": "/logos/Logos/Leagues/NCAAM/Big Sky/eastern-washington-eagles.png",
  "idaho-state-bengals": "/logos/Logos/Leagues/NCAAM/Big Sky/idaho-state-bengals.png",
  "idaho-vandals": "/logos/Logos/Leagues/NCAAM/Big Sky/idaho-vandals.png",
  "montana-grizzlies": "/logos/Logos/Leagues/NCAAM/Big Sky/montana-grizzlies.png",
  "montana-state-bobcats": "/logos/Logos/Leagues/NCAAM/Big Sky/montana-state-bobcats.png",
  "northern-arizona-lumberjacks": "/logos/Logos/Leagues/NCAAM/Big Sky/northern-arizona-lumberjacks.png",
  "northern-colorado-bears": "/logos/Logos/Leagues/NCAAM/Big Sky/northern-colorado-bears.png",
  "portland-state-vikings": "/logos/Logos/Leagues/NCAAM/Big Sky/portland-state-vikings.png",
  "sacramento-state-hornets": "/logos/Logos/Leagues/NCAAM/Big Sky/sacramento-state-hornets.png",
  "weber-state-wildcats": "/logos/Logos/Leagues/NCAAM/Big Sky/weber-state-wildcats.png",
  // Big South
  "charleston-southern-buccaneers": "/logos/Logos/Leagues/NCAAM/Big South/charleston-southern-buccaneers.png",
  "gardner-webb-runnin-bulldogs": "/logos/Logos/Leagues/NCAAM/Big South/gardner-webb-runnin-bulldogs.png",
  "high-point-panthers": "/logos/Logos/Leagues/NCAAM/Big South/high-point-panthers.png",
  "longwood-lancers": "/logos/Logos/Leagues/NCAAM/Big South/longwood-lancers.png",
  "presbyterian-blue-hose": "/logos/Logos/Leagues/NCAAM/Big South/presbyterian-blue-hose.png",
  "radford-highlanders": "/logos/Logos/Leagues/NCAAM/Big South/radford-highlanders.png",
  "south-carolina-upstate-spartans": "/logos/Logos/Leagues/NCAAM/Big South/south-carolina-upstate-spartans.png",
  "unc-asheville-bulldogs": "/logos/Logos/Leagues/NCAAM/Big South/unc-asheville-bulldogs.png",
  "winthrop-eagles": "/logos/Logos/Leagues/NCAAM/Big South/winthrop-eagles.png",
  // Big Ten
  "illinois-fighting-illini": "/logos/Logos/Leagues/NCAAM/Big Ten/illinois-fighting-illini.png",
  "indiana-hoosiers": "/logos/Logos/Leagues/NCAAM/Big Ten/indiana-hoosiers.png",
  "iowa-hawkeyes": "/logos/Logos/Leagues/NCAAM/Big Ten/iowa-hawkeyes.png",
  "maryland-terrapins": "/logos/Logos/Leagues/NCAAM/Big Ten/maryland-terrapins.png",
  "michigan-state-spartans": "/logos/Logos/Leagues/NCAAM/Big Ten/michigan-state-spartans.png",
  "michigan-wolverines": "/logos/Logos/Leagues/NCAAM/Big Ten/michigan-wolverines.png",
  "minnesota-golden-gophers": "/logos/Logos/Leagues/NCAAM/Big Ten/minnesota-golden-gophers.png",
  "nebraska-cornhuskers": "/logos/Logos/Leagues/NCAAM/Big Ten/nebraska-cornhuskers.png",
  "northwestern-wildcats": "/logos/Logos/Leagues/NCAAM/Big Ten/northwestern-wildcats.png",
  "ohio-state-buckeyes": "/logos/Logos/Leagues/NCAAM/Big Ten/ohio-state-buckeyes.png",
  "oregon-ducks": "/logos/Logos/Leagues/NCAAM/Big Ten/oregon-ducks.png",
  "penn-state-nittany-lions": "/logos/Logos/Leagues/NCAAM/Big Ten/penn-state-nittany-lions.png",
  "purdue-boilermakers": "/logos/Logos/Leagues/NCAAM/Big Ten/purdue-boilermakers.png",
  "rutgers-scarlet-knights": "/logos/Logos/Leagues/NCAAM/Big Ten/rutgers-scarlet-knights.png",
  "ucla-bruins": "/logos/Logos/Leagues/NCAAM/Big Ten/ucla-bruins.png",
  "usc-trojans": "/logos/Logos/Leagues/NCAAM/Big Ten/usc-trojans.png",
  "washington-huskies": "/logos/Logos/Leagues/NCAAM/Big Ten/washington-huskies.png",
  "wisconsin-badgers": "/logos/Logos/Leagues/NCAAM/Big Ten/wisconsin-badgers.png",
  // Big West
  "cal-poly-mustangs": "/logos/Logos/Leagues/NCAAM/Big West/cal-poly-mustangs.png",
  "cal-state-bakersfield-roadrunners": "/logos/Logos/Leagues/NCAAM/Big West/cal-state-bakersfield-roadrunners.png",
  "cal-state-fullerton-titans": "/logos/Logos/Leagues/NCAAM/Big West/cal-state-fullerton-titans.png",
  "cal-state-northridge-matadors": "/logos/Logos/Leagues/NCAAM/Big West/cal-state-northridge-matadors.png",
  "hawaii-rainbow-warriors": "/logos/Logos/Leagues/NCAAM/Big West/hawaii-rainbow-warriors.png",
  "long-beach-state-beach": "/logos/Logos/Leagues/NCAAM/Big West/long-beach-state-beach.png",
  "uc-davis-aggies": "/logos/Logos/Leagues/NCAAM/Big West/uc-davis-aggies.png",
  "uc-irvine-anteaters": "/logos/Logos/Leagues/NCAAM/Big West/uc-irvine-anteaters.png",
  "uc-riverside-highlanders": "/logos/Logos/Leagues/NCAAM/Big West/uc-riverside-highlanders.png",
  "uc-san-diego-tritons": "/logos/Logos/Leagues/NCAAM/Big West/uc-san-diego-tritons.png",
  "uc-santa-barbara-gauchos": "/logos/Logos/Leagues/NCAAM/Big West/uc-santa-barbara-gauchos.png",
  // C-USA
  "delaware-blue-hens": "/logos/Logos/Leagues/NCAAM/C-USA/delaware-blue-hens.png",
  "florida-international-panthers": "/logos/Logos/Leagues/NCAAM/C-USA/florida-international-panthers.png",
  "jacksonville-state-gamecocks": "/logos/Logos/Leagues/NCAAM/C-USA/jacksonville-state-gamecocks.png",
  "kennesaw-state-owls": "/logos/Logos/Leagues/NCAAM/C-USA/kennesaw-state-owls.png",
  "liberty-flames": "/logos/Logos/Leagues/NCAAM/C-USA/liberty-flames.png",
  "louisiana-tech-bulldogs": "/logos/Logos/Leagues/NCAAM/C-USA/louisiana-tech-bulldogs.png",
  "middle-tennessee-blue-raiders": "/logos/Logos/Leagues/NCAAM/C-USA/middle-tennessee-blue-raiders.png",
  "missouri-state-bears": "/logos/Logos/Leagues/NCAAM/C-USA/missouri-state-bears.png",
  "new-mexico-state-aggies": "/logos/Logos/Leagues/NCAAM/C-USA/new-mexico-state-aggies.png",
  "sam-houston-bearkats": "/logos/Logos/Leagues/NCAAM/C-USA/sam-houston-bearkats.png",
  "utep-miners": "/logos/Logos/Leagues/NCAAM/C-USA/utep-miners.png",
  "western-kentucky-hilltoppers": "/logos/Logos/Leagues/NCAAM/C-USA/western-kentucky-hilltoppers.png",
  // Colonial
  "campbell-fighting-camels": "/logos/Logos/Leagues/NCAAM/Colonial/campbell-fighting-camels.png",
  "charleston-cougars": "/logos/Logos/Leagues/NCAAM/Colonial/charleston-cougars.png",
  "drexel-dragons": "/logos/Logos/Leagues/NCAAM/Colonial/drexel-dragons.png",
  "elon-phoenix": "/logos/Logos/Leagues/NCAAM/Colonial/elon-phoenix.png",
  "hampton-pirates": "/logos/Logos/Leagues/NCAAM/Colonial/hampton-pirates.png",
  "hofstra-pride": "/logos/Logos/Leagues/NCAAM/Colonial/hofstra-pride.png",
  "monmouth-hawks": "/logos/Logos/Leagues/NCAAM/Colonial/monmouth-hawks.png",
  "north-carolina-at-aggies": "/logos/Logos/Leagues/NCAAM/Colonial/north-carolina-at-aggies.png",
  "northeastern-huskies": "/logos/Logos/Leagues/NCAAM/Colonial/northeastern-huskies.png",
  "stony-brook-seawolves": "/logos/Logos/Leagues/NCAAM/Colonial/stony-brook-seawolves.png",
  "towson-tigers": "/logos/Logos/Leagues/NCAAM/Colonial/towson-tigers.png",
  "unc-wilmington-seahawks": "/logos/Logos/Leagues/NCAAM/Colonial/unc-wilmington-seahawks.png",
  "william-mary-tribe": "/logos/Logos/Leagues/NCAAM/Colonial/william-mary-tribe.png",
  // Horizon
  "cleveland-state-vikings": "/logos/Logos/Leagues/NCAAM/Horizon/cleveland-state-vikings.png",
  "detroit-mercy-titans": "/logos/Logos/Leagues/NCAAM/Horizon/detroit-mercy-titans.png",
  "green-bay-phoenix": "/logos/Logos/Leagues/NCAAM/Horizon/green-bay-phoenix.png",
  "iu-indianapolis-jaguars": "/logos/Logos/Leagues/NCAAM/Horizon/iu-indianapolis-jaguars.png",
  "milwaukee-panthers": "/logos/Logos/Leagues/NCAAM/Horizon/milwaukee-panthers.png",
  "northern-kentucky-norse": "/logos/Logos/Leagues/NCAAM/Horizon/northern-kentucky-norse.png",
  "oakland-golden-grizzlies": "/logos/Logos/Leagues/NCAAM/Horizon/oakland-golden-grizzlies.png",
  "purdue-fort-wayne-mastodons": "/logos/Logos/Leagues/NCAAM/Horizon/purdue-fort-wayne-mastodons.png",
  "robert-morris-colonials": "/logos/Logos/Leagues/NCAAM/Horizon/robert-morris-colonials.png",
  "wright-state-raiders": "/logos/Logos/Leagues/NCAAM/Horizon/wright-state-raiders.png",
  "youngstown-state-penguins": "/logos/Logos/Leagues/NCAAM/Horizon/youngstown-state-penguins.png",
  // Ivy League
  "brown-bears": "/logos/Logos/Leagues/NCAAM/Ivy League/brown-bears.png",
  "columbia-lions": "/logos/Logos/Leagues/NCAAM/Ivy League/columbia-lions.png",
  "cornell-big-red": "/logos/Logos/Leagues/NCAAM/Ivy League/cornell-big-red.png",
  "dartmouth-big-green": "/logos/Logos/Leagues/NCAAM/Ivy League/dartmouth-big-green.png",
  "harvard-crimson": "/logos/Logos/Leagues/NCAAM/Ivy League/harvard-crimson.png",
  "pennsylvania-quakers": "/logos/Logos/Leagues/NCAAM/Ivy League/pennsylvania-quakers.png",
  "princeton-tigers": "/logos/Logos/Leagues/NCAAM/Ivy League/princeton-tigers.png",
  "yale-bulldogs": "/logos/Logos/Leagues/NCAAM/Ivy League/yale-bulldogs.png",
  // MAAC
  "canisius-golden-griffins": "/logos/Logos/Leagues/NCAAM/MAAC/canisius-golden-griffins.png",
  "fairfield-stags": "/logos/Logos/Leagues/NCAAM/MAAC/fairfield-stags.png",
  "iona-gaels": "/logos/Logos/Leagues/NCAAM/MAAC/iona-gaels.png",
  "manhattan-jaspers": "/logos/Logos/Leagues/NCAAM/MAAC/manhattan-jaspers.png",
  "marist-red-foxes": "/logos/Logos/Leagues/NCAAM/MAAC/marist-red-foxes.png",
  "merrimack-warriors": "/logos/Logos/Leagues/NCAAM/MAAC/merrimack-warriors.png",
  "mount-st-marys-mountaineers": "/logos/Logos/Leagues/NCAAM/MAAC/mount-st-marys-mountaineers.png",
  "niagara-purple-eagles": "/logos/Logos/Leagues/NCAAM/MAAC/niagara-purple-eagles.png",
  "quinnipiac-bobcats": "/logos/Logos/Leagues/NCAAM/MAAC/quinnipiac-bobcats.png",
  "rider-broncs": "/logos/Logos/Leagues/NCAAM/MAAC/rider-broncs.png",
  "sacred-heart-pioneers": "/logos/Logos/Leagues/NCAAM/MAAC/sacred-heart-pioneers.png",
  "saint-peters-peacocks": "/logos/Logos/Leagues/NCAAM/MAAC/saint-peters-peacocks.png",
  "siena-saints": "/logos/Logos/Leagues/NCAAM/MAAC/siena-saints.png",
  // MAC
  "akron-zips": "/logos/Logos/Leagues/NCAAM/MAC/akron-zips.png",
  "ball-state-cardinals": "/logos/Logos/Leagues/NCAAM/MAC/ball-state-cardinals.png",
  "bowling-green-falcons": "/logos/Logos/Leagues/NCAAM/MAC/bowling-green-falcons.png",
  "buffalo-bulls": "/logos/Logos/Leagues/NCAAM/MAC/buffalo-bulls.png",
  "central-michigan-chippewas": "/logos/Logos/Leagues/NCAAM/MAC/central-michigan-chippewas.png",
  "eastern-michigan-eagles": "/logos/Logos/Leagues/NCAAM/MAC/eastern-michigan-eagles.png",
  "kent-state-golden-flashes": "/logos/Logos/Leagues/NCAAM/MAC/kent-state-golden-flashes.png",
  "massachusetts-minutemen": "/logos/Logos/Leagues/NCAAM/MAC/massachusetts-minutemen.png",
  "miami-oh-redhawks": "/logos/Logos/Leagues/NCAAM/MAC/miami-oh-redhawks.png",
  "northern-illinois-huskies": "/logos/Logos/Leagues/NCAAM/MAC/northern-illinois-huskies.png",
  "ohio-bobcats": "/logos/Logos/Leagues/NCAAM/MAC/ohio-bobcats.png",
  "toledo-rockets": "/logos/Logos/Leagues/NCAAM/MAC/toledo-rockets.png",
  "western-michigan-broncos": "/logos/Logos/Leagues/NCAAM/MAC/western-michigan-broncos.png",
  // MEAC
  "coppin-state-eagles": "/logos/Logos/Leagues/NCAAM/MEAC/coppin-state-eagles.png",
  "delaware-state-hornets": "/logos/Logos/Leagues/NCAAM/MEAC/delaware-state-hornets.png",
  "howard-bison": "/logos/Logos/Leagues/NCAAM/MEAC/howard-bison.png",
  "maryland-eastern-shore-hawks": "/logos/Logos/Leagues/NCAAM/MEAC/maryland-eastern-shore-hawks.png",
  "morgan-state-bears": "/logos/Logos/Leagues/NCAAM/MEAC/morgan-state-bears.png",
  "norfolk-state-spartans": "/logos/Logos/Leagues/NCAAM/MEAC/norfolk-state-spartans.png",
  "north-carolina-central-eagles": "/logos/Logos/Leagues/NCAAM/MEAC/north-carolina-central-eagles.png",
  "south-carolina-state-bulldogs": "/logos/Logos/Leagues/NCAAM/MEAC/south-carolina-state-bulldogs.png",
  // MVC
  "belmont-bruins": "/logos/Logos/Leagues/NCAAM/MVC/belmont-bruins.png",
  "bradley-braves": "/logos/Logos/Leagues/NCAAM/MVC/bradley-braves.png",
  "drake-bulldogs": "/logos/Logos/Leagues/NCAAM/MVC/drake-bulldogs.png",
  "evansville-purple-aces": "/logos/Logos/Leagues/NCAAM/MVC/evansville-purple-aces.png",
  "illinois-state-redbirds": "/logos/Logos/Leagues/NCAAM/MVC/illinois-state-redbirds.png",
  "indiana-state-sycamores": "/logos/Logos/Leagues/NCAAM/MVC/indiana-state-sycamores.png",
  "murray-state-racers": "/logos/Logos/Leagues/NCAAM/MVC/murray-state-racers.png",
  "northern-iowa-panthers": "/logos/Logos/Leagues/NCAAM/MVC/northern-iowa-panthers.png",
  "southern-illinois-salukis": "/logos/Logos/Leagues/NCAAM/MVC/southern-illinois-salukis.png",
  "uic-flames": "/logos/Logos/Leagues/NCAAM/MVC/uic-flames.png",
  "valparaiso-beacons": "/logos/Logos/Leagues/NCAAM/MVC/valparaiso-beacons.png",
  // MWC (Mountain West)
  "air-force-falcons": "/logos/Logos/Leagues/NCAAM/MWC/air-force-falcons.png",
  "boise-state-broncos": "/logos/Logos/Leagues/NCAAM/MWC/boise-state-broncos.png",
  "colorado-state-rams": "/logos/Logos/Leagues/NCAAM/MWC/colorado-state-rams.png",
  "fresno-state-bulldogs": "/logos/Logos/Leagues/NCAAM/MWC/fresno-state-bulldogs.png",
  "grand-canyon-lopes": "/logos/Logos/Leagues/NCAAM/MWC/grand-canyon-lopes.png",
  "nevada-wolf-pack": "/logos/Logos/Leagues/NCAAM/MWC/nevada-wolf-pack.png",
  "new-mexico-lobos": "/logos/Logos/Leagues/NCAAM/MWC/new-mexico-lobos.png",
  "san-diego-state-aztecs": "/logos/Logos/Leagues/NCAAM/MWC/san-diego-state-aztecs.png",
  "san-jose-state-spartans": "/logos/Logos/Leagues/NCAAM/MWC/san-jose-state-spartans.png",
  "unlv-rebels": "/logos/Logos/Leagues/NCAAM/MWC/unlv-rebels.png",
  "utah-state-aggies": "/logos/Logos/Leagues/NCAAM/MWC/utah-state-aggies.png",
  "wyoming-cowboys": "/logos/Logos/Leagues/NCAAM/MWC/wyoming-cowboys.png",
  // NEC
  "central-connecticut-blue-devils": "/logos/Logos/Leagues/NCAAM/NEC/central-connecticut-blue-devils.png",
  "chicago-state-cougars": "/logos/Logos/Leagues/NCAAM/NEC/chicago-state-cougars.png",
  "fairleigh-dickinson-knights": "/logos/Logos/Leagues/NCAAM/NEC/fairleigh-dickinson-knights.png",
  "le-moyne-dolphins": "/logos/Logos/Leagues/NCAAM/NEC/le-moyne-dolphins.png",
  "long-island-university-sharks": "/logos/Logos/Leagues/NCAAM/NEC/long-island-university-sharks.png",
  "mercyhurst-lakers": "/logos/Logos/Leagues/NCAAM/NEC/mercyhurst-lakers.png",
  "new-haven-chargers": "/logos/Logos/Leagues/NCAAM/NEC/new-haven-chargers.png",
  "saint-francis-red-flash": "/logos/Logos/Leagues/NCAAM/NEC/saint-francis-red-flash.png",
  "stonehill-skyhawks": "/logos/Logos/Leagues/NCAAM/NEC/stonehill-skyhawks.png",
  "wagner-seahawks": "/logos/Logos/Leagues/NCAAM/NEC/wagner-seahawks.png",
  // OVC
  "eastern-illinois-panthers": "/logos/Logos/Leagues/NCAAM/OVC/eastern-illinois-panthers.png",
  "lindenwood-lions": "/logos/Logos/Leagues/NCAAM/OVC/lindenwood-lions.png",
  "little-rock-trojans": "/logos/Logos/Leagues/NCAAM/OVC/little-rock-trojans.png",
  "morehead-state-eagles": "/logos/Logos/Leagues/NCAAM/OVC/morehead-state-eagles.png",
  "siu-edwardsville-cougars": "/logos/Logos/Leagues/NCAAM/OVC/siu-edwardsville-cougars.png",
  "southeast-missouri-state-redhawks": "/logos/Logos/Leagues/NCAAM/OVC/southeast-missouri-state-redhawks.png",
  "southern-indiana-screaming-eagles": "/logos/Logos/Leagues/NCAAM/OVC/southern-indiana-screaming-eagles.png",
  "tennessee-state-tigers": "/logos/Logos/Leagues/NCAAM/OVC/tennessee-state-tigers.png",
  "tennessee-tech-golden-eagles": "/logos/Logos/Leagues/NCAAM/OVC/tennessee-tech-golden-eagles.png",
  "ut-martin-skyhawks": "/logos/Logos/Leagues/NCAAM/OVC/ut-martin-skyhawks.png",
  "western-illinois-leathernecks": "/logos/Logos/Leagues/NCAAM/OVC/western-illinois-leathernecks.png",
  // Patriot League
  "american-university-eagles": "/logos/Logos/Leagues/NCAAM/Patriot League/american-university-eagles.png",
  "army-black-knights": "/logos/Logos/Leagues/NCAAM/Patriot League/army-black-knights.png",
  "boston-university-terriers": "/logos/Logos/Leagues/NCAAM/Patriot League/boston-university-terriers.png",
  "bucknell-bison": "/logos/Logos/Leagues/NCAAM/Patriot League/bucknell-bison.png",
  "colgate-raiders": "/logos/Logos/Leagues/NCAAM/Patriot League/colgate-raiders.png",
  "holy-cross-crusaders": "/logos/Logos/Leagues/NCAAM/Patriot League/holy-cross-crusaders.png",
  "lafayette-leopards": "/logos/Logos/Leagues/NCAAM/Patriot League/lafayette-leopards.png",
  "lehigh-mountain-hawks": "/logos/Logos/Leagues/NCAAM/Patriot League/lehigh-mountain-hawks.png",
  "loyola-maryland-greyhounds": "/logos/Logos/Leagues/NCAAM/Patriot League/loyola-maryland-greyhounds.png",
  "navy-midshipmen": "/logos/Logos/Leagues/NCAAM/Patriot League/navy-midshipmen.png",
  // SEC
  "alabama-crimson-tide": "/logos/Logos/Leagues/NCAAM/SEC/alabama-crimson-tide.png",
  "arkansas-razorbacks": "/logos/Logos/Leagues/NCAAM/SEC/arkansas-razorbacks.png",
  "auburn-tigers": "/logos/Logos/Leagues/NCAAM/SEC/auburn-tigers.png",
  "florida-gators": "/logos/Logos/Leagues/NCAAM/SEC/florida-gators.png",
  "georgia-bulldogs": "/logos/Logos/Leagues/NCAAM/SEC/georgia-bulldogs.png",
  "kentucky-wildcats": "/logos/Logos/Leagues/NCAAM/SEC/kentucky-wildcats.png",
  "lsu-tigers": "/logos/Logos/Leagues/NCAAM/SEC/lsu-tigers.png",
  "mississippi-state-bulldogs": "/logos/Logos/Leagues/NCAAM/SEC/mississippi-state-bulldogs.png",
  "missouri-tigers": "/logos/Logos/Leagues/NCAAM/SEC/missouri-tigers.png",
  "oklahoma-sooners": "/logos/Logos/Leagues/NCAAM/SEC/oklahoma-sooners.png",
  "ole-miss-rebels": "/logos/Logos/Leagues/NCAAM/SEC/ole-miss-rebels.png",
  "south-carolina-gamecocks": "/logos/Logos/Leagues/NCAAM/SEC/south-carolina-gamecocks.png",
  "tennessee-volunteers": "/logos/Logos/Leagues/NCAAM/SEC/tennessee-volunteers.png",
  "texas-am-aggies": "/logos/Logos/Leagues/NCAAM/SEC/texas-am-aggies.png",
  "texas-longhorns": "/logos/Logos/Leagues/NCAAM/SEC/texas-longhorns.png",
  "vanderbilt-commodores": "/logos/Logos/Leagues/NCAAM/SEC/vanderbilt-commodores.png",
  // Southern
  "chattanooga-mocs": "/logos/Logos/Leagues/NCAAM/Southern/chattanooga-mocs.png",
  "east-tennessee-state-buccaneers": "/logos/Logos/Leagues/NCAAM/Southern/east-tennessee-state-buccaneers.png",
  "furman-paladins": "/logos/Logos/Leagues/NCAAM/Southern/furman-paladins.png",
  "mercer-bears": "/logos/Logos/Leagues/NCAAM/Southern/mercer-bears.png",
  "samford-bulldogs": "/logos/Logos/Leagues/NCAAM/Southern/samford-bulldogs.png",
  "the-citadel-bulldogs": "/logos/Logos/Leagues/NCAAM/Southern/the-citadel-bulldogs.png",
  "unc-greensboro-spartans": "/logos/Logos/Leagues/NCAAM/Southern/unc-greensboro-spartans.png",
  "vmi-keydets": "/logos/Logos/Leagues/NCAAM/Southern/vmi-keydets.png",
  "western-carolina-catamounts": "/logos/Logos/Leagues/NCAAM/Southern/western-carolina-catamounts.png",
  "wofford-terriers": "/logos/Logos/Leagues/NCAAM/Southern/wofford-terriers.png",
  // Southland
  "east-texas-am-lions": "/logos/Logos/Leagues/NCAAM/Southland/east-texas-am-lions.png",
  "houston-christian-huskies": "/logos/Logos/Leagues/NCAAM/Southland/houston-christian-huskies.png",
  "incarnate-word-cardinals": "/logos/Logos/Leagues/NCAAM/Southland/incarnate-word-cardinals.png",
  "lamar-cardinals": "/logos/Logos/Leagues/NCAAM/Southland/lamar-cardinals.png",
  "mcneese-cowboys": "/logos/Logos/Leagues/NCAAM/Southland/mcneese-cowboys.png",
  "new-orleans-privateers": "/logos/Logos/Leagues/NCAAM/Southland/new-orleans-privateers.png",
  "nicholls-colonels": "/logos/Logos/Leagues/NCAAM/Southland/nicholls-colonels.png",
  "northwestern-state-demons": "/logos/Logos/Leagues/NCAAM/Southland/northwestern-state-demons.png",
  "se-louisiana-lions": "/logos/Logos/Leagues/NCAAM/Southland/se-louisiana-lions.png",
  "stephen-f-austin-lumberjacks": "/logos/Logos/Leagues/NCAAM/Southland/stephen-f-austin-lumberjacks.png",
  "texas-am-corpus-christi-islanders": "/logos/Logos/Leagues/NCAAM/Southland/texas-am-corpus-christi-islanders.png",
  "ut-rio-grande-valley-vaqueros": "/logos/Logos/Leagues/NCAAM/Southland/ut-rio-grande-valley-vaqueros.png",
  // Summit League
  "denver-pioneers": "/logos/Logos/Leagues/NCAAM/Summit League/denver-pioneers.png",
  "kansas-city-roos": "/logos/Logos/Leagues/NCAAM/Summit League/kansas-city-roos.png",
  "north-dakota-fighting-hawks": "/logos/Logos/Leagues/NCAAM/Summit League/north-dakota-fighting-hawks.png",
  "north-dakota-state-bison": "/logos/Logos/Leagues/NCAAM/Summit League/north-dakota-state-bison.png",
  "omaha-mavericks": "/logos/Logos/Leagues/NCAAM/Summit League/omaha-mavericks.png",
  "oral-roberts-golden-eagles": "/logos/Logos/Leagues/NCAAM/Summit League/oral-roberts-golden-eagles.png",
  "south-dakota-coyotes": "/logos/Logos/Leagues/NCAAM/Summit League/south-dakota-coyotes.png",
  "south-dakota-state-jackrabbits": "/logos/Logos/Leagues/NCAAM/Summit League/south-dakota-state-jackrabbits.png",
  "st-thomas-minnesota-tommies": "/logos/Logos/Leagues/NCAAM/Summit League/st-thomas-minnesota-tommies.png",
  // Sun Belt
  "app-state-mountaineers": "/logos/Logos/Leagues/NCAAM/Sun Belt/app-state-mountaineers.png",
  "arkansas-state-red-wolves": "/logos/Logos/Leagues/NCAAM/Sun Belt/arkansas-state-red-wolves.png",
  "coastal-carolina-chanticleers": "/logos/Logos/Leagues/NCAAM/Sun Belt/coastal-carolina-chanticleers.png",
  "georgia-southern-eagles": "/logos/Logos/Leagues/NCAAM/Sun Belt/georgia-southern-eagles.png",
  "georgia-state-panthers": "/logos/Logos/Leagues/NCAAM/Sun Belt/georgia-state-panthers.png",
  "james-madison-dukes": "/logos/Logos/Leagues/NCAAM/Sun Belt/james-madison-dukes.png",
  "louisiana-ragin-cajuns": "/logos/Logos/Leagues/NCAAM/Sun Belt/louisiana-ragin-cajuns.png",
  "marshall-thundering-herd": "/logos/Logos/Leagues/NCAAM/Sun Belt/marshall-thundering-herd.png",
  "old-dominion-monarchs": "/logos/Logos/Leagues/NCAAM/Sun Belt/old-dominion-monarchs.png",
  "south-alabama-jaguars": "/logos/Logos/Leagues/NCAAM/Sun Belt/south-alabama-jaguars.png",
  "southern-miss-golden-eagles": "/logos/Logos/Leagues/NCAAM/Sun Belt/southern-miss-golden-eagles.png",
  "texas-state-bobcats": "/logos/Logos/Leagues/NCAAM/Sun Belt/texas-state-bobcats.png",
  "troy-trojans": "/logos/Logos/Leagues/NCAAM/Sun Belt/troy-trojans.png",
  "ul-monroe-warhawks": "/logos/Logos/Leagues/NCAAM/Sun Belt/ul-monroe-warhawks.png",
  // SWAC
  "alabama-am-bulldogs": "/logos/Logos/Leagues/NCAAM/SWAC/alabama-am-bulldogs.png",
  "alabama-state-hornets": "/logos/Logos/Leagues/NCAAM/SWAC/alabama-state-hornets.png",
  "alcorn-state-braves": "/logos/Logos/Leagues/NCAAM/SWAC/alcorn-state-braves.png",
  "arkansas-pine-bluff-golden-lions": "/logos/Logos/Leagues/NCAAM/SWAC/arkansas-pine-bluff-golden-lions.png",
  "bethune-cookman-wildcats": "/logos/Logos/Leagues/NCAAM/SWAC/bethune-cookman-wildcats.png",
  "florida-am-rattlers": "/logos/Logos/Leagues/NCAAM/SWAC/florida-am-rattlers.png",
  "grambling-tigers": "/logos/Logos/Leagues/NCAAM/SWAC/grambling-tigers.png",
  "jackson-state-tigers": "/logos/Logos/Leagues/NCAAM/SWAC/jackson-state-tigers.png",
  "mississippi-valley-state-delta-devils": "/logos/Logos/Leagues/NCAAM/SWAC/mississippi-valley-state-delta-devils.png",
  "prairie-view-am-panthers": "/logos/Logos/Leagues/NCAAM/SWAC/prairie-view-am-panthers.png",
  "southern-jaguars": "/logos/Logos/Leagues/NCAAM/SWAC/southern-jaguars.png",
  "texas-southern-tigers": "/logos/Logos/Leagues/NCAAM/SWAC/texas-southern-tigers.png",
  // WAC
  "abilene-christian-wildcats": "/logos/Logos/Leagues/NCAAM/WAC/abilene-christian-wildcats.png",
  "california-baptist-lancers": "/logos/Logos/Leagues/NCAAM/WAC/california-baptist-lancers.png",
  "southern-utah-thunderbirds": "/logos/Logos/Leagues/NCAAM/WAC/southern-utah-thunderbirds.png",
  "tarleton-state-texans": "/logos/Logos/Leagues/NCAAM/WAC/tarleton-state-texans.png",
  "ut-arlington-mavericks": "/logos/Logos/Leagues/NCAAM/WAC/ut-arlington-mavericks.png",
  "utah-tech-trailblazers": "/logos/Logos/Leagues/NCAAM/WAC/utah-tech-trailblazers.png",
  "utah-valley-wolverines": "/logos/Logos/Leagues/NCAAM/WAC/utah-valley-wolverines.png",
  // WCC
  "gonzaga-bulldogs": "/logos/Logos/Leagues/NCAAM/WCC/gonzaga-bulldogs.png",
  "loyola-marymount-lions": "/logos/Logos/Leagues/NCAAM/WCC/loyola-marymount-lions.png",
  "oregon-state-beavers": "/logos/Logos/Leagues/NCAAM/WCC/oregon-state-beavers.png",
  "pacific-tigers": "/logos/Logos/Leagues/NCAAM/WCC/pacific-tigers.png",
  "pepperdine-waves": "/logos/Logos/Leagues/NCAAM/WCC/pepperdine-waves.png",
  "portland-pilots": "/logos/Logos/Leagues/NCAAM/WCC/portland-pilots.png",
  "saint-marys-gaels": "/logos/Logos/Leagues/NCAAM/WCC/saint-marys-gaels.png",
  "san-diego-toreros": "/logos/Logos/Leagues/NCAAM/WCC/san-diego-toreros.png",
  "san-francisco-dons": "/logos/Logos/Leagues/NCAAM/WCC/san-francisco-dons.png",
  "santa-clara-broncos": "/logos/Logos/Leagues/NCAAM/WCC/santa-clara-broncos.png",
  "seattle-u-redhawks": "/logos/Logos/Leagues/NCAAM/WCC/seattle-u-redhawks.png",
  "washington-state-cougars": "/logos/Logos/Leagues/NCAAM/WCC/washington-state-cougars.png",
};

export function getTeamLogo(sport: string, espnAbbr: string, teamSlug?: string): string {
  console.log(`🖼️ [TEAM LOGO] Looking up logo for ${sport} - slug: "${teamSlug}", espnAbbr: "${espnAbbr}"`);
  
  if (teamSlug) {
    let logoPath: string | null = null;
    
    if (sport === "NFL") logoPath = findBestMatch(teamSlug, NFL_LOGO_PATHS, sport);
    else if (sport === "NBA") logoPath = findBestMatch(teamSlug, NBA_LOGO_PATHS, sport);
    else if (sport === "NHL") logoPath = findBestMatch(teamSlug, NHL_LOGO_PATHS, sport);
    else if (sport === "MLB") logoPath = findBestMatch(teamSlug, MLB_LOGO_PATHS, sport);
    else if (sport === "NCAAF") logoPath = findBestMatch(teamSlug, NCAAF_LOGO_PATHS, sport);
    else if (sport === "NCAAM") logoPath = findBestMatch(teamSlug, NCAAM_LOGO_PATHS, sport);
    
    if (logoPath) {
      console.log(`✅ [TEAM LOGO] Found local logo: ${logoPath}`);
      return logoPath;
    } else {
      console.warn(`⚠️ [TEAM LOGO] No local logo found for "${teamSlug}" in ${sport}, falling back to CDN`);
    }
  } else {
    console.warn(`⚠️ [TEAM LOGO] No teamSlug provided for ${sport}, using CDN`);
  }
  
  const cdnUrl = (sport === "NCAAF" || sport === "NCAAM")
    ? `https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${espnAbbr}.png&h=200&w=200`
    : `https://a.espncdn.com/combiner/i?img=/i/teamlogos/${sport.toLowerCase()}/500/${espnAbbr}.png&h=200&w=200`;
  
  console.log(`📡 [TEAM LOGO] Using CDN URL: ${cdnUrl}`);
  return cdnUrl;
}
