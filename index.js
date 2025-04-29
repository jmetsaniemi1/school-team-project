const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const path = require('path');
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

// Staattiset tiedostot - järjestys on tärkeä!
app.use('/', express.static(path.join(__dirname)));
app.use('/pages', express.static(path.join(__dirname, 'pages')));
app.use('/resources', express.static(path.join(__dirname, 'resources')));
app.use('/global', express.static(path.join(__dirname, 'global')));

// Yhdistetään tietokantaan
connectDB()
  .then(() => {
    console.log('[Vercel] MongoDB yhteys onnistui');
  })
  .catch((err) => {
    console.error('[Vercel] MongoDB yhteysvirhe:', err);
    process.exit(1);
  });

// API-reititykset
app.use('/api/auth', authRoutes);

// Kaikki muut GET-pyynnöt ohjataan index.html:ään
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API-polkua ei löydy' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Virheenkäsittely
app.use((err, req, res, next) => {
  console.error('[Vercel] Virhe:', err.stack);
  res.status(500).json({ message: 'Jotain meni pieleen!' });
});

// Käynnistetään palvelin
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[Vercel] Palvelin käynnissä portissa ${PORT}`);
});

