const express = require('express');
const router = express.Router();
const { getDB } = require('../db/database');

router.get('/', (req, res) => {
  const db = getDB();
  const { q, tier, genre, subject } = req.query;
  let sql = 'SELECT * FROM festivals WHERE 1=1';
  const params = [];
  if (q) { sql += ' AND (name LIKE ? OR description LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
  if (tier) { sql += ' AND tier = ?'; params.push(parseInt(tier)); }
  if (genre) { sql += ' AND genres LIKE ?'; params.push(`%${genre}%`); }
  if (subject) { sql += ' AND subject_tags LIKE ?'; params.push(`%${subject}%`); }
  sql += ' ORDER BY prestige DESC, tier ASC';
  const festivals = db.prepare(sql).all(...params);
  res.json(festivals.map(parseFestival));
});

router.get('/:id', (req, res) => {
  const db = getDB();
  const f = db.prepare('SELECT * FROM festivals WHERE id = ?').get(req.params.id);
  if (!f) return res.status(404).json({ error: 'Not found' });
  res.json(parseFestival(f));
});

function parseFestival(f) {
  return {
    ...f,
    categories: JSON.parse(f.categories || '[]'),
    genres: JSON.parse(f.genres || '[]'),
    notable_alumni: JSON.parse(f.notable_alumni || '[]'),
    subject_tags: JSON.parse(f.subject_tags || '[]'),
  };
}

module.exports = router;
