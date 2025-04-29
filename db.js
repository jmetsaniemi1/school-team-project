const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('[Vercel] MONGO_URI environment variable not set!');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('[Vercel] Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;


