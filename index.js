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
app.use(express.static(path.join(__dirname)));
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

// Tarkista onko pyyntö staattiselle tiedostolle
app.use((req, res, next) => {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.html'];
  if (staticExtensions.some(ext => req.path.endsWith(ext))) {
    console.log('[Vercel] Staattinen tiedosto pyydetty:', req.path);
    // Jos tiedostoa ei löydy, jatka seuraavaan middlewareen
    const filePath = path.join(__dirname, req.path);
    if (require('fs').existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }
  next();
});

// Kaikki muut GET-pyynnöt ohjataan index.html:ään
app.get('*', (req, res) => {
  console.log('[Vercel] Pyyntö:', req.path);
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

