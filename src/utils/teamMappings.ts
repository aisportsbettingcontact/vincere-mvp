// Map team slugs to display names and ESPN abbreviations
export const NFL_TEAM_MAPPINGS: Record<string, { name: string; abbr: string; espnAbbr: string; fullName: string }> = {
  "arizona-cardinals": { name: "Cardinals", abbr: "ARI", espnAbbr: "ari", fullName: "Arizona Cardinals" },
  "atlanta-falcons": { name: "Falcons", abbr: "ATL", espnAbbr: "atl", fullName: "Atlanta Falcons" },
  "baltimore-ravens": { name: "Ravens", abbr: "BAL", espnAbbr: "bal", fullName: "Baltimore Ravens" },
  "buffalo-bills": { name: "Bills", abbr: "BUF", espnAbbr: "buf", fullName: "Buffalo Bills" },
  "carolina-panthers": { name: "Panthers", abbr: "CAR", espnAbbr: "car", fullName: "Carolina Panthers" },
  "chicago-bears": { name: "Bears", abbr: "CHI", espnAbbr: "chi", fullName: "Chicago Bears" },
  "cincinnati-bengals": { name: "Bengals", abbr: "CIN", espnAbbr: "cin", fullName: "Cincinnati Bengals" },
  "cleveland-browns": { name: "Browns", abbr: "CLE", espnAbbr: "cle", fullName: "Cleveland Browns" },
  "dallas-cowboys": { name: "Cowboys", abbr: "DAL", espnAbbr: "dal", fullName: "Dallas Cowboys" },
  "denver-broncos": { name: "Broncos", abbr: "DEN", espnAbbr: "den", fullName: "Denver Broncos" },
  "detroit-lions": { name: "Lions", abbr: "DET", espnAbbr: "det", fullName: "Detroit Lions" },
  "green-bay-packers": { name: "Packers", abbr: "GB", espnAbbr: "gb", fullName: "Green Bay Packers" },
  "houston-texans": { name: "Texans", abbr: "HOU", espnAbbr: "hou", fullName: "Houston Texans" },
  "indianapolis-colts": { name: "Colts", abbr: "IND", espnAbbr: "ind", fullName: "Indianapolis Colts" },
  "jacksonville-jaguars": { name: "Jaguars", abbr: "JAX", espnAbbr: "jax", fullName: "Jacksonville Jaguars" },
  "kansas-city-chiefs": { name: "Chiefs", abbr: "KC", espnAbbr: "kc", fullName: "Kansas City Chiefs" },
  "las-vegas-raiders": { name: "Raiders", abbr: "LV", espnAbbr: "lv", fullName: "Las Vegas Raiders" },
  "los-angeles-chargers": { name: "Chargers", abbr: "LAC", espnAbbr: "lac", fullName: "Los Angeles Chargers" },
  "los-angeles-rams": { name: "Rams", abbr: "LAR", espnAbbr: "lar", fullName: "Los Angeles Rams" },
  "miami-dolphins": { name: "Dolphins", abbr: "MIA", espnAbbr: "mia", fullName: "Miami Dolphins" },
  "minnesota-vikings": { name: "Vikings", abbr: "MIN", espnAbbr: "min", fullName: "Minnesota Vikings" },
  "new-england-patriots": { name: "Patriots", abbr: "NE", espnAbbr: "ne", fullName: "New England Patriots" },
  "new-orleans-saints": { name: "Saints", abbr: "NO", espnAbbr: "no", fullName: "New Orleans Saints" },
  "new-york-giants": { name: "Giants", abbr: "NYG", espnAbbr: "nyg", fullName: "New York Giants" },
  "new-york-jets": { name: "Jets", abbr: "NYJ", espnAbbr: "nyj", fullName: "New York Jets" },
  "philadelphia-eagles": { name: "Eagles", abbr: "PHI", espnAbbr: "phi", fullName: "Philadelphia Eagles" },
  "pittsburgh-steelers": { name: "Steelers", abbr: "PIT", espnAbbr: "pit", fullName: "Pittsburgh Steelers" },
  "san-francisco-49ers": { name: "49ers", abbr: "SF", espnAbbr: "sf", fullName: "San Francisco 49ers" },
  "seattle-seahawks": { name: "Seahawks", abbr: "SEA", espnAbbr: "sea", fullName: "Seattle Seahawks" },
  "tampa-bay-buccaneers": { name: "Buccaneers", abbr: "TB", espnAbbr: "tb", fullName: "Tampa Bay Buccaneers" },
  "tennessee-titans": { name: "Titans", abbr: "TEN", espnAbbr: "ten", fullName: "Tennessee Titans" },
  "washington-commanders": { name: "Commanders", abbr: "WAS", espnAbbr: "wsh", fullName: "Washington Commanders" }
};

export function getTeamInfo(slug: string) {
  return NFL_TEAM_MAPPINGS[slug] || { 
    name: slug, 
    abbr: slug.toUpperCase().slice(0, 3), 
    espnAbbr: slug.slice(0, 3),
    fullName: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  };
}
