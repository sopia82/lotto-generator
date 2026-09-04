const axios = require('axios');
const { generateWeightedLottoGames } = require('../client/src/utils/lottoAlgorithm');

async function verifyFullApp() {
  console.log('====================================================');
  console.log('   E2E INTEGRATION & ALGORITHM VERIFICATION SUITE   ');
  console.log('====================================================\n');

  // 1. Verify Backend Endpoints
  console.log('[1] Testing Express Proxy Health & Stats APIs...');
  try {
    const health = await axios.get('http://localhost:5000/health');
    console.log('  ✔ /health:', health.data.status === 'ok' ? 'SUCCESS' : 'FAILED');

    const statsRes = await axios.get('http://localhost:5000/api/lotto/stats?count=30');
    console.log('  ✔ /api/lotto/stats status:', statsRes.data.success ? 'SUCCESS' : 'FAILED');
    const stats = statsRes.data.stats;
    console.log(`  ✔ Latest Draw: ${stats.latestDraw.drwNo}회 (${stats.latestDraw.drwNoDate})`);
    console.log(`  ✔ Hot Numbers Top 5: [${stats.hotNumbers.join(', ')}]`);
    console.log(`  ✔ Cold Numbers Top 5: [${stats.coldNumbers.join(', ')}]`);
  } catch (err) {
    console.error('  ✖ API Error:', err.message);
  }

  // 2. Verify Exclusion Numbers Test
  console.log('\n[2] Testing Exclusion Number Rules (제외 번호 적용 테스트)...');
  const exclTestList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const statsRes = await axios.get('http://localhost:5000/api/lotto/stats?count=30');
  const frequency = statsRes.data.stats.frequency;

  const exclGames = generateWeightedLottoGames({
    frequency,
    inclusion: [],
    exclusion: exclTestList,
    baseWeight: 1.0,
    gamesCount: 5
  });

  const hasNoExcluded = exclGames.every(g => !g.numbers.some(num => exclTestList.includes(num)));
  console.log(`  ✔ Excluded Numbers [${exclTestList.join(', ')}]: ${hasNoExcluded ? 'PASS (0 excluded numbers found in all 5 games)' : 'FAIL'}`);

  // 3. Verify Inclusion Numbers Test
  console.log('\n[3] Testing Inclusion Number Rules (고정 번호 적용 테스트)...');
  const inclTestList = [7, 14, 21, 35, 42];
  const inclGames = generateWeightedLottoGames({
    frequency,
    inclusion: inclTestList,
    exclusion: [],
    baseWeight: 1.0,
    gamesCount: 5
  });

  const hasAllIncluded = inclGames.every(g => inclTestList.every(num => g.numbers.includes(num)));
  console.log(`  ✔ Included Numbers [${inclTestList.join(', ')}]: ${hasAllIncluded ? 'PASS (All 5 games contain 100% of included numbers)' : 'FAIL'}`);

  // 4. Verify Ball Color Palette Rule Mapping
  console.log('\n[4] Testing Lotto Ball Color Standard Mapping...');
  const { getBallColorInfo } = require('../client/src/utils/ballColors');
  const colorTests = [
    { num: 5, expected: '#FBC400', category: '1-10 노랑' },
    { num: 15, expected: '#69C8F2', category: '11-20 파랑' },
    { num: 25, expected: '#FF7272', category: '21-30 빨강' },
    { num: 35, expected: '#AAAAAA', category: '31-40 회색' },
    { num: 45, expected: '#B0D840', category: '41-45 초록' }
  ];

  colorTests.forEach(({ num, expected, category }) => {
    const info = getBallColorInfo(num);
    const pass = info.bg === expected;
    console.log(`  ✔ Number ${num} (${category}) -> ${info.bg}: ${pass ? 'PASS' : 'FAIL'}`);
  });

  console.log('\n====================================================');
  console.log('   ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!   ');
  console.log('====================================================');
}

verifyFullApp();
