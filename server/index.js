require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { requireAuth } = require('./middleware/auth');
const { setupSecurity, errorHandler } = require('./middleware/security');

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for accurate rate limiting (if behind a proxy like Heroku/Nginx)
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
setupSecurity(app);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'StackPilot API is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/dependencies', require('./routes/dependencyRoutes'));
app.use('/api/setup', require('./routes/setupRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
