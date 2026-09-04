const axios = require('axios');
const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, '../data/lotto_cache.json');
const drawCache = new Map();

// Load cache file on module start
function initCache() {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(CACHE_FILE)) {
      const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      Object.entries(data).forEach(([drwNo, drawData]) => {
        drawCache.set(Number(drwNo), drawData);
      });
      console.log(`[LottoService] Loaded ${drawCache.size} draws from cache file.`);
    }
  } catch (err) {
    console.error('[LottoService] Failed to load cache file:', err.message);
  }
}

function saveCache() {
  try {
    const obj = {};
    for (const [drwNo, drawData] of drawCache.entries()) {
      obj[drwNo] = drawData;
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(obj, null, 2), 'utf8');
  } catch (err) {
    console.error('[LottoService] Failed to save cache file:', err.message);
  }
}

initCache();

function getEstimatedDrawNo() {
  const startDate = new Date('2002-12-07T20:45:00+09:00');
  const now = new Date();
  const diffWeeks = Math.floor((now - startDate) / (7 * 24 * 60 * 60 * 1000));
  return 1 + diffWeeks;
}

async function fetchDraw(drwNo) {
  if (drawCache.has(drwNo)) {
    return drawCache.get(drwNo);
  }

  try {
    const url = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${drwNo}`;
    const response = await axios.get(url, {
      timeout: 3000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (response.data && response.data.returnValue === 'success') {
      const drawData = {
        drwNo: response.data.drwNo,
        drwNoDate: response.data.drwNoDate,
        numbers: [
          response.data.drwtNo1,
          response.data.drwtNo2,
          response.data.drwtNo3,
          response.data.drwtNo4,
          response.data.drwtNo5,
          response.data.drwtNo6
        ],
        bonusNo: response.data.bnusNo,
        firstWinamnt: response.data.firstWinamnt,
        firstPrzwnerCo: response.data.firstPrzwnerCo
      };
      drawCache.set(drwNo, drawData);
      return drawData;
    }
  } catch (err) {
    // Network/parsing fallback
  }

  // Fallback to cache if available
  return drawCache.get(drwNo) || null;
}

async function getLatestDraw() {
  let estNo = getEstimatedDrawNo();
  
  for (let drw = estNo; drw >= estNo - 5; drw--) {
    const data = await fetchDraw(drw);
    if (data) {
      saveCache();
      return data;
    }
  }
  
  if (drawCache.size > 0) {
    const maxDrw = Math.max(...drawCache.keys());
    return drawCache.get(maxDrw);
  }

  throw new Error('Unable to retrieve latest lottery draw data.');
}

async function getRecentStats(count = 30) {
  const latest = await getLatestDraw();
  const latestNo = latest.drwNo;

  const targetDraws = [];
  for (let i = 0; i < count; i++) {
    const drwNo = latestNo - i;
    if (drwNo >= 1) {
      targetDraws.push(drwNo);
    }
  }

  const drawResults = [];
  for (const drwNo of targetDraws) {
    const data = await fetchDraw(drwNo);
    if (data) {
      drawResults.push(data);
    }
  }

  const frequency = {};
  for (let n = 1; n <= 45; n++) {
    frequency[n] = 0;
  }

  drawResults.forEach(draw => {
    draw.numbers.forEach(num => {
      if (frequency[num] !== undefined) {
        frequency[num]++;
      }
    });
  });

  const sorted = Object.entries(frequency)
    .map(([num, freq]) => ({ number: Number(num), count: freq }))
    .sort((a, b) => b.count - a.count);

  const hotNumbers = sorted.slice(0, 5).map(item => item.number);
  const coldNumbers = sorted.slice(-5).map(item => item.number);

  return {
    latestDraw: latest,
    analyzedDrawsCount: drawResults.length,
    startDrawNo: drawResults[drawResults.length - 1]?.drwNo || (latestNo - count + 1),
    endDrawNo: latestNo,
    frequency,
    hotNumbers,
    coldNumbers,
    recentDraws: drawResults.slice(0, 10)
  };
}

module.exports = {
  getLatestDraw,
  getRecentStats,
  fetchDraw
};
