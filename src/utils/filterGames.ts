// Script to filter out BAL @ MIA game from 10/30
import rawDataImport from '../data/nfl-splits-raw.json';

export function filterOutPastGame() {
  const rawData = JSON.parse(JSON.stringify(rawDataImport)) as any;
  
  // Iterate through all books
  Object.keys(rawData.books).forEach(bookKey => {
    const book = rawData.books[bookKey];
    
    // Check NFL section
    if (book.NFL) {
      Object.keys(book.NFL).forEach(dateKey => {
        // Filter out BAL @ MIA game
        book.NFL[dateKey] = book.NFL[dateKey].filter((game: any) => {
          const hasBalAndMia = 
            (game.a === 'baltimore-ravens' && game.h === 'miami-dolphins') ||
            (game.a === 'miami-dolphins' && game.h === 'baltimore-ravens');
          return !hasBalAndMia;
        });
        
        // Remove empty date arrays
        if (book.NFL[dateKey].length === 0) {
          delete book.NFL[dateKey];
        }
      });
    }
  });
  
  return rawData;
}

export const filteredData = filterOutPastGame();
