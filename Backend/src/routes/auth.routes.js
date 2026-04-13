'use strict';

const express = require('express');
const router = express.Router();

const { register, login, refreshToken, logout, getMe, resetPin } = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/security');
const { registerRules, loginRules, refreshTokenRules, resetPinRules } = require('../validators/auth.validator');

router.post('/register', authLimiter, validate(registerRules), register);
router.post('/login', authLimiter, validate(loginRules), login);
router.post('/refresh', validate(refreshTokenRules), refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/reset-pin', authLimiter, validate(resetPinRules), resetPin);

module.exports = router;
