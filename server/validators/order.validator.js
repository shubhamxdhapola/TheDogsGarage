import { z } from 'zod';

const shippingAddressSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Phone is required'),
  email: z.string().email().optional().or(z.literal('')),
  house: z.string().min(1, 'House/Flat number is required'),
  street: z.string().min(1, 'Street address is required'),
  area: z.string().optional().default(''),
  landmark: z.string().optional().default(''),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(6, 'Valid 6-digit Pincode is required'),
});

const orderItemInputSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemInputSchema).min(1, 'At least one item is required'),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(['UPI', 'COD']),
  saveAddress: z.boolean().optional().default(false),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  razorpayOrderId: z.string().min(1, 'Razorpay Order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Razorpay Payment ID is required'),
  razorpaySignature: z.string().optional().default(''),
});
