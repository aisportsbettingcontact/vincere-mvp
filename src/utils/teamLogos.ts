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
  "buffalo-bills": "/logos/Leagues/NFL/AFC/AFC East/buffalo-bills.png",
  "miami-dolphins": "/logos/Leagues/NFL/AFC/AFC East/miami-dolphins.png",
  "new-england-patriots": "/logos/Leagues/NFL/AFC/AFC East/new-england-patriots.png",
  "new-york-jets": "/logos/Leagues/NFL/AFC/AFC East/new-york-jets.png",
  "baltimore-ravens": "/logos/Leagues/NFL/AFC/AFC North/baltimore-ravens.png",
  "cincinnati-bengals": "/logos/Leagues/NFL/AFC/AFC North/cincinnati-bengals.png",
  "cleveland-browns": "/logos/Leagues/NFL/AFC/AFC North/cleveland-browns.png",
  "pittsburgh-steelers": "/logos/Leagues/NFL/AFC/AFC North/pittsburgh-steelers.png",
  "houston-texans": "/logos/Leagues/NFL/AFC/AFC South/houston-texans.png",
  "indianapolis-colts": "/logos/Leagues/NFL/AFC/AFC South/indianapolis-colts.png",
  "jacksonville-jaguars": "/logos/Leagues/NFL/AFC/AFC South/jacksonville-jaguars.png",
  "tennessee-titans": "/logos/Leagues/NFL/AFC/AFC South/tennessee-titans.png",
  "denver-broncos": "/logos/Leagues/NFL/AFC/AFC West/denver-broncos.png",
  "kansas-city-chiefs": "/logos/Leagues/NFL/AFC/AFC West/kansas-city-chiefs.png",
  "las-vegas-raiders": "/logos/Leagues/NFL/AFC/AFC West/las-vegas-raiders.png",
  "los-angeles-chargers": "/logos/Leagues/NFL/AFC/AFC West/los-angeles-chargers.png",
  "dallas-cowboys": "/logos/Leagues/NFL/NFC/NFC East/dallas-cowboys.png",
  "new-york-giants": "/logos/Leagues/NFL/NFC/NFC East/new-york-giants.png",
  "philadelphia-eagles": "/logos/Leagues/NFL/NFC/NFC East/philadelphia-eagles.png",
  "washington-commanders": "/logos/Leagues/NFL/NFC/NFC East/washington-commanders.png",
  "chicago-bears": "/logos/Leagues/NFL/NFC/NFC North/chicago-bears.png",
  "detroit-lions": "/logos/Leagues/NFL/NFC/NFC North/detroit-lions.png",
  "green-bay-packers": "/logos/Leagues/NFL/NFC/NFC North/green-bay-packers.png",
  "minnesota-vikings": "/logos/Leagues/NFL/NFC/NFC North/minnesota-vikings.png",
  "atlanta-falcons": "/logos/Leagues/NFL/NFC/NFC South/atlanta-falcons.png",
  "carolina-panthers": "/logos/Leagues/NFL/NFC/NFC South/carolina-panthers.png",
  "new-orleans-saints": "/logos/Leagues/NFL/NFC/NFC South/new-orleans-saints.png",
  "tampa-bay-buccaneers": "/logos/Leagues/NFL/NFC/NFC South/tampa-bay-buccaneers.png",
  "arizona-cardinals": "/logos/Leagues/NFL/NFC/NFC West/arizona-cardinals.png",
  "los-angeles-rams": "/logos/Leagues/NFL/NFC/NFC West/los-angeles-rams.png",
  "san-francisco-49ers": "/logos/Leagues/NFL/NFC/NFC West/san-francisco-49ers.png",
  "seattle-seahawks": "/logos/Leagues/NFL/NFC/NFC West/seattle-seahawks.png",
};

// NBA Logo Paths (30 teams)
const NBA_LOGO_PATHS: Record<string, string> = {
  "boston-celtics": "/logos/Leagues/NBA/Eastern/Atlantic/boston-celtics.png",
  "brooklyn-nets": "/logos/Leagues/NBA/Eastern/Atlantic/brooklyn-nets.png",
  "new-york-knicks": "/logos/Leagues/NBA/Eastern/Atlantic/new-york-knicks.png",
  "philadelphia-76ers": "/logos/Leagues/NBA/Eastern/Atlantic/philadelphia-76ers.png",
  "toronto-raptors": "/logos/Leagues/NBA/Eastern/Atlantic/toronto-raptors.png",
  "chicago-bulls": "/logos/Leagues/NBA/Eastern/Central/chicago-bulls.png",
  "cleveland-cavaliers": "/logos/Leagues/NBA/Eastern/Central/cleveland-cavaliers.png",
  "detroit-pistons": "/logos/Leagues/NBA/Eastern/Central/detroit-pistons.png",
  "indiana-pacers": "/logos/Leagues/NBA/Eastern/Central/indiana-pacers.png",
  "milwaukee-bucks": "/logos/Leagues/NBA/Eastern/Central/milwaukee-bucks.png",
  "atlanta-hawks": "/logos/Leagues/NBA/Eastern/Southeast/atlanta-hawks.png",
  "charlotte-hornets": "/logos/Leagues/NBA/Eastern/Southeast/charlotte-hornets.png",
  "miami-heat": "/logos/Leagues/NBA/Eastern/Southeast/miami-heat.png",
  "orlando-magic": "/logos/Leagues/NBA/Eastern/Southeast/orlando-magic.png",
  "washington-wizards": "/logos/Leagues/NBA/Eastern/Southeast/washington-wizards.png",
  "denver-nuggets": "/logos/Leagues/NBA/Western/Northwest/denver-nuggets.png",
  "minnesota-timberwolves": "/logos/Leagues/NBA/Western/Northwest/minnesota-timberwolves.png",
  "oklahoma-city-thunder": "/logos/Leagues/NBA/Western/Northwest/oklahoma-city-thunder.png",
  "portland-trail-blazers": "/logos/Leagues/NBA/Western/Northwest/portland-trail-blazers.png",
  "utah-jazz": "/logos/Leagues/NBA/Western/Northwest/utah-jazz.png",
  "golden-state-warriors": "/logos/Leagues/NBA/Western/Pacific/golden-state-warriors.png",
  "la-clippers": "/logos/Leagues/NBA/Western/Pacific/la-clippers.png",
  "los-angeles-lakers": "/logos/Leagues/NBA/Western/Pacific/los-angeles-lakers.png",
  "phoenix-suns": "/logos/Leagues/NBA/Western/Pacific/phoenix-suns.png",
  "sacramento-kings": "/logos/Leagues/NBA/Western/Pacific/sacramento-kings.png",
  "dallas-mavericks": "/logos/Leagues/NBA/Western/Southwest/dallas-mavericks.png",
  "houston-rockets": "/logos/Leagues/NBA/Western/Southwest/houston-rockets.png",
  "memphis-grizzlies": "/logos/Leagues/NBA/Western/Southwest/memphis-grizzlies.png",
  "new-orleans-pelicans": "/logos/Leagues/NBA/Western/Southwest/new-orleans-pelicans.png",
  "san-antonio-spurs": "/logos/Leagues/NBA/Western/Southwest/san-antonio-spurs.png",
};

