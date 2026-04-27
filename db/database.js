const { DatabaseSync: Database } = require('node:sqlite');
const path = require('path');
const { seedFestivals } = require('./seed');

const DB_PATH = path.join(__dirname, 'app.db');
let db;

function getDB() {
  if (!db) db = new Database(DB_PATH);
  return db;
}

function initDB() {
  const db = getDB();

  db.exec(`
    CREATE TABLE IF NOT EXISTS festivals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tier INTEGER,
      location TEXT,
      month TEXT,
      submission_opens TEXT,
      early_deadline TEXT,
      regular_deadline TEXT,
      late_deadline TEXT,
      fee_early INTEGER,
      fee_regular INTEGER,
      fee_late INTEGER,
      categories TEXT,
      genres TEXT,
      prestige INTEGER,
      acceptance_rate REAL,
      runtime_min INTEGER,
      runtime_max INTEGER,
      distribution_impact TEXT,
      notable_alumni TEXT,
      description TEXT,
      website TEXT,
      platform TEXT,
      notes TEXT,
      subject_tags TEXT,
      festival_start TEXT,
      festival_end TEXT
    );

    CREATE TABLE IF NOT EXISTS film_profile (
      id INTEGER PRIMARY KEY DEFAULT 1,
      title TEXT,
      logline TEXT,
      genres TEXT,
      runtime INTEGER,
      format TEXT,
      budget_tier TEXT,
      director_background TEXT,
      country TEXT,
      languages TEXT,
      premiere_status TEXT,
      awards_eligibility TEXT,
      submission_budget INTEGER,
      goals TEXT,
      shooting_style TEXT,
      subject_tags TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      festival_id TEXT NOT NULL,
      status TEXT DEFAULT 'shortlist',
      category TEXT,
      submitted_date TEXT,
      deadline TEXT,
      fee_paid INTEGER,
      notification_date TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add new columns to existing DBs gracefully
  try { db.exec('ALTER TABLE festivals ADD COLUMN festival_start TEXT') } catch {}
  try { db.exec('ALTER TABLE festivals ADD COLUMN festival_end TEXT') } catch {}

  // Seed festivals if empty
  const count = db.prepare('SELECT COUNT(*) as c FROM festivals').get();
  if (count.c === 0) {
    seedFestivals(db);
    console.log('Festival database seeded.');
  }
}

module.exports = { getDB, initDB };
