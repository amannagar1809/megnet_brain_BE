const express = require('express');
const router = express.Router();
const { getSalesAnalytics } = require('../controllers/analytics');

// Admin route
router.get('/sales', getSalesAnalytics);

module.exports = router;
