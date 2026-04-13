'use strict';

const { body } = require('express-validator');

const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters'),

  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Invalid role'),

  // Strip email entirely for user-role registrations (prevents browser auto-fill 409 conflicts)
  body('email')
    .customSanitizer((value, { req }) => {
      if (req.body.role !== 'admin') return undefined; // discard for non-admin
      return value;
    })
    .if((value, { req }) => req.body.role === 'admin')
    .trim()
    .notEmpty().withMessage('Email is required for administrator accounts')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('mobile')
    .if((value, { req }) => req.body.role !== 'admin')
    .trim()
    .notEmpty().withMessage('Mobile number is required for customer accounts')
    .matches(/^[0-9]{10}$/).withMessage('Mobile must be 10 digits'),

  body('password')
    .notEmpty().withMessage('Password/PIN is required')
    .isLength({ min: 6 }).withMessage('Must be at least 6 characters'),
];

const loginRules = [
  body('identifier')
    .trim()
    .notEmpty().withMessage('Email or Mobile is required'),

  body('password')
    .notEmpty().withMessage('Password/PIN is required'),
];

const refreshTokenRules = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required'),
];

const resetPinRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters'),

  body('mobile')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^[0-9]{10}$/).withMessage('Mobile must be 10 digits'),

  body('newPin')
    .notEmpty().withMessage('New PIN is required')
    .isLength({ min: 6 }).withMessage('PIN must be at least 6 characters'),
];

module.exports = { registerRules, loginRules, refreshTokenRules, resetPinRules };
