const User = require('../../models/user');
const mongoose = require('mongoose');

const getUsers = async (req, res) => {
  try {
    console.log('[Vercel] Fetching all users');
    console.log('[Vercel] Database:', mongoose.connection.db.databaseName);
    console.log('[Vercel] Collection:', User.collection.collectionName);
    const users = await User.find();
    console.log('[Vercel] Users found:', users.length);
    res.status(200).json(users);
  } catch (err) {
    console.error('[Vercel] Error fetching users:', { error: err.message, stack: err.stack });
    res.status(500).json({ error: err.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    console.log('[Vercel] Fetching current user:', { userId: req.userId });
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      console.log('[Vercel] User not found:', { userId: req.userId });
      return res.status(404).json({ error: 'Käyttäjää ei löydy' });
    }

    console.log('[Vercel] Current user found:', { userId: user._id, email: user.email });
    res.json(user);
  } catch (err) {
    console.error('[Vercel] Error fetching current user:', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Käyttäjän tietojen haku epäonnistui' });
  }
};

module.exports = { 
  getUsers,
  getCurrentUser
};

