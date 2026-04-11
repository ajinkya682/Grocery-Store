'use strict';

// ─────────────────────────────────────────────
// Custom Error Classes
// ─────────────────────────────────────────────

class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true; // Distinguish from programming errors

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', errorCode = 'VALIDATION_ERROR') {
    super(message, 400, errorCode);
  }
}

class AuthError extends AppError {
  constructor(message = 'Authentication required', errorCode = 'UNAUTHORIZED') {
    super(message, 401, errorCode);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission', errorCode = 'FORBIDDEN') {
    super(message, 403, errorCode);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource', errorCode = 'NOT_FOUND') {
    super(`${resource} not found`, 404, errorCode);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists', errorCode = 'CONFLICT') {
    super(message, 409, errorCode);
  }
}

class ServiceError extends AppError {
  constructor(message = 'External service error', errorCode = 'SERVICE_ERROR') {
    super(message, 502, errorCode);
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ServiceError,
};
