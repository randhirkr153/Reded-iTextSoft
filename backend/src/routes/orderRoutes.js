const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderProgress } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, authorize('Admin', 'Manager'), createOrder)
  .get(protect, getOrders);

router.route('/:id/progress')
  .put(protect, updateOrderProgress);

module.exports = router;
