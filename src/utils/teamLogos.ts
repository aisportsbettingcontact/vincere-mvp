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
 * Enhanced multi-strategy similarity scoring with advanced fuzzy matching
 */
function calculateSimilarity(slug: string, candidate: string): number {
  const s1 = normalize(slug);
  const s2 = normalize(candidate);
  
  // Exact match
  if (s1 === s2) return 1.0;
  
  let scores: number[] = [];
  
  // Extract key components (team name, mascot)
  const extractComponents = (str: string) => {
    const parts = str.split(' ').filter(w => w.length > 0);
    return parts;
  };
  
  const comp1 = extractComponents(s1);
  const comp2 = extractComponents(s2);
  
  // Strategy 1: Prefix/suffix matching (very strong signal)
  if (s2.startsWith(s1) || s1.startsWith(s2)) scores.push(0.98);
  if (s2.endsWith(s1) || s1.endsWith(s2)) scores.push(0.96);
  
  // Strategy 2: Substring containment with length ratio
  if (s1.includes(s2) || s2.includes(s1)) {
    const containScore = Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length);
    scores.push(0.92 * containScore);
  }
  
  // Strategy 3: Component-level exact matching (mascot/city match)
  let exactComponentMatches = 0;
  let partialComponentMatches = 0;
  for (const c1 of comp1) {
    for (const c2 of comp2) {
      if (c1 === c2 && c1.length > 2) { // Ignore short words like "st", "at"
        exactComponentMatches++;
      } else if ((c1.includes(c2) || c2.includes(c1)) && Math.min(c1.length, c2.length) > 2) {
        partialComponentMatches++;
      }
    }
  }
  if (comp1.length > 0 && comp2.length > 0) {
    const exactCompScore = exactComponentMatches / Math.max(comp1.length, comp2.length);
    const partialCompScore = partialComponentMatches / Math.max(comp1.length, comp2.length);
    if (exactCompScore > 0) scores.push(0.95 * exactCompScore);
    if (partialCompScore > 0) scores.push(0.88 * partialCompScore);
  }
  
  // Strategy 4: Word order invariant matching
  const allWords1Match = comp1.every(w1 => 
    comp2.some(w2 => w1 === w2 || (w1.length > 3 && w2.length > 3 && (w1.includes(w2) || w2.includes(w1))))
  );
  const allWords2Match = comp2.every(w2 => 
    comp1.some(w1 => w2 === w1 || (w1.length > 3 && w2.length > 3 && (w1.includes(w2) || w2.includes(w1))))
  );
  if (allWords1Match || allWords2Match) scores.push(0.94);
  
  // Strategy 5: Abbreviation handling (e.g., "st" for "state", "u" for "university")
  const abbreviations: Record<string, string[]> = {
    'u': ['university', 'univ'],
    'st': ['state', 'saint'],
    'mt': ['mount', 'mountain'],
    'ft': ['fort'],
    'tech': ['technical', 'technology'],
    'am': ['a&m', 'agricultural', 'mechanical']
  };
  let abbrMatches = 0;
  for (const c1 of comp1) {
    for (const c2 of comp2) {
      if (abbreviations[c1]?.includes(c2) || abbreviations[c2]?.includes(c1)) {
        abbrMatches++;
      }
    }
  }
  if (abbrMatches > 0) {
    scores.push(0.9 * (abbrMatches / Math.max(comp1.length, comp2.length)));
  }
  
  // Strategy 6: Levenshtein distance with length normalization
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen > 0) {
    const distance = levenshteinDistance(s1, s2);
    const levenScore = 1 - (distance / maxLen);
    scores.push(0.82 * levenScore);
  }
  
  // Strategy 7: N-gram matching (trigrams)
  const getNGrams = (str: string, n: number = 3): Set<string> => {
    const grams = new Set<string>();
    for (let i = 0; i <= str.length - n; i++) {
      grams.add(str.substring(i, i + n));
    }
    return grams;
  };
  const ngrams1 = getNGrams(s1);
  const ngrams2 = getNGrams(s2);
  let ngramOverlap = 0;
  for (const gram of ngrams1) {
    if (ngrams2.has(gram)) ngramOverlap++;
  }
  if (ngrams1.size > 0 && ngrams2.size > 0) {
    const ngramScore = ngramOverlap / Math.max(ngrams1.size, ngrams2.size);
    scores.push(0.85 * ngramScore);
  }
  
  // Strategy 8: Character overlap with position weighting
  const chars1 = new Set(s1.replace(/\s/g, ''));
  const chars2 = new Set(s2.replace(/\s/g, ''));
  let charOverlap = 0;
  for (const char of chars1) {
    if (chars2.has(char)) charOverlap++;
  }
  const charScore = charOverlap / Math.max(chars1.size, chars2.size);
  scores.push(0.75 * charScore);
  
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
  
  // Enhanced multi-strategy fuzzy matching with 90% threshold
  let matches: Array<{ key: string; score: number; path: string }> = [];
  
  for (const [key, path] of Object.entries(logoPaths)) {
    const score = calculateSimilarity(slug, key);
    if (score > 0.5) matches.push({ key, score, path });
  }
  
  matches.sort((a, b) => b.score - a.score);
  
  if (matches.length > 0) {
    console.log(`🔍 [LOGO MATCH] Top fuzzy matches for "${slug}":`, matches.slice(0, 5).map(m => `${m.key} (${m.score.toFixed(3)})`));
  }
  
  // 90% threshold for high-quality matches
  if (matches.length > 0 && matches[0].score >= 0.90) {
    console.log(`✅ [LOGO MATCH] High-confidence fuzzy match: "${slug}" → "${matches[0].key}" (score: ${matches[0].score.toFixed(3)})`);
    return matches[0].path;
  }
  
  // For scores between 80-90%, log as medium confidence
  if (matches.length > 0 && matches[0].score >= 0.80) {
    console.log(`⚠️ [LOGO MATCH] Medium-confidence fuzzy match: "${slug}" → "${matches[0].key}" (score: ${matches[0].score.toFixed(3)})`);
    return matches[0].path;
  }
  
  // For scores between 70-80%, log as low confidence but still use
  if (matches.length > 0 && matches[0].score >= 0.70) {
    console.log(`⚠️ [LOGO MATCH] Low-confidence fuzzy match: "${slug}" → "${matches[0].key}" (score: ${matches[0].score.toFixed(3)})`);
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
  "boston-celtics": "/logos/leagues/nba/eastern/atlantic/boston-celtics.png",
  "brooklyn-nets": "/logos/leagues/nba/eastern/atlantic/brooklyn-nets.png",
  "new-york-knicks": "/logos/leagues/nba/eastern/atlantic/new-york-knicks.png",
  "philadelphia-76ers": "/logos/leagues/nba/eastern/atlantic/philadelphia-76ers.png",
  "toronto-raptors": "/logos/leagues/nba/eastern/atlantic/toronto-raptors.png",
  "chicago-bulls": "/logos/leagues/nba/eastern/central/chicago-bulls.png",
  "cleveland-cavaliers": "/logos/leagues/nba/eastern/central/cleveland-cavaliers.png",
  "detroit-pistons": "/logos/leagues/nba/eastern/central/detroit-pistons.png",
  "indiana-pacers": "/logos/leagues/nba/eastern/central/indiana-pacers.png",
  "milwaukee-bucks": "/logos/leagues/nba/eastern/central/milwaukee-bucks.png",
  "atlanta-hawks": "/logos/leagues/nba/eastern/southeast/atlanta-hawks.png",
  "charlotte-hornets": "/logos/leagues/nba/eastern/southeast/charlotte-hornets.png",
  "miami-heat": "/logos/leagues/nba/eastern/southeast/miami-heat.png",
  "orlando-magic": "/logos/leagues/nba/eastern/southeast/orlando-magic.png",
  "washington-wizards": "/logos/leagues/nba/eastern/southeast/washington-wizards.png",
  "denver-nuggets": "/logos/leagues/nba/western/northwest/denver-nuggets.png",
  "minnesota-timberwolves": "/logos/leagues/nba/western/northwest/minnesota-timberwolves.png",
  "oklahoma-city-thunder": "/logos/leagues/nba/western/northwest/oklahoma-city-thunder.png",
  "portland-trail-blazers": "/logos/leagues/nba/western/northwest/portland-trail-blazers.png",
  "utah-jazz": "/logos/leagues/nba/western/northwest/utah-jazz.png",
  "golden-state-warriors": "/logos/leagues/nba/western/pacific/golden-state-warriors.png",
  "la-clippers": "/logos/leagues/nba/western/pacific/la-clippers.png",
  "los-angeles-lakers": "/logos/leagues/nba/western/pacific/los-angeles-lakers.png",
  "phoenix-suns": "/logos/leagues/nba/western/pacific/phoenix-suns.png",
  "sacramento-kings": "/logos/leagues/nba/western/pacific/sacramento-kings.png",
  "dallas-mavericks": "/logos/leagues/nba/western/southwest/dallas-mavericks.png",
  "houston-rockets": "/logos/leagues/nba/western/southwest/houston-rockets.png",
  "memphis-grizzlies": "/logos/leagues/nba/western/southwest/memphis-grizzlies.png",
  "new-orleans-pelicans": "/logos/leagues/nba/western/southwest/new-orleans-pelicans.png",
  "san-antonio-spurs": "/logos/leagues/nba/western/southwest/san-antonio-spurs.png",
};

