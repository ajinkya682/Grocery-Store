'use strict';

const express = require('express');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/order.controller');

const { protect, restrictTo } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const { createOrderRules, updateStatusRules } = require('../validators/order.validator');

// All order routes require authentication
router.use(protect);

router.post('/', validate(createOrderRules), createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);

// Admin only
router.get('/', restrictTo('admin'), getAllOrders);
router.patch('/:id/status', restrictTo('admin'), validate(updateStatusRules), updateOrderStatus);

module.exports = router;
