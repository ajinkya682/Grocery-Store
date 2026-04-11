'use strict';

const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');

// ─── GET /api/dashboard/stats ─────────────────────────────────────────────────
const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalProducts,
      totalUsers,
      totalOrders,
      lowStockCount,
      revenueAgg,
      activeOrdersCount,
      salesTrend,
      categoryRevenue,
      topProducts,
      recentOrders,
    ] = await Promise.all([
      // Counts
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true, role: 'user' }),
      Order.countDocuments(),
      Product.countDocuments({ stock: { $lt: 10 }, isActive: true }),

      // Total revenue from delivered orders
      Order.aggregate([
        { $match: { status: 'Delivered' } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } },
      ]),

      // Active orders (not delivered/cancelled)
      Order.countDocuments({ status: { $in: ['Pending', 'Processing', 'Shipped'] } }),

      // Sales trend — last 7 days
      Order.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'Cancelled' } } },
        {
          $group: {
            _id: {
              $dayOfWeek: '$createdAt',
            },
            sales: { $sum: '$pricing.total' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { '_id': 1 } },
      ]),

      // Revenue by category
      Order.aggregate([
        { $match: { status: 'Delivered' } },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'productInfo',
          },
        },
        { $unwind: '$productInfo' },
        {
          $group: {
            _id: '$productInfo.category',
            value: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          },
        },
        { $sort: { value: -1 } },
        { $limit: 6 },
      ]),

      // Top products by order frequency
      Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            name: { $first: '$items.name' },
            sales: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          },
        },
        { $sort: { sales: -1 } },
        { $limit: 5 },
      ]),

      // Recent 5 orders
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email'),
    ]);

    const dayNames = ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const formattedSalesTrend = salesTrend.map((d) => ({
      day: dayNames[d._id] || d._id,
      sales: Math.round(d.sales),
      orders: d.orders,
    }));

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalProducts,
          totalUsers,
          totalOrders,
          activeOrders: activeOrdersCount,
          lowStockCount,
          totalRevenue: revenueAgg[0]?.total || 0,
        },
        salesTrend: formattedSalesTrend,
        categoryRevenue: categoryRevenue.map((c) => ({ name: c._id, value: c.value })),
        topProducts,
        recentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboardStats };
