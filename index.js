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

app.use(cors(corsOptions));
app.use(express.json());

// Staattiset tiedostot
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'resources')));
app.use(express.static(path.join(__dirname, 'global')));

// Yhdistetään tietokantaan
connectDB()
  .then(() => {
    console.log('[Vercel] MongoDB yhteys onnistui');
  })
  .catch((err) => {
    console.error('[Vercel] MongoDB yhteysvirhe:', err);
    process.exit(1);
  });

// API-reitit
app.use('/api/auth', authRoutes);

// Testireitti (voit poistaa tämän myöhemmin)
app.get('/test', (req, res) => {
  res.send('Testi toimii!');
});

// Kaikki muut GET-pyynnöt ohjataan index.html:ään
app.get('*', (req, res) => {
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

