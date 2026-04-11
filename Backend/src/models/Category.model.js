'use strict';

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { versionKey: false },
  }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
