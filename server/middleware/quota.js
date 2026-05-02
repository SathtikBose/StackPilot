const Usage = require('../models/Usage');
const User = require('../models/User');
const { getOrCreateUser } = require('../utils/user');

const checkQuota = async (req, res, next) => {
  try {
    // req.auth is provided by ClerkExpressRequireAuth
    const { userId: clerkId } = req.auth;
    
    // In a real app, we'd get email from clerk as well, but for now we'll mock it if missing
    // req.auth should have session details
    const email = 'user@example.com'; 
    
    const user = await getOrCreateUser(clerkId, email);
    req.dbUser = user;

    if (user.plan === 'pro') {
      return next();
    }

    const today = new Date().toISOString().split('T')[0];
    let usage = await Usage.findOne({ userId: user._id, date: today });

    if (!usage) {
      usage = await Usage.create({
        userId: user._id,
        date: today,
        remainingCredits: 10
      });
    }

    if (usage.remainingCredits <= 0) {
      return res.status(429).json({ error: 'Daily quota exceeded. Upgrade to Pro for unlimited access.' });
    }

    req.usage = usage;
    next();
  } catch (error) {
    console.error('Quota Error:', error);
    res.status(500).json({ error: 'Internal Server Error during quota check' });
  }
};

module.exports = { checkQuota };
