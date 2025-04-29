const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Kirjautuminen
router.post('/login', async (req, res) => {
    try {
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
});

// Rekisteröityminen
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Tarkistetaan onko käyttäjätunnus tai sähköposti jo käytössä
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Käyttäjätunnus tai sähköposti on jo käytössä' });
        }

        // Salataan salasana
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Luodaan uusi käyttäjä
        const user = new User({
            username,
            email,
            password: hashedPassword,
            verification_token: jwt.sign({ email }, process.env.JWT_SECRET)
        });

        await user.save();

        // Tässä voisi lähettää vahvistussähköpostin

        res.status(201).json({ message: 'Käyttäjä luotu onnistuneesti' });
    } catch (error) {
        console.error('Rekisteröitymisvirhe:', error);
        res.status(500).json({ message: 'Palvelinvirhe' });
    }
});

// Salasanan palautus
router.post('/reset-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Etsitään käyttäjä
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Sähköpostiosoitetta ei löydy' });
        }

        // Luodaan palautuslinkki
        const resetToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Tässä voisi lähettää palautussähköpostin

        res.json({ message: 'Palautuslinkki lähetetty sähköpostiin' });
    } catch (error) {
        console.error('Salasanan palautusvirhe:', error);
        res.status(500).json({ message: 'Palvelinvirhe' });
    }
});

module.exports = router; 