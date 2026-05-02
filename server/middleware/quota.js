const Usage = require('../models/Usage');

const checkQuota = async (req, res, next) => {
  try {
    const user = req.user;

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
      return res.status(429).json({ 
        error: 'Daily quota exceeded. Upgrade to Pro for unlimited access.' 
      });
    }

    req.usage = usage;
    next();
  } catch (error) {
    // Quota Error
    res.status(500).json({ error: 'Internal Server Error during quota check' });
  }
};

module.exports = { checkQuota };
