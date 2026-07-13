const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyAdminToken } = require('../middleware/authAdminMiddleware');
const adminController = require('../controllers/adminController');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Admin Auth
router.post('/login', adminController.adminLogin);

// Protected Admin Routes
router.use(verifyAdminToken);

// User Management
router.get('/users', adminController.getUsers);
router.post('/users', upload.single('profilePhoto'), adminController.createUser);
router.put('/users/:id', upload.single('profilePhoto'), adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Document Management per User
router.get('/users/:id/documents', adminController.getUserDocuments);
router.post('/users/:id/documents', upload.fields([{ name: 'documentFile', maxCount: 1 }, { name: 'logoFile', maxCount: 1 }]), adminController.uploadDocument);
router.delete('/documents/:userDocId', adminController.deleteDocument);

module.exports = router;
