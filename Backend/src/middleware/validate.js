'use strict';

const { validationResult } = require('express-validator');

/**
 * Middleware factory — wraps express-validator rule arrays.
 * Usage: router.post('/path', validate(rules), controller)
 */
const validate = (rules) => {
  return async (req, res, next) => {
    // Run all validation rules
    await Promise.all(rules.map((rule) => rule.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errorCode: 'VALIDATION_ERROR',
      errors: formattedErrors,
    });
  };
};

module.exports = validate;
