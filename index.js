require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./db/database');

const festivalsRouter = require('./routes/festivals');
const profileRouter = require('./routes/profile');
const submissionsRouter = require('./routes/submissions');
const strategyRouter = require('./routes/strategy');
const chatRouter = require('./routes/chat');
const dashboardRouter = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Init DB (creates tables + seeds if needed)
initDB();

app.use('/api/festivals', festivalsRouter);
app.use('/api/film-profile', profileRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/strategy', strategyRouter);
app.use('/api/chat', chatRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Serve React frontend
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
