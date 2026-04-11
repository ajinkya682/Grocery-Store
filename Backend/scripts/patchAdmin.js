// scripts/patchAdmin.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User.model');

const patch = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@shop.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

    // Find admin
    const admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      console.log('❌ Admin user not found. Run seedAdmin.js first.');
    } else {
      admin.password = adminPassword;
      await admin.save();
      console.log(`✅ Admin password updated to match .env for: ${adminEmail}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Patch failed:', err.message);
    process.exit(1);
  }
};

patch();
