const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');
const { User, AdminUser } = require('../models/User');
const { Document, UserDocument, DocumentType } = require('../models/Document');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';

// --- Auth ---
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminUser.findOne({ adminEmail: email });
    if (!admin) return res.status(401).json({ message: 'Invalid admin credentials' });

    const isMatch = await bcrypt.compare(password, admin.adminPasswordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid admin credentials' });

    const token = jwt.sign({ id: admin._id, role: 'ADMIN' }, JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ token, admin: { id: admin._id, username: admin.adminUsername, email: admin.adminEmail } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Users CRUD ---
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, dob, gender } = req.body;
    
    const existing = await User.findOne({ email });
    if (existing) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    let profilePhotoUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'digilocker_profiles',
        resource_type: 'auto'
      });
      profilePhotoUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, passwordHash, phoneNumber, dob, gender, profilePhotoUrl });
    await newUser.save();

    res.status(201).json({ message: 'User created', user: { id: newUser._id, username, email } });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, phoneNumber, isActive, dob, gender } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (isActive !== undefined) user.isActive = isActive;
    if (dob !== undefined) user.dob = dob;
    if (gender !== undefined) user.gender = gender;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'digilocker_profiles',
        resource_type: 'auto'
      });
      user.profilePhotoUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Cleanup mappings
    await UserDocument.deleteMany({ user: req.params.id });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Documents CRUD ---
exports.getUserDocuments = async (req, res) => {
  try {
    const docs = await UserDocument.find({ user: req.params.id }).populate('document').sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const { documentName, documentTypeName, expiryDate } = req.body;
    const userId = req.params.id;

    if (!req.files || !req.files.documentFile) return res.status(400).json({ message: 'Document file is required' });

    const documentFile = req.files.documentFile[0];
    const logoFile = req.files.logoFile ? req.files.logoFile[0] : null;

    // Ensure document type exists
    let docType = await DocumentType.findOne({ typeName: documentTypeName.toUpperCase() });
    if (!docType) {
      docType = new DocumentType({ typeName: documentTypeName.toUpperCase() });
      await docType.save();
    }

    // Upload Document to Cloudinary
    const docResult = await cloudinary.uploader.upload(documentFile.path, {
      folder: 'digilocker_secure_vault',
      resource_type: 'auto'
    });
    fs.unlinkSync(documentFile.path);

    // Upload Logo to Cloudinary if provided
    let logoUrl = null;
    if (logoFile) {
      const logoResult = await cloudinary.uploader.upload(logoFile.path, {
        folder: 'digilocker_logos',
        resource_type: 'auto'
      });
      logoUrl = logoResult.secure_url;
      fs.unlinkSync(logoFile.path);
    }

    const newDoc = new Document({
      documentName,
      cloudStorageUrl: docResult.secure_url,
      logoUrl: logoUrl,
      expiryDate: expiryDate || null,
      documentType: docType._id
    });
    await newDoc.save();

    const userDocMapping = new UserDocument({
      user: userId,
      document: newDoc._id,
      accessType: 'VIEW_ONLY'
    });
    await userDocMapping.save();

    res.status(201).json({ message: 'Document uploaded to Cloudinary successfully', document: newDoc });
  } catch (error) {
    console.error(error);
    // Cleanup local files if upload failed
    if (req.files) {
      if (req.files.documentFile && fs.existsSync(req.files.documentFile[0].path)) {
        fs.unlinkSync(req.files.documentFile[0].path);
      }
      if (req.files.logoFile && fs.existsSync(req.files.logoFile[0].path)) {
        fs.unlinkSync(req.files.logoFile[0].path);
      }
    }
    res.status(500).json({ message: 'Server error during upload' });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const userDocId = req.params.userDocId; // Delete the mapping specifically
    const userDoc = await UserDocument.findByIdAndDelete(userDocId);
    
    if (!userDoc) return res.status(404).json({ message: 'Document mapping not found' });
    
    // Optionally delete the underlying Document if no one else is mapped to it
    const otherMappings = await UserDocument.countDocuments({ document: userDoc.document });
    if (otherMappings === 0) {
       await Document.findByIdAndDelete(userDoc.document);
    }
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
