'use strict';

const winston = require('winston');
const path = require('path');
const morgan = require('morgan');

const isProd = process.env.NODE_ENV === 'production';

// ─── Winston Logger ───────────────────────────────────────────────────────────

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}]: ${stack || message}`;
});

const transports = [
  new winston.transports.Console({
    format: combine(
      colorize(),
      logFormat
    ),
  }),
];

// File transport only in non-production environments to avoid issues with ephemeral storage
if (!isProd) {
  transports.push(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
    })
  );
}

const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports,
  exitOnError: false,
});

// ─── Morgan HTTP Logger ───────────────────────────────────────────────────────

// Custom stream: pipe morgan output through winston
const morganStream = {
  write: (message) => logger.http(message.trim()),
};

const morganMiddleware = morgan(
  isProd ? 'combined' : 'dev',
  { stream: morganStream }
);

module.exports = logger;
module.exports.morganMiddleware = morganMiddleware;
