const express = require('express');
const router = express.Router();
const auth = require('./routes_user_auth.js/auth.js');
const cors = require('cors');
const { getCurrentUser } = require('../database/methods/GET');
const { fetchUserData } = require('../database/methods/ownPage/GET');
const admin = require('../middleware/admin.js');
const User = require('../models/user');

// PUT operation
const putUsers = require('../database/methods/PUT');
// POST operation
const postUsers = require('../database/methods/POST');
// GET operation
const getUsers = require('../database/methods/GET');
// DELETE operation
const deleteUsers = require('../database/methods/DELETE');

// Kirjaudu sisään
router.post('/login', postUsers.loginUser);

// Rekisteröidy
router.post('/register', postUsers.registerUser);

// Palauta salasana
router.post('/reset-password', postUsers.resetPassword);

// Hae nykyisen käyttäjän tiedot
router.get('/current', auth, getCurrentUser);

// Hae käyttäjän tiedot omalle sivulle
router.get('/profile', auth, fetchUserData);

// Päivitä käyttäjä
router.put('/:id', auth, putUsers.updateUser);

// Luo käyttäjä
router.post('/', auth, postUsers.createUser);

// Poista käyttäjä
router.delete('/:id', auth, deleteUsers.deleteUser);

// Hae kaikki käyttäjät
router.get('/', auth, admin, getUsers.getUsers);

// Hae kaikki käyttäjät (adminille)
router.get('/all', async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Virhe käyttäjien haussa' });
    }
});

// Tallenna käyttäjän vierailu
router.post('/visits', auth, async (req, res) => {
    try {
        const userId = req.userId;
        const { page, timestamp } = req.body;
        console.log('TALLENNETAAN VIERAILU:', { userId, page, timestamp });
        if (!page || !timestamp) {
            return res.status(400).json({ error: 'Sivun nimi ja aikaleima vaaditaan' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Käyttäjää ei löydy' });
        }
        // Lisää uusi vierailu alkuun, pidä max 10 vierailua
        user.lastVisits = [{ page, timestamp: new Date(timestamp) }, ...(user.lastVisits || [])].slice(0, 10);
        console.log('TALLENNETAAN KÄYTTÄJÄLLE:', user.lastVisits);
        await user.save();
        res.status(200).json({ message: 'Vierailu tallennettu' });
    } catch (error) {
        console.error('Virhe vierailun tallennuksessa:', error);
        res.status(500).json({ error: 'Vierailun tallennus epäonnistui' });
    }
});

// Bannaa käyttäjä
router.post('/ban/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { duration } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Käyttäjää ei löydy' });
        }
        let banUntil = null;
        const now = new Date();
        switch (duration) {
            case '1h':
                banUntil = new Date(now.getTime() + 1 * 60 * 60 * 1000);
                break;
            case '3h':
                banUntil = new Date(now.getTime() + 3 * 60 * 60 * 1000);
                break;
            case '1d':
                banUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                break;
            case '1w':
                banUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                break;
            case '1m':
                banUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                break;
            case 'forever':
                banUntil = new Date('2999-12-31T23:59:59.999Z');
                break;
            default:
                banUntil = null;
        }
        user.banUntil = banUntil;
        await user.save();
        res.json({ message: 'Banni asetettu', banUntil });
    } catch (error) {
        res.status(500).json({ message: 'Bannin asettaminen epäonnistui' });
    }
});

module.exports = router;













