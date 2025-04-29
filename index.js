const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
let dbConnected = false;

// CORS, JSON, staattiset jne.
app.use(cors({ origin: ['https://school-team-project.vercel.app'] }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'resources')));
app.use(express.static(path.join(__dirname, 'global')));

// Tämä middleware takaa, että connectDB() ajetaan vain kerran ja virheet menevät Expressin error-handleriin
app.use(async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// API-reitit
app.use('/api/auth', authRoutes);

// Testi
app.get('/test', (req, res) => {
  res.send('Testi toimii!');
});

// Front-endin index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Virheenkäsittely
app.use((err, req, res, next) => {
  console.error('[Vercel] Virhe:', err.stack);
  res.status(500).json({ message: err.message || 'Jotain meni pieleen!' });
});

// Exportataan app Vercelille (EI app.listen)
module.exports = app;

