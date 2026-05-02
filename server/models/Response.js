const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true
  },
  dependencies: [{
    name: String,
    rank_tag: String,
    description: String,
    pros: [String],
    cons: [String],
    best_for: String
  }],
  setupSteps: [{
    title: String,
    content: String,
    code: String,
    filename: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Response', responseSchema);
