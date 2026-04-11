'use strict';

const { uploadFile } = require('../services/imagekit.service');
const { ValidationError } = require('../utils/AppError');

// ─── POST /api/upload ─────────────────────────────────────────────────────────
const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new ValidationError('No images provided', 'NO_FILES');
    }

    // Upload all files to ImageKit in parallel
    const uploadPromises = req.files.map((file) =>
      uploadFile(file.buffer, file.originalname)
    );

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      data: results, // [{ url, fileId }, ...]
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadImages };
