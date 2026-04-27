const express = require('express');
const router = express.Router();
const { getDB } = require('../db/database');

router.get('/', (req, res) => {
  const db = getDB();
  const profile = db.prepare('SELECT * FROM film_profile WHERE id = 1').get();
  if (!profile) return res.json(null);
  res.json(parseProfile(profile));
});

router.post('/', (req, res) => {
  const db = getDB();
  const p = req.body;
  const existing = db.prepare('SELECT id FROM film_profile WHERE id = 1').get();
  const data = {
    title: p.title || '',
    logline: p.logline || '',
    genres: JSON.stringify(p.genres || []),
    runtime: p.runtime || 0,
    format: p.format || 'digital',
    budget_tier: p.budget_tier || 'micro',
    director_background: p.director_background || 'first-time',
    country: p.country || '',
    languages: JSON.stringify(p.languages || ['English']),
    premiere_status: p.premiere_status || 'world',
    awards_eligibility: JSON.stringify(p.awards_eligibility || []),
    submission_budget: p.submission_budget || 0,
    goals: JSON.stringify(p.goals || []),
    shooting_style: p.shooting_style || '',
    subject_tags: JSON.stringify(p.subject_tags || []),
  };
  if (existing) {
    db.prepare(`UPDATE film_profile SET title=@title, logline=@logline, genres=@genres, runtime=@runtime, format=@format, budget_tier=@budget_tier, director_background=@director_background, country=@country, languages=@languages, premiere_status=@premiere_status, awards_eligibility=@awards_eligibility, submission_budget=@submission_budget, goals=@goals, shooting_style=@shooting_style, subject_tags=@subject_tags, updated_at=CURRENT_TIMESTAMP WHERE id=1`).run(data);
  } else {
    db.prepare(`INSERT INTO film_profile (id, title, logline, genres, runtime, format, budget_tier, director_background, country, languages, premiere_status, awards_eligibility, submission_budget, goals, shooting_style, subject_tags) VALUES (1, @title, @logline, @genres, @runtime, @format, @budget_tier, @director_background, @country, @languages, @premiere_status, @awards_eligibility, @submission_budget, @goals, @shooting_style, @subject_tags)`).run(data);
  }
  const updated = db.prepare('SELECT * FROM film_profile WHERE id = 1').get();
  res.json(parseProfile(updated));
});

function parseProfile(p) {
  return {
    ...p,
    genres: JSON.parse(p.genres || '[]'),
    languages: JSON.parse(p.languages || '[]'),
    awards_eligibility: JSON.parse(p.awards_eligibility || '[]'),
    goals: JSON.parse(p.goals || '[]'),
    subject_tags: JSON.parse(p.subject_tags || '[]'),
  };
}

module.exports = router;
