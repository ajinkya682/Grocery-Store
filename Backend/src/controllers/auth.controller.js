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
        address: user.address,
        pincode: user.pincode,
      },
      accessToken,
      refreshToken,
    },
  });
};

// ─── POST /api/auth/register ──────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const role = (req.body.role || 'user').toLowerCase();

    // ─── Log received payload for debugging (redact password) ─────────────────
    logger.info(`[register] role=${role} body_keys=${Object.keys(req.body).join(',')}`);

    // ─── Build a strictly role-scoped payload ─────────────────────────────────
    // Customer accounts: ONLY mobile — email is NEVER stored/checked for users
    // Admin accounts:    ONLY email  — mobile is not required
    let cleanedData;

    if (role === 'admin') {
      const { name, email, password, address, pincode } = req.body;
      if (!email || email.trim() === '') {
        throw new ConflictError('Email is required for admin accounts', 'EMAIL_REQUIRED');
      }
      const normalizedEmail = email.toLowerCase().trim();
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        logger.warn(`[register] Conflict: Admin email already registered: ${normalizedEmail}`);
        throw new ConflictError('Email address already registered', 'EMAIL_TAKEN');
      }
      cleanedData = { name, email: normalizedEmail, password, role: 'admin' };
      if (address) cleanedData.address = address;
      if (pincode) cleanedData.pincode = pincode;
    } else {
      // role === 'user' — email is completely ignored and stripped
      const { name, password, mobile, address, pincode } = req.body;
      if (!mobile || mobile.trim() === '') {
        throw new ConflictError('Mobile number is required for customer accounts', 'MOBILE_REQUIRED');
      }
      const normalizedMobile = mobile.trim();
      const existing = await User.findOne({ mobile: normalizedMobile });
      if (existing) {
        logger.warn(`[register] Conflict: Customer mobile already registered: ${normalizedMobile}`);
        throw new ConflictError('Mobile number already registered', 'MOBILE_TAKEN');
      }
      // Explicitly excluded 'email' from cleanedData to prevent collisions
      cleanedData = { name, password, mobile: normalizedMobile, role: 'user' };
      if (address) cleanedData.address = address;
      if (pincode) cleanedData.pincode = pincode;
    }

    const user = await User.create(cleanedData);
    logger.info(`[register] SUCCESS: ${role} created. Mobile=${cleanedData.mobile || 'N/A'} Email=${cleanedData.email || 'N/A'}`);
    sendTokenResponse(user, 201, res);
  } catch (err) {
    if (err.code === 11000) {
      logger.error(`[register] CONFLICT DETECTED: req.body.mobile=${req.body.mobile} keyValue=${JSON.stringify(err.keyValue)}`);
    } else {
      logger.error(`[register] ERROR: ${err.message}`);
    }
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
          address: user.address,
          pincode: user.pincode,
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

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/reset-pin ────────────────────────────────────────────────
const resetPin = async (req, res, next) => {
  try {
    const { name, mobile, newPin } = req.body;

    // Find customer by mobile and name (case-insensitive for safety)
    const user = await User.findOne({
      mobile: mobile.trim(),
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      role: ROLES.USER
    });

    if (!user) {
      throw new AuthError('No account found with matching Name and Mobile number.', 'USER_NOT_FOUND');
    }

    // Update PIN (password field)
    user.password = newPin;
    await user.save();

    logger.info(`PIN reset successful for User: ${mobile}`);

    res.status(200).json({
      success: true,
      message: 'PIN updated successfully. Please login with your new PIN.'
    });
  } catch (err) {
    logger.error(`[resetPin] ERROR: ${err.message} [mobile=${req.body.mobile}]`);
    next(err);
  }
};

module.exports = { register, login, refreshToken, logout, getMe, resetPin };
