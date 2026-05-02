const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const requireAuth = ClerkExpressRequireAuth({
  // Options
});

module.exports = { requireAuth };
