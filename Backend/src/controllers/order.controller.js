'use strict';

const mongoose = require('mongoose');
const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const { NotFoundError, ValidationError, ForbiddenError } = require('../utils/AppError');
const { ORDER_VALID_TRANSITIONS, PAGINATION } = require('../config/constants');
const logger = require('../utils/logger');

// ─── POST /api/orders ─────────────────────────────────────────────────────────
// Uses MongoDB transaction for atomic stock decrement + order creation
const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, shippingAddress, paymentMethod = 'COD', notes } = req.body;

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product || !product.isActive) {
        await session.abortTransaction();
        return next(new ValidationError(`Product "${item.productId}" not found or unavailable`, 'PRODUCT_UNAVAILABLE'));
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction();
        return next(new ValidationError(
          `Insufficient stock for "${product.name}". Available: ${product.stock}`,
          'INSUFFICIENT_STOCK'
        ));
      }

      // Atomically decrement stock
      await Product.updateOne(
        { _id: product._id },
        { $inc: { stock: -item.quantity } },
        { session }
      );

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0]?.url || '',
      });
    }

    // Fetch store settings for delivery logic
    const StoreSettings = require('../models/StoreSettings.model');
    const settings = await StoreSettings.getSingleton();
    const freeThreshold = settings?.delivery?.freeDeliveryMinOrder || 499;

    const deliveryFee = subtotal >= freeThreshold ? 0 : 40;
    const total = subtotal + deliveryFee;

    const [order] = await Order.create(
      [
        {
          user: req.user._id,
          items: orderItems,
          pricing: { subtotal, deliveryFee, discount: 0, total },
          shippingAddress,
          paymentMethod,
          notes,
          statusHistory: [{ status: 'Pending', note: 'Order placed' }],
        },
      ],
      { session }
    );

    await session.commitTransaction();
    logger.info(`Order created: ${order.orderNumber} by user ${req.user._id}`);

    res.status(201).json({ success: true, data: { order } });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

// ─── GET /api/orders/my ───────────────────────────────────────────────────────
const getMyOrders = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('items.product', 'name images'),
      Order.countDocuments({ user: req.user._id }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/orders (Admin) ──────────────────────────────────────────────────
const getAllOrders = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email mobile'),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/orders/:id ──────────────────────────────────────────────────────
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email mobile')
      .populate('items.product', 'name images');

    if (!order) throw new NotFoundError('Order', 'ORDER_NOT_FOUND');

    // Non-admins can only see their own orders
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      throw new ForbiddenError('Access denied', 'FORBIDDEN');
    }

    res.status(200).json({ success: true, data: { order } });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/orders/:id/status (Admin) ─────────────────────────────────────
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) throw new NotFoundError('Order', 'ORDER_NOT_FOUND');

    // Enforce valid lifecycle transitions
    const validNext = ORDER_VALID_TRANSITIONS[order.status];
    if (!validNext.includes(status)) {
      throw new ValidationError(
        `Cannot transition from "${order.status}" to "${status}"`,
        'INVALID_STATUS_TRANSITION'
      );
    }

    order.status = status;
    order.statusHistory.push({ status, note: note || '' });
    await order.save();

    logger.info(`Order ${order.orderNumber} status → ${status}`);
    res.status(200).json({ success: true, data: { order } });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/orders/:id/cancel (User) ─────────────────────────────────────
const cancelOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(req.params.id).session(session);
    if (!order) throw new NotFoundError('Order', 'ORDER_NOT_FOUND');

    if (order.user.toString() !== req.user._id.toString()) {
      throw new ForbiddenError('You can only cancel your own orders', 'FORBIDDEN');
    }

    if (!ORDER_VALID_TRANSITIONS[order.status].includes('Cancelled')) {
      throw new ValidationError(`Order in "${order.status}" status cannot be cancelled`, 'CANNOT_CANCEL');
    }

    // Restore stock
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    order.status = 'Cancelled';
    order.statusHistory.push({ status: 'Cancelled', note: 'Cancelled by user' });
    await order.save({ session });

    await session.commitTransaction();
    res.status(200).json({ success: true, data: { order } });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
