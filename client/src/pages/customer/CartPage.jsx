import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, ArrowRight, Minus, Plus, ShieldCheck, Trash2, Sparkles, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchServerCart,
  updateCartQuantity,
  removeFromCart,
} from '../../redux/slices/cart.slice.js';
import { formatCurrency } from '../../utils/helpers.js';
import { BlurText } from '../../components/reactbits/BlurText.jsx';
import { ShinyText } from '../../components/reactbits/ShinyText.jsx';
import { ClickSpark } from '../../components/reactbits/ClickSpark.jsx';
import { SpotlightCard } from '../../components/reactbits/SpotlightCard.jsx';

export const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal, discount, deliveryCharge, total, totalItemsCount } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchServerCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleUpdateQty = (productId, newQty) => {
    if (newQty < 1) return;
    dispatch(updateCartQuantity({ productId, quantity: newQty }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  if (items.length === 0) {
    return (
      <div className="pt-16 pb-28 bg-[#FAFAFA] min-h-[75vh] flex items-center justify-center relative">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#18181B 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-md w-full text-center border border-stone-200/80 shadow-card space-y-6 mx-4 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
            <ShoppingBag className="w-9 h-9 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <BlurText
              text="Your Garage Bag is Empty"
              delay={50}
              className="text-2xl font-black text-stone-900 font-display justify-center"
            />
            <p className="text-xs sm:text-sm text-stone-500 max-w-xs mx-auto leading-relaxed font-medium">
              You haven't added any pet accessories or shampoo care yet. Discover our signature collection.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <ClickSpark sparkColor="#E86A2C" className="w-full block">
              <Link
                to="/accessories"
                className="w-full py-3.5 px-6 rounded-xl bg-stone-900 text-white text-xs font-bold shadow-card hover:bg-stone-800 transition-all inline-flex items-center justify-center gap-2 cursor-pointer hover:scale-101 active:scale-99"
              >
                <ShinyText speed={2}>Explore The Garage Shop</ShinyText>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </Link>
            </ClickSpark>
            <Link
              to="/pets"
              className="py-3 px-6 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs font-bold hover:bg-stone-100 transition-all inline-flex items-center justify-center cursor-pointer"
            >
              Meet Available Puppies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-28 bg-[#FAFAFA] min-h-screen text-stone-900 overflow-x-hidden relative">
      {/* Subtle modern dot-grid background texture matching HomePage */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#18181B 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Cart Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200/80">
          <div className="flex items-baseline gap-3">
            <BlurText
              text="Your Garage Bag"
              delay={50}
              className="text-2xl sm:text-3xl font-black text-stone-900 font-display tracking-tight"
            />
            <span className="text-xs sm:text-sm font-bold text-stone-400">
              ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
            </span>
          </div>

          <Link
            to="/accessories"
            className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 transition-colors group"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 2 Column Layout with balanced spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence>
              {items.map((item) => {
                const product = item.product || {};
                const productId = product._id || product.id;
                const image =
                  product.image ||
                  product.images?.[0] ||
                  '/images/product-shampoo.jpg';

                return (
                  <motion.div
                    layout
                    key={productId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-card hover:shadow-subtle transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                  >
                    {/* Thumbnail & Product Details */}
                    <div className="flex items-center gap-5 min-w-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-stone-900 border border-stone-200/80 shrink-0 shadow-xs">
                        <img
                          src={image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1.5 min-w-0">
                        <Link
                          to={`/accessories/${productId}`}
                          className="font-extrabold text-sm sm:text-base text-stone-900 hover:text-amber-700 transition-colors line-clamp-1 font-display block"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-stone-400 font-medium">
                          {product.packageSize || '250ml Bottle'} • 100% Organic
                        </p>
                        
                        <div className="flex items-baseline gap-2 pt-0.5">
                          <span className="text-base font-black text-stone-900 font-display">
                            {formatCurrency(product.price)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs text-stone-400 line-through font-medium">
                              {formatCurrency(product.originalPrice)}
                            </span>
                          )}
                          {product.discount > 0 && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/80 border border-amber-200/60 px-2 py-0.5 rounded-full">
                              {product.discount}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector, Price & Remove Button */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 hover:bg-white disabled:opacity-30 transition-all cursor-pointer shadow-2xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center font-extrabold text-xs text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(productId, item.quantity + 1)}
                          disabled={item.quantity >= (product.stock || 99)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 hover:bg-white disabled:opacity-30 transition-all cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right min-w-[80px]">
                        <span className="text-lg font-black text-stone-900 font-display block">
                          {formatCurrency(product.price * item.quantity)}
                        </span>
                      </div>

                      {/* Remove Item Button */}
                      <button
                        type="button"
                        onClick={() => handleRemove(productId)}
                        className="p-2.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Delivery & Security Benefit Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-900 block">Fast Pan-India Delivery</span>
                  <span className="text-[11px] text-stone-500 font-medium">Free delivery on orders over ₹999</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-900 block">100% Genuine Care Guarantee</span>
                  <span className="text-[11px] text-stone-500 font-medium">Fresh direct from certified nursery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Price Details Card with SpotlightCard */}
          <SpotlightCard
            spotlightColor="rgba(232, 106, 44, 0.08)"
            spotlightSize={500}
            className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-card space-y-6"
          >
            <h3 className="font-black text-xs text-stone-400 uppercase tracking-widest pb-3 border-b border-stone-100 font-display">
              PRICE DETAILS
            </h3>

            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})</span>
                <span className="font-bold text-stone-900">{formatCurrency(subtotal + discount)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-amber-700 font-bold">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Delivery Charges</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    <span className="font-bold text-stone-900">{formatCurrency(deliveryCharge)}</span>
                  )}
                </span>
              </div>

              <div className="pt-4 border-t border-stone-200/80 flex justify-between items-baseline text-sm">
                <span className="font-extrabold text-stone-900">Total Amount</span>
                <span className="text-2xl font-black text-stone-900 font-display">
                  {formatCurrency(total)}
                </span>
              </div>

              {discount > 0 && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[11px] font-bold text-center">
                  You save {formatCurrency(discount)} on this order 🎉
                </div>
              )}
            </div>

            {/* Proceed CTA with ClickSpark & ShinyText */}
            <div className="pt-2">
              <ClickSpark sparkColor="#E86A2C" className="w-full block">
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-card hover:shadow-float transition-all hover:scale-101 active:scale-99 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShinyText speed={2.5}>Proceed to Checkout</ShinyText>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </ClickSpark>
            </div>

            <div className="flex items-center justify-center gap-2 text-stone-400 text-xs font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Secure 256-Bit SSL Checkout</span>
            </div>
          </SpotlightCard>

        </div>
      </div>
    </div>
  );
};

export default CartPage;
