'use strict';

const express = require('express');
const router = express.Router();

const { register, login, refreshToken, logout, getMe } = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/security');
const { registerRules, loginRules, refreshTokenRules } = require('../validators/auth.validator');

router.post('/register', authLimiter, validate(registerRules), register);
router.post('/login', authLimiter, validate(loginRules), login);
router.post('/refresh', validate(refreshTokenRules), refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
