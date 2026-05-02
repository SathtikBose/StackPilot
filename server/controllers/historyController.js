const Request = require('../models/Request');
const Response = require('../models/Response');
const Usage = require('../models/Usage');

const getHistory = async (req, res) => {
  try {
    const userId = req.dbUser._id;
    const requests = await Request.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    // Get corresponding responses
    const history = await Promise.all(requests.map(async (req) => {
      const resp = await Response.findOne({ requestId: req._id });
      return {
        _id: req._id,
        feature: req.feature,
        config: req.config,
        createdAt: req.createdAt,
        dependencies: resp ? resp.dependencies : []
      };
    }));

    const today = new Date().toISOString().split('T')[0];
    const usage = await Usage.findOne({ userId, date: today });

    // Deduplicate history items (filter out identical requests within 60 seconds)
    const uniqueHistory = [];
    history.forEach(item => {
      const isDuplicate = uniqueHistory.some(u => 
        u.feature === item.feature && 
        JSON.stringify(u.config) === JSON.stringify(item.config) &&
        Math.abs(new Date(u.createdAt) - new Date(item.createdAt)) < 60000
      );
      if (!isDuplicate) uniqueHistory.push(item);
    });

    res.json({ 
      history: uniqueHistory,
      usage: usage || { remainingCredits: 10 }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

module.exports = { getHistory };
