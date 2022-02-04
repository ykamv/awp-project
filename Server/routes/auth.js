const express = require('express');

// these are functions called from auth controller
const { signup, login } = require('../controllers/auth.js'); 

const router = express.Router();



router.post('/signup',signup);
router.post('/login',login);

module.exports = router;