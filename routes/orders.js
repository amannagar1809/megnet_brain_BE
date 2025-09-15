const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrder,
  getOrderByPayPalId,
  updateOrderStatus,
  getOrders,
} = require('../controllers/orders');

// Public routes
router.post('/create', createOrder);
router.get('/:orderNumber', getOrder);
router.get('/paypal/:paypalOrderId', getOrderByPayPalId);

// Admin routes
router.get('/', getOrders);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
