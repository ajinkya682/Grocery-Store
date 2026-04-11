'use strict';

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const uploadRoutes = require('./upload.routes');
const settingsRoutes = require('./settings.routes');
const dashboardRoutes = require('./dashboard.routes');
const categoryRoutes = require('./category.routes');

// ─── Health Check ─────────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Grocery Store API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── Mount Routes ─────────────────────────────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/upload', uploadRoutes);
router.use('/settings', settingsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;
