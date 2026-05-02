const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

// Get current user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').lean();
    
    // Fetch remaining credits
    const today = new Date().toISOString().split('T')[0];
    const Usage = require('../models/Usage');
    let usage = await Usage.findOne({ userId: req.user.id, date: today });
    
    if (!usage) {
      usage = await Usage.create({ userId: req.user.id, date: today });
    }

    res.json({
      ...user,
      credits: usage.remainingCredits
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
