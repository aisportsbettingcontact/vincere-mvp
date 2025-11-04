// Map team slugs to logo paths
// Paths must match exact GitHub directory structure

/**
 * ENHANCED FUZZY MATCHING SYSTEM
 * Multiple strategies for maximum matching success
 */

/**
 * Normalize string for comparison
 */
function normalize(str: string): string {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars but keep spaces
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

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
  
  // Strategy 1: Exact match = 1.0
  if (s1 === s2) return 1.0;
  
  let scores: number[] = [];
  
  // Strategy 2: Starts with (high weight)
  if (s2.startsWith(s1) || s1.startsWith(s2)) {
    scores.push(0.95);
  }
  
  // Strategy 3: Contains (medium-high weight)
  if (s1.includes(s2) || s2.includes(s1)) {
    const containScore = Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length);
    scores.push(0.85 * containScore);
  }
  
  // Strategy 4: Word matching (for multi-word teams)
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
  
  // Strategy 5: Levenshtein distance
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen > 0) {
    const distance = levenshteinDistance(s1, s2);
    const levenScore = 1 - (distance / maxLen);
    scores.push(0.75 * levenScore);
  }
  
  // Strategy 6: Character overlap
  const chars1 = new Set(s1.replace(/\s/g, ''));
  const chars2 = new Set(s2.replace(/\s/g, ''));
  let charOverlap = 0;
  for (const char of chars1) {
    if (chars2.has(char)) charOverlap++;
  }
  const charScore = charOverlap / Math.max(chars1.size, chars2.size);
  scores.push(0.6 * charScore);
  
  // Return best score from all strategies
  return Math.max(...scores, 0);
}

/**
 * ENHANCED: Find best matching logo path using multi-strategy fuzzy matching
 * ALWAYS filters by sport/league first
 */
function findBestMatch(slug: string, logoPaths: Record<string, string>, sport: string): string | null {
  console.log(`🔍 [${sport} MATCH] Searching for slug: "${slug}"`);
  console.log(`📚 [${sport} MATCH] Available candidates: ${Object.keys(logoPaths).length} teams`);
  
  // Strategy 1: Try exact match first
  if (logoPaths[slug]) {
    console.log(`✅ [${sport} EXACT] Perfect match found!`);
    console.log(`   Path: ${logoPaths[slug]}`);
    return logoPaths[slug];
  }
  
  // Strategy 2: Try case-insensitive exact match
  const lowerSlug = slug.toLowerCase();
  for (const [key, path] of Object.entries(logoPaths)) {
    if (key.toLowerCase() === lowerSlug) {
      console.log(`✅ [${sport} CASE-INSENSITIVE] Match: "${key}"`);
      console.log(`   Path: ${path}`);
      return path;
    }
  }
  
  // Strategy 3: Multi-strategy fuzzy matching
  console.log(`🔄 [${sport} FUZZY] Running advanced fuzzy match...`);
  
  let matches: Array<{ key: string; score: number; path: string }> = [];
  
  for (const [key, path] of Object.entries(logoPaths)) {
    const score = calculateSimilarity(slug, key);
    if (score > 0.5) { // Lower threshold to see more candidates
      matches.push({ key, score, path });
    }
  }
  
  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);
  
  // Log top 3 candidates
  console.log(`🎯 [${sport} CANDIDATES] Top matches:`);
  matches.slice(0, 3).forEach((m, i) => {
    console.log(`   ${i + 1}. "${m.key}" (score: ${m.score.toFixed(3)})`);
  });
  
  // Accept best match if score >= 0.65 (optimized threshold)
  if (matches.length > 0 && matches[0].score >= 0.65) {
    const best = matches[0];
    console.log(`✅ [${sport} FUZZY MATCH] "${slug}" → "${best.key}"`);
    console.log(`   Score: ${best.score.toFixed(3)}`);
    console.log(`   Path: ${best.path}`);
    return best.path;
  }
  
  console.warn(`❌ [${sport} NO MATCH] No suitable match for "${slug}"`);
  if (matches.length > 0) {
    console.warn(`   Best candidate: "${matches[0].key}" (score: ${matches[0].score.toFixed(3)} - below threshold)`);
  }
  
  return null;
}

