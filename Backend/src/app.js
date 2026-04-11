'use strict';

const express = require('express');
const { applySecurityMiddleware } = require('./middleware/security');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { NotFoundError } = require('./utils/AppError');

const app = express();

// ─── Security & Parsing Middleware ────────────────────────────────────────────
applySecurityMiddleware(app);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', routes);

// ─── 404 Catch-all ────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl}`, 'ROUTE_NOT_FOUND'));
});

// ─── Global Error Handler (MUST be last) ─────────────────────────────────────
app.use(errorHandler);

module.exports = app;