// NHL Logo Paths (32 teams)
const NHL_LOGO_PATHS: Record<string, string> = {
  "boston-bruins": "/logos/leagues/nhl/eastern/atlantic/boston-bruins.png",
  "buffalo-sabres": "/logos/leagues/nhl/eastern/atlantic/buffalo-sabres.png",
  "detroit-red-wings": "/logos/leagues/nhl/eastern/atlantic/detroit-red-wings.png",
  "florida-panthers": "/logos/leagues/nhl/eastern/atlantic/florida-panthers.png",
  "montreal-canadiens": "/logos/leagues/nhl/eastern/atlantic/montreal-canadiens.png",
  "ottawa-senators": "/logos/leagues/nhl/eastern/atlantic/ottawa-senators.png",
  "tampa-bay-lightning": "/logos/leagues/nhl/eastern/atlantic/tampa-bay-lightning.png",
  "toronto-maple-leafs": "/logos/leagues/nhl/eastern/atlantic/toronto-maple-leafs.png",
  "carolina-hurricanes": "/logos/leagues/nhl/eastern/metropolitan/carolina-hurricanes.png",
  "columbus-blue-jackets": "/logos/leagues/nhl/eastern/metropolitan/columbus-blue-jackets.png",
  "new-jersey-devils": "/logos/leagues/nhl/eastern/metropolitan/new-jersey-devils.png",
  "new-york-islanders": "/logos/leagues/nhl/eastern/metropolitan/new-york-islanders.png",
  "ny-islanders": "/logos/leagues/nhl/eastern/metropolitan/new-york-islanders.png",
  "new-york-rangers": "/logos/leagues/nhl/eastern/metropolitan/new-york-rangers.png",
  "ny-rangers": "/logos/leagues/nhl/eastern/metropolitan/new-york-rangers.png",
  "philadelphia-flyers": "/logos/leagues/nhl/eastern/metropolitan/philadelphia-flyers.png",
  "pittsburgh-penguins": "/logos/leagues/nhl/eastern/metropolitan/pittsburgh-penguins.png",
  "washington-capitals": "/logos/leagues/nhl/eastern/metropolitan/washington-capitals.png",
  "chicago-blackhawks": "/logos/leagues/nhl/western/central/chicago-blackhawks.png",
  "colorado-avalanche": "/logos/leagues/nhl/western/central/colorado-avalanche.png",
  "dallas-stars": "/logos/leagues/nhl/western/central/dallas-stars.png",
  "minnesota-wild": "/logos/leagues/nhl/western/central/minnesota-wild.png",
  "nashville-predators": "/logos/leagues/nhl/western/central/nashville-predators.png",
  "st-louis-blues": "/logos/leagues/nhl/western/central/st-louis-blues.png",
  "utah-hockey-club": "/logos/leagues/nhl/western/central/utah-mammoth.png",
  "utah-mammoth": "/logos/leagues/nhl/western/central/utah-mammoth.png",
  "winnipeg-jets": "/logos/leagues/nhl/western/central/winnipeg-jets.png",
  "anaheim-ducks": "/logos/leagues/nhl/western/pacific/anaheim-ducks.png",
  "calgary-flames": "/logos/leagues/nhl/western/pacific/calgary-flames.png",
  "edmonton-oilers": "/logos/leagues/nhl/western/pacific/edmonton-oilers.png",
  "los-angeles-kings": "/logos/leagues/nhl/western/pacific/los-angeles-kings.png",
  "san-jose-sharks": "/logos/leagues/nhl/western/pacific/san-jose-sharks.png",
  "seattle-kraken": "/logos/leagues/nhl/western/pacific/seattle-kraken.png",
  "vancouver-canucks": "/logos/leagues/nhl/western/pacific/vancouver-canucks.png",
  "vegas-golden-knights": "/logos/leagues/nhl/western/pacific/vegas-golden-knights.png",
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
  "boston-college-eagles": "/logos/leagues/ncaaf/acc/boston-college-eagles.png",
  "california-golden-bears": "/logos/leagues/ncaaf/acc/california-golden-bears.png",
  "clemson-tigers": "/logos/leagues/ncaaf/acc/clemson-tigers.png",
  "duke-blue-devils": "/logos/leagues/ncaaf/acc/duke-blue-devils.png",
  "florida-state-seminoles": "/logos/leagues/ncaaf/acc/florida-state-seminoles.png",
  "georgia-tech-yellow-jackets": "/logos/leagues/ncaaf/acc/georgia-tech-yellow-jackets.png",
  "louisville-cardinals": "/logos/leagues/ncaaf/acc/louisville-cardinals.png",
  "miami-hurricanes": "/logos/leagues/ncaaf/acc/miami-hurricanes.png",
  "nc-state-wolfpack": "/logos/leagues/ncaaf/acc/nc-state-wolfpack.png",
  "north-carolina-tar-heels": "/logos/leagues/ncaaf/acc/north-carolina-tar-heels.png",
  "pittsburgh-panthers": "/logos/leagues/ncaaf/acc/pittsburgh-panthers.png",
  "smu-mustangs": "/logos/leagues/ncaaf/acc/smu-mustangs.png",
  "stanford-cardinal": "/logos/leagues/ncaaf/acc/stanford-cardinal.png",
  "syracuse-orange": "/logos/leagues/ncaaf/acc/syracuse-orange.png",
  "virginia-cavaliers": "/logos/leagues/ncaaf/acc/virginia-cavaliers.png",
  "virginia-tech-hokies": "/logos/leagues/ncaaf/acc/virginia-tech-hokies.png",
  "wake-forest-demon-deacons": "/logos/leagues/ncaaf/acc/wake-forest-demon-deacons.png",
  "army-black-knights": "/logos/leagues/ncaaf/american/army-black-knights.png",
  "charlotte-49ers": "/logos/leagues/ncaaf/american/charlotte-49ers.png",
  "east-carolina-pirates": "/logos/leagues/ncaaf/american/east-carolina-pirates.png",
  "florida-atlantic-owls": "/logos/leagues/ncaaf/american/florida-atlantic-owls.png",
  "memphis-tigers": "/logos/leagues/ncaaf/american/memphis-tigers.png",
  "navy-midshipmen": "/logos/leagues/ncaaf/american/navy-midshipmen.png",
  "north-texas-mean-green": "/logos/leagues/ncaaf/american/north-texas-mean-green.png",
  "rice-owls": "/logos/leagues/ncaaf/american/rice-owls.png",
  "south-florida-bulls": "/logos/leagues/ncaaf/american/south-florida-bulls.png",
  "temple-owls": "/logos/leagues/ncaaf/american/temple-owls.png",
  "tulane-green-wave": "/logos/leagues/ncaaf/american/tulane-green-wave.png",
  "tulsa-golden-hurricane": "/logos/leagues/ncaaf/american/tulsa-golden-hurricane.png",
  "uab-blazers": "/logos/leagues/ncaaf/american/uab-blazers.png",
  "utsa-roadrunners": "/logos/leagues/ncaaf/american/utsa-roadrunners.png",
  "arizona-state-sun-devils": "/logos/leagues/ncaaf/big-12/arizona-state-sun-devils.png",
  "arizona-wildcats": "/logos/leagues/ncaaf/big-12/arizona-wildcats.png",
  "baylor-bears": "/logos/leagues/ncaaf/big-12/baylor-bears.png",
  "byu-cougars": "/logos/leagues/ncaaf/big-12/byu-cougars.png",
  "cincinnati-bearcats": "/logos/leagues/ncaaf/big-12/cincinnati-bearcats.png",
  "colorado-buffaloes": "/logos/leagues/ncaaf/big-12/colorado-buffaloes.png",
  "houston-cougars": "/logos/leagues/ncaaf/big-12/houston-cougars.png",
  "iowa-state-cyclones": "/logos/leagues/ncaaf/big-12/iowa-state-cyclones.png",
  "kansas-jayhawks": "/logos/leagues/ncaaf/big-12/kansas-jayhawks.png",
  "kansas-state-wildcats": "/logos/leagues/ncaaf/big-12/kansas-state-wildcats.png",
  "oklahoma-state-cowboys": "/logos/leagues/ncaaf/big-12/oklahoma-state-cowboys.png",
  "tcu-horned-frogs": "/logos/leagues/ncaaf/big-12/tcu-horned-frogs.png",
  "texas-tech-red-raiders": "/logos/leagues/ncaaf/big-12/texas-tech-red-raiders.png",
  "ucf-knights": "/logos/leagues/ncaaf/big-12/ucf-knights.png",
  "utah-utes": "/logos/leagues/ncaaf/big-12/utah-utes.png",
  "west-virginia-mountaineers": "/logos/leagues/ncaaf/big-12/west-virginia-mountaineers.png",
  "illinois-fighting-illini": "/logos/leagues/ncaaf/big-ten/illinois-fighting-illini.png",
  "indiana-hoosiers": "/logos/leagues/ncaaf/big-ten/indiana-hoosiers.png",
  "iowa-hawkeyes": "/logos/leagues/ncaaf/big-ten/iowa-hawkeyes.png",
  "maryland-terrapins": "/logos/leagues/ncaaf/big-ten/maryland-terrapins.png",
  "michigan-state-spartans": "/logos/leagues/ncaaf/big-ten/michigan-state-spartans.png",
  "michigan-wolverines": "/logos/leagues/ncaaf/big-ten/michigan-wolverines.png",
  "minnesota-golden-gophers": "/logos/leagues/ncaaf/big-ten/minnesota-golden-gophers.png",
  "nebraska-cornhuskers": "/logos/leagues/ncaaf/big-ten/nebraska-cornhuskers.png",
  "northwestern-wildcats": "/logos/leagues/ncaaf/big-ten/northwestern-wildcats.png",
  "ohio-state-buckeyes": "/logos/leagues/ncaaf/big-ten/ohio-state-buckeyes.png",
  "oregon-ducks": "/logos/leagues/ncaaf/big-ten/oregon-ducks.png",
  "penn-state-nittany-lions": "/logos/leagues/ncaaf/big-ten/penn-state-nittany-lions.png",
  "purdue-boilermakers": "/logos/leagues/ncaaf/big-ten/purdue-boilermakers.png",
  "rutgers-scarlet-knights": "/logos/leagues/ncaaf/big-ten/rutgers-scarlet-knights.png",
  "ucla-bruins": "/logos/leagues/ncaaf/big-ten/ucla-bruins.png",
  "usc-trojans": "/logos/leagues/ncaaf/big-ten/usc-trojans.png",
  "washington-huskies": "/logos/leagues/ncaaf/big-ten/washington-huskies.png",
  "wisconsin-badgers": "/logos/leagues/ncaaf/big-ten/wisconsin-badgers.png",
  "delaware-blue-hens": "/logos/leagues/ncaaf/conference-usa/delaware-blue-hens.png",
  "florida-international-panthers": "/logos/leagues/ncaaf/conference-usa/florida-international-panthers.png",
  "jacksonville-state-gamecocks": "/logos/leagues/ncaaf/conference-usa/jacksonville-state-gamecocks.png",
  "kennesaw-state-owls": "/logos/leagues/ncaaf/conference-usa/kennesaw-state-owls.png",
  "liberty-flames": "/logos/leagues/ncaaf/conference-usa/liberty-flames.png",
  "louisiana-tech-bulldogs": "/logos/leagues/ncaaf/conference-usa/louisiana-tech-bulldogs.png",
  "middle-tennessee-blue-raiders": "/logos/leagues/ncaaf/conference-usa/middle-tennessee-blue-raiders.png",
  "missouri-state-bears": "/logos/leagues/ncaaf/conference-usa/missouri-state-bears.png",
  "new-mexico-state-aggies": "/logos/leagues/ncaaf/conference-usa/new-mexico-state-aggies.png",
  "sam-houston-bearkats": "/logos/leagues/ncaaf/conference-usa/sam-houston-bearkats.png",
  "utep-miners": "/logos/leagues/ncaaf/conference-usa/utep-miners.png",
  "western-kentucky-hilltoppers": "/logos/leagues/ncaaf/conference-usa/western-kentucky-hilltoppers.png",
  "notre-dame-fighting-irish": "/logos/leagues/ncaaf/independents/notre-dame-fighting-irish.png",
  "uconn-huskies": "/logos/leagues/ncaaf/independents/uconn-huskies.png",
  "akron-zips": "/logos/leagues/ncaaf/mid-american/akron-zips.png",
  "ball-state-cardinals": "/logos/leagues/ncaaf/mid-american/ball-state-cardinals.png",
  "bowling-green-falcons": "/logos/leagues/ncaaf/mid-american/bowling-green-falcons.png",
  "buffalo-bulls": "/logos/leagues/ncaaf/mid-american/buffalo-bulls.png",
  "central-michigan-chippewas": "/logos/leagues/ncaaf/mid-american/central-michigan-chippewas.png",
  "eastern-michigan-eagles": "/logos/leagues/ncaaf/mid-american/eastern-michigan-eagles.png",
  "kent-state-golden-flashes": "/logos/leagues/ncaaf/mid-american/kent-state-golden-flashes.png",
  "massachusetts-minutemen": "/logos/leagues/ncaaf/mid-american/massachusetts-minutemen.png",
  "miami-oh-redhawks": "/logos/leagues/ncaaf/mid-american/miami-oh-redhawks.png",
  "northern-illinois-huskies": "/logos/leagues/ncaaf/mid-american/northern-illinois-huskies.png",
  "ohio-bobcats": "/logos/leagues/ncaaf/mid-american/ohio-bobcats.png",
  "toledo-rockets": "/logos/leagues/ncaaf/mid-american/toledo-rockets.png",
  "western-michigan-broncos": "/logos/leagues/ncaaf/mid-american/western-michigan-broncos.png",
  "air-force-falcons": "/logos/leagues/ncaaf/mountain-west/air-force-falcons.png",
  "boise-state-broncos": "/logos/leagues/ncaaf/mountain-west/boise-state-broncos.png",
  "colorado-state-rams": "/logos/leagues/ncaaf/mountain-west/colorado-state-rams.png",
  "fresno-state-bulldogs": "/logos/leagues/ncaaf/mountain-west/fresno-state-bulldogs.png",
  "hawaii-rainbow-warriors": "/logos/leagues/ncaaf/mountain-west/hawaii-rainbow-warriors.png",
  "nevada-wolf-pack": "/logos/leagues/ncaaf/mountain-west/nevada-wolf-pack.png",
  "new-mexico-lobos": "/logos/leagues/ncaaf/mountain-west/new-mexico-lobos.png",
  "san-diego-state-aztecs": "/logos/leagues/ncaaf/mountain-west/san-diego-state-aztecs.png",
  "san-jose-state-spartans": "/logos/leagues/ncaaf/mountain-west/san-jose-state-spartans.png",
  "unlv-rebels": "/logos/leagues/ncaaf/mountain-west/unlv-rebels.png",
  "utah-state-aggies": "/logos/leagues/ncaaf/mountain-west/utah-state-aggies.png",
  "wyoming-cowboys": "/logos/leagues/ncaaf/mountain-west/wyoming-cowboys.png",
  "oregon-state-beavers": "/logos/leagues/ncaaf/pac-12/oregon-state-beavers.png",
  "washington-state-cougars": "/logos/leagues/ncaaf/pac-12/washington-state-cougars.png",
  "alabama-crimson-tide": "/logos/leagues/ncaaf/sec/alabama-crimson-tide.png",
  "arkansas-razorbacks": "/logos/leagues/ncaaf/sec/arkansas-razorbacks.png",
  "auburn-tigers": "/logos/leagues/ncaaf/sec/auburn-tigers.png",
  "florida-gators": "/logos/leagues/ncaaf/sec/florida-gators.png",
  "georgia-bulldogs": "/logos/leagues/ncaaf/sec/georgia-bulldogs.png",
  "kentucky-wildcats": "/logos/leagues/ncaaf/sec/kentucky-wildcats.png",
  "lsu-tigers": "/logos/leagues/ncaaf/sec/lsu-tigers.png",
  "mississippi-state-bulldogs": "/logos/leagues/ncaaf/sec/mississippi-state-bulldogs.png",
  "missouri-tigers": "/logos/leagues/ncaaf/sec/missouri-tigers.png",
  "oklahoma-sooners": "/logos/leagues/ncaaf/sec/oklahoma-sooners.png",
  "ole-miss-rebels": "/logos/leagues/ncaaf/sec/ole-miss-rebels.png",
  "south-carolina-gamecocks": "/logos/leagues/ncaaf/sec/south-carolina-gamecocks.png",
  "tennessee-volunteers": "/logos/leagues/ncaaf/sec/tennessee-volunteers.png",
  "texas-am-aggies": "/logos/leagues/ncaaf/sec/texas-am-aggies.png",
  "texas-longhorns": "/logos/leagues/ncaaf/sec/texas-longhorns.png",
  "vanderbilt-commodores": "/logos/leagues/ncaaf/sec/vanderbilt-commodores.png",
  "app-state-mountaineers": "/logos/leagues/ncaaf/sun-belt/app-state-mountaineers.png",
  "arkansas-state-red-wolves": "/logos/leagues/ncaaf/sun-belt/arkansas-state-red-wolves.png",
  "coastal-carolina-chanticleers": "/logos/leagues/ncaaf/sun-belt/coastal-carolina-chanticleers.png",
  "georgia-southern-eagles": "/logos/leagues/ncaaf/sun-belt/georgia-southern-eagles.png",
  "georgia-state-panthers": "/logos/leagues/ncaaf/sun-belt/georgia-state-panthers.png",
  "james-madison-dukes": "/logos/leagues/ncaaf/sun-belt/james-madison-dukes.png",
  "louisiana-ragin-cajuns": "/logos/leagues/ncaaf/sun-belt/louisiana-ragin-cajuns.png",
  "marshall-thundering-herd": "/logos/leagues/ncaaf/sun-belt/marshall-thundering-herd.png",
  "old-dominion-monarchs": "/logos/leagues/ncaaf/sun-belt/old-dominion-monarchs.png",
  "south-alabama-jaguars": "/logos/leagues/ncaaf/sun-belt/south-alabama-jaguars.png",
  "southern-miss-golden-eagles": "/logos/leagues/ncaaf/sun-belt/southern-miss-golden-eagles.png",
  "texas-state-bobcats": "/logos/leagues/ncaaf/sun-belt/texas-state-bobcats.png",
  "troy-trojans": "/logos/leagues/ncaaf/sun-belt/troy-trojans.png",
  "ul-monroe-warhawks": "/logos/leagues/ncaaf/sun-belt/ul-monroe-warhawks.png",
};

