'use strict';

const express = require('express');
const router = express.Router();

const { getSettings, updateSettings } = require('../controllers/settings.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.get('/', getSettings);
router.put('/', protect, restrictTo('admin'), updateSettings);

module.exports = router;
