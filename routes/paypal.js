const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypal');

// Create PayPal order
router.post('/create-order', paypalController.createPayPalOrder);

// Capture PayPal order
router.post('/capture-order', paypalController.capturePayPalOrder);

// PayPal webhook for payment status updates
router.post('/webhook', paypalController.paypalWebhook);

module.exports = router;
