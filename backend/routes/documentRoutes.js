const express = require('express');
const router = express.Router();
const { getMyDocuments } = require('../controllers/documentController');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/documents - Fetch user's issued documents
router.get('/', verifyToken, getMyDocuments);

module.exports = router;
