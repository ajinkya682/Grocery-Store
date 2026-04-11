'use strict';

const express = require('express');
const router = express.Router();
const Category = require('../models/Category.model');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// GET /api/categories - Public (or admin only, but usually public for store frontend)
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    // Return array of strings to match frontend expectation
    res.status(200).json({ success: true, data: categories.map(c => c.name) });
  } catch (error) {
    next(error);
  }
});

// POST /api/categories - Admin only
router.post('/', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    
    // Check if exists
    const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const newCategory = await Category.create({ name: name.trim(), isSystem: false });
    
    res.status(201).json({ success: true, data: newCategory.name });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
