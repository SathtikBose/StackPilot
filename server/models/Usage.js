const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  remainingCredits: {
    type: Number,
    default: 10
  }
}, { timestamps: true });

// Index for quick lookup by user and date
usageSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Usage', usageSchema);
