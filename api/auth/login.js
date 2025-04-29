const connectDB = require('../../db');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    // Sallitaan vain POST-metodit
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Yhdistetään tietokantaan
        await connectDB();

        const { username, password } = req.body;
        
        // Etsitään käyttäjä
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Virheellinen käyttäjätunnus tai salasana' });
        }

        // Tarkistetaan salasana
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Virheellinen käyttäjätunnus tai salasana' });
        }

        // Luodaan JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Päivitetään viimeinen kirjautuminen
        user.last_login = new Date();
        await user.save();

        res.json({ token, username: user.username });
    } catch (error) {
        console.error('Kirjautumisvirhe:', error);
        res.status(500).json({ message: 'Palvelinvirhe' });
    }
}; 