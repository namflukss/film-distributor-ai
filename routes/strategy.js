const express = require('express');
const router = express.Router();
const { getDB } = require('../db/database');
const { rankFestivalsForFilm } = require('../services/strategy');
const { getStrategyRecommendation } = require('../services/claude');

router.post('/analyze', async (req, res) => {
  const db = getDB();
  const profile = req.body.profile || db.prepare('SELECT * FROM film_profile WHERE id=1').get();
  if (!profile) return res.status(400).json({ error: 'No film profile found' });

  const festivals = db.prepare('SELECT * FROM festivals').all().map(f => ({
    ...f,
    genres: JSON.parse(f.genres || '[]'),
    categories: JSON.parse(f.categories || '[]'),
    subject_tags: JSON.parse(f.subject_tags || '[]'),
  }));

  const ranked = rankFestivalsForFilm(profile, festivals);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send ranked festivals first
  res.write(`data: ${JSON.stringify({ ranked: ranked.slice(0, 30) })}\n\n`);

  await getStrategyRecommendation(profile, ranked, res);
  res.end();
});

module.exports = router;
