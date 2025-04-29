const User = require('../../../models/user');
const mongoose = require('mongoose');

const fetchUserData = async (req, res) => {
    try {
        console.log('[Vercel] Fetching user data for own page');
        
        if (!req.userId) {
            console.error('[Vercel] No userId in request');
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: 'Käyttäjää ei ole autentikoitu' });
        }

        if (!mongoose.Types.ObjectId.isValid(req.userId)) {
            console.error('[Vercel] Invalid userId format:', req.userId);
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: 'Virheellinen käyttäjätunniste' });
        }

        const user = await User.findById(req.userId).select('-password');
        
        if (!user) {
            console.log('[Vercel] User not found:', { userId: req.userId });
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: 'Käyttäjää ei löydy' });
        }

        console.log('[Vercel] User data fetched successfully:', { userId: user._id, email: user.email });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            registration_date: user.registration_date,
            avatar: user.avatar,
            lastVisits: user.lastVisits || []
        });
    } catch (error) {
        console.error('[Vercel] Error fetching user data:', { error: error.message, stack: error.stack });
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: 'Käyttäjän tietojen haku epäonnistui' });
    }
};

module.exports = { fetchUserData }; 