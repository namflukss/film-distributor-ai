const express = require('express');
const router = express.Router();
const { getDB } = require('../db/database');
const { chatWithAdvisor } = require('../services/claude');

router.get('/history', (req, res) => {
  const db = getDB();
  const messages = db.prepare('SELECT * FROM chat_messages ORDER BY created_at ASC LIMIT 50').all();
  res.json(messages);
});

router.post('/', async (req, res) => {
  const db = getDB();
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  db.prepare('INSERT INTO chat_messages (role, content) VALUES (?, ?)').run('user', message);

  const history = db.prepare('SELECT role, content FROM chat_messages ORDER BY created_at DESC LIMIT 20').all().reverse();

  const profileRaw = db.prepare('SELECT * FROM film_profile WHERE id=1').get();
  const profile = profileRaw ? {
    ...profileRaw,
    genres: JSON.parse(profileRaw.genres || '[]'),
    goals: JSON.parse(profileRaw.goals || '[]'),
    subject_tags: JSON.parse(profileRaw.subject_tags || '[]'),
    languages: JSON.parse(profileRaw.languages || '[]'),
    awards_eligibility: JSON.parse(profileRaw.awards_eligibility || '[]'),
  } : null;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  let fullResponse = '';
  const originalWrite = res.write.bind(res);
  res.write = function(data) {
    if (typeof data === 'string' && data.startsWith('data: ')) {
      try {
        const parsed = JSON.parse(data.slice(6).trim());
        if (parsed.type === 'text' && parsed.content) fullResponse += parsed.content;
      } catch {}
    }
    return originalWrite(data);
  };

  await chatWithAdvisor(history, profile, res);

  if (fullResponse) {
    db.prepare('INSERT INTO chat_messages (role, content) VALUES (?, ?)').run('assistant', fullResponse);
    db.prepare('DELETE FROM chat_messages WHERE id NOT IN (SELECT id FROM chat_messages ORDER BY created_at DESC LIMIT 50)').run();
  }

  res.end();
});

router.delete('/history', (req, res) => {
  const db = getDB();
  db.prepare('DELETE FROM chat_messages').run();
  res.json({ ok: true });
});

module.exports = router;
