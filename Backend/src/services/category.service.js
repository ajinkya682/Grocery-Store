'use strict';

const Category = require('../models/Category.model');
const logger = require('../utils/logger');

const DEFAULT_CATEGORIES = [
  'Staples',
  'Cooking Essentials',
  'Dairy & Bakery',
  'Snacks & Namkeen',
  'Beverages',
  'Packaged Food',
  'Fruits & Vegetables',
  'Personal Care',
  'Household & Cleaning',
  'Baby Care',
  'Pet Care',
  'Pooja Items',
];

const seedDefaultCategories = async () => {
  try {
    for (const catName of DEFAULT_CATEGORIES) {
      // Use updateOne with upsert to prevent unique constraint errors and only seed if missing
      await Category.updateOne(
        { name: catName },
        { $setOnInsert: { name: catName, isSystem: true } },
        { upsert: true }
      );
    }
    logger.info('System Categories seeded successfully.');
  } catch (error) {
    logger.error(`Error seeding categories: ${error.message}`);
  }
};

module.exports = { seedDefaultCategories, DEFAULT_CATEGORIES };
