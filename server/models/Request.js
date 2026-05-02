const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  feature: {
    type: String,
    required: true
  },
  config: {
    kotlinVersion: String,
    gradleVersion: String,
    uiType: String, // Compose / XML
    minSdk: String,
    description: String
  },
  selectedDependency: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