// NHL Logo Paths (32 teams)
const NHL_LOGO_PATHS: Record<string, string> = {
  "boston-bruins": "/logos/Leagues/NHL/Eastern/Atlantic/boston-bruins.png",
  "buffalo-sabres": "/logos/Leagues/NHL/Eastern/Atlantic/buffalo-sabres.png",
  "detroit-red-wings": "/logos/Leagues/NHL/Eastern/Atlantic/detroit-red-wings.png",
  "florida-panthers": "/logos/Leagues/NHL/Eastern/Atlantic/florida-panthers.png",
  "montreal-canadiens": "/logos/Leagues/NHL/Eastern/Atlantic/montreal-canadiens.png",
  "ottawa-senators": "/logos/Leagues/NHL/Eastern/Atlantic/ottawa-senators.png",
  "tampa-bay-lightning": "/logos/Leagues/NHL/Eastern/Atlantic/tampa-bay-lightning.png",
  "toronto-maple-leafs": "/logos/Leagues/NHL/Eastern/Atlantic/toronto-maple-leafs.png",
  "carolina-hurricanes": "/logos/Leagues/NHL/Eastern/Metropolitan/carolina-hurricanes.png",
  "columbus-blue-jackets": "/logos/Leagues/NHL/Eastern/Metropolitan/columbus-blue-jackets.png",
  "new-jersey-devils": "/logos/Leagues/NHL/Eastern/Metropolitan/new-jersey-devils.png",
  "new-york-islanders": "/logos/Leagues/NHL/Eastern/Metropolitan/new-york-islanders.png",
  "ny-islanders": "/logos/Leagues/NHL/Eastern/Metropolitan/new-york-islanders.png",
  "new-york-rangers": "/logos/Leagues/NHL/Eastern/Metropolitan/new-york-rangers.png",
  "ny-rangers": "/logos/Leagues/NHL/Eastern/Metropolitan/new-york-rangers.png",
  "philadelphia-flyers": "/logos/Leagues/NHL/Eastern/Metropolitan/philadelphia-flyers.png",
  "pittsburgh-penguins": "/logos/Leagues/NHL/Eastern/Metropolitan/pittsburgh-penguins.png",
  "washington-capitals": "/logos/Leagues/NHL/Eastern/Metropolitan/washington-capitals.png",
  "chicago-blackhawks": "/logos/Leagues/NHL/Western/Central/chicago-blackhawks.png",
  "colorado-avalanche": "/logos/Leagues/NHL/Western/Central/colorado-avalanche.png",
  "dallas-stars": "/logos/Leagues/NHL/Western/Central/dallas-stars.png",
  "minnesota-wild": "/logos/Leagues/NHL/Western/Central/minnesota-wild.png",
  "nashville-predators": "/logos/Leagues/NHL/Western/Central/nashville-predators.png",
  "st-louis-blues": "/logos/Leagues/NHL/Western/Central/st-louis-blues.png",
  "utah-hockey-club": "/logos/Leagues/NHL/Western/Central/utah-mammoth.png",
  "utah-mammoth": "/logos/Leagues/NHL/Western/Central/utah-mammoth.png",
  "winnipeg-jets": "/logos/Leagues/NHL/Western/Central/winnipeg-jets.png",
  "anaheim-ducks": "/logos/Leagues/NHL/Western/Pacific/anaheim-ducks.png",
  "calgary-flames": "/logos/Leagues/NHL/Western/Pacific/calgary-flames.png",
  "edmonton-oilers": "/logos/Leagues/NHL/Western/Pacific/edmonton-oilers.png",
  "los-angeles-kings": "/logos/Leagues/NHL/Western/Pacific/los-angeles-kings.png",
  "san-jose-sharks": "/logos/Leagues/NHL/Western/Pacific/san-jose-sharks.png",
  "seattle-kraken": "/logos/Leagues/NHL/Western/Pacific/seattle-kraken.png",
  "vancouver-canucks": "/logos/Leagues/NHL/Western/Pacific/vancouver-canucks.png",
  "vegas-golden-knights": "/logos/Leagues/NHL/Western/Pacific/vegas-golden-knights.png",
};

// MLB Logo Paths (30 teams)
const MLB_LOGO_PATHS: Record<string, string> = {
  "chicago-white-sox": "/logos/Leagues/MLB/Teams/AL/AL Central/chicago-white-sox.png",
  "cleveland-guardians": "/logos/Leagues/MLB/Teams/AL/AL Central/cleveland-guardians.png",
  "detroit-tigers": "/logos/Leagues/MLB/Teams/AL/AL Central/detroit-tigers.png",
  "kansas-city-royals": "/logos/Leagues/MLB/Teams/AL/AL Central/kansas-city-royals.png",
  "minnesota-twins": "/logos/Leagues/MLB/Teams/AL/AL Central/minnesota-twins.png",
  "baltimore-orioles": "/logos/Leagues/MLB/Teams/AL/AL East/baltimore-orioles.png",
  "boston-red-sox": "/logos/Leagues/MLB/Teams/AL/AL East/boston-red-sox.png",
  "new-york-yankees": "/logos/Leagues/MLB/Teams/AL/AL East/new-york-yankees.png",
  "tampa-bay-rays": "/logos/Leagues/MLB/Teams/AL/AL East/tampa-bay-rays.png",
  "toronto-blue-jays": "/logos/Leagues/MLB/Teams/AL/AL East/toronto-blue-jays.png",
  "athletics": "/logos/Leagues/MLB/Teams/AL/AL West/athletics.png",
  "oakland-athletics": "/logos/Leagues/MLB/Teams/AL/AL West/athletics.png",
  "houston-astros": "/logos/Leagues/MLB/Teams/AL/AL West/houston-astros.png",
  "los-angeles-angels": "/logos/Leagues/MLB/Teams/AL/AL West/los-angeles-angels.png",
  "seattle-mariners": "/logos/Leagues/MLB/Teams/AL/AL West/seattle-mariners.png",
  "texas-rangers": "/logos/Leagues/MLB/Teams/AL/AL West/texas-rangers.png",
  "chicago-cubs": "/logos/Leagues/MLB/Teams/NL/NL Central/chicago-cubs.png",
  "cincinnati-reds": "/logos/Leagues/MLB/Teams/NL/NL Central/cincinnati-reds.png",
  "milwaukee-brewers": "/logos/Leagues/MLB/Teams/NL/NL Central/milwaukee-brewers.png",
  "pittsburgh-pirates": "/logos/Leagues/MLB/Teams/NL/NL Central/pittsburgh-pirates.png",
  "st-louis-cardinals": "/logos/Leagues/MLB/Teams/NL/NL Central/st-louis-cardinals.png",
  "atlanta-braves": "/logos/Leagues/MLB/Teams/NL/NL East/atlanta-braves.png",
  "miami-marlins": "/logos/Leagues/MLB/Teams/NL/NL East/miami-marlins.png",
  "new-york-mets": "/logos/Leagues/MLB/Teams/NL/NL East/new-york-mets.png",
  "philadelphia-phillies": "/logos/Leagues/MLB/Teams/NL/NL East/philadelphia-phillies.png",
  "washington-nationals": "/logos/Leagues/MLB/Teams/NL/NL East/washington-nationals.png",
  "arizona-diamondbacks": "/logos/Leagues/MLB/Teams/NL/NL West/arizona-diamondbacks.png",
  "colorado-rockies": "/logos/Leagues/MLB/Teams/NL/NL West/colorado-rockies.png",
  "los-angeles-dodgers": "/logos/Leagues/MLB/Teams/NL/NL West/los-angeles-dodgers.png",
  "san-diego-padres": "/logos/Leagues/MLB/Teams/NL/NL West/san-diego-padres.png",
  "san-francisco-giants": "/logos/Leagues/MLB/Teams/NL/NL West/san-francisco-giants.png",
};

