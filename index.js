const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS-asetukset
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://school-team-project.vercel.app'
  ],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

// Yhdistetään tietokantaan
connectDB()
  .then(() => {
    console.log('MongoDB yhteys onnistui');
  })
  .catch((err) => {
    console.error('MongoDB yhteysvirhe:', err);
    process.exit(1);
  });

// Reititykset
app.use('/api/auth', authRoutes);

// Virheenkäsittely
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Jotain meni pieleen!' });
});

// Käynnistetään palvelin
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Palvelin käynnissä portissa ${PORT}`);
});

