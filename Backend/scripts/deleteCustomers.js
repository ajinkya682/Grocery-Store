'use strict';

// ─────────────────────────────────────────────────────────────────
// Delete Customer Users Script
// Deletes all users with role='user' (keeps admin accounts safe)
// Run: node scripts/deleteCustomers.js
// ─────────────────────────────────────────────────────────────────

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../src/models/User.model');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-store');
    console.log('✅ Connected to MongoDB');

    const result = await User.deleteMany({ role: 'user' });
    console.log(`🗑️  Deleted ${result.deletedCount} customer user(s).`);
    console.log('✅ Admin accounts are untouched.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
};

run();
