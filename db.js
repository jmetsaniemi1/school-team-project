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
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log('[Vercel Debug] MongoDB yhteys onnistui!');
    
    // Testataan yhteyttä
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('[Vercel Debug] Saatavilla olevat kokoelmat:', collections.map(c => c.name));
    
  } catch (err) {
    console.error('[Vercel Debug] MongoDB yhteysvirhe:', err.message);
    console.error('[Vercel Debug] Täysi virhe:', err);
    throw err;
  }
};

module.exports = connectDB;



