'use strict';

const User = require('../models/User.model');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../services/auth.service');
const { AuthError, ConflictError, NotFoundError } = require('../utils/AppError');
const { ROLES } = require('../config/constants');
const logger = require('../utils/logger');

// ─── Helper: Send token response ──────────────────────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  return res.status(statusCode).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
      },
      accessToken,
      refreshToken,
    },
  });
};

// ─── POST /api/auth/register ──────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password, mobile, role = 'user' } = req.body;

    // Check for existing by unique identifier
    if (role === 'admin' && email) {
       const existing = await User.findOne({ email });
       if (existing) throw new ConflictError('Email already registered', 'EMAIL_TAKEN');
    } else if (mobile) {
       const existing = await User.findOne({ mobile });
       if (existing) throw new ConflictError('Mobile number already registered', 'MOBILE_TAKEN');
    }

    const user = await User.create({ name, email, password, mobile, role });

    logger.info(`New ${role} registered: ${email || mobile}`);
    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    // Detect if identifier is a mobile number (10 digits) or email
    const isMobile = /^[0-9]{10}$/.test(identifier);
    const query = isMobile ? { mobile: identifier } : { email: identifier.toLowerCase() };

    // Fetch user with password
    const user = await User.findOne(query).select('+password +isActive');
    
    if (!user || !user.isActive) {
      throw new AuthError('Invalid credentials. Please check your details.', 'INVALID_CREDENTIALS');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AuthError('Invalid credentials. Please check your details.', 'INVALID_CREDENTIALS');
    }

    // Save refresh token in DB
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    logger.info(`User logged in via ${isMobile ? 'Mobile' : 'Email'}: ${identifier} [${user.role}]`);

    const accessToken = generateAccessToken(user._id, user.role);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/refresh ───────────────────────────────────────────────────
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('+refreshToken +isActive');

    if (!user || !user.isActive || user.refreshToken !== token) {
      throw new AuthError('Invalid or expired refresh token', 'REFRESH_TOKEN_INVALID');
    }

    // Rotate refresh token
    const newRefresh = generateRefreshToken(user._id);
    user.refreshToken = newRefresh;
    await user.save({ validateBeforeSave: false });

    const newAccess = generateAccessToken(user._id, user.role);

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccess,
        refreshToken: newRefresh,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new NotFoundError('User', 'USER_NOT_FOUND');

    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refreshToken, logout, getMe };
