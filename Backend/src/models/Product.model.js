'use strict';

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    fileId: { type: String, default: '' }, // ImageKit fileId for deletion
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    unit: {
      type: String,
      trim: true,
      default: 'pcs',
    },
    images: [imageSchema],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
  },
  {
    timestamps: true,
    strict: true,
    toJSON: { versionKey: false },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
productSchema.index({ name: 'text', description: 'text', tags: 'text' }); // Full-text search
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });

// ─── Pre-save: auto-generate slug ─────────────────────────────────────────────
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
