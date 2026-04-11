'use strict';

const express = require('express');
const router = express.Router();

const { uploadImages: uploadController } = require('../controllers/upload.controller');
const { uploadImages: multerMiddleware } = require('../middleware/upload.middleware');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Only authenticated admins can upload
router.post('/', protect, restrictTo('admin'), multerMiddleware, uploadController);

module.exports = router;
