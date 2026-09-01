import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Pet } from '../models/Pet.js';
import { Setting } from '../models/Setting.js';
import { restoreProductStock } from '../services/order.service.js';

/**
 * GET /api/admin/dashboard — Real aggregated dashboard statistics
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      pendingOrders,
      totalCustomers,
      availablePets,
      totalPets,
      adoptedPets,
      lowStockProducts,
      recentOrders,
      revenueResult,
      itemsSoldResult,
      statusCounts,
      categorySalesResult,
      // 30 days raw grouped by date
      dailyAggregates,
      // Today metrics
      todayOrdersCount,
      todayRevenueResult,
      todayDeliveredCount,
      todayCancelledCount,
      // Period comparisons for real trends
      current30dRevenueResult,
      prev30dRevenueResult,
      current30dOrdersCount,
      prev30dOrdersCount,
      current30dCustomersCount,
      prev30dCustomersCount,
    ] = await Promise.all([
      // Total orders count
      Order.countDocuments(),

      // Pending / in-progress orders
      Order.countDocuments({ orderStatus: { $in: ['PLACED', 'PROCESSING'] } }),

      // Total registered customers
      User.countDocuments({ role: { $ne: 'admin' } }),

      // Available pets
      Pet.countDocuments({ isAvailable: true }),

      // Total pets in catalog
      Pet.countDocuments(),

      // Adopted pets
      Pet.countDocuments({ $or: [{ isAdopted: true }, { isAvailable: false }] }),

      // Low stock products alert (stock <= 20 or lowest stock)
      Product.find({ isActive: true })
        .sort({ stock: 1 })
        .limit(6)
        .select('name stock price images category'),

      // Recent 8 orders with user info
      Order.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate('user', 'name email phone avatar')
        .select('orderId user total paymentMethod paymentStatus orderStatus createdAt items shippingAddress'),

      // Total all-time revenue (non-cancelled orders)
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'CANCELLED' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),

      // Total products/units sold
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'CANCELLED' } } },
        { $unwind: '$items' },
        { $group: { _id: null, totalQty: { $sum: '$items.quantity' } } },
      ]),

      // Order status breakdown
      Order.aggregate([
        { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
      ]),

      // Category sales breakdown
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'CANCELLED' } } },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'productDoc',
          },
        },
        { $unwind: { path: '$productDoc', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: { $ifNull: ['$productDoc.category', 'Accessories'] },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            count: { $sum: '$items.quantity' },
          },
        },
        { $sort: { revenue: -1 } },
      ]),

      // Daily orders & revenue for past 30 days
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: {
              $sum: {
                $cond: [{ $ne: ['$orderStatus', 'CANCELLED'] }, '$total', 0],
              },
            },
            orders: { $sum: 1 },
            completed: {
              $sum: {
                $cond: [{ $eq: ['$orderStatus', 'DELIVERED'] }, 1, 0],
              },
            },
            cancelled: {
              $sum: {
                $cond: [{ $eq: ['$orderStatus', 'CANCELLED'] }, 1, 0],
              },
            },
          },
        },
      ]),

      // Today's orders count
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),

      // Today's revenue
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfToday }, orderStatus: { $ne: 'CANCELLED' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),

      // Today's delivered orders
      Order.countDocuments({ createdAt: { $gte: startOfToday }, orderStatus: 'DELIVERED' }),

      // Today's cancelled orders
      Order.countDocuments({ createdAt: { $gte: startOfToday }, orderStatus: 'CANCELLED' }),

      // Current 30d revenue
      Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, orderStatus: { $ne: 'CANCELLED' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),

      // Previous 30d revenue (60d to 30d)
      Order.aggregate([
        { $match: { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }, orderStatus: { $ne: 'CANCELLED' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),

      // Current 30d orders
      Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

      // Previous 30d orders
      Order.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),

      // Current 30d customers
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo }, role: { $ne: 'admin' } }),

      // Previous 30d customers
      User.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }, role: { $ne: 'admin' } }),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;
    const productsSold = itemsSoldResult[0]?.totalQty || 0;
    const todayRevenue = todayRevenueResult[0]?.total || 0;

    // Real Trend Calculations
    const calcTrend = (curr, prev) => {
      if (prev === 0) {
        return curr > 0 ? { trend: `+${curr > 1 ? 100 : 0}%`, isPositive: true } : { trend: '+0.0%', isPositive: true };
      }
      const pct = (((curr - prev) / prev) * 100).toFixed(1);
      const isPos = Number(pct) >= 0;
      return {
        trend: `${isPos ? '+' : ''}${pct}%`,
        isPositive: isPos,
      };
    };

    const current30dRev = current30dRevenueResult[0]?.total || 0;
    const prev30dRev = prev30dRevenueResult[0]?.total || 0;

    const revTrend = calcTrend(current30dRev, prev30dRev);
    const ordersTrend = calcTrend(current30dOrdersCount, prev30dOrdersCount);
    const customersTrend = calcTrend(current30dCustomersCount, prev30dCustomersCount);

    // Build Continuous 30-Day and 7-Day Time Series
    const dateMap = new Map();
    dailyAggregates.forEach((d) => {
      dateMap.set(d._id, d);
    });

    const last30DaysData = [];
    const last7DaysData = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0];
      const shortLabel = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      const weekdayLabel = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const fullDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

      const dayRecord = dateMap.get(key);
      const revenue = dayRecord?.revenue || 0;
      const orders = dayRecord?.orders || 0;
      const completed = dayRecord?.completed || 0;
      const cancelled = dayRecord?.cancelled || 0;
      const other = Math.max(0, orders - completed);

      const entry = {
        date: shortLabel,
        weekday: weekdayLabel,
        fullDate,
        rawDate: key,
        revenue,
        orders,
        completed,
        cancelled,
        other,
      };

      last30DaysData.push(entry);

      if (i < 7) {
        last7DaysData.push(entry);
      }
    }

    // Status colors & formatting
    const statusColorMap = {
      DELIVERED: '#10b981',
      PROCESSING: '#f97316',
      SHIPPED: '#3b82f6',
      PLACED: '#f59e0b',
      OUT_FOR_DELIVERY: '#8b5cf6',
      CANCELLED: '#f43f5e',
    };

    const ordersOverview = statusCounts.map((s) => ({
      name: s._id ? s._id.charAt(0) + s._id.slice(1).toLowerCase().replace(/_/g, ' ') : 'Pending',
      rawStatus: s._id,
      value: s.count,
      color: statusColorMap[s._id] || '#64748b',
    }));

    // Top categories with percentages
    const catColors = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];
    const totalCatRevenue = categorySalesResult.reduce((acc, c) => acc + c.revenue, 0) || (totalRevenue || 1);

    const topSellingCategories = categorySalesResult.map((c, idx) => ({
      name: c._id || 'Accessories',
      revenue: c.revenue,
      percentage: Number(((c.revenue / totalCatRevenue) * 100).toFixed(1)),
      color: catColors[idx % catColors.length],
    }));

    return res.status(200).json({
      metrics: {
        totalRevenue: { value: totalRevenue, trend: revTrend.trend, isPositive: revTrend.isPositive },
        totalOrders: { value: totalOrders, trend: ordersTrend.trend, isPositive: ordersTrend.isPositive },
        pendingOrders: { value: pendingOrders, trend: '-0.0%', isPositive: true },
        totalCustomers: { value: totalCustomers, trend: customersTrend.trend, isPositive: customersTrend.isPositive },
        productsSold: { value: productsSold, trend: ordersTrend.trend, isPositive: ordersTrend.isPositive },
        availablePets: { value: availablePets, trend: '+0.0%', isPositive: true },
        todayRevenue: { value: todayRevenue },
        todayOrders: { value: todayOrdersCount },
        todayDelivered: { value: todayDeliveredCount },
        todayCancelled: { value: todayCancelledCount },
      },
      revenueOverview: last30DaysData,
      last7DaysData,
      ordersOverview: ordersOverview.length > 0 ? ordersOverview : [{ name: 'Pending', value: 0, color: '#f59e0b' }],
      recentOrders,
      topSellingCategories: topSellingCategories.length > 0 ? topSellingCategories : [
        { name: 'Dog Food & Accessories', revenue: totalRevenue, percentage: 100, color: '#6366f1' },
      ],
      lowStockAlert: lowStockProducts,
      petsSummary: {
        total: totalPets,
        available: availablePets,
        adopted: adoptedPets,
        notAvailable: Math.max(0, totalPets - availablePets - adoptedPets),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/analytics — Dynamic time-series analytics
 */
