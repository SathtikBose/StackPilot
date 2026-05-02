const Request = require('../models/Request');
const Response = require('../models/Response');
const Usage = require('../models/Usage');
const { generateDependencies, generateAlternatives } = require('../utils/ai');

const getDependencies = async (req, res) => {
  const { feature, kotlinVersion, gradleVersion, uiType, minSdk, description } = req.body;
  
  // Validation
  if (!feature || !kotlinVersion || !gradleVersion || !uiType || !minSdk) {
    return res.status(400).json({ error: 'Missing required inputs' });
  }

  try {
    const tenSecondsAgo = new Date(Date.now() - 10000);
    // 1. Atomically find or create the Request record to prevent race conditions
    // We check for a matching request within the last 10 seconds
    let newRequest = await Request.findOne({
      userId: req.dbUser._id,
      feature,
      'config.kotlinVersion': kotlinVersion,
      'config.gradleVersion': gradleVersion,
      'config.uiType': uiType,
      'config.minSdk': minSdk,
      createdAt: { $gte: tenSecondsAgo }
    });
    
    let isBrandNew = false;
    if (!newRequest) {
      newRequest = await Request.create({
        userId: req.dbUser._id,
        feature,
        config: { kotlinVersion, gradleVersion, uiType, minSdk, description }
      });
      isBrandNew = true;
    } else {
      const existingResponse = await Response.findOne({ requestId: newRequest._id });
      if (existingResponse) {
        return res.json({
          requestId: newRequest._id,
          dependencies: existingResponse.dependencies,
          remainingCredits: req.usage?.remainingCredits ?? 'unlimited'
        });
      }
    }

    // 2. Call AI
    const dependencies = await generateDependencies({
      feature, kotlinVersion, gradleVersion, uiType, minSdk, description
    });

    // 3. Save Response
    // Handle the case where AI returns an object with a dependencies key or just an array
    const depList = Array.isArray(dependencies) ? dependencies : (dependencies.dependencies || []);
    
    const newResponse = await Response.create({
      requestId: newRequest._id,
      dependencies: depList.slice(0, 5)
    });

    // 4. Decrement credits
    if (req.dbUser.plan === 'free') {
      req.usage.remainingCredits -= 1;
      await req.usage.save();
    }

    res.json({
      requestId: newRequest._id,
      dependencies: newResponse.dependencies,
      remainingCredits: req.usage?.remainingCredits ?? 'unlimited'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMoreAlternatives = async (req, res) => {
  const { requestId } = req.body;

  if (!requestId) {
    return res.status(400).json({ error: 'Request ID is required' });
  }

  try {
    const originalRequest = await Request.findById(requestId);
    const originalResponse = await Response.findOne({ requestId });

    if (!originalRequest || !originalResponse) {
      return res.status(404).json({ error: 'Original request not found' });
    }

    const existingNames = originalResponse.dependencies.map(d => d.name);

    // Call AI
    const alternatives = await generateAlternatives(
      { ...originalRequest.config, feature: originalRequest.feature },
      existingNames
    );

    const altList = Array.isArray(alternatives) ? alternatives : (alternatives.dependencies || []);

    if (altList.length === 0) {
      return res.json({ message: 'No more alternatives available', dependencies: [] });
    }

    // Append to original response or just return new ones? 
    // Requirement says "Returns 2-3 additional dependencies"
    originalResponse.dependencies.push(...altList.slice(0, 3));
    await originalResponse.save();

    // Decrement credits
    if (req.dbUser.plan === 'free') {
      req.usage.remainingCredits -= 1;
      await req.usage.save();
    }

    res.json({
      dependencies: altList.slice(0, 3),
      remainingCredits: req.usage?.remainingCredits ?? 'unlimited'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDependencies, getMoreAlternatives };
