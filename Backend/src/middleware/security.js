'use strict';

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');
const compression = require('compression');
const express = require('express');

const { RATE_LIMIT } = require('../config/constants');
const { morganMiddleware } = require('../utils/logger');

// Parse allowed origins from env
const parseOrigins = () => {
  const raw = process.env.ALLOWED_ORIGINS || 'http://localhost:5173';
  return raw.split(',').map((o) => o.trim().replace(/\/$/, '').toLowerCase());
};

// ─── Global Rate Limiter ──────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: RATE_LIMIT.GLOBAL.WINDOW_MS,
  max: RATE_LIMIT.GLOBAL.MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    errorCode: 'RATE_LIMIT_EXCEEDED',
  },
  skip: (req) => req.path === '/api/health', // Skip health check
});

// ─── Auth-Specific Stricter Rate Limiter ─────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: RATE_LIMIT.AUTH.WINDOW_MS,
  max: RATE_LIMIT.AUTH.MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 15 minutes.',
    errorCode: 'AUTH_RATE_LIMIT_EXCEEDED',
  },
});

// ─── Apply Security Middleware ────────────────────────────────────────────────
const applySecurityMiddleware = (app) => {
  // 1. HTTP request logging
  app.use(morganMiddleware);

  // 2. Secure HTTP headers
  app.use(helmet());

  // 3. CORS — strict origin allowlist
  app.use(
    cors({
      origin: (origin, cb) => {
        const allowed = parseOrigins();
        const incomingOrigin = origin ? origin.replace(/\/$/, '').toLowerCase() : null;
        
        // Allow Postman / curl (no origin) in development
        if (!incomingOrigin || allowed.includes(incomingOrigin) || process.env.NODE_ENV === 'development') {
          cb(null, true);
        } else {
          cb(new Error(`CORS: Origin ${origin} not allowed`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 4. Trust proxy (for Heroku, Render, etc.)
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  // 5. Global rate limiter
  app.use(globalLimiter);

  // 6. Body parsers with size limits
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // 7. NoSQL injection prevention — strips $ and . from req.body/params/query
  app.use(mongoSanitize({ replaceWith: '_' }));

  // 8. XSS sanitization — removes HTML from string values in req.body
  app.use((req, res, next) => {
    if (req.body && typeof req.body === 'object') {
      const sanitize = (obj) => {
        if (typeof obj === 'string') return xss(obj);
        if (Array.isArray(obj)) return obj.map(sanitize);
        if (obj && typeof obj === 'object') {
          return Object.fromEntries(
            Object.entries(obj).map(([k, v]) => [k, sanitize(v)])
          );
        }
        return obj;
      };
      req.body = sanitize(req.body);
    }
    next();
  });

  // 9. Gzip compression
  app.use(compression());
};

module.exports = { applySecurityMiddleware, authLimiter };
