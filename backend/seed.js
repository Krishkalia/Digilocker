require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, AdminUser } = require('./models/User');
const { DocumentType, Document, UserDocument } = require('./models/Document');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/secure-vault';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await AdminUser.deleteMany({});
    await DocumentType.deleteMany({});
    await Document.deleteMany({});
    await UserDocument.deleteMany({});
    console.log('Cleared existing collections');

    // Create Admin User
    const adminPasswordHash = await bcrypt.hash('admin1234', 10);
    const admin = await AdminUser.create({
      adminUsername: 'pk',
      adminEmail: 'pk@admin.com',
      adminPasswordHash
    });

    // Create Standard User
    const userPasswordHash = await bcrypt.hash('password123', 10);
    const user = await User.create({
      username: 'Krish Kalia',
      email: 'user@example.com',
      passwordHash: userPasswordHash,
      phoneNumber: '9876543210'
    });
    console.log('Created Users');

    // Create Document Types
    const typeIdentity = await DocumentType.create({ typeName: 'IDENTITY' });
    const typeAcademic = await DocumentType.create({ typeName: 'ACADEMIC' });

    // Create Documents
    const aadhaarDoc = await Document.create({
      documentName: 'Aadhaar Card',
      cloudStorageUrl: 'https://placeholder.url/aadhaar.pdf',
      documentType: typeIdentity._id
    });

    const degreeDoc = await Document.create({
      documentName: 'B.Tech Degree',
      cloudStorageUrl: 'https://placeholder.url/degree.pdf',
      documentType: typeAcademic._id
    });
    console.log('Created Documents');

    // Assign Documents to User
    await UserDocument.create({
      user: user._id,
      document: aadhaarDoc._id,
      accessType: 'VIEW_ONLY'
    });

    await UserDocument.create({
      user: user._id,
      document: degreeDoc._id,
      accessType: 'VIEW_ONLY'
    });
    console.log('Assigned Documents to User');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
