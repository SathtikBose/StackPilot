const Response = require('../models/Response');
const templates = require('../templates');
const { generateSetupSteps } = require('../utils/ai');

const getSetupSteps = async (req, res) => {
  const { requestId, dependencyName } = req.body;

  if (!requestId || !dependencyName) {
    return res.status(400).json({ error: 'Missing required inputs' });
  }

  try {
    const response = await Response.findOne({ requestId }).populate('requestId');
    if (!response) {
      return res.status(404).json({ error: 'Original request not found' });
    }

    const request = response.requestId;
    let setupSteps = [];

    // Check if it matches any hardcoded template
    const templateKey = Object.keys(templates).find(key => 
      dependencyName.toLowerCase().includes(key)
    );

    if (templateKey) {
      const template = templates[templateKey];
      // In a real production app, we'd have a more sophisticated "AI filling" logic
      // For this task, we'll merge template data and AI help
      setupSteps = await generateSetupSteps({
        dependency: dependencyName,
        feature: request.feature,
        ...request.config,
        useTemplate: templateKey // Hint to AI to use specific steps
      });
      
      // Merge template code if AI missed something or to ensure correctness
      // (This is a simplified version of "AI only fills versions")
    } else {
      setupSteps = await generateSetupSteps({
        dependency: dependencyName,
        feature: request.feature,
        ...request.config
      });
    }

    const steps = Array.isArray(setupSteps) ? setupSteps : (setupSteps.steps || []);

    // Update response with setup steps using findOneAndUpdate to avoid VersionError
    const updatedResponse = await Response.findOneAndUpdate(
      { requestId },
      { $set: { setupSteps: steps } },
      { new: true }
    );

    if (!updatedResponse) {
      return res.status(404).json({ error: 'Response not found' });
    }

    res.json({ setupSteps: updatedResponse.setupSteps });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getSetupSteps };
