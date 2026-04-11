'use strict';

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-store';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      // Mongoose 8+ handles connection pooling automatically
      serverSelectionTimeoutMS: 10000, // 10s before giving up
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`❌ MongoDB connection failed: ${err.message}`);
    // Exit process with failure — process managers (PM2, Docker) will restart
    process.exit(1);
  }
};

// Log connection events
mongoose.connection.on('disconnected', () => {
  isConnected = false;
  logger.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  logger.info('🔄 MongoDB reconnected');
});

// Graceful shutdown
const closeDB = async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed (graceful shutdown)');
};

module.exports = { connectDB, closeDB };
