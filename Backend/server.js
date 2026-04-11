'use strict';

// Load env FIRST before importing anything else
require('dotenv').config();

const app = require('./src/app');
const { connectDB, closeDB } = require('./src/config/db');
const { seedDefaultCategories } = require('./src/services/category.service');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  await connectDB();
  await seedDefaultCategories();

  const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });

  // ─── Graceful Shutdown ────────────────────────────────────────────────────
  const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await closeDB();
      logger.info('Server closed. Process exiting.');
      process.exit(0);
    });

    // Force exit after 30s if graceful fails
    setTimeout(() => process.exit(1), 30000).unref();
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

// ─── Guard Rails ─────────────────────────────────────────────────────────────
// Never crash on unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Promise Rejection: ${err.message}`, { stack: err.stack });
  // Give the server time to finish in-flight requests, then exit
  process.exit(1);
});

// Never crash on uncaught sync exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

startServer();
