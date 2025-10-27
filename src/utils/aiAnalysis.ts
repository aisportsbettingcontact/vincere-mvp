interface AnalysisInput {
  matchup: string;
  market: "spread" | "moneyline" | "total";
  current_line: string;
  away_line?: string;
  home_line?: string;
  tickets: { away?: number; home?: number; o?: number; u?: number };
  money: { away?: number; home?: number; o?: number; u?: number };
  move: { from: string; to: string };
}

interface AIInsights {
  bookNeed: string;
  sharpSide: string;
  publicSide: string;
}

export function generateAIInsights(input: AnalysisInput): AIInsights {
  const [away, home] = input.matchup.split(' @ ');
  
  if (input.market === "total") {
    const overTickets = input.tickets.o || 50;
    const underTickets = input.tickets.u || 50;
    const overMoney = input.money.o || 50;
    const underMoney = input.money.u || 50;
    
    const ticketDiff = overTickets - underTickets;
    const moneyDiff = overMoney - underMoney;
    
    // Determine public and sharp sides
    const publicSide = Math.abs(ticketDiff) > 10 
      ? (ticketDiff > 0 ? "Over" : "Under")
      : "Mixed signals";
    const sharpSide = Math.abs(moneyDiff) > 10 
      ? (moneyDiff > 0 ? "Over" : "Under")
      : publicSide;
    
    return {
      bookNeed: `${publicSide === "Over" ? "UNDER" : "OVER"} ${input.current_line}. Books need the ${publicSide === "Over" ? "under" : "over"} to balance ${publicSide === "Mixed signals" ? "the" : "heavy"} public action.`,
      sharpSide: `${sharpSide} ${input.current_line}. Sharp money ${moneyDiff > 15 ? "heavily" : ""} favors the ${sharpSide.toLowerCase()} with ${Math.abs(moneyDiff).toFixed(0)}% of handle.`,
      publicSide: `${publicSide} ${input.current_line}. Public bettors are ${Math.abs(ticketDiff) > 20 ? "heavily" : ""} backing the ${publicSide.toLowerCase()} with ${Math.max(overTickets, underTickets).toFixed(0)}% of tickets.`
    };
  }
  
  if (input.market === "moneyline") {
    const awayTickets = input.tickets.away || 50;
    const homeTickets = input.tickets.home || 50;
    const awayMoney = input.money.away || 50;
    const homeMoney = input.money.home || 50;
    
    const ticketDiff = awayTickets - homeTickets;
    const moneyDiff = awayMoney - homeMoney;
    
    const publicTeam = Math.abs(ticketDiff) > 10 ? (ticketDiff > 0 ? away : home) : "Mixed signals";
    const sharpTeam = Math.abs(moneyDiff) > 10 ? (moneyDiff > 0 ? away : home) : publicTeam;
    const bookNeed = publicTeam === away ? home : away;
    
    return {
      bookNeed: `${bookNeed} ${input.current_line}. Sportsbooks need ${bookNeed} to win to balance the action.`,
      sharpSide: `${sharpTeam} ${input.current_line}. Sharp bettors are backing ${sharpTeam} with ${Math.max(awayMoney, homeMoney).toFixed(0)}% of the money.`,
      publicSide: `${publicTeam} ${input.current_line}. The public is all over ${publicTeam} with ${Math.max(awayTickets, homeTickets).toFixed(0)}% of tickets.`
    };
  }
  
  // Spread
  const awayTickets = input.tickets.away || 50;
  const homeTickets = input.tickets.home || 50;
  const awayMoney = input.money.away || 50;
  const homeMoney = input.money.home || 50;
  
  const ticketDiff = awayTickets - homeTickets;
  const moneyDiff = awayMoney - homeMoney;
  
  const publicTeam = Math.abs(ticketDiff) > 10 ? (ticketDiff > 0 ? away : home) : "Mixed signals";
  const sharpTeam = Math.abs(moneyDiff) > 10 ? (moneyDiff > 0 ? away : home) : publicTeam;
  const bookNeed = publicTeam === away ? home : away;
  
  return {
    bookNeed: `${bookNeed} ${input.current_line}. Books need ${bookNeed} to cover to balance heavy public action on ${publicTeam}.`,
    sharpSide: `${sharpTeam} ${input.current_line}. Sharp money is ${Math.abs(moneyDiff) > 20 ? "heavily" : ""} on ${sharpTeam} with ${Math.max(awayMoney, homeMoney).toFixed(0)}% of handle.`,
    publicSide: `${publicTeam} ${input.current_line}. Recreational bettors are hammering ${publicTeam} with ${Math.max(awayTickets, homeTickets).toFixed(0)}% of tickets.`
  };
}
