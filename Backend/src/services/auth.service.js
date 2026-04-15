'use strict';

const jwt = require('jsonwebtoken');
const { AuthError } = require('../utils/AppError');

// ─── Token Generation ─────────────────────────────────────────────────────────

const generateAccessToken = (userId, role) => {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
  }
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
};

const generateRefreshToken = (userId) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
  }
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

// ─── Token Verification ───────────────────────────────────────────────────────

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    throw new AuthError(
      err.name === 'TokenExpiredError'
        ? 'Access token expired'
        : 'Invalid access token',
      err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN'
    );
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new AuthError(
      err.name === 'TokenExpiredError'
        ? 'Refresh token expired. Please log in again.'
        : 'Invalid refresh token',
      'REFRESH_TOKEN_INVALID'
    );
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
