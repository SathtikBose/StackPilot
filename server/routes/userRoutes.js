const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const { getOrCreateUser } = require('../utils/user');

// Get current user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const { userId: clerkId } = req.auth;
    const email = 'user@example.com'; // Default email if not found
    const user = await getOrCreateUser(clerkId, email);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mock upgrade to Pro
router.post('/upgrade', requireAuth, async (req, res) => {
  try {
    const { userId: clerkId } = req.auth;
    const user = await User.findOneAndUpdate(
      { clerkId },
      { plan: 'pro' },
      { new: true }
    );
    res.json({ message: 'Successfully upgraded to Pro', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
