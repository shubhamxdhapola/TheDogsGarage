import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  sku: { type: String, default: '' },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  quantity: { type: Number, required: true, min: 1 },
  total: { type: Number, required: true },
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  house: { type: String, required: true },
  street: { type: String, required: true },
  area: { type: String },
  landmark: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
}, { _id: false });

const orderStatusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['PLACED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  items: [orderItemSchema],
  shippingAddress: {
    type: shippingAddressSchema,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  deliveryCharge: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'COD'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING',
    index: true,
  },
  orderStatus: {
    type: String,
    enum: ['PLACED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
    default: 'PLACED',
    index: true,
  },
  statusHistory: [orderStatusHistorySchema],
  razorpayOrderId: {
    type: String,
    default: '',
  },
  razorpayPaymentId: {
    type: String,
    default: '',
  },
  razorpaySignature: {
    type: String,
    default: '',
  },
  estimatedDeliveryDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

export const Order = mongoose.model('Order', orderSchema);
