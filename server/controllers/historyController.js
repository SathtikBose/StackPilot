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

    res.json({ 
      history,
      usage: usage || { remainingCredits: 10 }
    });
  } catch (error) {
    console.error('History Error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

module.exports = { getHistory };
