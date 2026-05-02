const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    // MongoDB Connected
  } catch (error) {
    // Connection Error
    process.exit(1);
  }
};

module.exports = connectDB;
