const express = require('express');
const router = express.Router();
const { login, registerTempUser } = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register (Temporary for testing)
router.post('/register', registerTempUser);

module.exports = router;
