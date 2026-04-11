'use strict';

const multer = require('multer');
const { UPLOAD } = require('../config/constants');
const { ValidationError } = require('../utils/AppError');

// ─── Memory Storage (no disk writes) ─────────────────────────────────────────
const storage = multer.memoryStorage();

// ─── File Filter ──────────────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  if (UPLOAD.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ValidationError(
        `Invalid file type: ${file.mimetype}. Allowed: jpg, png, webp`,
        'INVALID_FILE_TYPE'
      ),
      false
    );
  }
};

// ─── Multer Instance ──────────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: UPLOAD.MAX_FILE_SIZE, // 2 MB per file
    files: UPLOAD.MAX_FILES,         // max 5 files at once
  },
});

// ─── Upload Middleware ────────────────────────────────────────────────────────
// Wraps multer to convert multer errors → AppErrors (consistent JSON response)
const uploadImages = (req, res, next) => {
  const multerMiddleware = upload.array('images', UPLOAD.MAX_FILES);

  multerMiddleware(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ValidationError('File too large. Maximum allowed: 2MB', 'FILE_TOO_LARGE'));
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return next(new ValidationError(`Too many files. Maximum: ${UPLOAD.MAX_FILES}`, 'TOO_MANY_FILES'));
      }
      return next(new ValidationError(err.message, 'UPLOAD_ERROR'));
    }

    next(err);
  });
};

module.exports = { uploadImages };
