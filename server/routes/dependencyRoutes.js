const express = require('express');
const router = express.Router();
const { getDependencies, getMoreAlternatives } = require('../controllers/dependencyController');
const { requireAuth } = require('../middleware/auth');
const { checkQuota } = require('../middleware/quota');

router.post('/', requireAuth, checkQuota, getDependencies);
router.post('/more', requireAuth, checkQuota, getMoreAlternatives);

module.exports = router;
