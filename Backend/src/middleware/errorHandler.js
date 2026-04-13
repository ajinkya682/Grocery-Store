'use strict';

const logger = require('../utils/logger');
const { AppError } = require('../utils/AppError');

// ─────────────────────────────────────────────
// Transform known Mongoose / JWT errors into AppErrors
// ─────────────────────────────────────────────

const handleCastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400, 'INVALID_ID');

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  logger.error(`[DuplicateKeyError] Field: ${field}, Value: ${value}`);
  return new AppError(
    `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    409,
    'DUPLICATE_FIELD'
  );
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(messages.join('. '), 400, 'VALIDATION_ERROR');
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401, 'INVALID_TOKEN');

const handleJWTExpiredError = () =>
  new AppError('Your session has expired. Please log in again.', 401, 'TOKEN_EXPIRED');

// ─────────────────────────────────────────────
// Global Error Handler Middleware
// ─────────────────────────────────────────────

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Transform known library errors
  if (err.name === 'CastError') error = handleCastError(err);
  else if (err.code === 11000) error = handleDuplicateKeyError(err);
  else if (err.name === 'ValidationError') error = handleValidationError(err);
  else if (err.name === 'JsonWebTokenError') error = handleJWTError();
  else if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  const statusCode = error.statusCode || 500;
  const errorCode = error.errorCode || 'INTERNAL_ERROR';
  const message = error.isOperational ? error.message : 'Something went wrong';

  // Log all errors (include stack in development)
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${error.message}`, {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      stack: error.stack,
    });
  } else {
    logger.warn(`${statusCode} - ${error.message} [${req.method} ${req.originalUrl}]`);
  }

  const response = {
    success: false,
    message,
    errorCode,
  };

  // Only include stack trace in development
  if (process.env.NODE_ENV === 'development' && error.stack) {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
