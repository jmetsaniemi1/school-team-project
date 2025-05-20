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

module.exports = router;













