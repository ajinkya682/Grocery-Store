'use strict';

// ─────────────────────────────────────────────────────────────────
// Admin Seed Script
// Creates the initial admin account in MongoDB
// Run ONCE: node scripts/seedAdmin.js
// ─────────────────────────────────────────────────────────────────

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../src/models/User.model');
const StoreSettings = require('../src/models/StoreSettings.model');
const logger = require('../src/utils/logger');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-store');
    console.log('✅ Connected to MongoDB');

    // Seed Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@shop.com';
    const existing = await User.findOne({ email: adminEmail });

    if (!existing) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Store Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin',
        isActive: true,
      });
      console.log(`✅ Admin created: ${adminEmail}`);
    } else {
      console.log(`ℹ️  Admin already exists: ${adminEmail}`);
    }

    // Seed Store Settings (singleton)
    await StoreSettings.getSingleton();
    console.log('✅ Store settings initialized');

    await mongoose.disconnect();
    console.log('✅ Seeding complete. Disconnected from MongoDB.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