// NCAAM Logo Paths - COMPLETE ALL CONFERENCES
const NCAAM_LOGO_PATHS: Record<string, string> = {
  // A-10
  "davidson-wildcats": "/logos/leagues/ncaam/a-10/davidson-wildcats.png",
  "dayton-flyers": "/logos/leagues/ncaam/a-10/dayton-flyers.png",
  "duquesne-dukes": "/logos/leagues/ncaam/a-10/duquesne-dukes.png",
  "fordham-rams": "/logos/leagues/ncaam/a-10/fordham-rams.png",
  "george-mason-patriots": "/logos/leagues/ncaam/a-10/george-mason-patriots.png",
  "george-washington-revolutionaries": "/logos/leagues/ncaam/a-10/george-washington-revolutionaries.png",
  "la-salle-explorers": "/logos/leagues/ncaam/a-10/la-salle-explorers.png",
  "loyola-chicago-ramblers": "/logos/leagues/ncaam/a-10/loyola-chicago-ramblers.png",
  "rhode-island-rams": "/logos/leagues/ncaam/a-10/rhode-island-rams.png",
  "richmond-spiders": "/logos/leagues/ncaam/a-10/richmond-spiders.png",
  "saint-josephs-hawks": "/logos/leagues/ncaam/a-10/saint-josephs-hawks.png",
  "saint-louis-billikens": "/logos/leagues/ncaam/a-10/saint-louis-billikens.png",
  "st-bonaventure-bonnies": "/logos/leagues/ncaam/a-10/st-bonaventure-bonnies.png",
  "vcu-rams": "/logos/leagues/ncaam/a-10/vcu-rams.png",
  // ACC
  "boston-college-eagles": "/logos/leagues/ncaam/acc/boston-college-eagles.png",
  "california-golden-bears": "/logos/leagues/ncaam/acc/california-golden-bears.png",
  "clemson-tigers": "/logos/leagues/ncaam/acc/clemson-tigers.png",
  "duke-blue-devils": "/logos/leagues/ncaam/acc/duke-blue-devils.png",
  "florida-state-seminoles": "/logos/leagues/ncaam/acc/florida-state-seminoles.png",
  "georgia-tech-yellow-jackets": "/logos/leagues/ncaam/acc/georgia-tech-yellow-jackets.png",
  "louisville-cardinals": "/logos/leagues/ncaam/acc/louisville-cardinals.png",
  "miami-hurricanes": "/logos/leagues/ncaam/acc/miami-hurricanes.png",
  "nc-state-wolfpack": "/logos/leagues/ncaam/acc/nc-state-wolfpack.png",
  "north-carolina-tar-heels": "/logos/leagues/ncaam/acc/north-carolina-tar-heels.png",
  "notre-dame-fighting-irish": "/logos/leagues/ncaam/acc/notre-dame-fighting-irish.png",
  "pittsburgh-panthers": "/logos/leagues/ncaam/acc/pittsburgh-panthers.png",
  "smu-mustangs": "/logos/leagues/ncaam/acc/smu-mustangs.png",
  "stanford-cardinal": "/logos/leagues/ncaam/acc/stanford-cardinal.png",
  "syracuse-orange": "/logos/leagues/ncaam/acc/syracuse-orange.png",
  "virginia-cavaliers": "/logos/leagues/ncaam/acc/virginia-cavaliers.png",
  "virginia-tech-hokies": "/logos/leagues/ncaam/acc/virginia-tech-hokies.png",
  "wake-forest-demon-deacons": "/logos/leagues/ncaam/acc/wake-forest-demon-deacons.png",
  // America East
  "binghamton-bearcats": "/logos/leagues/ncaam/america-east/binghamton-bearcats.png",
  "bryant-bulldogs": "/logos/leagues/ncaam/america-east/bryant-bulldogs.png",
  "maine-black-bears": "/logos/leagues/ncaam/america-east/maine-black-bears.png",
  "new-hampshire-wildcats": "/logos/leagues/ncaam/america-east/new-hampshire-wildcats.png",
  "njit-highlanders": "/logos/leagues/ncaam/america-east/njit-highlanders.png",
  "ualbany-great-danes": "/logos/leagues/ncaam/america-east/ualbany-great-danes.png",
  "umass-lowell-river-hawks": "/logos/leagues/ncaam/america-east/umass-lowell-river-hawks.png",
  "umbc-retrievers": "/logos/leagues/ncaam/america-east/umbc-retrievers.png",
  "vermont-catamounts": "/logos/leagues/ncaam/america-east/vermont-catamounts.png",
  // American
  "charlotte-49ers": "/logos/leagues/ncaam/american/charlotte-49ers.png",
  "east-carolina-pirates": "/logos/leagues/ncaam/american/east-carolina-pirates.png",
  "florida-atlantic-owls": "/logos/leagues/ncaam/american/florida-atlantic-owls.png",
  "memphis-tigers": "/logos/leagues/ncaam/american/memphis-tigers.png",
  "north-texas-mean-green": "/logos/leagues/ncaam/american/north-texas-mean-green.png",
  "rice-owls": "/logos/leagues/ncaam/american/rice-owls.png",
  "south-florida-bulls": "/logos/leagues/ncaam/american/south-florida-bulls.png",
  "temple-owls": "/logos/leagues/ncaam/american/temple-owls.png",
  "tulane-green-wave": "/logos/leagues/ncaam/american/tulane-green-wave.png",
  "tulsa-golden-hurricane": "/logos/leagues/ncaam/american/tulsa-golden-hurricane.png",
  "uab-blazers": "/logos/leagues/ncaam/american/uab-blazers.png",
  "utsa-roadrunners": "/logos/leagues/ncaam/american/utsa-roadrunners.png",
  "wichita-state-shockers": "/logos/leagues/ncaam/american/wichita-state-shockers.png",
  // ASUN
  "austin-peay-governors": "/logos/leagues/ncaam/asun/austin-peay-governors.png",
  "bellarmine-knights": "/logos/leagues/ncaam/asun/bellarmine-knights.png",
  "central-arkansas-bears": "/logos/leagues/ncaam/asun/central-arkansas-bears.png",
  "eastern-kentucky-colonels": "/logos/leagues/ncaam/asun/eastern-kentucky-colonels.png",
  "florida-gulf-coast-eagles": "/logos/leagues/ncaam/asun/florida-gulf-coast-eagles.png",
  "jacksonville-dolphins": "/logos/leagues/ncaam/asun/jacksonville-dolphins.png",
  "lipscomb-bisons": "/logos/leagues/ncaam/asun/lipscomb-bisons.png",
  "north-alabama-lions": "/logos/leagues/ncaam/asun/north-alabama-lions.png",
  "north-florida-ospreys": "/logos/leagues/ncaam/asun/north-florida-ospreys.png",
  "queens-university-royals": "/logos/leagues/ncaam/asun/queens-university-royals.png",
  "stetson-hatters": "/logos/leagues/ncaam/asun/stetson-hatters.png",
  "west-georgia-wolves": "/logos/leagues/ncaam/asun/west-georgia-wolves.png",
  // Big 12
  "arizona-state-sun-devils": "/logos/leagues/ncaam/big-12/arizona-state-sun-devils.png",
  "arizona-wildcats": "/logos/leagues/ncaam/big-12/arizona-wildcats.png",
  "baylor-bears": "/logos/leagues/ncaam/big-12/baylor-bears.png",
  "byu-cougars": "/logos/leagues/ncaam/big-12/byu-cougars.png",
  "cincinnati-bearcats": "/logos/leagues/ncaam/big-12/cincinnati-bearcats.png",
  "colorado-buffaloes": "/logos/leagues/ncaam/big-12/colorado-buffaloes.png",
  "houston-cougars": "/logos/leagues/ncaam/big-12/houston-cougars.png",
  "iowa-state-cyclones": "/logos/leagues/ncaam/big-12/iowa-state-cyclones.png",
  "kansas-jayhawks": "/logos/leagues/ncaam/big-12/kansas-jayhawks.png",
  "kansas-state-wildcats": "/logos/leagues/ncaam/big-12/kansas-state-wildcats.png",
  "oklahoma-state-cowboys": "/logos/leagues/ncaam/big-12/oklahoma-state-cowboys.png",
  "tcu-horned-frogs": "/logos/leagues/ncaam/big-12/tcu-horned-frogs.png",
  "texas-tech-red-raiders": "/logos/leagues/ncaam/big-12/texas-tech-red-raiders.png",
  "ucf-knights": "/logos/leagues/ncaam/big-12/ucf-knights.png",
  "utah-utes": "/logos/leagues/ncaam/big-12/utah-utes.png",
  "west-virginia-mountaineers": "/logos/leagues/ncaam/big-12/west-virginia-mountaineers.png",
  // Big East
  "butler-bulldogs": "/logos/leagues/ncaam/big-east/butler-bulldogs.png",
  "creighton-bluejays": "/logos/leagues/ncaam/big-east/creighton-bluejays.png",
  "depaul-blue-demons": "/logos/leagues/ncaam/big-east/depaul-blue-demons.png",
  "georgetown-hoyas": "/logos/leagues/ncaam/big-east/georgetown-hoyas.png",
  "marquette-golden-eagles": "/logos/leagues/ncaam/big-east/marquette-golden-eagles.png",
  "providence-friars": "/logos/leagues/ncaam/big-east/providence-friars.png",
  "seton-hall-pirates": "/logos/leagues/ncaam/big-east/seton-hall-pirates.png",
  "st-johns-red-storm": "/logos/leagues/ncaam/big-east/st-johns-red-storm.png",
  "uconn-huskies": "/logos/leagues/ncaam/big-east/uconn-huskies.png",
  "villanova-wildcats": "/logos/leagues/ncaam/big-east/villanova-wildcats.png",
  "xavier-musketeers": "/logos/leagues/ncaam/big-east/xavier-musketeers.png",
  // Big Sky
  "eastern-washington-eagles": "/logos/leagues/ncaam/big-sky/eastern-washington-eagles.png",
  "idaho-state-bengals": "/logos/leagues/ncaam/big-sky/idaho-state-bengals.png",
  "idaho-vandals": "/logos/leagues/ncaam/big-sky/idaho-vandals.png",
  "montana-grizzlies": "/logos/leagues/ncaam/big-sky/montana-grizzlies.png",
  "montana-state-bobcats": "/logos/leagues/ncaam/big-sky/montana-state-bobcats.png",
  "northern-arizona-lumberjacks": "/logos/leagues/ncaam/big-sky/northern-arizona-lumberjacks.png",
  "northern-colorado-bears": "/logos/leagues/ncaam/big-sky/northern-colorado-bears.png",
  "portland-state-vikings": "/logos/leagues/ncaam/big-sky/portland-state-vikings.png",
  "sacramento-state-hornets": "/logos/leagues/ncaam/big-sky/sacramento-state-hornets.png",
  "weber-state-wildcats": "/logos/leagues/ncaam/big-sky/weber-state-wildcats.png",
  // Big South
  "charleston-southern-buccaneers": "/logos/leagues/ncaam/big-south/charleston-southern-buccaneers.png",
  "gardner-webb-runnin-bulldogs": "/logos/leagues/ncaam/big-south/gardner-webb-runnin-bulldogs.png",
  "high-point-panthers": "/logos/leagues/ncaam/big-south/high-point-panthers.png",
  "longwood-lancers": "/logos/leagues/ncaam/big-south/longwood-lancers.png",
  "presbyterian-blue-hose": "/logos/leagues/ncaam/big-south/presbyterian-blue-hose.png",
  "radford-highlanders": "/logos/leagues/ncaam/big-south/radford-highlanders.png",
  "south-carolina-upstate-spartans": "/logos/leagues/ncaam/big-south/south-carolina-upstate-spartans.png",
  "unc-asheville-bulldogs": "/logos/leagues/ncaam/big-south/unc-asheville-bulldogs.png",
  "winthrop-eagles": "/logos/leagues/ncaam/big-south/winthrop-eagles.png",
  // Big Ten
  "illinois-fighting-illini": "/logos/leagues/ncaam/big-ten/illinois-fighting-illini.png",
  "indiana-hoosiers": "/logos/leagues/ncaam/big-ten/indiana-hoosiers.png",
  "iowa-hawkeyes": "/logos/leagues/ncaam/big-ten/iowa-hawkeyes.png",
  "maryland-terrapins": "/logos/leagues/ncaam/big-ten/maryland-terrapins.png",
  "michigan-state-spartans": "/logos/leagues/ncaam/big-ten/michigan-state-spartans.png",
  "michigan-wolverines": "/logos/leagues/ncaam/big-ten/michigan-wolverines.png",
  "minnesota-golden-gophers": "/logos/leagues/ncaam/big-ten/minnesota-golden-gophers.png",
  "nebraska-cornhuskers": "/logos/leagues/ncaam/big-ten/nebraska-cornhuskers.png",
  "northwestern-wildcats": "/logos/leagues/ncaam/big-ten/northwestern-wildcats.png",
  "ohio-state-buckeyes": "/logos/leagues/ncaam/big-ten/ohio-state-buckeyes.png",
  "oregon-ducks": "/logos/leagues/ncaam/big-ten/oregon-ducks.png",
  "penn-state-nittany-lions": "/logos/leagues/ncaam/big-ten/penn-state-nittany-lions.png",
  "purdue-boilermakers": "/logos/leagues/ncaam/big-ten/purdue-boilermakers.png",
  "rutgers-scarlet-knights": "/logos/leagues/ncaam/big-ten/rutgers-scarlet-knights.png",
  "ucla-bruins": "/logos/leagues/ncaam/big-ten/ucla-bruins.png",
  "usc-trojans": "/logos/leagues/ncaam/big-ten/usc-trojans.png",
  "washington-huskies": "/logos/leagues/ncaam/big-ten/washington-huskies.png",
  "wisconsin-badgers": "/logos/leagues/ncaam/big-ten/wisconsin-badgers.png",
  // Big West
  "cal-poly-mustangs": "/logos/leagues/ncaam/big-west/cal-poly-mustangs.png",
  "cal-state-bakersfield-roadrunners": "/logos/leagues/ncaam/big-west/cal-state-bakersfield-roadrunners.png",
  "cal-state-fullerton-titans": "/logos/leagues/ncaam/big-west/cal-state-fullerton-titans.png",
  "cal-state-northridge-matadors": "/logos/leagues/ncaam/big-west/cal-state-northridge-matadors.png",
  "hawaii-rainbow-warriors": "/logos/leagues/ncaam/big-west/hawaii-rainbow-warriors.png",
  "long-beach-state-beach": "/logos/leagues/ncaam/big-west/long-beach-state-beach.png",
  "uc-davis-aggies": "/logos/leagues/ncaam/big-west/uc-davis-aggies.png",
  "uc-irvine-anteaters": "/logos/leagues/ncaam/big-west/uc-irvine-anteaters.png",
  "uc-riverside-highlanders": "/logos/leagues/ncaam/big-west/uc-riverside-highlanders.png",
  "uc-san-diego-tritons": "/logos/leagues/ncaam/big-west/uc-san-diego-tritons.png",
  "uc-santa-barbara-gauchos": "/logos/leagues/ncaam/big-west/uc-santa-barbara-gauchos.png",
  // C-USA
  "delaware-blue-hens": "/logos/leagues/ncaam/c-usa/delaware-blue-hens.png",
  "florida-international-panthers": "/logos/leagues/ncaam/c-usa/florida-international-panthers.png",
  "jacksonville-state-gamecocks": "/logos/leagues/ncaam/c-usa/jacksonville-state-gamecocks.png",
  "kennesaw-state-owls": "/logos/leagues/ncaam/c-usa/kennesaw-state-owls.png",
  "liberty-flames": "/logos/leagues/ncaam/c-usa/liberty-flames.png",
  "louisiana-tech-bulldogs": "/logos/leagues/ncaam/c-usa/louisiana-tech-bulldogs.png",
  "middle-tennessee-blue-raiders": "/logos/leagues/ncaam/c-usa/middle-tennessee-blue-raiders.png",
  "missouri-state-bears": "/logos/leagues/ncaam/c-usa/missouri-state-bears.png",
  "new-mexico-state-aggies": "/logos/leagues/ncaam/c-usa/new-mexico-state-aggies.png",
  "sam-houston-bearkats": "/logos/leagues/ncaam/c-usa/sam-houston-bearkats.png",
  "utep-miners": "/logos/leagues/ncaam/c-usa/utep-miners.png",
  "western-kentucky-hilltoppers": "/logos/leagues/ncaam/c-usa/western-kentucky-hilltoppers.png",
  // Colonial
  "campbell-fighting-camels": "/logos/leagues/ncaam/colonial/campbell-fighting-camels.png",
  "charleston-cougars": "/logos/leagues/ncaam/colonial/charleston-cougars.png",
  "drexel-dragons": "/logos/leagues/ncaam/colonial/drexel-dragons.png",
  "elon-phoenix": "/logos/leagues/ncaam/colonial/elon-phoenix.png",
  "hampton-pirates": "/logos/leagues/ncaam/colonial/hampton-pirates.png",
  "hofstra-pride": "/logos/leagues/ncaam/colonial/hofstra-pride.png",
  "monmouth-hawks": "/logos/leagues/ncaam/colonial/monmouth-hawks.png",
  "north-carolina-at-aggies": "/logos/leagues/ncaam/colonial/north-carolina-at-aggies.png",
  "northeastern-huskies": "/logos/leagues/ncaam/colonial/northeastern-huskies.png",
  "stony-brook-seawolves": "/logos/leagues/ncaam/colonial/stony-brook-seawolves.png",
  "towson-tigers": "/logos/leagues/ncaam/colonial/towson-tigers.png",
  "unc-wilmington-seahawks": "/logos/leagues/ncaam/colonial/unc-wilmington-seahawks.png",
  "william-mary-tribe": "/logos/leagues/ncaam/colonial/william-mary-tribe.png",
  // Horizon
  "cleveland-state-vikings": "/logos/leagues/ncaam/horizon/cleveland-state-vikings.png",
  "detroit-mercy-titans": "/logos/leagues/ncaam/horizon/detroit-mercy-titans.png",
  "green-bay-phoenix": "/logos/leagues/ncaam/horizon/green-bay-phoenix.png",
  "iu-indianapolis-jaguars": "/logos/leagues/ncaam/horizon/iu-indianapolis-jaguars.png",
  "milwaukee-panthers": "/logos/leagues/ncaam/horizon/milwaukee-panthers.png",
  "northern-kentucky-norse": "/logos/leagues/ncaam/horizon/northern-kentucky-norse.png",
  "oakland-golden-grizzlies": "/logos/leagues/ncaam/horizon/oakland-golden-grizzlies.png",
  "purdue-fort-wayne-mastodons": "/logos/leagues/ncaam/horizon/purdue-fort-wayne-mastodons.png",
  "robert-morris-colonials": "/logos/leagues/ncaam/horizon/robert-morris-colonials.png",
  "wright-state-raiders": "/logos/leagues/ncaam/horizon/wright-state-raiders.png",
  "youngstown-state-penguins": "/logos/leagues/ncaam/horizon/youngstown-state-penguins.png",
  // Ivy League
  "brown-bears": "/logos/leagues/ncaam/ivy-league/brown-bears.png",
  "columbia-lions": "/logos/leagues/ncaam/ivy-league/columbia-lions.png",
  "cornell-big-red": "/logos/leagues/ncaam/ivy-league/cornell-big-red.png",
  "dartmouth-big-green": "/logos/leagues/ncaam/ivy-league/dartmouth-big-green.png",
  "harvard-crimson": "/logos/leagues/ncaam/ivy-league/harvard-crimson.png",
  "pennsylvania-quakers": "/logos/leagues/ncaam/ivy-league/pennsylvania-quakers.png",
  "princeton-tigers": "/logos/leagues/ncaam/ivy-league/princeton-tigers.png",
  "yale-bulldogs": "/logos/leagues/ncaam/ivy-league/yale-bulldogs.png",
  // MAAC
  "canisius-golden-griffins": "/logos/leagues/ncaam/maac/canisius-golden-griffins.png",
  "fairfield-stags": "/logos/leagues/ncaam/maac/fairfield-stags.png",
  "iona-gaels": "/logos/leagues/ncaam/maac/iona-gaels.png",
  "manhattan-jaspers": "/logos/leagues/ncaam/maac/manhattan-jaspers.png",
  "marist-red-foxes": "/logos/leagues/ncaam/maac/marist-red-foxes.png",
  "merrimack-warriors": "/logos/leagues/ncaam/maac/merrimack-warriors.png",
  "mount-st-marys-mountaineers": "/logos/leagues/ncaam/maac/mount-st-marys-mountaineers.png",
  "niagara-purple-eagles": "/logos/leagues/ncaam/maac/niagara-purple-eagles.png",
  "quinnipiac-bobcats": "/logos/leagues/ncaam/maac/quinnipiac-bobcats.png",
  "rider-broncs": "/logos/leagues/ncaam/maac/rider-broncs.png",
  "sacred-heart-pioneers": "/logos/leagues/ncaam/maac/sacred-heart-pioneers.png",
  "saint-peters-peacocks": "/logos/leagues/ncaam/maac/saint-peters-peacocks.png",
  "siena-saints": "/logos/leagues/ncaam/maac/siena-saints.png",
  // MAC
  "akron-zips": "/logos/leagues/ncaam/mac/akron-zips.png",
  "ball-state-cardinals": "/logos/leagues/ncaam/mac/ball-state-cardinals.png",
  "bowling-green-falcons": "/logos/leagues/ncaam/mac/bowling-green-falcons.png",
  "buffalo-bulls": "/logos/leagues/ncaam/mac/buffalo-bulls.png",
  "central-michigan-chippewas": "/logos/leagues/ncaam/mac/central-michigan-chippewas.png",
  "eastern-michigan-eagles": "/logos/leagues/ncaam/mac/eastern-michigan-eagles.png",
  "kent-state-golden-flashes": "/logos/leagues/ncaam/mac/kent-state-golden-flashes.png",
  "massachusetts-minutemen": "/logos/leagues/ncaam/mac/massachusetts-minutemen.png",
  "miami-oh-redhawks": "/logos/leagues/ncaam/mac/miami-oh-redhawks.png",
  "northern-illinois-huskies": "/logos/leagues/ncaam/mac/northern-illinois-huskies.png",
  "ohio-bobcats": "/logos/leagues/ncaam/mac/ohio-bobcats.png",
  "toledo-rockets": "/logos/leagues/ncaam/mac/toledo-rockets.png",
  "western-michigan-broncos": "/logos/leagues/ncaam/mac/western-michigan-broncos.png",
  // MEAC
  "coppin-state-eagles": "/logos/leagues/ncaam/meac/coppin-state-eagles.png",
  "delaware-state-hornets": "/logos/leagues/ncaam/meac/delaware-state-hornets.png",
  "howard-bison": "/logos/leagues/ncaam/meac/howard-bison.png",
  "maryland-eastern-shore-hawks": "/logos/leagues/ncaam/meac/maryland-eastern-shore-hawks.png",
  "morgan-state-bears": "/logos/leagues/ncaam/meac/morgan-state-bears.png",
  "norfolk-state-spartans": "/logos/leagues/ncaam/meac/norfolk-state-spartans.png",
  "north-carolina-central-eagles": "/logos/leagues/ncaam/meac/north-carolina-central-eagles.png",
  "south-carolina-state-bulldogs": "/logos/leagues/ncaam/meac/south-carolina-state-bulldogs.png",
  // MVC
  "belmont-bruins": "/logos/leagues/ncaam/mvc/belmont-bruins.png",
  "bradley-braves": "/logos/leagues/ncaam/mvc/bradley-braves.png",
  "drake-bulldogs": "/logos/leagues/ncaam/mvc/drake-bulldogs.png",
  "evansville-purple-aces": "/logos/leagues/ncaam/mvc/evansville-purple-aces.png",
  "illinois-state-redbirds": "/logos/leagues/ncaam/mvc/illinois-state-redbirds.png",
  "indiana-state-sycamores": "/logos/leagues/ncaam/mvc/indiana-state-sycamores.png",
  "murray-state-racers": "/logos/leagues/ncaam/mvc/murray-state-racers.png",
  "northern-iowa-panthers": "/logos/leagues/ncaam/mvc/northern-iowa-panthers.png",
  "southern-illinois-salukis": "/logos/leagues/ncaam/mvc/southern-illinois-salukis.png",
  "uic-flames": "/logos/leagues/ncaam/mvc/uic-flames.png",
  "valparaiso-beacons": "/logos/leagues/ncaam/mvc/valparaiso-beacons.png",
  // MWC (Mountain West)
  "air-force-falcons": "/logos/leagues/ncaam/mwc/air-force-falcons.png",
  "boise-state-broncos": "/logos/leagues/ncaam/mwc/boise-state-broncos.png",
  "colorado-state-rams": "/logos/leagues/ncaam/mwc/colorado-state-rams.png",
  "fresno-state-bulldogs": "/logos/leagues/ncaam/mwc/fresno-state-bulldogs.png",
  "grand-canyon-lopes": "/logos/leagues/ncaam/mwc/grand-canyon-lopes.png",
  "nevada-wolf-pack": "/logos/leagues/ncaam/mwc/nevada-wolf-pack.png",
  "new-mexico-lobos": "/logos/leagues/ncaam/mwc/new-mexico-lobos.png",
  "san-diego-state-aztecs": "/logos/leagues/ncaam/mwc/san-diego-state-aztecs.png",
  "san-jose-state-spartans": "/logos/leagues/ncaam/mwc/san-jose-state-spartans.png",
  "unlv-rebels": "/logos/leagues/ncaam/mwc/unlv-rebels.png",
  "utah-state-aggies": "/logos/leagues/ncaam/mwc/utah-state-aggies.png",
  "wyoming-cowboys": "/logos/leagues/ncaam/mwc/wyoming-cowboys.png",
  // NEC
  "central-connecticut-blue-devils": "/logos/leagues/ncaam/nec/central-connecticut-blue-devils.png",
  "chicago-state-cougars": "/logos/leagues/ncaam/nec/chicago-state-cougars.png",
  "fairleigh-dickinson-knights": "/logos/leagues/ncaam/nec/fairleigh-dickinson-knights.png",
  "le-moyne-dolphins": "/logos/leagues/ncaam/nec/le-moyne-dolphins.png",
  "long-island-university-sharks": "/logos/leagues/ncaam/nec/long-island-university-sharks.png",
  "mercyhurst-lakers": "/logos/leagues/ncaam/nec/mercyhurst-lakers.png",
  "new-haven-chargers": "/logos/leagues/ncaam/nec/new-haven-chargers.png",
  "saint-francis-red-flash": "/logos/leagues/ncaam/nec/saint-francis-red-flash.png",
  "stonehill-skyhawks": "/logos/leagues/ncaam/nec/stonehill-skyhawks.png",
  "wagner-seahawks": "/logos/leagues/ncaam/nec/wagner-seahawks.png",
  // OVC
  "eastern-illinois-panthers": "/logos/leagues/ncaam/ovc/eastern-illinois-panthers.png",
  "lindenwood-lions": "/logos/leagues/ncaam/ovc/lindenwood-lions.png",
  "little-rock-trojans": "/logos/leagues/ncaam/ovc/little-rock-trojans.png",
  "morehead-state-eagles": "/logos/leagues/ncaam/ovc/morehead-state-eagles.png",
  "siu-edwardsville-cougars": "/logos/leagues/ncaam/ovc/siu-edwardsville-cougars.png",
  "southeast-missouri-state-redhawks": "/logos/leagues/ncaam/ovc/southeast-missouri-state-redhawks.png",
  "southern-indiana-screaming-eagles": "/logos/leagues/ncaam/ovc/southern-indiana-screaming-eagles.png",
  "tennessee-state-tigers": "/logos/leagues/ncaam/ovc/tennessee-state-tigers.png",
  "tennessee-tech-golden-eagles": "/logos/leagues/ncaam/ovc/tennessee-tech-golden-eagles.png",
  "ut-martin-skyhawks": "/logos/leagues/ncaam/ovc/ut-martin-skyhawks.png",
  "western-illinois-leathernecks": "/logos/leagues/ncaam/ovc/western-illinois-leathernecks.png",
  // Patriot League
  "american-university-eagles": "/logos/leagues/ncaam/patriot-league/american-university-eagles.png",
  "army-black-knights": "/logos/leagues/ncaam/patriot-league/army-black-knights.png",
  "boston-university-terriers": "/logos/leagues/ncaam/patriot-league/boston-university-terriers.png",
  "bucknell-bison": "/logos/leagues/ncaam/patriot-league/bucknell-bison.png",
  "colgate-raiders": "/logos/leagues/ncaam/patriot-league/colgate-raiders.png",
  "holy-cross-crusaders": "/logos/leagues/ncaam/patriot-league/holy-cross-crusaders.png",
  "lafayette-leopards": "/logos/leagues/ncaam/patriot-league/lafayette-leopards.png",
  "lehigh-mountain-hawks": "/logos/leagues/ncaam/patriot-league/lehigh-mountain-hawks.png",
  "loyola-maryland-greyhounds": "/logos/leagues/ncaam/patriot-league/loyola-maryland-greyhounds.png",
  "navy-midshipmen": "/logos/leagues/ncaam/patriot-league/navy-midshipmen.png",
  // SEC
  "alabama-crimson-tide": "/logos/leagues/ncaam/sec/alabama-crimson-tide.png",
  "arkansas-razorbacks": "/logos/leagues/ncaam/sec/arkansas-razorbacks.png",
  "auburn-tigers": "/logos/leagues/ncaam/sec/auburn-tigers.png",
  "florida-gators": "/logos/leagues/ncaam/sec/florida-gators.png",
  "georgia-bulldogs": "/logos/leagues/ncaam/sec/georgia-bulldogs.png",
  "kentucky-wildcats": "/logos/leagues/ncaam/sec/kentucky-wildcats.png",
  "lsu-tigers": "/logos/leagues/ncaam/sec/lsu-tigers.png",
  "mississippi-state-bulldogs": "/logos/leagues/ncaam/sec/mississippi-state-bulldogs.png",
  "missouri-tigers": "/logos/leagues/ncaam/sec/missouri-tigers.png",
  "oklahoma-sooners": "/logos/leagues/ncaam/sec/oklahoma-sooners.png",
  "ole-miss-rebels": "/logos/leagues/ncaam/sec/ole-miss-rebels.png",
  "south-carolina-gamecocks": "/logos/leagues/ncaam/sec/south-carolina-gamecocks.png",
  "tennessee-volunteers": "/logos/leagues/ncaam/sec/tennessee-volunteers.png",
  "texas-am-aggies": "/logos/leagues/ncaam/sec/texas-am-aggies.png",
  "texas-longhorns": "/logos/leagues/ncaam/sec/texas-longhorns.png",
  "vanderbilt-commodores": "/logos/leagues/ncaam/sec/vanderbilt-commodores.png",
  // Southern
  "chattanooga-mocs": "/logos/leagues/ncaam/southern/chattanooga-mocs.png",
  "east-tennessee-state-buccaneers": "/logos/leagues/ncaam/southern/east-tennessee-state-buccaneers.png",
  "furman-paladins": "/logos/leagues/ncaam/southern/furman-paladins.png",
  "mercer-bears": "/logos/leagues/ncaam/southern/mercer-bears.png",
  "samford-bulldogs": "/logos/leagues/ncaam/southern/samford-bulldogs.png",
  "the-citadel-bulldogs": "/logos/leagues/ncaam/southern/the-citadel-bulldogs.png",
  "unc-greensboro-spartans": "/logos/leagues/ncaam/southern/unc-greensboro-spartans.png",
  "vmi-keydets": "/logos/leagues/ncaam/southern/vmi-keydets.png",
  "western-carolina-catamounts": "/logos/leagues/ncaam/southern/western-carolina-catamounts.png",
  "wofford-terriers": "/logos/leagues/ncaam/southern/wofford-terriers.png",
  // Southland
  "east-texas-am-lions": "/logos/leagues/ncaam/southland/east-texas-am-lions.png",
  "houston-christian-huskies": "/logos/leagues/ncaam/southland/houston-christian-huskies.png",
  "incarnate-word-cardinals": "/logos/leagues/ncaam/southland/incarnate-word-cardinals.png",
  "lamar-cardinals": "/logos/leagues/ncaam/southland/lamar-cardinals.png",
  "mcneese-cowboys": "/logos/leagues/ncaam/southland/mcneese-cowboys.png",
  "new-orleans-privateers": "/logos/leagues/ncaam/southland/new-orleans-privateers.png",
  "nicholls-colonels": "/logos/leagues/ncaam/southland/nicholls-colonels.png",
  "northwestern-state-demons": "/logos/leagues/ncaam/southland/northwestern-state-demons.png",
  "se-louisiana-lions": "/logos/leagues/ncaam/southland/se-louisiana-lions.png",
  "stephen-f-austin-lumberjacks": "/logos/leagues/ncaam/southland/stephen-f-austin-lumberjacks.png",
  "texas-am-corpus-christi-islanders": "/logos/leagues/ncaam/southland/texas-am-corpus-christi-islanders.png",
  "ut-rio-grande-valley-vaqueros": "/logos/leagues/ncaam/southland/ut-rio-grande-valley-vaqueros.png",
  // Summit League
  "denver-pioneers": "/logos/leagues/ncaam/summit-league/denver-pioneers.png",
  "kansas-city-roos": "/logos/leagues/ncaam/summit-league/kansas-city-roos.png",
  "north-dakota-fighting-hawks": "/logos/leagues/ncaam/summit-league/north-dakota-fighting-hawks.png",
  "north-dakota-state-bison": "/logos/leagues/ncaam/summit-league/north-dakota-state-bison.png",
  "omaha-mavericks": "/logos/leagues/ncaam/summit-league/omaha-mavericks.png",
  "oral-roberts-golden-eagles": "/logos/leagues/ncaam/summit-league/oral-roberts-golden-eagles.png",
  "south-dakota-coyotes": "/logos/leagues/ncaam/summit-league/south-dakota-coyotes.png",
  "south-dakota-state-jackrabbits": "/logos/leagues/ncaam/summit-league/south-dakota-state-jackrabbits.png",
  "st-thomas-minnesota-tommies": "/logos/leagues/ncaam/summit-league/st-thomas-minnesota-tommies.png",
  // Sun Belt
  "app-state-mountaineers": "/logos/leagues/ncaam/sun-belt/app-state-mountaineers.png",
  "arkansas-state-red-wolves": "/logos/leagues/ncaam/sun-belt/arkansas-state-red-wolves.png",
  "coastal-carolina-chanticleers": "/logos/leagues/ncaam/sun-belt/coastal-carolina-chanticleers.png",
  "georgia-southern-eagles": "/logos/leagues/ncaam/sun-belt/georgia-southern-eagles.png",
  "georgia-state-panthers": "/logos/leagues/ncaam/sun-belt/georgia-state-panthers.png",
  "james-madison-dukes": "/logos/leagues/ncaam/sun-belt/james-madison-dukes.png",
  "louisiana-ragin-cajuns": "/logos/leagues/ncaam/sun-belt/louisiana-ragin-cajuns.png",
  "marshall-thundering-herd": "/logos/leagues/ncaam/sun-belt/marshall-thundering-herd.png",
  "old-dominion-monarchs": "/logos/leagues/ncaam/sun-belt/old-dominion-monarchs.png",
  "south-alabama-jaguars": "/logos/leagues/ncaam/sun-belt/south-alabama-jaguars.png",
  "southern-miss-golden-eagles": "/logos/leagues/ncaam/sun-belt/southern-miss-golden-eagles.png",
  "texas-state-bobcats": "/logos/leagues/ncaam/sun-belt/texas-state-bobcats.png",
  "troy-trojans": "/logos/leagues/ncaam/sun-belt/troy-trojans.png",
  "ul-monroe-warhawks": "/logos/leagues/ncaam/sun-belt/ul-monroe-warhawks.png",
  // SWAC
  "alabama-am-bulldogs": "/logos/leagues/ncaam/swac/alabama-am-bulldogs.png",
  "alabama-state-hornets": "/logos/leagues/ncaam/swac/alabama-state-hornets.png",
  "alcorn-state-braves": "/logos/leagues/ncaam/swac/alcorn-state-braves.png",
  "arkansas-pine-bluff-golden-lions": "/logos/leagues/ncaam/swac/arkansas-pine-bluff-golden-lions.png",
  "bethune-cookman-wildcats": "/logos/leagues/ncaam/swac/bethune-cookman-wildcats.png",
  "florida-am-rattlers": "/logos/leagues/ncaam/swac/florida-am-rattlers.png",
  "grambling-tigers": "/logos/leagues/ncaam/swac/grambling-tigers.png",
  "jackson-state-tigers": "/logos/leagues/ncaam/swac/jackson-state-tigers.png",
  "mississippi-valley-state-delta-devils": "/logos/leagues/ncaam/swac/mississippi-valley-state-delta-devils.png",
  "prairie-view-am-panthers": "/logos/leagues/ncaam/swac/prairie-view-am-panthers.png",
  "southern-jaguars": "/logos/leagues/ncaam/swac/southern-jaguars.png",
  "texas-southern-tigers": "/logos/leagues/ncaam/swac/texas-southern-tigers.png",
  // WAC
  "abilene-christian-wildcats": "/logos/leagues/ncaam/wac/abilene-christian-wildcats.png",
  "california-baptist-lancers": "/logos/leagues/ncaam/wac/california-baptist-lancers.png",
  "southern-utah-thunderbirds": "/logos/leagues/ncaam/wac/southern-utah-thunderbirds.png",
  "tarleton-state-texans": "/logos/leagues/ncaam/wac/tarleton-state-texans.png",
  "ut-arlington-mavericks": "/logos/leagues/ncaam/wac/ut-arlington-mavericks.png",
  "utah-tech-trailblazers": "/logos/leagues/ncaam/wac/utah-tech-trailblazers.png",
  "utah-valley-wolverines": "/logos/leagues/ncaam/wac/utah-valley-wolverines.png",
  // WCC
  "gonzaga-bulldogs": "/logos/leagues/ncaam/wcc/gonzaga-bulldogs.png",
  "loyola-marymount-lions": "/logos/leagues/ncaam/wcc/loyola-marymount-lions.png",
  "oregon-state-beavers": "/logos/leagues/ncaam/wcc/oregon-state-beavers.png",
  "pacific-tigers": "/logos/leagues/ncaam/wcc/pacific-tigers.png",
  "pepperdine-waves": "/logos/leagues/ncaam/wcc/pepperdine-waves.png",
  "portland-pilots": "/logos/leagues/ncaam/wcc/portland-pilots.png",
  "saint-marys-gaels": "/logos/leagues/ncaam/wcc/saint-marys-gaels.png",
  "san-diego-toreros": "/logos/leagues/ncaam/wcc/san-diego-toreros.png",
  "san-francisco-dons": "/logos/leagues/ncaam/wcc/san-francisco-dons.png",
  "santa-clara-broncos": "/logos/leagues/ncaam/wcc/santa-clara-broncos.png",
  "seattle-u-redhawks": "/logos/leagues/ncaam/wcc/seattle-u-redhawks.png",
  "washington-state-cougars": "/logos/leagues/ncaam/wcc/washington-state-cougars.png",
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
