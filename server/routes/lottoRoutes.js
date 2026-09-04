const express = require('express');
const router = express.Router();
const lottoService = require('../services/lottoService');

// Get latest draw number and winning numbers
router.get('/latest', async (req, res) => {
  try {
    const data = await lottoService.getLatestDraw();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get recent stats (frequency of 1~45 numbers in recent N draws)
router.get('/stats', async (req, res) => {
  try {
    const count = parseInt(req.query.count, 10) || 30;
    const stats = await lottoService.getRecentStats(count);
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Generate 5 games using weighted random sampling algorithm
router.post('/generate', async (req, res) => {
  try {
    const { exclusion = [], inclusion = [], baseWeight = 1, gamesCount = 5, statsCount = 30 } = req.body;
    
    // Validate inputs
    const excl = Array.isArray(exclusion) ? exclusion.map(Number) : [];
    const incl = Array.isArray(inclusion) ? inclusion.map(Number) : [];

    if (excl.length > 10) {
      return res.status(400).json({ success: false, error: 'Exclusion numbers cannot exceed 10.' });
    }
    if (incl.length > 5) {
      return res.status(400).json({ success: false, error: 'Inclusion numbers cannot exceed 5.' });
    }

    const stats = await lottoService.getRecentStats(statsCount);
    const frequency = stats.frequency;

    // Helper for weighted sampling single game
    const generateGame = () => {
      const selected = new Set(incl);
      
      // Calculate weights for remaining available numbers (1~45 excluding excl and already selected incl)
      while (selected.size < 6) {
        const candidates = [];
        const weights = [];
        let totalWeight = 0;

        for (let num = 1; num <= 45; num++) {
          if (!excl.includes(num) && !selected.has(num)) {
            const count = frequency[num] || 0;
            const weight = count + Number(baseWeight);
            candidates.push(num);
            weights.push(weight);
            totalWeight += weight;
          }
        }

        if (candidates.length === 0 || totalWeight <= 0) {
          // Fallback if weights error
          break;
        }

        // Weighted Random Pick using CDF
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

      return Array.from(selected).sort((a, b) => a - b);
    };

    const games = [];
    const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    for (let i = 0; i < gamesCount; i++) {
      games.push({
        label: labels[i] || `Game ${i + 1}`,
        numbers: generateGame()
      });
    }

    res.json({
      success: true,
      games,
      meta: {
        inclusion: incl,
        exclusion: excl,
        analyzedDrawsCount: stats.analyzedDrawsCount,
        baseWeight
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
