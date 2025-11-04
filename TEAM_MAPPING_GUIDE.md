# Team Mapping Guide

## Overview

This guide explains how the team mapping system works and how to add new teams when they're missing.

## Architecture

The team data pipeline consists of several interconnected utilities:

### 1. **Team Mappings** (`src/utils/teamMappings.ts`)
Maps team slugs to display names, abbreviations, and ESPN identifiers.

```typescript
"arizona-cardinals": {
  name: "Cardinals",           // Short display name
  abbr: "ARI",                 // 3-4 letter abbreviation
  espnAbbr: "ari",            // ESPN API identifier
  fullName: "Arizona Cardinals" // Full official name
}
```

### 2. **Team Colors** (`src/utils/teamColors.ts`)
Provides official team colors (primary, secondary, tertiary hex codes).

```typescript
"Arizona Cardinals": {
  primary: "#97233F",    // Main team color
  secondary: "#000000",  // Secondary color
  tertiary: "#FFB612"   // Accent color
}
```

### 3. **Team Logos** (`src/utils/teamLogos.ts`)
Maps team slugs to local logo file paths.

```typescript
"arizona-cardinals": "/logos/Leagues/NFL/NFC/NFC West/arizona-cardinals.png"
```

### 4. **Fuzzy Matching** (`src/utils/fuzzyTeamMatcher.ts`)
Provides intelligent fallback matching when exact lookups fail using:
- Levenshtein distance
- Partial string matching
- Keyword extraction

## Logo Directory Structure

```
public/logos/Leagues/
├── NBA/
│   ├── Eastern/
│   │   ├── Atlantic/
│   │   ├── Central/
│   │   └── Southeast/
│   └── Western/
│       ├── Northwest/
│       ├── Pacific/
│       └── Southwest/
├── NFL/
│   ├── AFC/
│   │   ├── AFC East/
│   │   ├── AFC North/
│   │   ├── AFC South/
│   │   └── AFC West/
│   └── NFC/
│       ├── NFC East/
│       ├── NFC North/
│       ├── NFC South/
│       └── NFC West/
├── NHL/
│   ├── Eastern/
│   │   ├── Atlantic/
│   │   └── Metropolitan/
│   └── Western/
│       ├── Central/
│       └── Pacific/
├── NCAAF/ (College Football by conference)
├── NCAAM/ (College Basketball by conference)
└── Sportsbooks/ (DraftKings, Circa, etc.)
```

## Adding a New Team

### Step 1: Identify the Missing Team

Check console logs for entries like:
```
🚨 [TEAM MAPPING] No direct match for "new-team-slug" in NBA
```

### Step 2: Add to Team Mappings

Open `src/utils/teamMappings.ts` and add to the appropriate sport mapping:

```typescript
export const NBA_TEAM_MAPPINGS: Record<string, ...> = {
  // ... existing teams ...
  "new-team-slug": {
    name: "Team Name",
    abbr: "ABC",
    espnAbbr: "abc",
    fullName: "Full Team Name"
  }
};
```

### Step 3: Add Team Colors

Open `src/utils/teamColors.ts` and add official colors:

```typescript
export const NBA_TEAM_COLORS: Record<string, ...> = {
  // ... existing teams ...
  "Full Team Name": {
    primary: "#HEXCOLOR",   // Find on team's official website
    secondary: "#HEXCOLOR",
    tertiary: "#HEXCOLOR"
  }
};
```

**Finding Official Colors:**
1. Visit the team's official website
2. Check the team's brand guidelines (often in press/media sections)
3. Use color picker tools on official logos
4. Reference ESPN's team pages

### Step 4: Add Logo Path (Optional)

If you have the logo file locally:

1. Place the logo in the appropriate directory structure
2. Open `src/utils/teamLogos.ts` and add the path:

```typescript
export const NBA_LOGO_PATHS: Record<string, string> = {
  // ... existing teams ...
  "new-team-slug": "/logos/Leagues/NBA/Conference/Division/new-team-slug.png"
};
```

**If logo is not available locally:**
The system will automatically fall back to ESPN's CDN, so this step is optional.

### Step 5: Test

1. Restart the development server
2. Check console logs for successful team lookup
3. Verify team name, colors, and logo display correctly in the UI

## Debugging Team Issues

### Missing Team Names
**Symptom:** Team displays as raw slug (e.g., "arizona-cardinals")
**Solution:** Add team to appropriate mapping in `teamMappings.ts`

### Wrong or Default Colors
**Symptom:** Team shows purple (#6F74FF) or wrong colors
**Solution:** Add team colors to `teamColors.ts` using the **full team name** as key

### Missing Logos
**Symptom:** Broken image or ESPN logo
**Solution:** 
1. Check if logo file exists in `public/logos/Leagues/`
2. Add path to `teamLogos.ts`
3. If file doesn't exist, ESPN CDN fallback will be used

### Fuzzy Matching Not Working
**Symptom:** Team still shows as slug despite similar team existing
**Solution:** Lower the confidence threshold in `fuzzyTeamMatcher.ts` or add exact mapping

## College Sports (NCAAF/NCAAM)

College teams use slightly different mapping:

```typescript
// CFB example
"alabama-crimson-tide": {
  name: "Alabama",
  abbr: "ALA",
  espnAbbr: "333",  // ESPN uses numeric IDs for college teams
  fullName: "alabama crimson tide"  // lowercase for CFB
}
```

**Important Notes:**
- CFB/CBB data automatically converts to NCAAF/NCAAM in the parser
- ESPN uses numeric team IDs for college teams
- Full names are lowercase in CFB mappings for consistency

## Comprehensive Logging

The system includes extensive logging at every stage:

### Parser Level
```
🎮 [PARSER] ========== PARSING GAME 20251103NFL00047 ==========
🎮 [PARSER] Raw sport: "nfl"
🎮 [PARSER] Away slug: "arizona-cardinals"
🎮 [PARSER] Home slug: "dallas-cowboys"
```

### Team Lookup
```
🔍 [TEAM MAPPING] Looking up slug: "arizona-cardinals" for sport: NFL
✅ [TEAM MAPPING] Direct match found: Arizona Cardinals (ARI)
```

### Color Lookup
```
🎨 [TEAM COLORS] Looking up colors for: "Arizona Cardinals" (NFL)
🎨 [TEAM COLORS] Final colors: { primary: "#97233F", ... }
```

### Logo Lookup
```
🖼️ [TEAM LOGO] Looking up logo - Sport: NFL, Slug: "arizona-cardinals"
✅ [TEAM LOGO] NFL local logo found: /logos/Leagues/NFL/...
```

## Best Practices

1. **Always use exact team slugs** from the data source
2. **Use official colors** from team brand guidelines
3. **Test with real data** after adding new teams
4. **Keep mappings alphabetically sorted** for maintainability
5. **Add comments** for teams with unusual naming conventions
6. **Use fuzzy matching** as last resort, not primary strategy

## Common Issues

### Issue: "Team colors showing as default purple"
**Cause:** Key mismatch between mapping and color lookup
**Fix:** Ensure the fullName in mapping exactly matches the key in colors

### Issue: "Logo not loading"
**Cause:** Path typo or file missing
**Fix:** Verify file exists and path is correct (case-sensitive)

### Issue: "CBB teams not showing"
**Cause:** Limited CBB_TEAM_MAPPINGS coverage
**Fix:** Expand CBB mappings or rely on fuzzy matching fallback

## Future Improvements

- [ ] Auto-generate mappings from ESPN API
- [ ] Add team location/stadium data
- [ ] Support for international leagues
- [ ] Automated testing of all team mappings
- [ ] Logo optimization and caching strategy
