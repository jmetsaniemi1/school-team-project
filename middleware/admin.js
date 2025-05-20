const jwt = require('jsonwebtoken');

const admin = (req, res, next) => {
    try {
        // Hae token headerista
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log('[ADMIN MW] Token:', token);
        if (!token) {
            console.log('[ADMIN MW] Ei tokenia');
            return res.status(401).json({ error: 'Ei autentikaatiota' });
        }
        // Tarkista token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('[ADMIN MW] Decoded:', decoded);
        if (decoded.role !== 'admin') {
            console.log('[ADMIN MW] Ei admin-roolia:', decoded.role);
            return res.status(403).json({ error: 'Vain adminille' });
        }
        console.log('[ADMIN MW] Admin hyväksytty');
        next();
    } catch (error) {
        console.log('[ADMIN MW] Virhe:', error);
        res.status(401).json({ error: 'Virheellinen token' });
    }
};

module.exports = admin; 