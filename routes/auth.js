const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Kirjautuminen
router.post('/login', async (req, res) => {
    try {
        console.log('[Auth Debug] Login attempt:', req.body);
        const { email, password } = req.body;
        
        if (!email || !password) {
            console.log('[Auth Debug] Missing email or password');
            return res.status(400).json({ message: 'Sähköposti ja salasana vaaditaan' });
        }
        
        // Etsitään käyttäjä sähköpostilla
        console.log('[Auth Debug] Searching user with email:', email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('[Auth Debug] User not found');
            return res.status(401).json({ message: 'Virheellinen sähköposti tai salasana' });
        }

        // Tarkistetaan salasana
        console.log('[Auth Debug] Checking password');
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log('[Auth Debug] Invalid password');
            return res.status(401).json({ message: 'Virheellinen sähköposti tai salasana' });
        }

        // Luodaan JWT token
        console.log('[Auth Debug] Creating JWT token');
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Päivitetään viimeinen kirjautuminen
        user.last_login = new Date();
        await user.save();

        console.log('[Auth Debug] Login successful');
        res.json({ 
            token, 
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        });
    } catch (error) {
        console.error('[Auth Debug] Login error:', error);
        res.status(500).json({ message: 'Palvelinvirhe' });
    }
});

// Rekisteröityminen
router.post('/register', async (req, res) => {
    try {
        console.log('[Auth Debug] Register attempt:', req.body);
        const { username, email, password } = req.body;

        if (!email || !password || !username) {
            console.log('[Auth Debug] Missing required fields');
            return res.status(400).json({ message: 'Kaikki kentät ovat pakollisia' });
        }

        // Tarkistetaan onko käyttäjätunnus tai sähköposti jo käytössä
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            console.log('[Auth Debug] User already exists');
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
            registration_date: new Date(),
            verification_token: jwt.sign({ email }, process.env.JWT_SECRET)
        });

        await user.save();
        console.log('[Auth Debug] User created successfully');

        // Luodaan token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ 
            message: 'Käyttäjä luotu onnistuneesti',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        });
    } catch (error) {
        console.error('[Auth Debug] Registration error:', error);
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

// Hae kaikki käyttäjät (adminille)
router.get('/all', async (req, res) => {
    try {
        // Voit halutessasi tarkistaa tässä, että pyytäjä on admin
        const users = await User.find({}, '-password'); // Ei palauteta salasanaa
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Virhe käyttäjien haussa' });
    }
});

module.exports = router; 