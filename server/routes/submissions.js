const express = require('express');
const router = express.Router();
const { getDB } = require('../db/database');

router.get('/', (req, res) => {
  const db = getDB();
  const rows = db.prepare(`
    SELECT s.*, f.name as festival_name, f.tier as festival_tier, f.prestige, f.location, f.month
    FROM submissions s
    LEFT JOIN festivals f ON s.festival_id = f.id
    ORDER BY s.created_at DESC
  `).all();
  res.json(rows);
});

router.post('/', (req, res) => {
  const db = getDB();
  const { festival_id, status, category, submitted_date, deadline, fee_paid, notification_date, notes } = req.body;
  const result = db.prepare(`
    INSERT INTO submissions (festival_id, status, category, submitted_date, deadline, fee_paid, notification_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(festival_id, status || 'shortlist', category || '', submitted_date || null, deadline || null, fee_paid || 0, notification_date || null, notes || '');
  const row = db.prepare('SELECT s.*, f.name as festival_name, f.tier as festival_tier FROM submissions s LEFT JOIN festivals f ON s.festival_id = f.id WHERE s.id = ?').get(result.lastInsertRowid);
  res.json(row);
});

router.patch('/:id', (req, res) => {
  const db = getDB();
  const { status, category, submitted_date, deadline, fee_paid, notification_date, notes } = req.body;
  db.prepare(`
    UPDATE submissions SET status=COALESCE(?,status), category=COALESCE(?,category), submitted_date=COALESCE(?,submitted_date), deadline=COALESCE(?,deadline), fee_paid=COALESCE(?,fee_paid), notification_date=COALESCE(?,notification_date), notes=COALESCE(?,notes), updated_at=CURRENT_TIMESTAMP WHERE id=?
  `).run(status, category, submitted_date, deadline, fee_paid, notification_date, notes, req.params.id);
  const row = db.prepare('SELECT s.*, f.name as festival_name, f.tier as festival_tier FROM submissions s LEFT JOIN festivals f ON s.festival_id = f.id WHERE s.id = ?').get(req.params.id);
  res.json(row);
});

router.delete('/:id', (req, res) => {
  const db = getDB();
  db.prepare('DELETE FROM submissions WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
