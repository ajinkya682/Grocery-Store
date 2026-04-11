'use strict';

const { body } = require('express-validator');

const createProductRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3–100 characters'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

  body('originalPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Original price must be positive'),

  body('unit')
    .optional()
    .trim(),

  body('isFeatured')
    .optional()
    .isBoolean().withMessage('isFeatured must be a boolean'),

  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
];

const updateProductRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3–100 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be positive'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be non-negative'),

  body('category')
    .optional()
    .trim()
    .notEmpty().withMessage('Category cannot be empty if provided'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description too long'),

  body('isFeatured')
    .optional()
    .isBoolean(),
];

const bulkStockRules = [
  body('updates')
    .isArray({ min: 1 }).withMessage('Updates must be a non-empty array'),

  body('updates.*.productId')
    .notEmpty().withMessage('productId required in each update')
    .isMongoId().withMessage('Invalid productId'),

  body('updates.*.stock')
    .isInt({ min: 0 }).withMessage('Stock must be non-negative'),
];

module.exports = { createProductRules, updateProductRules, bulkStockRules };
