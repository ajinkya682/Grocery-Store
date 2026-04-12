'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { BCRYPT_SALT_ROUNDS, ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: false, // Changed to false for mobile-only users
      unique: true,
      sparse: true, // Crucial: Allows multiple nulls without uniqueness collision
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password/PIN is required'],
      minlength: [6, 'Password/PIN must be at least 6 characters'],
      select: false,
    },
    mobile: {
      type: String,
      required: false, // Handled by manual validation below
      unique: true,
      sparse: true,
      trim: true,
      match: [/^[0-9]{10}$/, 'Mobile must be 10 digits'],
    },
    address: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: { values: Object.values(ROLES), message: 'Invalid role' },
      default: ROLES.USER,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
    strict: true,
    toJSON: {
      versionKey: false,
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.refreshToken;
        return ret;
      },
    },
  }
);

// ─── Verification & Sanitization Logic: Role-based identity ───────────────────
userSchema.pre('validate', function(next) {
  // Strip email for customer accounts to prevent sparse index collisions from browser auto-fill
  if (this.role === ROLES.USER) {
    this.email = undefined;
  }

  // Convert empty strings to undefined for sparse index safety (global)
  if (this.email === '') this.email = undefined;
  if (this.mobile === '') this.mobile = undefined;

  // Manual validation logic
  if (this.role === ROLES.ADMIN && !this.email) {
    this.invalidate('email', 'Email is required for administrator accounts.');
  }
  if (this.role === ROLES.USER && !this.mobile) {
    this.invalidate('mobile', 'Mobile number is required for customer accounts.');
  }
  next();
});

// ─── Pre-save hook: hash password only when modified ──────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);
  next();
});

// ─── Instance method: compare password ───────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
