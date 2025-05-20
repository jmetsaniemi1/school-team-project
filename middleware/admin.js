const jwt = require('jsonwebtoken');

const admin = (req, res, next) => {
    try {
        // Hae token headerista
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Ei autentikaatiota' });
        }
        // Tarkista token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Vain adminille' });
        }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Virheellinen token' });
    }
};

module.exports = admin; 