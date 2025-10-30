/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate color difference using Euclidean distance in RGB space
 */
function colorDistance(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return 1000; // Return large number if parsing fails

  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;

  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

/**
 * Check if two colors are too similar
 * Threshold of ~100 works well for detecting similar colors
 */
export function areColorsSimilar(color1: string, color2: string): boolean {
  const distance = colorDistance(color1, color2);
  return distance < 120; // Adjust threshold as needed
}

/**
 * Get the best contrasting color from available options, avoiding black when possible
 */
export function getBestContrastColor(
  primary: string,
  secondary: string,
  tertiary: string
): string {
  // If secondary is black and tertiary is not, prefer tertiary
  if (secondary.toLowerCase() === "#000000" && tertiary.toLowerCase() !== "#000000") {
    return tertiary;
  }
  return secondary;
}
