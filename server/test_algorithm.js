const { generateWeightedLottoGames } = require('../client/src/utils/lottoAlgorithm');

console.log('--- Running Algorithm Verification Tests ---');

// Mock frequency data
const frequency = {};
for (let i = 1; i <= 45; i++) {
  frequency[i] = i; // Number 45 has weight 45 + 1 = 46, number 1 has weight 1 + 1 = 2
}

// Test 1: Basic 5-game generation
const test1 = generateWeightedLottoGames({
  frequency,
  inclusion: [],
  exclusion: [],
  baseWeight: 1,
  gamesCount: 5
});

console.log('Test 1 (Basic 5 games count & format):', test1.length === 5 ? 'PASS' : 'FAIL');
test1.forEach((game, idx) => {
  const isLength6 = game.numbers.length === 6;
  const isSorted = JSON.stringify(game.numbers) === JSON.stringify([...game.numbers].sort((a, b) => a - b));
  const isUnique = new Set(game.numbers).size === 6;
  console.log(`  Game ${game.label}: [${game.numbers.join(', ')}] -> L6:${isLength6}, Sorted:${isSorted}, Unique:${isUnique}`);
});

// Test 2: Inclusion Rule Verification (Must include 7, 14, 21 in all 5 games)
const incl = [7, 14, 21];
const test2 = generateWeightedLottoGames({
  frequency,
  inclusion: incl,
  exclusion: [],
  baseWeight: 1,
  gamesCount: 5
});

const allHaveIncl = test2.every(game => incl.every(num => game.numbers.includes(num)));
console.log('Test 2 (Inclusion Rule [7, 14, 21] in all games):', allHaveIncl ? 'PASS' : 'FAIL');

// Test 3: Exclusion Rule Verification (Must NOT include 1, 2, 3, 4, 5, 6, 8, 9, 10, 11 in any game)
const excl = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11];
const test3 = generateWeightedLottoGames({
  frequency,
  inclusion: [],
  exclusion: excl,
  baseWeight: 1,
  gamesCount: 5
});

const noneHaveExcl = test3.every(game => !game.numbers.some(num => excl.includes(num)));
console.log('Test 3 (Exclusion Rule [1..6, 8..11] absent in all games):', noneHaveExcl ? 'PASS' : 'FAIL');

console.log('--- All Algorithm Tests Completed ---');
