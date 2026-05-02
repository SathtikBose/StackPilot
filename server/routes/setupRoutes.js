const express = require('express');
const router = express.Router();
const { getSetupSteps } = require('../controllers/setupController');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, getSetupSteps);

module.exports = router;
