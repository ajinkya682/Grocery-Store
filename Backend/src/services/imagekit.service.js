'use strict';

const ImageKit = require('@imagekit/nodejs');
const path = require('path');
const { ServiceError } = require('../utils/AppError');
const { UPLOAD } = require('../config/constants');
const logger = require('../utils/logger');

// ─── Initialize ImageKit SDK ──────────────────────────────────────────────────
let imagekit;

const getImageKit = () => {
  if (!imagekit) {
    if (
      !process.env.IMAGEKIT_PUBLIC_KEY ||
      !process.env.IMAGEKIT_PRIVATE_KEY ||
      !process.env.IMAGEKIT_URL_ENDPOINT
    ) {
      throw new ServiceError(
        'ImageKit credentials not configured. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in .env',
        'IMAGEKIT_NOT_CONFIGURED'
      );
    }

    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }
  return imagekit;
};

// ─── Upload File ─────────────────────────────────────────────────────────────

/**
 * Upload a file buffer to ImageKit
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} originalName - Original filename for extension
 * @param {string} folder - Target folder in ImageKit
 * @returns {{ url: string, fileId: string }}
 */
const uploadFile = async (buffer, originalName, folder = UPLOAD.IMAGEKIT_FOLDER) => {
  try {
    const ik = getImageKit();
    const ext = path.extname(originalName).toLowerCase();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const safeFileName = `product-${timestamp}-${random}${ext}`;
    
    const base64File = buffer.toString('base64');

    const result = await ik.files.upload({
      file: base64File,
      fileName: safeFileName,
      folder,
      useUniqueFileName: false, // We already make it unique
      tags: ['grocery-store', 'product'],
    });

    logger.info(`ImageKit upload success: ${result.url}`);

    return {
      url: result.url,
      fileId: result.fileId,
    };
  } catch (err) {
    logger.error(`ImageKit upload failed: ${err.message}`);
    throw new ServiceError(
      'Image upload failed. Please try again.',
      'IMAGE_UPLOAD_FAILED'
    );
  }
};

// ─── Delete File ──────────────────────────────────────────────────────────────

/**
 * Delete a file from ImageKit by fileId
 * @param {string} fileId
 */
const deleteFile = async (fileId) => {
  if (!fileId) return;

  try {
    const ik = getImageKit();
    await ik.files.deleteFile(fileId);
    logger.info(`ImageKit delete success: ${fileId}`);
  } catch (err) {
    // Non-critical — log but don't throw (orphan files don't break the app)
    logger.warn(`ImageKit delete failed for fileId ${fileId}: ${err.message}`);
  }
};

module.exports = { uploadFile, deleteFile };
