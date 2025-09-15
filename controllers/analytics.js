const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = async (req, res, next) => {
  try {
    // Sales by category
    const salesByCategory = await Order.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: '$items',
      },
      {
        $unwind: '$productDetails',
      },
      {
        $match: { status: 'delivered' },
      },
      {
        $group: {
          _id: '$productDetails.category',
          totalSales: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          totalOrders: { $sum: 1 },
          totalQuantity: { $sum: '$items.quantity' },
        },
      },
      {
        $sort: { totalSales: -1 },
      },
    ]);

    // Top selling products
    const topSellingProducts = await Order.aggregate([
      {
        $unwind: '$items',
      },
      {
        $match: { status: 'delivered' },
      },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $project: {
          name: '$product.name',
          category: '$product.category',
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Low stock alerts
    const lowStockProducts = await Product.find({
      stockQuantity: { $lte: 10 },
    }).select('name category stockQuantity');

    res.json({
      success: true,
      data: {
        salesByCategory,
        topSellingProducts,
        lowStockProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSalesAnalytics,
};
