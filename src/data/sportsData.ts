export interface Matchup {
  dateTime: string;
  away: {
    name: string;
    espnAbbr: string;
    color: string;
    odds: {
      ml: string;
      spread: string;
      spreadOdds: string;
      total: string;
      totalOdds: string;
    };
  };
  home: {
    name: string;
    espnAbbr: string;
    color: string;
    odds: {
      ml: string;
      spread: string;
      spreadOdds: string;
      total: string;
      totalOdds: string;
    };
  };
}

export function getTeamLogo(sport: string, espnAbbr: string): string {
  const sportPath = sport.toLowerCase();
  return `https://a.espncdn.com/i/teamlogos/${sportPath}/500/${espnAbbr}.png`;
}