// NFL Logo Paths
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

// NBA Logo Paths
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
  "dallas-mavericks": "/logos/Leagues/NBA/Western/Southwest/dallas-mavericks.png",
  "houston-rockets": "/logos/Leagues/NBA/Western/Southwest/houston-rockets.png",
  "memphis-grizzlies": "/logos/Leagues/NBA/Western/Southwest/memphis-grizzlies.png",
  "new-orleans-pelicans": "/logos/Leagues/NBA/Western/Southwest/new-orleans-pelicans.png",
  "san-antonio-spurs": "/logos/Leagues/NBA/Western/Southwest/san-antonio-spurs.png",
  "denver-nuggets": "/logos/Leagues/NBA/Western/Northwest/denver-nuggets.png",
  "minnesota-timberwolves": "/logos/Leagues/NBA/Western/Northwest/minnesota-timberwolves.png",
  "oklahoma-city-thunder": "/logos/Leagues/NBA/Western/Northwest/oklahoma-city-thunder.png",
  "portland-trail-blazers": "/logos/Leagues/NBA/Western/Northwest/portland-trail-blazers.png",
  "utah-jazz": "/logos/Leagues/NBA/Western/Northwest/utah-jazz.png",
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
  "vancouver-canucks": "/logos/Leagues/NHL/Western/Pacific/vancouver-canucks.png",
  "vegas-golden-knights": "/logos/Leagues/NHL/Western/Pacific/vegas-golden-knights.png",
  "washington-capitals": "/logos/Leagues/NHL/Eastern/Metropolitan/washington-capitals.png",
  "winnipeg-jets": "/logos/Leagues/NHL/Western/Central/winnipeg-jets.png"
};

// MLB Logo Paths
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

// NCAAF & NCAAM - Placeholder for future expansion based on uploaded structure
const NCAAF_LOGO_PATHS: Record<string, string> = {};
const NCAAM_LOGO_PATHS: Record<string, string> = {};

export function getTeamLogo(sport: string, espnAbbr: string, teamSlug?: string): string {
  console.log('🔍 [LOGO DEBUG] getTeamLogo called:', { sport, espnAbbr, teamSlug });
  
  if (teamSlug) {
    let logoPath: string | null = null;
    
    // Use fuzzy matching to find best logo path by sport
    if (sport === "NFL") {
      logoPath = findBestMatch(teamSlug, NFL_LOGO_PATHS, sport);
    } else if (sport === "NBA") {
      logoPath = findBestMatch(teamSlug, NBA_LOGO_PATHS, sport);
    } else if (sport === "NHL") {
      logoPath = findBestMatch(teamSlug, NHL_LOGO_PATHS, sport);
    } else if (sport === "MLB") {
      logoPath = findBestMatch(teamSlug, MLB_LOGO_PATHS, sport);
    } else if (sport === "NCAAF") {
      logoPath = findBestMatch(teamSlug, NCAAF_LOGO_PATHS, sport);
    } else if (sport === "NCAAM") {
      logoPath = findBestMatch(teamSlug, NCAAM_LOGO_PATHS, sport);
    }
    
    if (logoPath) {
      console.log('✅ [LOGO RETURN] Returning local logo:', logoPath);
      return logoPath;
    }
    
    console.warn('⚠️ [LOGO FALLBACK] No match found, using ESPN CDN');
  } else {
    console.warn('⚠️ [LOGO DEBUG] No teamSlug provided, falling back to ESPN CDN');
  }
  
  const cdnUrl = (sport === "NCAAF" || sport === "NCAAM")
    ? `https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${espnAbbr}.png&h=200&w=200`
    : `https://a.espncdn.com/combiner/i?img=/i/teamlogos/${sport.toLowerCase()}/500/${espnAbbr}.png&h=200&w=200`;
  
  console.log('📡 [LOGO CDN] Using ESPN CDN:', cdnUrl);
  return cdnUrl;
}
