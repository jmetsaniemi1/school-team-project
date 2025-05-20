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

        const { email, password } = req.body;
        
        // Etsitään käyttäjä
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Virheellinen käyttäjätunnus tai salasana' });
        }

        console.log('Käyttäjä dokumentti:', user);
        console.log('Käyttäjän rooli ennen tokenin luontia:', user.role);

        // Tarkistetaan salasana
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Virheellinen käyttäjätunnus tai salasana' });
        }

        // Luodaan JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        console.log('Luodun tokenin payload:', payload);

        // Päivitetään viimeinen kirjautuminen
        user.last_login = new Date();
        await user.save();

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Kirjautumisvirhe:', error);
        res.status(500).json({ message: 'Palvelinvirhe' });
    }
}; 