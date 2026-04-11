'use strict';

const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getFeaturedProducts,
  searchProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateStock,
} = require('../controllers/product.controller');

const { protect, restrictTo } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const { createProductRules, updateProductRules, bulkStockRules } = require('../validators/product.validator');

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// ─── Admin Only ───────────────────────────────────────────────────────────────
router.use(protect, restrictTo('admin'));

router.post('/', validate(createProductRules), createProduct);
router.put('/:id', validate(updateProductRules), updateProduct);
router.delete('/:id', deleteProduct);
router.patch('/bulk-stock', validate(bulkStockRules), bulkUpdateStock);

module.exports = router;
