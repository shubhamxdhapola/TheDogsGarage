import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import {
  closeCartDrawer,
  updateCartQuantity,
  removeFromCart,
  fetchServerCart,
} from '../../redux/slices/cart.slice.js';
import { formatCurrency } from '../../utils/helpers.js';
import { ShinyText } from '../reactbits/ShinyText.jsx';
import { ClickSpark } from '../reactbits/ClickSpark.jsx';

export const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCartDrawerOpen, items, subtotal, totalItemsCount } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useSelector((state) => state.auth);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (isCartDrawerOpen && isAuthenticated) {
      dispatch(fetchServerCart());
    }
  }, [isCartDrawerOpen, dispatch, isAuthenticated]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartDrawerOpen) {
        dispatch(closeCartDrawer());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartDrawerOpen, dispatch]);

  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const computedSubtotal =
    typeof subtotal === 'number' && subtotal > 0
      ? subtotal
      : items.reduce(
          (acc, it) =>
            acc + (it.price || it.product?.price || 0) * (it.quantity || 1),
          0
        );

  const handleCheckoutClick = () => {
    dispatch(closeCartDrawer());
    navigate('/checkout');
  };

  const handleShopAccessories = () => {
    dispatch(closeCartDrawer());
    navigate('/accessories');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        onClick={() => dispatch(closeCartDrawer())}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
        <motion.div
          ref={drawerRef}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="w-screen max-w-md bg-[#FAFAFA] shadow-2xl flex flex-col justify-between border-l border-stone-200 relative overflow-hidden"
        >
          {/* Subtle dot-grid texture matching HomePage */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#18181B 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200/80 flex items-center justify-between bg-white relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-xs border border-amber-200/60">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-base text-stone-900 font-display leading-tight">
                  Shopping Bag
                </h3>
                <p className="text-xs text-stone-400 font-medium">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => dispatch(closeCartDrawer())}
              className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer"
              title="Close Bag"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 relative z-10">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-base text-stone-900 font-display">Your bag is empty</h4>
                  <p className="text-xs text-stone-500 max-w-[240px] mx-auto leading-relaxed font-medium">
                    Treat your dog with our premium botanical shampoo and wellness accessories.
                  </p>
                </div>
                <ClickSpark sparkColor="#E86A2C" className="pt-2">
                  <button
                    type="button"
                    onClick={handleShopAccessories}
                    className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-card transition-all cursor-pointer hover:scale-101 active:scale-99"
                  >
                    <ShinyText speed={2}>Explore The Store</ShinyText>
                  </button>
                </ClickSpark>
              </div>
            ) : (
              <AnimatePresence>
                {items.map((item) => {
                  const product = item.product || {};
                  const name = product.name || item.name || 'Dog Grooming Shampoo';
                  const image =
                    product.images?.[0] ||
                    item.image ||
                    '/images/product-shampoo.jpg';
                  const price = item.price || product.price || 650;
                  const productId = product._id || item.productId || item._id;

                  return (
                    <motion.div
                      layout
                      key={productId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-3.5 p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs relative group"
                    >
                      {/* Compact Image Container */}
                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-stone-900 border border-stone-200 shrink-0 overflow-hidden shadow-2xs">
                        <img
                          src={image}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0 pr-6">
                        <div>
                          <h4 className="font-extrabold text-xs text-stone-900 truncate font-display" title={name}>
                            {name}
                          </h4>
                          <p className="text-[11px] text-stone-400 font-medium">
                            {product.packageSize || '250ml Bottle'} • 100% Organic
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() =>
                                dispatch(
                                  updateCartQuantity({
                                    productId,
                                    quantity: Math.max(1, item.quantity - 1),
                                  })
                                )
                              }
                              className="w-6 h-6 rounded-md text-stone-600 hover:bg-white flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-black text-xs text-stone-900 px-2 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                dispatch(
                                  updateCartQuantity({
                                    productId,
                                    quantity: item.quantity + 1,
                                  })
                                )
                              }
                              className="w-6 h-6 rounded-md text-stone-600 hover:bg-white flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <span className="font-black text-sm text-stone-900 font-display">
                            {formatCurrency(price * item.quantity)}
                          </span>
                        </div>
                      </div>

                      {/* Remove Item Button */}
                      <button
                        type="button"
                        onClick={() => dispatch(removeFromCart(productId))}
                        className="absolute top-2.5 right-2.5 p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200/80 bg-white space-y-3.5 relative z-10 shadow-float">
              {/* Trust Badges */}
              <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium px-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Safe & Secure
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-600" /> COD Available
                </span>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-stone-500">Subtotal</span>
                <span className="text-2xl font-black text-stone-900 font-display">
                  {formatCurrency(computedSubtotal)}
                </span>
              </div>

              {/* Primary Direct Checkout Action */}
              <ClickSpark sparkColor="#E86A2C" className="w-full block">
                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-card hover:shadow-float transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-101 active:scale-99"
                >
                  <ShinyText speed={2.5}>Proceed to Checkout</ShinyText>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </ClickSpark>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CartDrawer;
