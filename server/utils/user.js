const User = require('../models/User');

const getOrCreateUser = async (clerkId, email) => {
  let user = await User.findOne({ clerkId });
  if (!user) {
    user = await User.create({
      clerkId,
      email,
      plan: 'free'
    });
  }
  return user;
};

module.exports = { getOrCreateUser };
