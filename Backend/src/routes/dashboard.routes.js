'use strict';

const express = require('express');
const router = express.Router();

const { getDashboardStats } = require('../controllers/dashboard.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.get('/stats', protect, restrictTo('admin'), getDashboardStats);

module.exports = router;
