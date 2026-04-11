'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { AuthError, ForbiddenError } = require('../utils/AppError');

// ─── Extract Token from Header ────────────────────────────────────────────────
const extractToken = (req) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    return auth.split(' ')[1];
  }
  return null;
};

// ─── protect ─────────────────────────────────────────────────────────────────
// Requires a valid JWT; attaches req.user
const protect = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return next(new AuthError('No token provided. Please log in.', 'NO_TOKEN'));
    }

    // Verify token (throws on invalid/expired)
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Fetch user — ensures account still exists and is active
    const user = await User.findById(decoded.id).select('+isActive');
    if (!user || !user.isActive) {
      return next(new AuthError('User no longer exists or is deactivated.', 'USER_NOT_FOUND'));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err); // Passes JWT errors to global handler
  }
};

// ─── restrictTo ──────────────────────────────────────────────────────────────
// RBAC — only allow specified roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          'You do not have permission to perform this action.',
          'FORBIDDEN'
        )
      );
    }
    next();
  };
};

// ─── optionalAuth ─────────────────────────────────────────────────────────────
// Attaches user if token exists; continues regardless
const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id);
    if (user && user.isActive) req.user = user;

    next();
  } catch {
    // Invalid token — just continue without user
    next();
  }
};

module.exports = { protect, restrictTo, optionalAuth };
