import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { Setting } from '../models/Setting.js';

export const generateOrderId = async () => {
  let isUnique = false;
  let orderId = '';
  
  while (!isUnique) {
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5 digits e.g. 84920
    orderId = `TDG-${randomNum}`;
    const existing = await Order.findOne({ orderId });
    if (!existing) {
      isUnique = true;
    }
  }
  
  return orderId;
};

/**
 * Server-side order calculation & inventory validation
 */
export const calculateOrderSummary = async (items = []) => {
  if (!items || items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  let subtotal = 0;
  let totalDiscount = 0;
  const processedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId || item.product);

    if (!product) {
      throw new Error(`Product not found with ID: ${item.productId || item.product}`);
    }

    if (!product.isActive) {
      throw new Error(`Product "${product.name}" is currently not active for sale.`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`);
    }

    const itemPrice = product.price;
    const itemOriginalPrice = product.originalPrice || product.price;
    const itemTotal = itemPrice * item.quantity;
    
    if (itemOriginalPrice > itemPrice) {
      totalDiscount += (itemOriginalPrice - itemPrice) * item.quantity;
    }

    subtotal += itemTotal;

    processedItems.push({
      product: product._id,
      name: product.name,
      sku: product.sku,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      price: itemPrice,
      originalPrice: itemOriginalPrice,
      quantity: item.quantity,
      total: itemTotal,
    });
  }

  const setting = await Setting.findOne({ key: 'store_config' });
  const freeDeliveryThreshold = setting?.freeDeliveryThreshold ?? 999;
  const standardDeliveryFee = setting?.standardDeliveryFee ?? 99;

  // Free delivery on orders meeting or exceeding admin-configured threshold
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryCharge = isFreeDelivery ? 0 : standardDeliveryFee;
  const finalTotal = subtotal + deliveryCharge;

  return {
    items: processedItems,
    subtotal,
    discount: totalDiscount,
    deliveryCharge,
    total: finalTotal,
  };
};

/**
 * Atomic stock deduction
 */
export const deductProductStock = async (items = []) => {
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }
};

/**
 * Restore stock if order is cancelled
 */
export const restoreProductStock = async (items = []) => {
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }
};
