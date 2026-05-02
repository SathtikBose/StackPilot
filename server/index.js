require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { requireAuth } = require('./middleware/auth');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'StackPilot API is running' });
});

app.get('/api/test-auth', requireAuth, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.auth });
});

app.use('/api/dependencies', require('./routes/dependencyRoutes'));
app.use('/api/setup', require('./routes/setupRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