export const getAnalytics = async (req, res, next) => {
  try {
    const { range = '30d' } = req.query;

    let startDate = new Date();
    if (range === '7d') startDate.setDate(startDate.getDate() - 7);
    else if (range === '30d') startDate.setDate(startDate.getDate() - 30);
    else if (range === '90d') startDate.setDate(startDate.getDate() - 90);
    else if (range === '1y') startDate.setFullYear(startDate.getFullYear() - 1);
    else startDate = new Date(0); // all time

    const [
      revenueResult,
      totalOrdersCount,
      revenueTimeline,
      categorySales,
      statusBreakdown,
    ] = await Promise.all([
      // Total Revenue in window
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, orderStatus: { $ne: 'CANCELLED' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),

      // Total Orders in window
      Order.countDocuments({ createdAt: { $gte: startDate } }),

      // Revenue & orders over time
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, orderStatus: { $ne: 'CANCELLED' } } },
        {
          $group: {
            _id: { $dateToString: { format: '%d %b', date: '$createdAt' } },
            revenue: { $sum: '$total' },
            orders: { $sum: 1 },
            dateSort: { $min: '$createdAt' },
          },
        },
        { $sort: { dateSort: 1 } },
      ]),

      // Category breakdown in window
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, orderStatus: { $ne: 'CANCELLED' } } },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'productDoc',
          },
        },
        { $unwind: { path: '$productDoc', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: { $ifNull: ['$productDoc.category', 'Accessories'] },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          },
        },
        { $sort: { revenue: -1 } },
      ]),

      // Status breakdown
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
      ]),
    ]);

    return res.status(200).json({
      range,
      totalRevenue: revenueResult[0]?.total || 0,
      totalOrders: totalOrdersCount,
      timeline: revenueTimeline.map((t) => ({ date: t._id, revenue: t.revenue, orders: t.orders })),
      categories: categorySales.map((c) => ({ category: c._id, revenue: c.revenue })),
      statuses: statusBreakdown.map((s) => ({ status: s._id, count: s.count })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/orders — Paginated, searchable orders list
 */
export const getAdminOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search, paymentMethod } = req.query;

    const query = {};
    if (status && status !== 'All') {
      query.orderStatus = status;
    }
    if (paymentMethod && paymentMethod !== 'All') {
      query.paymentMethod = paymentMethod;
    }
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'shippingAddress.name': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('user', 'name email phone avatar'),
      Order.countDocuments(query),
    ]);

    return res.status(200).json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/orders/:id/status — Update order status
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ['PLACED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status value' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = orderStatus;

    if (orderStatus === 'DELIVERED') {
      order.deliveredAt = new Date();
      if (order.paymentMethod === 'COD') {
        order.paymentStatus = 'COMPLETED';
      }
    }

    if (orderStatus === 'CANCELLED' && previousStatus !== 'CANCELLED') {
      order.cancelledAt = new Date();
      await restoreProductStock(order.items);
    }

    await order.save();

    return res.status(200).json({
      message: `Order status updated to ${orderStatus}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/customers — Paginated customer list with lifetime metrics
 */
export const getAdminCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const query = {
      $or: [
        { role: { $in: ['CUSTOMER', 'customer', 'user', 'USER'] } },
        { role: { $nin: ['ADMIN', 'admin'] } },
      ],
    };
    if (search) {
      query.$and = [
        {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).select('-password'),
      User.countDocuments(query),
    ]);

    // Aggregate spend per customer
    const userIds = users.map((u) => u._id);
    const orderAgg = await Order.aggregate([
      { $match: { user: { $in: userIds }, orderStatus: { $ne: 'CANCELLED' } } },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$total' },
          ordersCount: { $sum: 1 },
        },
      },
    ]);

    const aggMap = new Map();
    orderAgg.forEach((a) => aggMap.set(a._id.toString(), a));

    const customersWithMetrics = users.map((u) => {
      const agg = aggMap.get(u._id.toString()) || { totalSpent: 0, ordersCount: 0 };
      return {
        ...u.toObject(),
        totalSpent: agg.totalSpent,
        ordersCount: agg.ordersCount,
      };
    });

    return res.status(200).json({
      customers: customersWithMetrics,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/settings — Get store settings
 */
export const getAdminSettings = async (req, res, next) => {
  try {
    let setting = await Setting.findOne({ key: 'store_config' });
    if (!setting) {
      setting = await Setting.create({ key: 'store_config' });
    }
    return res.status(200).json({ success: true, settings: setting });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/settings — Update store settings
 */
export const updateAdminSettings = async (req, res, next) => {
  try {
    let setting = await Setting.findOneAndUpdate(
      { key: 'store_config' },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    return res.status(200).json({
      success: true,
      message: 'Store & Business configuration saved successfully!',
      settings: setting,
    });
  } catch (error) {
    next(error);
  }
};

// Aliases matching route imports
export const getAllOrders = getAdminOrders;
export const getAllCustomers = getAdminCustomers;
