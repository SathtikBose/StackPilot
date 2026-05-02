const axios = require('axios');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'meta-llama/llama-3-8b-instruct';

const generateDependencies = async (params) => {
  const { feature, kotlinVersion, gradleVersion, uiType, minSdk, description } = params;

  const prompt = `
    You are an expert Android Developer. 
    Recommend exactly 5 dependencies for the following feature: "${feature}".
    Context:
    - Kotlin Version: ${kotlinVersion}
    - Gradle Version: ${gradleVersion}
    - UI Type: ${uiType}
    - Min SDK: ${minSdk}
    - Additional Description: ${description || 'None'}

    Return ONLY a JSON array of objects. Each object MUST have:
    - name: String (e.g., "com.squareup.retrofit2:retrofit:2.9.0")
    - rank_tag: String (Choose from: "⭐ Best for beginners", "⚡ Best performance", "🏗️ Best for scalability", "🧪 Experimental / modern", "🔧 Lightweight option")
    - description: String (Brief overview)
    - pros: Array of Strings
    - cons: Array of Strings
    - best_for: String (When to use this)

    STRICT RULES:
    1. Return ONLY JSON. No explanation.
    2. Exactly 5 results.
    3. Ensure versions are compatible with Kotlin ${kotlinVersion} and Gradle ${gradleVersion}.
  `;

  try {
    const response = await axios.post(OPENROUTER_URL, {
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://stackpilot.app',
        'X-Title': 'StackPilot'
      }
    });

    const content = response.data.choices[0].message.content;
    // Some models might wrap JSON in backticks, let's clean it
    const jsonStr = content.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);
    throw new Error('Failed to generate dependencies from AI');
  }
};

const generateAlternatives = async (params, existing) => {
  const { feature, kotlinVersion, gradleVersion, uiType, minSdk } = params;
  
  const prompt = `
    Recommend 2-3 ADDITIONAL Android dependencies for the feature: "${feature}" that are NOT in this list: ${existing.join(', ')}.
    Context: Kotlin ${kotlinVersion}, Gradle ${gradleVersion}, UI ${uiType}, Min SDK ${minSdk}.

    Return ONLY a JSON array of objects with the same structure as before. 
    If no more alternatives are available, return an empty array [].
  `;

  try {
    const response = await axios.post(OPENROUTER_URL, {
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      }
    });

    const content = response.data.choices[0].message.content;
    const jsonStr = content.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);
    throw new Error('Failed to generate alternatives from AI');
  }
};

const generateSetupSteps = async (params) => {
  const { dependency, feature, kotlinVersion, gradleVersion, uiType, minSdk } = params;

  const prompt = `
    Generate structured setup steps for the Android dependency: "${dependency}".
    Feature Context: "${feature}"
    Project Context: Kotlin ${kotlinVersion}, Gradle ${gradleVersion}, UI ${uiType}, Min SDK ${minSdk}.

    Return ONLY a JSON array of 6 steps. Each step MUST have:
    - title: String (e.g., "1. Add Dependency (Gradle)")
    - content: String (Brief description)
    - code: String (Code snippet if applicable, or empty string)
    - filename: String (Filename if applicable, or empty string)

    STRICT OUTPUT SECTIONS:
    1. Add Dependency (Gradle)
    2. Enable Plugins
    3. Create Files
    4. Configuration Changes
    5. Example Usage
    6. Testing Instructions

    Return ONLY JSON. No explanation.
  `;

  try {
    const response = await axios.post(OPENROUTER_URL, {
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      }
    });

    const content = response.data.choices[0].message.content;
    const jsonStr = content.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);
    throw new Error('Failed to generate setup steps from AI');
  }
};

module.exports = { generateDependencies, generateAlternatives, generateSetupSteps };
