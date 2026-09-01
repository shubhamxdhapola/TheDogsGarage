import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { User } from '../models/User.js';
import {
  generateOrderId,
  calculateOrderSummary,
  deductProductStock,
  restoreProductStock,
} from '../services/order.service.js';
import { createRazorpayOrder, verifyPaymentSignature } from '../services/payment.service.js';
import { createOrderSchema, verifyPaymentSchema } from '../validators/order.validator.js';

export const createOrder = async (req, res, next) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    const { items, shippingAddress, paymentMethod, saveAddress } = validatedData;

    // Recalculate price summary from database
    const calculation = await calculateOrderSummary(items);
    const orderId = await generateOrderId();

    // Estimate delivery: 3-5 days from today
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 4);

    // If user wants to save a new address
    if (saveAddress && req.user && shippingAddress) {
      const user = await User.findById(req.user._id);
      if (user) {
        // Check if an identical address already exists in user's saved addresses
        const isDuplicate = user.addresses.some((addr) => {
          const houseMatch =
            (addr.house || '').trim().toLowerCase() === (shippingAddress.house || '').trim().toLowerCase();
          const streetMatch =
            (addr.street || '').trim().toLowerCase() === (shippingAddress.street || '').trim().toLowerCase();
          const pincodeMatch =
            (addr.pincode || '').toString().trim() === (shippingAddress.pincode || '').toString().trim();
          return houseMatch && streetMatch && pincodeMatch;
        });

        if (!isDuplicate) {
          user.addresses.push({
            name: shippingAddress.name,
            phone: shippingAddress.phone,
            house: shippingAddress.house,
            street: shippingAddress.street,
            area: shippingAddress.area || '',
            landmark: shippingAddress.landmark || '',
            city: shippingAddress.city,
            state: shippingAddress.state,
            pincode: shippingAddress.pincode,
            type: 'HOME',
            isDefault: user.addresses.length === 0,
          });
          await user.save();
        }
      }
    }

    const order = new Order({
      orderId,
      user: req.user._id,
      items: calculation.items,
      shippingAddress,
      subtotal: calculation.subtotal,
      discount: calculation.discount,
      deliveryCharge: calculation.deliveryCharge,
      total: calculation.total,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
      orderStatus: 'PLACED',
      statusHistory: [{ status: 'PLACED', timestamp: new Date(), note: 'Order successfully created' }],
      estimatedDeliveryDate,
    });

    if (paymentMethod === 'COD') {
      await deductProductStock(calculation.items);
      await order.save();

      // Clear user cart
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

      return res.status(201).json({
        message: 'Order placed successfully with Cash on Delivery!',
        order,
      });
    }

    // For UPI / Online payment:
    const razorpayOrder = await createRazorpayOrder({
      amount: calculation.total,
      receipt: orderId,
      notes: { orderId, userId: req.user._id.toString() },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(201).json({
      message: 'Order initiated. Please complete payment.',
      order,
      razorpayOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const validatedData = verifyPaymentSchema.parse(req.body);
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = validatedData;

    const order = await Order.findOne({ orderId, user: req.user._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isValid = verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      order.paymentStatus = 'FAILED';
      await order.save();
      return res.status(400).json({ message: 'Payment verification failed. Invalid signature.' });
    }

    // Deduct stock and finalize order
    await deductProductStock(order.items);

    order.paymentStatus = 'COMPLETED';
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.statusHistory.push({
      status: 'PROCESSING',
      timestamp: new Date(),
      note: 'Payment verified and order processing started',
    });
    order.orderStatus = 'PROCESSING';
    await order.save();

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    return res.status(200).json({
      message: 'Payment verified successfully and order confirmed!',
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments({ user: req.user._id }),
    ]);

    return res.status(200).json({
      orders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query = { user: req.user._id };

    if (id.startsWith('TDG-')) {
      query.orderId = id;
    } else if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = id;
    } else {
      query.orderId = id;
    }

    // Admins can view any order
    if (req.user.role === 'ADMIN') {
      delete query.user;
    }

    const order = await Order.findOne(query).populate('user', 'name phone email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      orderId: id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.orderStatus !== 'PLACED') {
      return res.status(400).json({
        message: `Order cannot be cancelled in '${order.orderStatus}' status.`,
      });
    }

    order.orderStatus = 'CANCELLED';
    order.statusHistory.push({
      status: 'CANCELLED',
      timestamp: new Date(),
      note: 'Cancelled by customer',
    });

    if (order.paymentStatus === 'COMPLETED') {
      order.paymentStatus = 'REFUNDED';
    }

    await restoreProductStock(order.items);
    await order.save();

    return res.status(200).json({
      message: 'Order cancelled successfully and inventory restored.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

export const retryPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    let query = { user: req.user._id };

    if (id.startsWith('TDG-')) {
      query.orderId = id;
    } else if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = id;
    } else {
      query.orderId = id;
    }

    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus === 'COMPLETED') {
      return res.status(400).json({ message: 'This order has already been paid.' });
    }

    if (order.orderStatus === 'CANCELLED') {
      return res.status(400).json({ message: 'Cannot pay for a cancelled order.' });
    }

    // Generate new Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amount: order.total,
      receipt: order.orderId,
      notes: { orderId: order.orderId, userId: req.user._id.toString() },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(200).json({
      message: 'Payment retry initiated.',
      order,
      razorpayOrder,
    });
  } catch (error) {
    next(error);
  }
};
