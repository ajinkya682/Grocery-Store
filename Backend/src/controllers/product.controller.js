'use strict';

const Product = require('../models/Product.model');
const { deleteFile } = require('../services/imagekit.service');
const { NotFoundError, ValidationError } = require('../utils/AppError');
const { PAGINATION } = require('../config/constants');

// ─── GET /api/products ────────────────────────────────────────────────────────
const getAllProducts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE, 1);
    const limit = Math.min(parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    const sortMap = {
      newest: { createdAt: -1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      name: { name: 1 },
    };
    const sort = sortMap[req.query.sort] || { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/products/featured ───────────────────────────────────────────────
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true }).limit(8);
    res.status(200).json({ success: true, data: { products } });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/products/search ─────────────────────────────────────────────────
const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(200).json({ success: true, data: { products: [] } });
    }

    const products = await Product.find(
      { $text: { $search: q }, isActive: true },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20);

    res.status(200).json({ success: true, data: { products } });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/products/categories ─────────────────────────────────────────────
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.status(200).json({ success: true, data: { categories } });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/products/:id ────────────────────────────────────────────────────
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      throw new NotFoundError('Product', 'PRODUCT_NOT_FOUND');
    }
    res.status(200).json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/products (Admin) ───────────────────────────────────────────────
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/products/:id (Admin) ───────────────────────────────────────────
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) throw new NotFoundError('Product', 'PRODUCT_NOT_FOUND');

    res.status(200).json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/products/:id (Admin) ────────────────────────────────────────
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new NotFoundError('Product', 'PRODUCT_NOT_FOUND');

    // Delete images from ImageKit
    if (product.images && product.images.length > 0) {
      await Promise.allSettled(
        product.images
          .filter((img) => img.fileId)
          .map((img) => deleteFile(img.fileId))
      );
    }

    await product.deleteOne();

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/products/bulk-stock (Admin) ───────────────────────────────────
const bulkUpdateStock = async (req, res, next) => {
  try {
    const { updates } = req.body; // [{ productId, stock }]

    const ops = updates.map(({ productId, stock }) => ({
      updateOne: {
        filter: { _id: productId },
        update: { $set: { stock: parseInt(stock) } },
        upsert: false,
      },
    }));

    const result = await Product.bulkWrite(ops, { ordered: false });

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} products updated`,
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getFeaturedProducts,
  searchProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateStock,
};
