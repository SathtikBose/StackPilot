const express = require('express');
const router = express.Router();
const { getHistory } = require('../controllers/historyController');
const { requireAuth } = require('../middleware/auth');
const { checkQuota } = require('../middleware/quota');

// Using checkQuota even for history to ensure user exists in DB
router.get('/', requireAuth, checkQuota, getHistory);

module.exports = router;
