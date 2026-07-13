const mongoose = require('mongoose');

const documentTypeSchema = new mongoose.Schema({
  typeName: {
    type: String, // e.g. PDF, IMAGE, CERTIFICATE
    required: true,
    unique: true,
    uppercase: true
  }
});

const documentSchema = new mongoose.Schema({
  documentName: {
    type: String,
    required: true
  },
  cloudStorageUrl: {
    type: String,
    required: true // Cloudinary reference for generating signed URLs
  },
  expiryDate: {
    type: Date,
    default: null
  },
  documentType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DocumentType',
    required: true
  }
}, { timestamps: { createdAt: 'uploadTimestamp', updatedAt: true } });

const userDocumentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  accessType: {
    type: String,
    enum: ['VIEW_ONLY'],
    default: 'VIEW_ONLY'
  },
  lastViewedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// As per project context, mapping which admin manages which user's documents
const adminUserAccessSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  grantedAt: {
    type: Date,
    default: Date.now
  }
});

const DocumentType = mongoose.model('DocumentType', documentTypeSchema);
const Document = mongoose.model('Document', documentSchema);
const UserDocument = mongoose.model('UserDocument', userDocumentSchema);
const AdminUserAccess = mongoose.model('AdminUserAccess', adminUserAccessSchema);

module.exports = {
  DocumentType,
  Document,
  UserDocument,
  AdminUserAccess
};
