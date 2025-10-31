export function getTeamLogo(sport: string, espnAbbr: string): string {
  if (sport === "CFB" || sport === "CBB") {
    return `https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${espnAbbr}.png&h=200&w=200`;
  }
  const sportPath = sport.toLowerCase();
  return `https://a.espncdn.com/combiner/i?img=/i/teamlogos/${sportPath}/500/${espnAbbr}.png&h=200&w=200`;
}
