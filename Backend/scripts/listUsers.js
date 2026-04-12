'use strict';

// ─────────────────────────────────────────────────────────────────
// List All Users Script
// Run: node scripts/listUsers.js
// ─────────────────────────────────────────────────────────────────

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../src/models/User.model');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-store');
    console.log('✅ Connected to MongoDB');

    const users = await User.find({}, { name: 1, email: 1, mobile: 1, role: 1, createdAt: 1 }).lean();

    if (users.length === 0) {
      console.log('ℹ️  No users found in the database.');
    } else {
      console.log(`\n📋 Found ${users.length} user(s):\n`);
      users.forEach((u, i) => {
        console.log(`${i + 1}. [${u.role.toUpperCase()}] ${u.name}`);
        console.log(`   📧 Email:  ${u.email || '—'}`);
        console.log(`   📱 Mobile: ${u.mobile || '—'}`);
        console.log(`   🕐 Created: ${u.createdAt?.toISOString().slice(0, 10)}`);
        console.log(`   🆔 ID: ${u._id}\n`);
      });
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
};

run();
