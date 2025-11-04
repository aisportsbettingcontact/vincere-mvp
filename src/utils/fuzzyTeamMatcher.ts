/**
 * Fuzzy Team Matching Utility
 * 
 * Provides intelligent team name matching when exact slug lookups fail
 * Uses Levenshtein distance and partial matching algorithms
 */

/**
 * Calculate Levenshtein distance between two strings
 * Used to find closest team name match
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Normalize team name for matching
 */
function normalizeTeamName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract keywords from team name for partial matching
 */
function extractKeywords(name: string): string[] {
  const normalized = normalizeTeamName(name);
  const words = normalized.split(' ');
  
  // Filter out common words
  const commonWords = ['the', 'of', 'and', 'at', 'state', 'university'];
  return words.filter(w => !commonWords.includes(w) && w.length > 2);
}

interface FuzzyMatchResult {
  match: string;
  confidence: number;
  method: 'exact' | 'levenshtein' | 'partial' | 'keyword';
}

/**
 * Find the best matching team name from a list of options
 */
export function findBestTeamMatch(
  searchTerm: string,
  availableTeams: string[],
  threshold: number = 0.6
): FuzzyMatchResult | null {
  console.log(`🔍 [FUZZY MATCHER] Searching for: "${searchTerm}"`);
  console.log(`🔍 [FUZZY MATCHER] Available options: ${availableTeams.length} teams`);
  
  const normalizedSearch = normalizeTeamName(searchTerm);
  const searchKeywords = extractKeywords(searchTerm);
  
  let bestMatch: FuzzyMatchResult | null = null;
  let bestScore = 0;
  
  for (const team of availableTeams) {
    const normalizedTeam = normalizeTeamName(team);
    
    // 1. Exact match (perfect score)
    if (normalizedSearch === normalizedTeam) {
      console.log(`✅ [FUZZY MATCHER] Exact match found: "${team}"`);
      return {
        match: team,
        confidence: 1.0,
        method: 'exact'
      };
    }
    
    // 2. Levenshtein distance matching
    const distance = levenshteinDistance(normalizedSearch, normalizedTeam);
    const maxLength = Math.max(normalizedSearch.length, normalizedTeam.length);
    const similarity = 1 - (distance / maxLength);
    
    if (similarity > bestScore) {
      bestScore = similarity;
      bestMatch = {
        match: team,
        confidence: similarity,
        method: 'levenshtein'
      };
    }
    
    // 3. Partial string matching
    if (normalizedTeam.includes(normalizedSearch) || normalizedSearch.includes(normalizedTeam)) {
      const partialScore = Math.min(normalizedSearch.length, normalizedTeam.length) / 
                           Math.max(normalizedSearch.length, normalizedTeam.length);
      
      if (partialScore > bestScore) {
        bestScore = partialScore;
        bestMatch = {
          match: team,
          confidence: partialScore,
          method: 'partial'
        };
      }
    }
    
    // 4. Keyword matching
    const teamKeywords = extractKeywords(team);
    const matchingKeywords = searchKeywords.filter(k => 
      teamKeywords.some(tk => tk.includes(k) || k.includes(tk))
    );
    
    if (matchingKeywords.length > 0 && searchKeywords.length > 0) {
      const keywordScore = matchingKeywords.length / searchKeywords.length;
      
      if (keywordScore > bestScore) {
        bestScore = keywordScore;
        bestMatch = {
          match: team,
          confidence: keywordScore,
          method: 'keyword'
        };
      }
    }
  }
  
  if (bestMatch && bestMatch.confidence >= threshold) {
    console.log(`✅ [FUZZY MATCHER] Best match: "${bestMatch.match}" (confidence: ${(bestMatch.confidence * 100).toFixed(1)}%, method: ${bestMatch.method})`);
    return bestMatch;
  }
  
  console.warn(`⚠️ [FUZZY MATCHER] No match found above threshold (${threshold}). Best score: ${(bestScore * 100).toFixed(1)}%`);
  return null;
}

/**
 * Create a fallback team info object from a slug
 */
export function createFallbackTeamInfo(slug: string, sport: string) {
  console.log(`🔧 [FUZZY MATCHER] Creating fallback for slug: "${slug}" (${sport})`);
  
  // Convert slug to display name
  const words = slug.split('-');
  const name = words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Create abbreviated name (first letters or common abbreviations)
  let abbr: string;
  if (words.length === 1) {
    abbr = words[0].substring(0, 4).toUpperCase();
  } else if (words.length === 2) {
    abbr = words[0].substring(0, 2).toUpperCase() + words[1].substring(0, 2).toUpperCase();
  } else {
    abbr = words.slice(0, 3).map(w => w.charAt(0).toUpperCase()).join('');
  }
  
  const fallback = {
    name,
    abbr: abbr.substring(0, 4),
    espnAbbr: slug,
    fullName: name
  };
  
  console.log(`🔧 [FUZZY MATCHER] Fallback created:`, fallback);
  return fallback;
}
