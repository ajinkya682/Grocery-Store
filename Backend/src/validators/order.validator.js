'use strict';

const { body } = require('express-validator');

const createOrderRules = [
  body('items')
    .isArray({ min: 1 }).withMessage('Items must be a non-empty array'),

  body('items.*.productId')
    .notEmpty().withMessage('productId is required for each item')
    .isMongoId().withMessage('Invalid productId format'),

  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),

  body('shippingAddress.name')
    .trim()
    .notEmpty().withMessage('Recipient name is required'),

  body('shippingAddress.phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),

  body('shippingAddress.address')
    .trim()
    .notEmpty().withMessage('Address is required'),

  body('shippingAddress.city')
    .trim()
    .notEmpty().withMessage('City is required'),

  body('shippingAddress.pincode')
    .trim()
    .notEmpty().withMessage('Pincode is required')
    .isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digits'),

  body('paymentMethod')
    .optional()
    .isIn(['COD', 'UPI', 'Card', 'Wallet']).withMessage('Invalid payment method'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];

const updateStatusRules = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'])
    .withMessage('Invalid status value'),

  body('note')
    .optional()
    .trim()
    .isLength({ max: 200 }),
];

module.exports = { createOrderRules, updateStatusRules };
