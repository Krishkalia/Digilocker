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
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/ping', (req, res) => {
  res.status(200).send('pong');
});

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // --- Self-Ping Mechanism for Render Free Tier ---
  // Render spins down inactive free web services after 15 minutes.
  // This interval pings the server itself every 14 minutes to keep it awake.
  const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes
  
  setInterval(() => {
    const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    const pingUrl = `${baseUrl}/api/ping`;
    
    const httpModule = pingUrl.startsWith('https') ? require('https') : require('http');
    
    httpModule.get(pingUrl, (res) => {
      console.log(`[Self-Ping] Successfully pinged ${pingUrl} - Status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`[Self-Ping] Failed to ping ${pingUrl}:`, err.message);
    });
  }, PING_INTERVAL);
});
