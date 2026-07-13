const express = require('express');
const router = express.Router();
const multer = require('multer');
const { login, registerTempUser, updateProfilePhoto } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Configure multer for temp storage
const upload = multer({ dest: 'uploads/' });

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register (Temporary for testing)
router.post('/register', registerTempUser);

// PUT /api/auth/profile-photo
router.put('/profile-photo', verifyToken, upload.single('profilePhoto'), updateProfilePhoto);

module.exports = router;