// NCAAF Logo Paths - All conferences
const NCAAF_LOGO_PATHS: Record<string, string> = {
  "boston-college-eagles": "/logos/Leagues/NCAAF/ACC/boston-college-eagles.png",
  "california-golden-bears": "/logos/Leagues/NCAAF/ACC/california-golden-bears.png",
  "clemson-tigers": "/logos/Leagues/NCAAF/ACC/clemson-tigers.png",
  "duke-blue-devils": "/logos/Leagues/NCAAF/ACC/duke-blue-devils.png",
  "florida-state-seminoles": "/logos/Leagues/NCAAF/ACC/florida-state-seminoles.png",
  "georgia-tech-yellow-jackets": "/logos/Leagues/NCAAF/ACC/georgia-tech-yellow-jackets.png",
  "louisville-cardinals": "/logos/Leagues/NCAAF/ACC/louisville-cardinals.png",
  "miami-hurricanes": "/logos/Leagues/NCAAF/ACC/miami-hurricanes.png",
  "nc-state-wolfpack": "/logos/Leagues/NCAAF/ACC/nc-state-wolfpack.png",
  "north-carolina-tar-heels": "/logos/Leagues/NCAAF/ACC/north-carolina-tar-heels.png",
  "pittsburgh-panthers": "/logos/Leagues/NCAAF/ACC/pittsburgh-panthers.png",
  "smu-mustangs": "/logos/Leagues/NCAAF/ACC/smu-mustangs.png",
  "stanford-cardinal": "/logos/Leagues/NCAAF/ACC/stanford-cardinal.png",
  "syracuse-orange": "/logos/Leagues/NCAAF/ACC/syracuse-orange.png",
  "virginia-cavaliers": "/logos/Leagues/NCAAF/ACC/virginia-cavaliers.png",
  "virginia-tech-hokies": "/logos/Leagues/NCAAF/ACC/virginia-tech-hokies.png",
  "wake-forest-demon-deacons": "/logos/Leagues/NCAAF/ACC/wake-forest-demon-deacons.png",
  "army-black-knights": "/logos/Leagues/NCAAF/American/army-black-knights.png",
  "charlotte-49ers": "/logos/Leagues/NCAAF/American/charlotte-49ers.png",
  "east-carolina-pirates": "/logos/Leagues/NCAAF/American/east-carolina-pirates.png",
  "florida-atlantic-owls": "/logos/Leagues/NCAAF/American/florida-atlantic-owls.png",
  "memphis-tigers": "/logos/Leagues/NCAAF/American/memphis-tigers.png",
  "navy-midshipmen": "/logos/Leagues/NCAAF/American/navy-midshipmen.png",
  "north-texas-mean-green": "/logos/Leagues/NCAAF/American/north-texas-mean-green.png",
  "rice-owls": "/logos/Leagues/NCAAF/American/rice-owls.png",
  "south-florida-bulls": "/logos/Leagues/NCAAF/American/south-florida-bulls.png",
  "temple-owls": "/logos/Leagues/NCAAF/American/temple-owls.png",
  "tulane-green-wave": "/logos/Leagues/NCAAF/American/tulane-green-wave.png",
  "tulsa-golden-hurricane": "/logos/Leagues/NCAAF/American/tulsa-golden-hurricane.png",
  "uab-blazers": "/logos/Leagues/NCAAF/American/uab-blazers.png",
  "utsa-roadrunners": "/logos/Leagues/NCAAF/American/utsa-roadrunners.png",
  "arizona-state-sun-devils": "/logos/Leagues/NCAAF/Big 12/arizona-state-sun-devils.png",
  "arizona-wildcats": "/logos/Leagues/NCAAF/Big 12/arizona-wildcats.png",
  "baylor-bears": "/logos/Leagues/NCAAF/Big 12/baylor-bears.png",
  "byu-cougars": "/logos/Leagues/NCAAF/Big 12/byu-cougars.png",
  "cincinnati-bearcats": "/logos/Leagues/NCAAF/Big 12/cincinnati-bearcats.png",
  "colorado-buffaloes": "/logos/Leagues/NCAAF/Big 12/colorado-buffaloes.png",
  "houston-cougars": "/logos/Leagues/NCAAF/Big 12/houston-cougars.png",
  "iowa-state-cyclones": "/logos/Leagues/NCAAF/Big 12/iowa-state-cyclones.png",
  "kansas-jayhawks": "/logos/Leagues/NCAAF/Big 12/kansas-jayhawks.png",
  "kansas-state-wildcats": "/logos/Leagues/NCAAF/Big 12/kansas-state-wildcats.png",
  "oklahoma-state-cowboys": "/logos/Leagues/NCAAF/Big 12/oklahoma-state-cowboys.png",
  "tcu-horned-frogs": "/logos/Leagues/NCAAF/Big 12/tcu-horned-frogs.png",
  "texas-tech-red-raiders": "/logos/Leagues/NCAAF/Big 12/texas-tech-red-raiders.png",
  "ucf-knights": "/logos/Leagues/NCAAF/Big 12/ucf-knights.png",
  "utah-utes": "/logos/Leagues/NCAAF/Big 12/utah-utes.png",
  "west-virginia-mountaineers": "/logos/Leagues/NCAAF/Big 12/west-virginia-mountaineers.png",
  "illinois-fighting-illini": "/logos/Leagues/NCAAF/Big Ten/illinois-fighting-illini.png",
  "indiana-hoosiers": "/logos/Leagues/NCAAF/Big Ten/indiana-hoosiers.png",
  "iowa-hawkeyes": "/logos/Leagues/NCAAF/Big Ten/iowa-hawkeyes.png",
  "maryland-terrapins": "/logos/Leagues/NCAAF/Big Ten/maryland-terrapins.png",
  "michigan-state-spartans": "/logos/Leagues/NCAAF/Big Ten/michigan-state-spartans.png",
  "michigan-wolverines": "/logos/Leagues/NCAAF/Big Ten/michigan-wolverines.png",
  "minnesota-golden-gophers": "/logos/Leagues/NCAAF/Big Ten/minnesota-golden-gophers.png",
  "nebraska-cornhuskers": "/logos/Leagues/NCAAF/Big Ten/nebraska-cornhuskers.png",
  "northwestern-wildcats": "/logos/Leagues/NCAAF/Big Ten/northwestern-wildcats.png",
  "ohio-state-buckeyes": "/logos/Leagues/NCAAF/Big Ten/ohio-state-buckeyes.png",
  "oregon-ducks": "/logos/Leagues/NCAAF/Big Ten/oregon-ducks.png",
  "penn-state-nittany-lions": "/logos/Leagues/NCAAF/Big Ten/penn-state-nittany-lions.png",
  "purdue-boilermakers": "/logos/Leagues/NCAAF/Big Ten/purdue-boilermakers.png",
  "rutgers-scarlet-knights": "/logos/Leagues/NCAAF/Big Ten/rutgers-scarlet-knights.png",
  "ucla-bruins": "/logos/Leagues/NCAAF/Big Ten/ucla-bruins.png",
  "usc-trojans": "/logos/Leagues/NCAAF/Big Ten/usc-trojans.png",
  "washington-huskies": "/logos/Leagues/NCAAF/Big Ten/washington-huskies.png",
  "wisconsin-badgers": "/logos/Leagues/NCAAF/Big Ten/wisconsin-badgers.png",
  "delaware-blue-hens": "/logos/Leagues/NCAAF/Conference USA/delaware-blue-hens.png",
  "florida-international-panthers": "/logos/Leagues/NCAAF/Conference USA/florida-international-panthers.png",
  "jacksonville-state-gamecocks": "/logos/Leagues/NCAAF/Conference USA/jacksonville-state-gamecocks.png",
  "kennesaw-state-owls": "/logos/Leagues/NCAAF/Conference USA/kennesaw-state-owls.png",
  "liberty-flames": "/logos/Leagues/NCAAF/Conference USA/liberty-flames.png",
  "louisiana-tech-bulldogs": "/logos/Leagues/NCAAF/Conference USA/louisiana-tech-bulldogs.png",
  "middle-tennessee-blue-raiders": "/logos/Leagues/NCAAF/Conference USA/middle-tennessee-blue-raiders.png",
  "missouri-state-bears": "/logos/Leagues/NCAAF/Conference USA/missouri-state-bears.png",
  "new-mexico-state-aggies": "/logos/Leagues/NCAAF/Conference USA/new-mexico-state-aggies.png",
  "sam-houston-bearkats": "/logos/Leagues/NCAAF/Conference USA/sam-houston-bearkats.png",
  "utep-miners": "/logos/Leagues/NCAAF/Conference USA/utep-miners.png",
  "western-kentucky-hilltoppers": "/logos/Leagues/NCAAF/Conference USA/western-kentucky-hilltoppers.png",
  "notre-dame-fighting-irish": "/logos/Leagues/NCAAF/Independents/notre-dame-fighting-irish.png",
  "uconn-huskies": "/logos/Leagues/NCAAF/Independents/uconn-huskies.png",
  "akron-zips": "/logos/Leagues/NCAAF/Mid-American/akron-zips.png",
  "ball-state-cardinals": "/logos/Leagues/NCAAF/Mid-American/ball-state-cardinals.png",
  "bowling-green-falcons": "/logos/Leagues/NCAAF/Mid-American/bowling-green-falcons.png",
  "buffalo-bulls": "/logos/Leagues/NCAAF/Mid-American/buffalo-bulls.png",
  "central-michigan-chippewas": "/logos/Leagues/NCAAF/Mid-American/central-michigan-chippewas.png",
  "eastern-michigan-eagles": "/logos/Leagues/NCAAF/Mid-American/eastern-michigan-eagles.png",
  "kent-state-golden-flashes": "/logos/Leagues/NCAAF/Mid-American/kent-state-golden-flashes.png",
  "massachusetts-minutemen": "/logos/Leagues/NCAAF/Mid-American/massachusetts-minutemen.png",
  "miami-oh-redhawks": "/logos/Leagues/NCAAF/Mid-American/miami-oh-redhawks.png",
  "northern-illinois-huskies": "/logos/Leagues/NCAAF/Mid-American/northern-illinois-huskies.png",
  "ohio-bobcats": "/logos/Leagues/NCAAF/Mid-American/ohio-bobcats.png",
  "toledo-rockets": "/logos/Leagues/NCAAF/Mid-American/toledo-rockets.png",
  "western-michigan-broncos": "/logos/Leagues/NCAAF/Mid-American/western-michigan-broncos.png",
  "air-force-falcons": "/logos/Leagues/NCAAF/Mountain West/air-force-falcons.png",
  "boise-state-broncos": "/logos/Leagues/NCAAF/Mountain West/boise-state-broncos.png",
  "colorado-state-rams": "/logos/Leagues/NCAAF/Mountain West/colorado-state-rams.png",
  "fresno-state-bulldogs": "/logos/Leagues/NCAAF/Mountain West/fresno-state-bulldogs.png",
  "hawaii-rainbow-warriors": "/logos/Leagues/NCAAF/Mountain West/hawaii-rainbow-warriors.png",
  "nevada-wolf-pack": "/logos/Leagues/NCAAF/Mountain West/nevada-wolf-pack.png",
  "new-mexico-lobos": "/logos/Leagues/NCAAF/Mountain West/new-mexico-lobos.png",
  "san-diego-state-aztecs": "/logos/Leagues/NCAAF/Mountain West/san-diego-state-aztecs.png",
  "san-jose-state-spartans": "/logos/Leagues/NCAAF/Mountain West/san-jose-state-spartans.png",
  "unlv-rebels": "/logos/Leagues/NCAAF/Mountain West/unlv-rebels.png",
  "utah-state-aggies": "/logos/Leagues/NCAAF/Mountain West/utah-state-aggies.png",
  "wyoming-cowboys": "/logos/Leagues/NCAAF/Mountain West/wyoming-cowboys.png",
  "oregon-state-beavers": "/logos/Leagues/NCAAF/Pac-12/oregon-state-beavers.png",
  "washington-state-cougars": "/logos/Leagues/NCAAF/Pac-12/washington-state-cougars.png",
  "alabama-crimson-tide": "/logos/Leagues/NCAAF/SEC/alabama-crimson-tide.png",
  "arkansas-razorbacks": "/logos/Leagues/NCAAF/SEC/arkansas-razorbacks.png",
  "auburn-tigers": "/logos/Leagues/NCAAF/SEC/auburn-tigers.png",
  "florida-gators": "/logos/Leagues/NCAAF/SEC/florida-gators.png",
  "georgia-bulldogs": "/logos/Leagues/NCAAF/SEC/georgia-bulldogs.png",
  "kentucky-wildcats": "/logos/Leagues/NCAAF/SEC/kentucky-wildcats.png",
  "lsu-tigers": "/logos/Leagues/NCAAF/SEC/lsu-tigers.png",
  "mississippi-state-bulldogs": "/logos/Leagues/NCAAF/SEC/mississippi-state-bulldogs.png",
  "missouri-tigers": "/logos/Leagues/NCAAF/SEC/missouri-tigers.png",
  "oklahoma-sooners": "/logos/Leagues/NCAAF/SEC/oklahoma-sooners.png",
  "ole-miss-rebels": "/logos/Leagues/NCAAF/SEC/ole-miss-rebels.png",
  "south-carolina-gamecocks": "/logos/Leagues/NCAAF/SEC/south-carolina-gamecocks.png",
  "tennessee-volunteers": "/logos/Leagues/NCAAF/SEC/tennessee-volunteers.png",
  "texas-am-aggies": "/logos/Leagues/NCAAF/SEC/texas-am-aggies.png",
  "texas-longhorns": "/logos/Leagues/NCAAF/SEC/texas-longhorns.png",
  "vanderbilt-commodores": "/logos/Leagues/NCAAF/SEC/vanderbilt-commodores.png",
  "app-state-mountaineers": "/logos/Leagues/NCAAF/Sun Belt/app-state-mountaineers.png",
  "arkansas-state-red-wolves": "/logos/Leagues/NCAAF/Sun Belt/arkansas-state-red-wolves.png",
  "coastal-carolina-chanticleers": "/logos/Leagues/NCAAF/Sun Belt/coastal-carolina-chanticleers.png",
  "georgia-southern-eagles": "/logos/Leagues/NCAAF/Sun Belt/georgia-southern-eagles.png",
  "georgia-state-panthers": "/logos/Leagues/NCAAF/Sun Belt/georgia-state-panthers.png",
  "james-madison-dukes": "/logos/Leagues/NCAAF/Sun Belt/james-madison-dukes.png",
  "louisiana-ragin-cajuns": "/logos/Leagues/NCAAF/Sun Belt/louisiana-ragin-cajuns.png",
  "marshall-thundering-herd": "/logos/Leagues/NCAAF/Sun Belt/marshall-thundering-herd.png",
  "old-dominion-monarchs": "/logos/Leagues/NCAAF/Sun Belt/old-dominion-monarchs.png",
  "south-alabama-jaguars": "/logos/Leagues/NCAAF/Sun Belt/south-alabama-jaguars.png",
  "southern-miss-golden-eagles": "/logos/Leagues/NCAAF/Sun Belt/southern-miss-golden-eagles.png",
  "texas-state-bobcats": "/logos/Leagues/NCAAF/Sun Belt/texas-state-bobcats.png",
  "troy-trojans": "/logos/Leagues/NCAAF/Sun Belt/troy-trojans.png",
  "ul-monroe-warhawks": "/logos/Leagues/NCAAF/Sun Belt/ul-monroe-warhawks.png",
};

