import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { Setting } from '../models/Setting.js';

/**
 * Helper to populate and compute live cart totals
 */
const formatCartResponse = async (cart) => {
  if (!cart || !cart.items || cart.items.length === 0) {
    return {
      items: [],
      subtotal: 0,
      discount: 0,
      deliveryCharge: 0,
      total: 0,
      totalItemsCount: 0,
    };
  }

  const populatedCart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: 'name slug sku price originalPrice discount stock images isActive',
  });

  const validItems = [];
  let subtotal = 0;
  let totalDiscount = 0;
  let totalItemsCount = 0;

  for (const item of populatedCart.items) {
    const product = item.product;
    if (product && product.isActive) {
      const quantity = Math.min(item.quantity, Math.max(1, product.stock));
      const price = product.price;
      const originalPrice = product.originalPrice || product.price;
      const lineTotal = price * quantity;

      if (originalPrice > price) {
        totalDiscount += (originalPrice - price) * quantity;
      }

      subtotal += lineTotal;
      totalItemsCount += quantity;

      validItems.push({
        product: {
          _id: product._id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          price: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          stock: product.stock,
          image: product.images && product.images.length > 0 ? product.images[0] : '',
        },
        quantity,
        price,
        lineTotal,
      });
    }
  }

  const setting = await Setting.findOne({ key: 'store_config' });
  const freeDeliveryThreshold = setting?.freeDeliveryThreshold ?? 999;
  const standardDeliveryFee = setting?.standardDeliveryFee ?? 99;

  const deliveryCharge = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : standardDeliveryFee;
  const total = subtotal + deliveryCharge;

  return {
    items: validItems,
    subtotal,
    discount: totalDiscount,
    deliveryCharge,
    total,
    totalItemsCount,
  };
};

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const formattedCart = await formatCartResponse(cart);
    return res.status(200).json({ cart: formattedCart });
  } catch (error) {
    next(error);
  }
};

export const syncCart = async (req, res, next) => {
  try {
    const { guestItems = [] } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    for (const gItem of guestItems) {
      const productId = gItem.productId || gItem.product?._id || gItem.product;
      const quantity = Number(gItem.quantity) || 1;

      const product = await Product.findById(productId);
      if (product && product.isActive && product.stock > 0) {
        const existingIndex = cart.items.findIndex(
          (item) => item.product.toString() === productId.toString()
        );

        if (existingIndex > -1) {
          cart.items[existingIndex].quantity = Math.min(
            cart.items[existingIndex].quantity + quantity,
            product.stock
          );
        } else {
          cart.items.push({
            product: productId,
            quantity: Math.min(quantity, product.stock),
          });
        }
      }
    }

    await cart.save();
    const formattedCart = await formatCartResponse(cart);
    return res.status(200).json({ message: 'Cart synced successfully', cart: formattedCart });
  } catch (error) {
    next(error);
  }
};

export const addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found or currently unavailable' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: `Only ${product.stock} items available in stock.`
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          message: `Cannot add more. Max available stock is ${product.stock}.`
        });
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();
    const formattedCart = await formatCartResponse(cart);
    return res.status(200).json({ message: 'Item added to cart', cart: formattedCart });
  } catch (error) {
    next(error);
  }
};

export const updateItemQuantity = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (Number(quantity) < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (Number(quantity) > product.stock) {
      return res.status(400).json({
        message: `Requested quantity exceeds available stock of ${product.stock}.`
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = Number(quantity);
    await cart.save();

    const formattedCart = await formatCartResponse(cart);
    return res.status(200).json({ message: 'Cart updated', cart: formattedCart });
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    await cart.save();
    const formattedCart = await formatCartResponse(cart);
    return res.status(200).json({ message: 'Item removed from cart', cart: formattedCart });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    next(error);
  }
};
