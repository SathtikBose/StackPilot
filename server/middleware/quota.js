const Usage = require('../models/Usage');

const checkQuota = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.plan === 'pro') {
      return next();
    }

    const today = new Date().toISOString().split('T')[0];
    const usage = await Usage.findOneAndUpdate(
      { userId: user._id, date: today },
      { $setOnInsert: { userId: user._id, date: today, remainingCredits: 10 } },
      { upsert: true, new: true }
    );

    if (usage.remainingCredits <= 0) {
      return res.status(403).json({ 
        error: 'Daily credit limit reached. Upgrade to Pro for unlimited access.' 
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
