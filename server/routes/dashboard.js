const express = require('express');
const router = express.Router();
const { getDB } = require('../db/database');

router.get('/stats', (req, res) => {
  const db = getDB();
  const total = db.prepare('SELECT COUNT(*) as c FROM submissions').get().c;
  const accepted = db.prepare("SELECT COUNT(*) as c FROM submissions WHERE status='accepted'").get().c;
  const rejected = db.prepare("SELECT COUNT(*) as c FROM submissions WHERE status='rejected'").get().c;
  const submitted = db.prepare("SELECT COUNT(*) as c FROM submissions WHERE status='submitted'").get().c;
  const feesSpent = db.prepare("SELECT COALESCE(SUM(fee_paid),0) as t FROM submissions WHERE status != 'shortlist'").get().t;
  const profile = db.prepare('SELECT submission_budget FROM film_profile WHERE id=1').get();
  const budget = profile?.submission_budget || 0;

  const upcoming = db.prepare(`
    SELECT s.*, f.name as festival_name, f.tier as festival_tier
    FROM submissions s
    LEFT JOIN festivals f ON s.festival_id = f.id
    WHERE s.deadline IS NOT NULL AND s.deadline >= date('now') AND s.deadline <= date('now', '+30 days')
    ORDER BY s.deadline ASC LIMIT 5
  `).all();

  const recent = db.prepare(`
    SELECT s.*, f.name as festival_name FROM submissions s
    LEFT JOIN festivals f ON s.festival_id = f.id
    ORDER BY s.updated_at DESC LIMIT 10
  `).all();

  const acceptanceRate = (submitted + accepted + rejected) > 0
    ? Math.round((accepted / (accepted + rejected || 1)) * 100)
    : 0;

  const momentum = Math.min(100, Math.round(
    (total * 5) + (accepted * 20) + (submitted * 8) - (rejected * 2)
  ));

  res.json({
    total, accepted, rejected, submitted,
    feesSpent, budget, budgetRemaining: budget - feesSpent,
    acceptanceRate, momentum, upcoming, recent
  });
});

module.exports = router;