// NCAAM Logo Paths - COMPLETE ALL CONFERENCES
const NCAAM_LOGO_PATHS: Record<string, string> = {
  // A-10
  "davidson-wildcats": "/logos/Leagues/NCAAM/A-10/davidson-wildcats.png",
  "dayton-flyers": "/logos/Leagues/NCAAM/A-10/dayton-flyers.png",
  "duquesne-dukes": "/logos/Leagues/NCAAM/A-10/duquesne-dukes.png",
  "fordham-rams": "/logos/Leagues/NCAAM/A-10/fordham-rams.png",
  "george-mason-patriots": "/logos/Leagues/NCAAM/A-10/george-mason-patriots.png",
  "george-washington-revolutionaries": "/logos/Leagues/NCAAM/A-10/george-washington-revolutionaries.png",
  "la-salle-explorers": "/logos/Leagues/NCAAM/A-10/la-salle-explorers.png",
  "loyola-chicago-ramblers": "/logos/Leagues/NCAAM/A-10/loyola-chicago-ramblers.png",
  "rhode-island-rams": "/logos/Leagues/NCAAM/A-10/rhode-island-rams.png",
  "richmond-spiders": "/logos/Leagues/NCAAM/A-10/richmond-spiders.png",
  "saint-josephs-hawks": "/logos/Leagues/NCAAM/A-10/saint-josephs-hawks.png",
  "saint-louis-billikens": "/logos/Leagues/NCAAM/A-10/saint-louis-billikens.png",
  "st-bonaventure-bonnies": "/logos/Leagues/NCAAM/A-10/st-bonaventure-bonnies.png",
  "vcu-rams": "/logos/Leagues/NCAAM/A-10/vcu-rams.png",
  // ACC
  "boston-college-eagles": "/logos/Leagues/NCAAM/ACC/boston-college-eagles.png",
  "california-golden-bears": "/logos/Leagues/NCAAM/ACC/california-golden-bears.png",
  "clemson-tigers": "/logos/Leagues/NCAAM/ACC/clemson-tigers.png",
  "duke-blue-devils": "/logos/Leagues/NCAAM/ACC/duke-blue-devils.png",
  "florida-state-seminoles": "/logos/Leagues/NCAAM/ACC/florida-state-seminoles.png",
  "georgia-tech-yellow-jackets": "/logos/Leagues/NCAAM/ACC/georgia-tech-yellow-jackets.png",
  "louisville-cardinals": "/logos/Leagues/NCAAM/ACC/louisville-cardinals.png",
  "miami-hurricanes": "/logos/Leagues/NCAAM/ACC/miami-hurricanes.png",
  "nc-state-wolfpack": "/logos/Leagues/NCAAM/ACC/nc-state-wolfpack.png",
  "north-carolina-tar-heels": "/logos/Leagues/NCAAM/ACC/north-carolina-tar-heels.png",
  "notre-dame-fighting-irish": "/logos/Leagues/NCAAM/ACC/notre-dame-fighting-irish.png",
  "pittsburgh-panthers": "/logos/Leagues/NCAAM/ACC/pittsburgh-panthers.png",
  "smu-mustangs": "/logos/Leagues/NCAAM/ACC/smu-mustangs.png",
  "stanford-cardinal": "/logos/Leagues/NCAAM/ACC/stanford-cardinal.png",
  "syracuse-orange": "/logos/Leagues/NCAAM/ACC/syracuse-orange.png",
  "virginia-cavaliers": "/logos/Leagues/NCAAM/ACC/virginia-cavaliers.png",
  "virginia-tech-hokies": "/logos/Leagues/NCAAM/ACC/virginia-tech-hokies.png",
  "wake-forest-demon-deacons": "/logos/Leagues/NCAAM/ACC/wake-forest-demon-deacons.png",
  // America East
  "binghamton-bearcats": "/logos/Leagues/NCAAM/America East/binghamton-bearcats.png",
  "bryant-bulldogs": "/logos/Leagues/NCAAM/America East/bryant-bulldogs.png",
  "maine-black-bears": "/logos/Leagues/NCAAM/America East/maine-black-bears.png",
  "new-hampshire-wildcats": "/logos/Leagues/NCAAM/America East/new-hampshire-wildcats.png",
  "njit-highlanders": "/logos/Leagues/NCAAM/America East/njit-highlanders.png",
  "ualbany-great-danes": "/logos/Leagues/NCAAM/America East/ualbany-great-danes.png",
  "umass-lowell-river-hawks": "/logos/Leagues/NCAAM/America East/umass-lowell-river-hawks.png",
  "umbc-retrievers": "/logos/Leagues/NCAAM/America East/umbc-retrievers.png",
  "vermont-catamounts": "/logos/Leagues/NCAAM/America East/vermont-catamounts.png",
  // American
  "charlotte-49ers": "/logos/Leagues/NCAAM/American/charlotte-49ers.png",
  "east-carolina-pirates": "/logos/Leagues/NCAAM/American/east-carolina-pirates.png",
  "florida-atlantic-owls": "/logos/Leagues/NCAAM/American/florida-atlantic-owls.png",
  "memphis-tigers": "/logos/Leagues/NCAAM/American/memphis-tigers.png",
  "north-texas-mean-green": "/logos/Leagues/NCAAM/American/north-texas-mean-green.png",
  "rice-owls": "/logos/Leagues/NCAAM/American/rice-owls.png",
  "south-florida-bulls": "/logos/Leagues/NCAAM/American/south-florida-bulls.png",
  "temple-owls": "/logos/Leagues/NCAAM/American/temple-owls.png",
  "tulane-green-wave": "/logos/Leagues/NCAAM/American/tulane-green-wave.png",
  "tulsa-golden-hurricane": "/logos/Leagues/NCAAM/American/tulsa-golden-hurricane.png",
  "uab-blazers": "/logos/Leagues/NCAAM/American/uab-blazers.png",
  "utsa-roadrunners": "/logos/Leagues/NCAAM/American/utsa-roadrunners.png",
  "wichita-state-shockers": "/logos/Leagues/NCAAM/American/wichita-state-shockers.png",
  // ASUN
  "austin-peay-governors": "/logos/Leagues/NCAAM/ASUN/austin-peay-governors.png",
  "bellarmine-knights": "/logos/Leagues/NCAAM/ASUN/bellarmine-knights.png",
  "central-arkansas-bears": "/logos/Leagues/NCAAM/ASUN/central-arkansas-bears.png",
  "eastern-kentucky-colonels": "/logos/Leagues/NCAAM/ASUN/eastern-kentucky-colonels.png",
  "florida-gulf-coast-eagles": "/logos/Leagues/NCAAM/ASUN/florida-gulf-coast-eagles.png",
  "jacksonville-dolphins": "/logos/Leagues/NCAAM/ASUN/jacksonville-dolphins.png",
  "lipscomb-bisons": "/logos/Leagues/NCAAM/ASUN/lipscomb-bisons.png",
  "north-alabama-lions": "/logos/Leagues/NCAAM/ASUN/north-alabama-lions.png",
  "north-florida-ospreys": "/logos/Leagues/NCAAM/ASUN/north-florida-ospreys.png",
  "queens-university-royals": "/logos/Leagues/NCAAM/ASUN/queens-university-royals.png",
  "stetson-hatters": "/logos/Leagues/NCAAM/ASUN/stetson-hatters.png",
  "west-georgia-wolves": "/logos/Leagues/NCAAM/ASUN/west-georgia-wolves.png",
  // Big 12
  "arizona-state-sun-devils": "/logos/Leagues/NCAAM/Big 12/arizona-state-sun-devils.png",
  "arizona-wildcats": "/logos/Leagues/NCAAM/Big 12/arizona-wildcats.png",
  "baylor-bears": "/logos/Leagues/NCAAM/Big 12/baylor-bears.png",
  "byu-cougars": "/logos/Leagues/NCAAM/Big 12/byu-cougars.png",
  "cincinnati-bearcats": "/logos/Leagues/NCAAM/Big 12/cincinnati-bearcats.png",
  "colorado-buffaloes": "/logos/Leagues/NCAAM/Big 12/colorado-buffaloes.png",
  "houston-cougars": "/logos/Leagues/NCAAM/Big 12/houston-cougars.png",
  "iowa-state-cyclones": "/logos/Leagues/NCAAM/Big 12/iowa-state-cyclones.png",
  "kansas-jayhawks": "/logos/Leagues/NCAAM/Big 12/kansas-jayhawks.png",
  "kansas-state-wildcats": "/logos/Leagues/NCAAM/Big 12/kansas-state-wildcats.png",
  "oklahoma-state-cowboys": "/logos/Leagues/NCAAM/Big 12/oklahoma-state-cowboys.png",
  "tcu-horned-frogs": "/logos/Leagues/NCAAM/Big 12/tcu-horned-frogs.png",
  "texas-tech-red-raiders": "/logos/Leagues/NCAAM/Big 12/texas-tech-red-raiders.png",
  "ucf-knights": "/logos/Leagues/NCAAM/Big 12/ucf-knights.png",
  "utah-utes": "/logos/Leagues/NCAAM/Big 12/utah-utes.png",
  "west-virginia-mountaineers": "/logos/Leagues/NCAAM/Big 12/west-virginia-mountaineers.png",
  // Big East
  "butler-bulldogs": "/logos/Leagues/NCAAM/Big East/butler-bulldogs.png",
  "creighton-bluejays": "/logos/Leagues/NCAAM/Big East/creighton-bluejays.png",
  "depaul-blue-demons": "/logos/Leagues/NCAAM/Big East/depaul-blue-demons.png",
  "georgetown-hoyas": "/logos/Leagues/NCAAM/Big East/georgetown-hoyas.png",
  "marquette-golden-eagles": "/logos/Leagues/NCAAM/Big East/marquette-golden-eagles.png",
  "providence-friars": "/logos/Leagues/NCAAM/Big East/providence-friars.png",
  "seton-hall-pirates": "/logos/Leagues/NCAAM/Big East/seton-hall-pirates.png",
  "st-johns-red-storm": "/logos/Leagues/NCAAM/Big East/st-johns-red-storm.png",
  "uconn-huskies": "/logos/Leagues/NCAAM/Big East/uconn-huskies.png",
  "villanova-wildcats": "/logos/Leagues/NCAAM/Big East/villanova-wildcats.png",
  "xavier-musketeers": "/logos/Leagues/NCAAM/Big East/xavier-musketeers.png",
  // Big Sky
  "eastern-washington-eagles": "/logos/Leagues/NCAAM/Big Sky/eastern-washington-eagles.png",
  "idaho-state-bengals": "/logos/Leagues/NCAAM/Big Sky/idaho-state-bengals.png",
  "idaho-vandals": "/logos/Leagues/NCAAM/Big Sky/idaho-vandals.png",
  "montana-grizzlies": "/logos/Leagues/NCAAM/Big Sky/montana-grizzlies.png",
  "montana-state-bobcats": "/logos/Leagues/NCAAM/Big Sky/montana-state-bobcats.png",
  "northern-arizona-lumberjacks": "/logos/Leagues/NCAAM/Big Sky/northern-arizona-lumberjacks.png",
  "northern-colorado-bears": "/logos/Leagues/NCAAM/Big Sky/northern-colorado-bears.png",
  "portland-state-vikings": "/logos/Leagues/NCAAM/Big Sky/portland-state-vikings.png",
  "sacramento-state-hornets": "/logos/Leagues/NCAAM/Big Sky/sacramento-state-hornets.png",
  "weber-state-wildcats": "/logos/Leagues/NCAAM/Big Sky/weber-state-wildcats.png",
  // Big South
  "charleston-southern-buccaneers": "/logos/Leagues/NCAAM/Big South/charleston-southern-buccaneers.png",
  "gardner-webb-runnin-bulldogs": "/logos/Leagues/NCAAM/Big South/gardner-webb-runnin-bulldogs.png",
  "high-point-panthers": "/logos/Leagues/NCAAM/Big South/high-point-panthers.png",
  "longwood-lancers": "/logos/Leagues/NCAAM/Big South/longwood-lancers.png",
  "presbyterian-blue-hose": "/logos/Leagues/NCAAM/Big South/presbyterian-blue-hose.png",
  "radford-highlanders": "/logos/Leagues/NCAAM/Big South/radford-highlanders.png",
  "south-carolina-upstate-spartans": "/logos/Leagues/NCAAM/Big South/south-carolina-upstate-spartans.png",
  "unc-asheville-bulldogs": "/logos/Leagues/NCAAM/Big South/unc-asheville-bulldogs.png",
  "winthrop-eagles": "/logos/Leagues/NCAAM/Big South/winthrop-eagles.png",
  // Big Ten
  "illinois-fighting-illini": "/logos/Leagues/NCAAM/Big Ten/illinois-fighting-illini.png",
  "indiana-hoosiers": "/logos/Leagues/NCAAM/Big Ten/indiana-hoosiers.png",
  "iowa-hawkeyes": "/logos/Leagues/NCAAM/Big Ten/iowa-hawkeyes.png",
  "maryland-terrapins": "/logos/Leagues/NCAAM/Big Ten/maryland-terrapins.png",
  "michigan-state-spartans": "/logos/Leagues/NCAAM/Big Ten/michigan-state-spartans.png",
  "michigan-wolverines": "/logos/Leagues/NCAAM/Big Ten/michigan-wolverines.png",
  "minnesota-golden-gophers": "/logos/Leagues/NCAAM/Big Ten/minnesota-golden-gophers.png",
  "nebraska-cornhuskers": "/logos/Leagues/NCAAM/Big Ten/nebraska-cornhuskers.png",
  "northwestern-wildcats": "/logos/Leagues/NCAAM/Big Ten/northwestern-wildcats.png",
  "ohio-state-buckeyes": "/logos/Leagues/NCAAM/Big Ten/ohio-state-buckeyes.png",
  "oregon-ducks": "/logos/Leagues/NCAAM/Big Ten/oregon-ducks.png",
  "penn-state-nittany-lions": "/logos/Leagues/NCAAM/Big Ten/penn-state-nittany-lions.png",
  "purdue-boilermakers": "/logos/Leagues/NCAAM/Big Ten/purdue-boilermakers.png",
  "rutgers-scarlet-knights": "/logos/Leagues/NCAAM/Big Ten/rutgers-scarlet-knights.png",
  "ucla-bruins": "/logos/Leagues/NCAAM/Big Ten/ucla-bruins.png",
  "usc-trojans": "/logos/Leagues/NCAAM/Big Ten/usc-trojans.png",
  "washington-huskies": "/logos/Leagues/NCAAM/Big Ten/washington-huskies.png",
  "wisconsin-badgers": "/logos/Leagues/NCAAM/Big Ten/wisconsin-badgers.png",
  // Big West
  "cal-poly-mustangs": "/logos/Leagues/NCAAM/Big West/cal-poly-mustangs.png",
  "cal-state-bakersfield-roadrunners": "/logos/Leagues/NCAAM/Big West/cal-state-bakersfield-roadrunners.png",
  "cal-state-fullerton-titans": "/logos/Leagues/NCAAM/Big West/cal-state-fullerton-titans.png",
  "cal-state-northridge-matadors": "/logos/Leagues/NCAAM/Big West/cal-state-northridge-matadors.png",
  "hawaii-rainbow-warriors": "/logos/Leagues/NCAAM/Big West/hawaii-rainbow-warriors.png",
  "long-beach-state-beach": "/logos/Leagues/NCAAM/Big West/long-beach-state-beach.png",
  "uc-davis-aggies": "/logos/Leagues/NCAAM/Big West/uc-davis-aggies.png",
  "uc-irvine-anteaters": "/logos/Leagues/NCAAM/Big West/uc-irvine-anteaters.png",
  "uc-riverside-highlanders": "/logos/Leagues/NCAAM/Big West/uc-riverside-highlanders.png",
  "uc-san-diego-tritons": "/logos/Leagues/NCAAM/Big West/uc-san-diego-tritons.png",
  "uc-santa-barbara-gauchos": "/logos/Leagues/NCAAM/Big West/uc-santa-barbara-gauchos.png",
  // C-USA
  "delaware-blue-hens": "/logos/Leagues/NCAAM/C-USA/delaware-blue-hens.png",
  "florida-international-panthers": "/logos/Leagues/NCAAM/C-USA/florida-international-panthers.png",
  "jacksonville-state-gamecocks": "/logos/Leagues/NCAAM/C-USA/jacksonville-state-gamecocks.png",
  "kennesaw-state-owls": "/logos/Leagues/NCAAM/C-USA/kennesaw-state-owls.png",
  "liberty-flames": "/logos/Leagues/NCAAM/C-USA/liberty-flames.png",
  "louisiana-tech-bulldogs": "/logos/Leagues/NCAAM/C-USA/louisiana-tech-bulldogs.png",
  "middle-tennessee-blue-raiders": "/logos/Leagues/NCAAM/C-USA/middle-tennessee-blue-raiders.png",
  "missouri-state-bears": "/logos/Leagues/NCAAM/C-USA/missouri-state-bears.png",
  "new-mexico-state-aggies": "/logos/Leagues/NCAAM/C-USA/new-mexico-state-aggies.png",
  "sam-houston-bearkats": "/logos/Leagues/NCAAM/C-USA/sam-houston-bearkats.png",
  "utep-miners": "/logos/Leagues/NCAAM/C-USA/utep-miners.png",
  "western-kentucky-hilltoppers": "/logos/Leagues/NCAAM/C-USA/western-kentucky-hilltoppers.png",
  // Colonial
  "campbell-fighting-camels": "/logos/Leagues/NCAAM/Colonial/campbell-fighting-camels.png",
  "charleston-cougars": "/logos/Leagues/NCAAM/Colonial/charleston-cougars.png",
  "drexel-dragons": "/logos/Leagues/NCAAM/Colonial/drexel-dragons.png",
  "elon-phoenix": "/logos/Leagues/NCAAM/Colonial/elon-phoenix.png",
  "hampton-pirates": "/logos/Leagues/NCAAM/Colonial/hampton-pirates.png",
  "hofstra-pride": "/logos/Leagues/NCAAM/Colonial/hofstra-pride.png",
  "monmouth-hawks": "/logos/Leagues/NCAAM/Colonial/monmouth-hawks.png",
  "north-carolina-at-aggies": "/logos/Leagues/NCAAM/Colonial/north-carolina-at-aggies.png",
  "northeastern-huskies": "/logos/Leagues/NCAAM/Colonial/northeastern-huskies.png",
  "stony-brook-seawolves": "/logos/Leagues/NCAAM/Colonial/stony-brook-seawolves.png",
  "towson-tigers": "/logos/Leagues/NCAAM/Colonial/towson-tigers.png",
  "unc-wilmington-seahawks": "/logos/Leagues/NCAAM/Colonial/unc-wilmington-seahawks.png",
  "william-mary-tribe": "/logos/Leagues/NCAAM/Colonial/william-mary-tribe.png",
  // Horizon
  "cleveland-state-vikings": "/logos/Leagues/NCAAM/Horizon/cleveland-state-vikings.png",
  "detroit-mercy-titans": "/logos/Leagues/NCAAM/Horizon/detroit-mercy-titans.png",
  "green-bay-phoenix": "/logos/Leagues/NCAAM/Horizon/green-bay-phoenix.png",
  "iu-indianapolis-jaguars": "/logos/Leagues/NCAAM/Horizon/iu-indianapolis-jaguars.png",
  "milwaukee-panthers": "/logos/Leagues/NCAAM/Horizon/milwaukee-panthers.png",
  "northern-kentucky-norse": "/logos/Leagues/NCAAM/Horizon/northern-kentucky-norse.png",
  "oakland-golden-grizzlies": "/logos/Leagues/NCAAM/Horizon/oakland-golden-grizzlies.png",
  "purdue-fort-wayne-mastodons": "/logos/Leagues/NCAAM/Horizon/purdue-fort-wayne-mastodons.png",
  "robert-morris-colonials": "/logos/Leagues/NCAAM/Horizon/robert-morris-colonials.png",
  "wright-state-raiders": "/logos/Leagues/NCAAM/Horizon/wright-state-raiders.png",
  "youngstown-state-penguins": "/logos/Leagues/NCAAM/Horizon/youngstown-state-penguins.png",
  // Ivy League
  "brown-bears": "/logos/Leagues/NCAAM/Ivy League/brown-bears.png",
  "columbia-lions": "/logos/Leagues/NCAAM/Ivy League/columbia-lions.png",
  "cornell-big-red": "/logos/Leagues/NCAAM/Ivy League/cornell-big-red.png",
  "dartmouth-big-green": "/logos/Leagues/NCAAM/Ivy League/dartmouth-big-green.png",
  "harvard-crimson": "/logos/Leagues/NCAAM/Ivy League/harvard-crimson.png",
  "pennsylvania-quakers": "/logos/Leagues/NCAAM/Ivy League/pennsylvania-quakers.png",
  "princeton-tigers": "/logos/Leagues/NCAAM/Ivy League/princeton-tigers.png",
  "yale-bulldogs": "/logos/Leagues/NCAAM/Ivy League/yale-bulldogs.png",
  // MAAC
  "canisius-golden-griffins": "/logos/Leagues/NCAAM/MAAC/canisius-golden-griffins.png",
  "fairfield-stags": "/logos/Leagues/NCAAM/MAAC/fairfield-stags.png",
  "iona-gaels": "/logos/Leagues/NCAAM/MAAC/iona-gaels.png",
  "manhattan-jaspers": "/logos/Leagues/NCAAM/MAAC/manhattan-jaspers.png",
  "marist-red-foxes": "/logos/Leagues/NCAAM/MAAC/marist-red-foxes.png",
  "merrimack-warriors": "/logos/Leagues/NCAAM/MAAC/merrimack-warriors.png",
  "mount-st-marys-mountaineers": "/logos/Leagues/NCAAM/MAAC/mount-st-marys-mountaineers.png",
  "niagara-purple-eagles": "/logos/Leagues/NCAAM/MAAC/niagara-purple-eagles.png",
  "quinnipiac-bobcats": "/logos/Leagues/NCAAM/MAAC/quinnipiac-bobcats.png",
  "rider-broncs": "/logos/Leagues/NCAAM/MAAC/rider-broncs.png",
  "sacred-heart-pioneers": "/logos/Leagues/NCAAM/MAAC/sacred-heart-pioneers.png",
  "saint-peters-peacocks": "/logos/Leagues/NCAAM/MAAC/saint-peters-peacocks.png",
  "siena-saints": "/logos/Leagues/NCAAM/MAAC/siena-saints.png",
  // MAC
  "akron-zips": "/logos/Leagues/NCAAM/MAC/akron-zips.png",
  "ball-state-cardinals": "/logos/Leagues/NCAAM/MAC/ball-state-cardinals.png",
  "bowling-green-falcons": "/logos/Leagues/NCAAM/MAC/bowling-green-falcons.png",
  "buffalo-bulls": "/logos/Leagues/NCAAM/MAC/buffalo-bulls.png",
  "central-michigan-chippewas": "/logos/Leagues/NCAAM/MAC/central-michigan-chippewas.png",
  "eastern-michigan-eagles": "/logos/Leagues/NCAAM/MAC/eastern-michigan-eagles.png",
  "kent-state-golden-flashes": "/logos/Leagues/NCAAM/MAC/kent-state-golden-flashes.png",
  "massachusetts-minutemen": "/logos/Leagues/NCAAM/MAC/massachusetts-minutemen.png",
  "miami-oh-redhawks": "/logos/Leagues/NCAAM/MAC/miami-oh-redhawks.png",
  "northern-illinois-huskies": "/logos/Leagues/NCAAM/MAC/northern-illinois-huskies.png",
  "ohio-bobcats": "/logos/Leagues/NCAAM/MAC/ohio-bobcats.png",
  "toledo-rockets": "/logos/Leagues/NCAAM/MAC/toledo-rockets.png",
  "western-michigan-broncos": "/logos/Leagues/NCAAM/MAC/western-michigan-broncos.png",
  // MEAC
  "coppin-state-eagles": "/logos/Leagues/NCAAM/MEAC/coppin-state-eagles.png",
  "delaware-state-hornets": "/logos/Leagues/NCAAM/MEAC/delaware-state-hornets.png",
  "howard-bison": "/logos/Leagues/NCAAM/MEAC/howard-bison.png",
  "maryland-eastern-shore-hawks": "/logos/Leagues/NCAAM/MEAC/maryland-eastern-shore-hawks.png",
  "morgan-state-bears": "/logos/Leagues/NCAAM/MEAC/morgan-state-bears.png",
  "norfolk-state-spartans": "/logos/Leagues/NCAAM/MEAC/norfolk-state-spartans.png",
  "north-carolina-central-eagles": "/logos/Leagues/NCAAM/MEAC/north-carolina-central-eagles.png",
  "south-carolina-state-bulldogs": "/logos/Leagues/NCAAM/MEAC/south-carolina-state-bulldogs.png",
  // MVC
  "belmont-bruins": "/logos/Leagues/NCAAM/MVC/belmont-bruins.png",
  "bradley-braves": "/logos/Leagues/NCAAM/MVC/bradley-braves.png",
  "drake-bulldogs": "/logos/Leagues/NCAAM/MVC/drake-bulldogs.png",
  "evansville-purple-aces": "/logos/Leagues/NCAAM/MVC/evansville-purple-aces.png",
  "illinois-state-redbirds": "/logos/Leagues/NCAAM/MVC/illinois-state-redbirds.png",
  "indiana-state-sycamores": "/logos/Leagues/NCAAM/MVC/indiana-state-sycamores.png",
  "murray-state-racers": "/logos/Leagues/NCAAM/MVC/murray-state-racers.png",
  "northern-iowa-panthers": "/logos/Leagues/NCAAM/MVC/northern-iowa-panthers.png",
  "southern-illinois-salukis": "/logos/Leagues/NCAAM/MVC/southern-illinois-salukis.png",
  "uic-flames": "/logos/Leagues/NCAAM/MVC/uic-flames.png",
  "valparaiso-beacons": "/logos/Leagues/NCAAM/MVC/valparaiso-beacons.png",
  // MWC (Mountain West)
  "air-force-falcons": "/logos/Leagues/NCAAM/MWC/air-force-falcons.png",
  "boise-state-broncos": "/logos/Leagues/NCAAM/MWC/boise-state-broncos.png",
  "colorado-state-rams": "/logos/Leagues/NCAAM/MWC/colorado-state-rams.png",
  "fresno-state-bulldogs": "/logos/Leagues/NCAAM/MWC/fresno-state-bulldogs.png",
  "grand-canyon-lopes": "/logos/Leagues/NCAAM/MWC/grand-canyon-lopes.png",
  "nevada-wolf-pack": "/logos/Leagues/NCAAM/MWC/nevada-wolf-pack.png",
  "new-mexico-lobos": "/logos/Leagues/NCAAM/MWC/new-mexico-lobos.png",
  "san-diego-state-aztecs": "/logos/Leagues/NCAAM/MWC/san-diego-state-aztecs.png",
  "san-jose-state-spartans": "/logos/Leagues/NCAAM/MWC/san-jose-state-spartans.png",
  "unlv-rebels": "/logos/Leagues/NCAAM/MWC/unlv-rebels.png",
  "utah-state-aggies": "/logos/Leagues/NCAAM/MWC/utah-state-aggies.png",
  "wyoming-cowboys": "/logos/Leagues/NCAAM/MWC/wyoming-cowboys.png",
  // NEC
  "central-connecticut-blue-devils": "/logos/Leagues/NCAAM/NEC/central-connecticut-blue-devils.png",
  "chicago-state-cougars": "/logos/Leagues/NCAAM/NEC/chicago-state-cougars.png",
  "fairleigh-dickinson-knights": "/logos/Leagues/NCAAM/NEC/fairleigh-dickinson-knights.png",
  "le-moyne-dolphins": "/logos/Leagues/NCAAM/NEC/le-moyne-dolphins.png",
  "long-island-university-sharks": "/logos/Leagues/NCAAM/NEC/long-island-university-sharks.png",
  "mercyhurst-lakers": "/logos/Leagues/NCAAM/NEC/mercyhurst-lakers.png",
  "new-haven-chargers": "/logos/Leagues/NCAAM/NEC/new-haven-chargers.png",
  "saint-francis-red-flash": "/logos/Leagues/NCAAM/NEC/saint-francis-red-flash.png",
  "stonehill-skyhawks": "/logos/Leagues/NCAAM/NEC/stonehill-skyhawks.png",
  "wagner-seahawks": "/logos/Leagues/NCAAM/NEC/wagner-seahawks.png",
  // OVC
  "eastern-illinois-panthers": "/logos/Leagues/NCAAM/OVC/eastern-illinois-panthers.png",
  "lindenwood-lions": "/logos/Leagues/NCAAM/OVC/lindenwood-lions.png",
  "little-rock-trojans": "/logos/Leagues/NCAAM/OVC/little-rock-trojans.png",
  "morehead-state-eagles": "/logos/Leagues/NCAAM/OVC/morehead-state-eagles.png",
  "siu-edwardsville-cougars": "/logos/Leagues/NCAAM/OVC/siu-edwardsville-cougars.png",
  "southeast-missouri-state-redhawks": "/logos/Leagues/NCAAM/OVC/southeast-missouri-state-redhawks.png",
  "southern-indiana-screaming-eagles": "/logos/Leagues/NCAAM/OVC/southern-indiana-screaming-eagles.png",
  "tennessee-state-tigers": "/logos/Leagues/NCAAM/OVC/tennessee-state-tigers.png",
  "tennessee-tech-golden-eagles": "/logos/Leagues/NCAAM/OVC/tennessee-tech-golden-eagles.png",
  "ut-martin-skyhawks": "/logos/Leagues/NCAAM/OVC/ut-martin-skyhawks.png",
  "western-illinois-leathernecks": "/logos/Leagues/NCAAM/OVC/western-illinois-leathernecks.png",
  // Patriot League
  "american-university-eagles": "/logos/Leagues/NCAAM/Patriot League/american-university-eagles.png",
  "army-black-knights": "/logos/Leagues/NCAAM/Patriot League/army-black-knights.png",
  "boston-university-terriers": "/logos/Leagues/NCAAM/Patriot League/boston-university-terriers.png",
  "bucknell-bison": "/logos/Leagues/NCAAM/Patriot League/bucknell-bison.png",
  "colgate-raiders": "/logos/Leagues/NCAAM/Patriot League/colgate-raiders.png",
  "holy-cross-crusaders": "/logos/Leagues/NCAAM/Patriot League/holy-cross-crusaders.png",
  "lafayette-leopards": "/logos/Leagues/NCAAM/Patriot League/lafayette-leopards.png",
  "lehigh-mountain-hawks": "/logos/Leagues/NCAAM/Patriot League/lehigh-mountain-hawks.png",
  "loyola-maryland-greyhounds": "/logos/Leagues/NCAAM/Patriot League/loyola-maryland-greyhounds.png",
  "navy-midshipmen": "/logos/Leagues/NCAAM/Patriot League/navy-midshipmen.png",
  // SEC
  "alabama-crimson-tide": "/logos/Leagues/NCAAM/SEC/alabama-crimson-tide.png",
  "arkansas-razorbacks": "/logos/Leagues/NCAAM/SEC/arkansas-razorbacks.png",
  "auburn-tigers": "/logos/Leagues/NCAAM/SEC/auburn-tigers.png",
  "florida-gators": "/logos/Leagues/NCAAM/SEC/florida-gators.png",
  "georgia-bulldogs": "/logos/Leagues/NCAAM/SEC/georgia-bulldogs.png",
  "kentucky-wildcats": "/logos/Leagues/NCAAM/SEC/kentucky-wildcats.png",
  "lsu-tigers": "/logos/Leagues/NCAAM/SEC/lsu-tigers.png",
  "mississippi-state-bulldogs": "/logos/Leagues/NCAAM/SEC/mississippi-state-bulldogs.png",
  "missouri-tigers": "/logos/Leagues/NCAAM/SEC/missouri-tigers.png",
  "oklahoma-sooners": "/logos/Leagues/NCAAM/SEC/oklahoma-sooners.png",
  "ole-miss-rebels": "/logos/Leagues/NCAAM/SEC/ole-miss-rebels.png",
  "south-carolina-gamecocks": "/logos/Leagues/NCAAM/SEC/south-carolina-gamecocks.png",
  "tennessee-volunteers": "/logos/Leagues/NCAAM/SEC/tennessee-volunteers.png",
  "texas-am-aggies": "/logos/Leagues/NCAAM/SEC/texas-am-aggies.png",
  "texas-longhorns": "/logos/Leagues/NCAAM/SEC/texas-longhorns.png",
  "vanderbilt-commodores": "/logos/Leagues/NCAAM/SEC/vanderbilt-commodores.png",
  // Southern
  "chattanooga-mocs": "/logos/Leagues/NCAAM/Southern/chattanooga-mocs.png",
  "east-tennessee-state-buccaneers": "/logos/Leagues/NCAAM/Southern/east-tennessee-state-buccaneers.png",
  "furman-paladins": "/logos/Leagues/NCAAM/Southern/furman-paladins.png",
  "mercer-bears": "/logos/Leagues/NCAAM/Southern/mercer-bears.png",
  "samford-bulldogs": "/logos/Leagues/NCAAM/Southern/samford-bulldogs.png",
  "the-citadel-bulldogs": "/logos/Leagues/NCAAM/Southern/the-citadel-bulldogs.png",
  "unc-greensboro-spartans": "/logos/Leagues/NCAAM/Southern/unc-greensboro-spartans.png",
  "vmi-keydets": "/logos/Leagues/NCAAM/Southern/vmi-keydets.png",
  "western-carolina-catamounts": "/logos/Leagues/NCAAM/Southern/western-carolina-catamounts.png",
  "wofford-terriers": "/logos/Leagues/NCAAM/Southern/wofford-terriers.png",
  // Southland
  "east-texas-am-lions": "/logos/Leagues/NCAAM/Southland/east-texas-am-lions.png",
  "houston-christian-huskies": "/logos/Leagues/NCAAM/Southland/houston-christian-huskies.png",
  "incarnate-word-cardinals": "/logos/Leagues/NCAAM/Southland/incarnate-word-cardinals.png",
  "lamar-cardinals": "/logos/Leagues/NCAAM/Southland/lamar-cardinals.png",
  "mcneese-cowboys": "/logos/Leagues/NCAAM/Southland/mcneese-cowboys.png",
  "new-orleans-privateers": "/logos/Leagues/NCAAM/Southland/new-orleans-privateers.png",
  "nicholls-colonels": "/logos/Leagues/NCAAM/Southland/nicholls-colonels.png",
  "northwestern-state-demons": "/logos/Leagues/NCAAM/Southland/northwestern-state-demons.png",
  "se-louisiana-lions": "/logos/Leagues/NCAAM/Southland/se-louisiana-lions.png",
  "stephen-f-austin-lumberjacks": "/logos/Leagues/NCAAM/Southland/stephen-f-austin-lumberjacks.png",
  "texas-am-corpus-christi-islanders": "/logos/Leagues/NCAAM/Southland/texas-am-corpus-christi-islanders.png",
  "ut-rio-grande-valley-vaqueros": "/logos/Leagues/NCAAM/Southland/ut-rio-grande-valley-vaqueros.png",
  // Summit League
  "denver-pioneers": "/logos/Leagues/NCAAM/Summit League/denver-pioneers.png",
  "kansas-city-roos": "/logos/Leagues/NCAAM/Summit League/kansas-city-roos.png",
  "north-dakota-fighting-hawks": "/logos/Leagues/NCAAM/Summit League/north-dakota-fighting-hawks.png",
  "north-dakota-state-bison": "/logos/Leagues/NCAAM/Summit League/north-dakota-state-bison.png",
  "omaha-mavericks": "/logos/Leagues/NCAAM/Summit League/omaha-mavericks.png",
  "oral-roberts-golden-eagles": "/logos/Leagues/NCAAM/Summit League/oral-roberts-golden-eagles.png",
  "south-dakota-coyotes": "/logos/Leagues/NCAAM/Summit League/south-dakota-coyotes.png",
  "south-dakota-state-jackrabbits": "/logos/Leagues/NCAAM/Summit League/south-dakota-state-jackrabbits.png",
  "st-thomas-minnesota-tommies": "/logos/Leagues/NCAAM/Summit League/st-thomas-minnesota-tommies.png",
  // Sun Belt
  "app-state-mountaineers": "/logos/Leagues/NCAAM/Sun Belt/app-state-mountaineers.png",
  "arkansas-state-red-wolves": "/logos/Leagues/NCAAM/Sun Belt/arkansas-state-red-wolves.png",
  "coastal-carolina-chanticleers": "/logos/Leagues/NCAAM/Sun Belt/coastal-carolina-chanticleers.png",
  "georgia-southern-eagles": "/logos/Leagues/NCAAM/Sun Belt/georgia-southern-eagles.png",
  "georgia-state-panthers": "/logos/Leagues/NCAAM/Sun Belt/georgia-state-panthers.png",
  "james-madison-dukes": "/logos/Leagues/NCAAM/Sun Belt/james-madison-dukes.png",
  "louisiana-ragin-cajuns": "/logos/Leagues/NCAAM/Sun Belt/louisiana-ragin-cajuns.png",
  "marshall-thundering-herd": "/logos/Leagues/NCAAM/Sun Belt/marshall-thundering-herd.png",
  "old-dominion-monarchs": "/logos/Leagues/NCAAM/Sun Belt/old-dominion-monarchs.png",
  "south-alabama-jaguars": "/logos/Leagues/NCAAM/Sun Belt/south-alabama-jaguars.png",
  "southern-miss-golden-eagles": "/logos/Leagues/NCAAM/Sun Belt/southern-miss-golden-eagles.png",
  "texas-state-bobcats": "/logos/Leagues/NCAAM/Sun Belt/texas-state-bobcats.png",
  "troy-trojans": "/logos/Leagues/NCAAM/Sun Belt/troy-trojans.png",
  "ul-monroe-warhawks": "/logos/Leagues/NCAAM/Sun Belt/ul-monroe-warhawks.png",
  // SWAC
  "alabama-am-bulldogs": "/logos/Leagues/NCAAM/SWAC/alabama-am-bulldogs.png",
  "alabama-state-hornets": "/logos/Leagues/NCAAM/SWAC/alabama-state-hornets.png",
  "alcorn-state-braves": "/logos/Leagues/NCAAM/SWAC/alcorn-state-braves.png",
  "arkansas-pine-bluff-golden-lions": "/logos/Leagues/NCAAM/SWAC/arkansas-pine-bluff-golden-lions.png",
  "bethune-cookman-wildcats": "/logos/Leagues/NCAAM/SWAC/bethune-cookman-wildcats.png",
  "florida-am-rattlers": "/logos/Leagues/NCAAM/SWAC/florida-am-rattlers.png",
  "grambling-tigers": "/logos/Leagues/NCAAM/SWAC/grambling-tigers.png",
  "jackson-state-tigers": "/logos/Leagues/NCAAM/SWAC/jackson-state-tigers.png",
  "mississippi-valley-state-delta-devils": "/logos/Leagues/NCAAM/SWAC/mississippi-valley-state-delta-devils.png",
  "prairie-view-am-panthers": "/logos/Leagues/NCAAM/SWAC/prairie-view-am-panthers.png",
  "southern-jaguars": "/logos/Leagues/NCAAM/SWAC/southern-jaguars.png",
  "texas-southern-tigers": "/logos/Leagues/NCAAM/SWAC/texas-southern-tigers.png",
  // WAC
  "abilene-christian-wildcats": "/logos/Leagues/NCAAM/WAC/abilene-christian-wildcats.png",
  "california-baptist-lancers": "/logos/Leagues/NCAAM/WAC/california-baptist-lancers.png",
  "southern-utah-thunderbirds": "/logos/Leagues/NCAAM/WAC/southern-utah-thunderbirds.png",
  "tarleton-state-texans": "/logos/Leagues/NCAAM/WAC/tarleton-state-texans.png",
  "ut-arlington-mavericks": "/logos/Leagues/NCAAM/WAC/ut-arlington-mavericks.png",
  "utah-tech-trailblazers": "/logos/Leagues/NCAAM/WAC/utah-tech-trailblazers.png",
  "utah-valley-wolverines": "/logos/Leagues/NCAAM/WAC/utah-valley-wolverines.png",
  // WCC
  "gonzaga-bulldogs": "/logos/Leagues/NCAAM/WCC/gonzaga-bulldogs.png",
  "loyola-marymount-lions": "/logos/Leagues/NCAAM/WCC/loyola-marymount-lions.png",
  "oregon-state-beavers": "/logos/Leagues/NCAAM/WCC/oregon-state-beavers.png",
  "pacific-tigers": "/logos/Leagues/NCAAM/WCC/pacific-tigers.png",
  "pepperdine-waves": "/logos/Leagues/NCAAM/WCC/pepperdine-waves.png",
  "portland-pilots": "/logos/Leagues/NCAAM/WCC/portland-pilots.png",
  "saint-marys-gaels": "/logos/Leagues/NCAAM/WCC/saint-marys-gaels.png",
  "san-diego-toreros": "/logos/Leagues/NCAAM/WCC/san-diego-toreros.png",
  "san-francisco-dons": "/logos/Leagues/NCAAM/WCC/san-francisco-dons.png",
  "santa-clara-broncos": "/logos/Leagues/NCAAM/WCC/santa-clara-broncos.png",
  "seattle-u-redhawks": "/logos/Leagues/NCAAM/WCC/seattle-u-redhawks.png",
  "washington-state-cougars": "/logos/Leagues/NCAAM/WCC/washington-state-cougars.png",
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
