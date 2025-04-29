const express = require('express');
const router = express.Router();
const auth = require('./routes_user_auth.js/auth.js');
const cors = require('cors');
const { getCurrentUser } = require('../database/methods/GET');
const { fetchUserData } = require('../database/methods/ownPage/GET');

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
router.get('/', auth, getUsers.getUsers);

module.exports = router;













