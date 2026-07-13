require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/secure-vault';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('Secure Document Vault API');
});

// Routes
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
