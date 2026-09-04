/**
 * Weighted Random Sampling Lotto Generation Algorithm
 */

/**
 * Generate 5 games (A, B, C, D, E) based on past draw frequencies, inclusion, and exclusion rules.
 * 
 * @param {Object} params
 * @param {Object} params.frequency Map of number (1..45) to draw count
 * @param {number[]} params.inclusion Array of numbers to guarantee in every game (max 5)
 * @param {number[]} params.exclusion Array of numbers to completely exclude (max 10)
 * @param {number} params.baseWeight Smoothing base weight (default: 1)
 * @param {number} params.gamesCount Number of games to generate (default: 5)
 * @returns {Array<{label: string, numbers: number[]}>}
 */
export function generateWeightedLottoGames({
  frequency = {},
  inclusion = [],
  exclusion = [],
  baseWeight = 1,
  gamesCount = 5
}) {
  const incl = Array.from(new Set(inclusion.map(Number))).filter(n => n >= 1 && n <= 45);
  const excl = Array.from(new Set(exclusion.map(Number))).filter(n => n >= 1 && n <= 45);

  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const games = [];

  for (let g = 0; g < gamesCount; g++) {
    const selected = new Set(incl);

    // Continue drawing until 6 unique numbers are selected
    while (selected.size < 6) {
      const candidates = [];
      const weights = [];
      let totalWeight = 0;

      for (let num = 1; num <= 45; num++) {
        if (!excl.includes(num) && !selected.has(num)) {
          const count = frequency[num] || 0;
          const w = count + Number(baseWeight);
          candidates.push(num);
          weights.push(w);
          totalWeight += w;
        }
      }

      if (candidates.length === 0 || totalWeight <= 0) {
        // Fallback in rare case candidates run out
        break;
      }

      // Cumulative distribution function sampling
      let rnd = Math.random() * totalWeight;
      let picked = candidates[candidates.length - 1];

      for (let i = 0; i < candidates.length; i++) {
        if (rnd < weights[i]) {
          picked = candidates[i];
          break;
        }
        rnd -= weights[i];
      }

      selected.add(picked);
    }

    const numbers = Array.from(selected).sort((a, b) => a - b);
    games.push({
      label: labels[g] || `Game ${g + 1}`,
      numbers
    });
  }

  return games;
}
