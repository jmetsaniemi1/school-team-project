const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  console.log('[Vercel Debug] Yritetään yhdistää MongoDB:hen...');
  console.log('[Vercel Debug] MONGO_URI määritelty:', !!mongoURI);
  
  if (!mongoURI) {
    console.error('[Vercel Debug] MONGO_URI ympäristömuuttujaa ei ole määritelty!');
    throw new Error('MONGO_URI environment variable not set');
  }

  try {
    console.log('[Vercel Debug] Yhdistetään osoitteeseen:', mongoURI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://***:***@'));
    const conn = await mongoose.connect(mongoURI, { 
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('[Vercel Debug] MongoDB yhteys onnistui!');
    console.log('[Vercel Debug] Yhteyden tila:', mongoose.connection.readyState);
    
    // Varmistetaan että yhteys on valmis
    if (mongoose.connection.readyState === 1) {
      try {
        const dbName = mongoose.connection.db.databaseName;
        console.log('[Vercel Debug] Yhdistetty tietokantaan:', dbName);
      } catch (err) {
        console.log('[Vercel Debug] Tietokannan nimen hakeminen epäonnistui:', err.message);
      }
    }
    
    return conn;
  } catch (err) {
    console.error('[Vercel Debug] MongoDB yhteysvirhe:', err.message);
    console.error('[Vercel Debug] Täysi virhe:', err);
    throw err;
  }
};

module.exports = connectDB;



