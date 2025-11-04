// Temporary script to fix logo paths in teamLogos.ts
// Run this once to update all paths from "/logos/Leagues/" to "/logos/Logos/Leagues/"

import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/utils/teamLogos.ts';
let content = readFileSync(filePath, 'utf-8');

// Replace all occurrences of "/logos/Leagues/" with "/logos/Logos/Leagues/"
content = content.replace(/\"\/logos\/Leagues\//g, '"/logos/Logos/Leagues/');

writeFileSync(filePath, content, 'utf-8');

console.log('✅ Fixed all logo paths');
