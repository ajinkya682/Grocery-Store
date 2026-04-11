'use strict';

const StoreSettings = require('../models/StoreSettings.model');
const logger = require('../utils/logger');

// ─── GET /api/settings ────────────────────────────────────────────────────────
const getSettings = async (req, res, next) => {
  try {
    const settings = await StoreSettings.getSingleton();
    res.status(200).json({ success: true, data: { settings } });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/settings (Admin) ────────────────────────────────────────────────
const updateSettings = async (req, res, next) => {
  try {
    const settings = await StoreSettings.getSingleton();

    // Deep merge — only update provided fields
    const allowedFields = ['identity', 'contact', 'location', 'businessHours', 'delivery', 'social'];
    for (const field of allowedFields) {
      if (req.body[field]) {
        settings[field] = { ...settings[field].toObject(), ...req.body[field] };
      }
    }

    await settings.save();
    logger.info(`Store settings updated by admin: ${req.user.email}`);

    res.status(200).json({ success: true, data: { settings } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSettings, updateSettings };
