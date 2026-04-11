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

  body('email')
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

module.exports = { registerRules, loginRules, refreshTokenRules };
