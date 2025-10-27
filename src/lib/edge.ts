import { Game, Market, Book, Angle, Confidence, GameAnalysis } from "@/types";

export function calculateDivergence(game: Game, side: "home" | "away"): number {
  const splits = side === "home" ? game.splits.home : game.splits.away;
  return splits.moneyPct - splits.betsPct;
}

export function determineAngle(
  game: Game,
  market: Market,
  side: "home" | "away"
): Angle {
  const divergence = calculateDivergence(game, side);
  
  // Find recent price movement for this market/side
  const recentMovement = game.movement.filter(
    (m) => m.market === market && m.side === side
  );
  
  let movedTowardSide = false;
  if (recentMovement.length >= 2) {
    const older = recentMovement[recentMovement.length - 2];
    const newer = recentMovement[recentMovement.length - 1];
    
    // For spreads/totals: negative movement means line moved in favor
    // For ML: lower odds for favorite = moved toward
    if (market === "Spread" || market === "Total") {
      movedTowardSide = newer.price < older.price;
    } else {
      movedTowardSide = newer.price < older.price;
    }
  }
  
  if (divergence >= 15 && movedTowardSide) {
    return "Sharp";
  } else if (divergence <= -15) {
    return "Public";
  }
  return "Balanced";
}

export function calculateConfidence(
  game: Game,
  market: Market,
  side: "home" | "away"
): Confidence {
  const divergence = Math.abs(calculateDivergence(game, side));
  
  // Calculate price movement magnitude
  const recentMovement = game.movement.filter(
    (m) => m.market === market && m.side === side
  );
  
  let movementMagnitude = 0;
  if (recentMovement.length >= 2) {
    const older = recentMovement[recentMovement.length - 2];
    const newer = recentMovement[recentMovement.length - 1];
    movementMagnitude = Math.abs(newer.price - older.price);
  }
  
  // Check opening line if available
  const openLine = game.open?.[market];
  let lineMovement = 0;
  if (openLine) {
    const firstBook = Object.keys(game.odds)[0] as Book;
    const currentOdds = game.odds[firstBook][market];
    
    if (market === "Spread" && currentOdds && "line" in openLine && "line" in currentOdds) {
      lineMovement = Math.abs(currentOdds.line - openLine.line);
    } else if (market === "Total" && currentOdds && "line" in openLine && "line" in currentOdds) {
      lineMovement = Math.abs(currentOdds.line - openLine.line);
    } else if (market === "ML" && currentOdds && "home" in openLine && "home" in currentOdds) {
      const openPrice = side === "home" ? openLine.home : openLine.away;
      const currentPrice = side === "home" ? currentOdds.home : currentOdds.away;
      if (openPrice && currentPrice) {
        lineMovement = Math.abs(currentPrice - openPrice);
      }
    }
  }
  
  // High confidence criteria
  if (
    divergence >= 20 &&
    ((market !== "ML" && lineMovement >= 0.5) ||
      (market === "ML" && lineMovement >= 0.1))
  ) {
    return "High";
  }
  
  // Medium confidence
  if (divergence >= 10) {
    return "Medium";
  }
  
  return "Low";
}

export function findBestBook(
  game: Game,
  market: Market,
  side: "home" | "away" | "over" | "under"
): { book: Book; price: number | string } {
  const books = Object.keys(game.odds) as Book[];
  let bestBook: Book = books[0];
  let bestPrice: number | string = 0;
  
  if (market === "ML") {
    const isHome = side === "home";
    let bestDecimal = isHome ? Infinity : -Infinity;
    
    books.forEach((book) => {
      const ml = game.odds[book].ML;
      if (ml) {
        const price = isHome ? ml.home : ml.away;
        // For favorites (lower than 2.0), we want LOWEST
        // For underdogs (higher than 2.0), we want HIGHEST
        if (price < 2.0 && price < bestDecimal && isHome) {
          bestDecimal = price;
          bestBook = book;
          bestPrice = price.toFixed(2);
        } else if (price >= 2.0 && price > bestDecimal && !isHome) {
          bestDecimal = price;
          bestBook = book;
          bestPrice = price.toFixed(2);
        }
      }
    });
  } else if (market === "Spread") {
    const isHome = side === "home";
    let bestLine = isHome ? Infinity : -Infinity;
    let bestOdds = -Infinity;
    
    books.forEach((book) => {
      const spread = game.odds[book].Spread;
      if (spread) {
        const line = isHome ? spread.line : -spread.line;
        const odds = isHome ? spread.home : spread.away;
        
        // Best number first, then best price
        if (
          (isHome && line < bestLine) ||
          (!isHome && line > bestLine) ||
          (line === bestLine && odds > bestOdds)
        ) {
          bestLine = line;
          bestOdds = odds;
          bestBook = book;
          bestPrice = `${isHome ? "" : "+"}${Math.abs(spread.line).toFixed(1)} (${odds.toFixed(2)})`;
        }
      }
    });
  } else if (market === "Total") {
    const isOver = side === "over";
    let bestLine = isOver ? -Infinity : Infinity;
    let bestOdds = -Infinity;
    
    books.forEach((book) => {
      const total = game.odds[book].Total;
      if (total) {
        const line = total.line;
        const odds = isOver ? total.over : total.under;
        
        // For over: lower line is better; for under: higher line is better
        if (
          (isOver && line < bestLine) ||
          (!isOver && line > bestLine) ||
          (line === bestLine && odds > bestOdds)
        ) {
          bestLine = line;
          bestOdds = odds;
          bestBook = book;
          bestPrice = `${isOver ? "O" : "U"}${line} (${odds.toFixed(2)})`;
        }
      }
    });
  }
  
  return { book: bestBook, price: bestPrice };
}

export function generateExplanation(
  game: Game,
  market: Market,
  side: "home" | "away",
  angle: Angle,
  divergence: number
): string {
  const splits = side === "home" ? game.splits.home : game.splits.away;
  const team = side === "home" ? game.home : game.away;
  
  if (angle === "Sharp") {
    return `${Math.abs(divergence).toFixed(0)}% more money than bets on ${team}. Line moved toward sharp side.`;
  } else if (angle === "Public") {
    return `${Math.abs(divergence).toFixed(0)}% more bets than money on ${team}. Public overload.`;
  }
  return `${splits.betsPct}% bets, ${splits.moneyPct}% money on ${team}. Balanced action.`;
}

export function analyzeGame(
  game: Game,
  market: Market = "Spread"
): GameAnalysis {
  // Default to home side for analysis
  const side: "home" | "away" = "home";
  const divergence = calculateDivergence(game, side);
  const angle = determineAngle(game, market, side);
  const confidence = calculateConfidence(game, market, side);
  const explanation = generateExplanation(game, market, side, angle, divergence);
  const bestBook = findBestBook(game, market, side);
  
  return {
    angle,
    confidence,
    divergence,
    explanation,
    bestBook,
  };
}
