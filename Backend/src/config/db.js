'use strict';

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-store';

let isConnected = false;

const repairIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    logger.info('🔍 [Startup] [IndexRepair] Checking for stale indexes...');

    // Attempt to drop email_1 index
    try {
      await usersCollection.dropIndex('email_1');
      logger.info('✅ [Startup] [IndexRepair] email_1 dropped successfully');
    } catch (e) {
      if (e.codeName === 'IndexNotFound') {
        logger.debug('ℹ️ [Startup] [IndexRepair] email_1 not found, skipping');
      } else {
        logger.warn(`⚠️ [Startup] [IndexRepair] Warning dropping email_1: ${e.message}`);
      }
    }

    // Attempt to drop mobile_1 index
    try {
      await usersCollection.dropIndex('mobile_1');
      logger.info('✅ [Startup] [IndexRepair] mobile_1 dropped successfully');
    } catch (e) {
      if (e.codeName === 'IndexNotFound') {
        logger.debug('ℹ️ [Startup] [IndexRepair] mobile_1 not found, skipping');
      } else {
        logger.warn(`⚠️ [Startup] [IndexRepair] Warning dropping mobile_1: ${e.message}`);
      }
    }

    logger.info('🚀 [Startup] [IndexRepair] Cleanup complete. Mongoose will rebuild indexes if needed.');
  } catch (err) {
    logger.error(`❌ [Startup] [IndexRepair] Fatal error during index repair: ${err.message}`);
  }
};

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      // Mongoose 8+ handles connection pooling automatically
      serverSelectionTimeoutMS: 20000, // 20s before giving up
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Trigger index repair one-time on startup to fix stale non-sparse indexes
    await repairIndexes();
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
