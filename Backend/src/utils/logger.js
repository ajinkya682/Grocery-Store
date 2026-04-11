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
  // Always write errors to file
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'error.log'),
    level: 'error',
    maxsize: 5 * 1024 * 1024, // 5 MB
    maxFiles: 5,
  }),
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'combined.log'),
    maxsize: 10 * 1024 * 1024,
    maxFiles: 5,
  }),
];

// Console transport only in development
if (!isProd) {
  transports.push(
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    })
  );
}

const logger = winston.createLogger({
  level: isProd ? 'warn' : 'debug',
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
