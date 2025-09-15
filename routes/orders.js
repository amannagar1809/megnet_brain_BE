const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrder,
  updateOrderStatus,
  getOrders,
} = require('../controllers/orders');

// Public routes
router.post('/create', createOrder);
router.get('/:orderNumber', getOrder);

// Admin routes
router.get('/', getOrders);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
