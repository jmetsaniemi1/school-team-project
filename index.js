const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
let dbConnected = false;

// CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://school-team-project.vercel.app'
    // → lisää preview-URLit tänne, jos haluat
  ]
}));

// JSON-bodyt ja staattiset hakemistot
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Yhdistä MongoDB: vain kerran per cold start
app.use(async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log('[Vercel] MongoDB yhteys onnistui');
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// API-reitit
app.use('/api/auth', authRoutes);

// Testireitti
app.get('/test', (req, res) => {
  res.send('Testi toimii!');
});

// Catch-all (kaaosta välttävä regex, ei 'string)
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

// Express‐error handler
app.use((err, req, res, next) => {
  console.error('[Vercel] Virhe:', err.stack);
  res.status(500).json({ message: err.message || 'Jotain meni pieleen!' });
});

// Exportataan app (EI app.listen)
module.exports = app;


