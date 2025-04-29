const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    throw new Error('MONGO_URI environment variable not set');
  }
  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log('[Vercel] MongoDB connected');
  } catch (err) {
    console.error('[Vercel] Error connecting to MongoDB:', err);
    throw err;
  }
};

module.exports = connectDB;



