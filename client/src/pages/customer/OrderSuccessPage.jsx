import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Check,
  Package,
  MapPin,
  Copy,
  CheckCheck,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchOrderById } from '../../redux/slices/order.slice.js';
import { formatCurrency } from '../../utils/helpers.js';
import { BlurText } from '../../components/reactbits/BlurText.jsx';
import { ClickSpark } from '../../components/reactbits/ClickSpark.jsx';
import { ShinyText } from '../../components/reactbits/ShinyText.jsx';
import { BUSINESS_CONFIG } from '../../utils/constants.js';

export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order, latestPlacedOrder } = useSelector((state) => state.orders);
  const { settings } = useSelector((state) => state.settings);
  const [copied, setCopied] = useState(false);

  const whatsapp = settings?.whatsappNumber || settings?.contactPhone || BUSINESS_CONFIG.WHATSAPP;
  const whatsappRaw = whatsapp.replace(/\D/g, '');

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  const activeOrder = order || latestPlacedOrder;
  const displayOrderId = orderId || activeOrder?.orderId || '';

  const items = activeOrder?.items || [];
  const subtotal = activeOrder?.subtotal || activeOrder?.total || 0;
  const deliveryFee = activeOrder?.deliveryFee ?? 0;
  const totalAmount = activeOrder?.total || activeOrder?.amount || subtotal + deliveryFee;

  const isCOD =
    activeOrder?.paymentMethod === 'COD' ||
    activeOrder?.paymentDetails?.method === 'COD';
  const isPaid = activeOrder?.paymentStatus === 'COMPLETED';

  const shipping = activeOrder?.shippingAddress;

  const handleCopyId = () => {
    navigator.clipboard.writeText(displayOrderId);
    setCopied(true);
    toast.success('Order ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-6 sm:pt-10 pb-20 sm:pb-28 bg-[#FAFAFA] min-h-[calc(100vh-80px)] flex items-center justify-center text-stone-900 relative overflow-x-hidden">
      {/* Subtle modern dot-grid background texture matching HomePage */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#18181B 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-lg mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="bg-white rounded-3xl p-5 sm:p-8 md:p-10 border border-stone-200/80 shadow-card space-y-5 sm:space-y-6 text-center">
          
          {/* Header Icon & Message */}
          <div className="space-y-3 flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shadow-xs">
              <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <BlurText
                text={isCOD && !isPaid ? "Order Placed Successfully" : "Payment & Order Confirmed"}
                delay={50}
                className="text-2xl sm:text-3xl font-black text-stone-900 font-display tracking-tight justify-center"
              />
              <p className="text-xs sm:text-sm text-stone-500 font-medium max-w-sm mx-auto leading-relaxed">
                Thank you for trusting The Dogs Garage! Your pet essentials are being packed for fast courier dispatch.
              </p>
            </div>
          </div>

          {/* Two-Column Key Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-left">
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block font-display">
                Order ID
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-stone-900 text-xs sm:text-sm tracking-tight truncate">
                  {displayOrderId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="text-stone-400 hover:text-amber-700 transition-colors p-0.5 cursor-pointer shrink-0"
                  title="Copy Order ID"
                >
                  {copied ? (
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block font-display">
                Est. Delivery
              </span>
              <span className="font-bold text-stone-900 text-xs sm:text-sm block">
                3 – 5 Business Days
              </span>
            </div>
          </div>

          {/* Ordered Items Summary */}
          {items.length > 0 && (
            <div className="border border-stone-200/70 rounded-2xl p-4 text-left space-y-3 bg-stone-50/50">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200/60">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5 font-display">
                  <Package className="w-3.5 h-3.5 text-stone-400" />
                  <span>Product Item</span>
                </span>
                <span className="text-xs font-bold text-stone-800">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
                {items.map((item, idx) => {
                  const product = item.product || {};
                  const title = item.name || product.name || 'Premium Shampoo 250ml';
                  const qty = item.quantity || 1;
                  const price = item.price || 0;
                  const itemImg = item.image || (product.images && product.images[0]) || '/images/product-shampoo.jpg';

                  return (
                    <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={itemImg}
                          alt={title}
                          className="w-10 h-10 rounded-xl object-cover bg-stone-900 border border-stone-200 shrink-0"
                        />
                        <p className="font-bold text-stone-900 truncate">
                          {title} <span className="text-stone-400 font-normal">× {qty}</span>
                        </p>
                      </div>
                      <span className="font-extrabold text-stone-900 shrink-0 font-display">
                        {formatCurrency(price * qty)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price summary row */}
              <div className="pt-2.5 border-t border-stone-200/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-stone-500">
                  <span>Delivery Charges</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-700 font-bold">FREE</strong> : formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex items-center justify-between font-bold text-stone-900 pt-2 border-t border-stone-200/40">
                  <span className="text-xs">{isCOD && !isPaid ? 'Total Payable on Delivery' : 'Total Amount Paid'}</span>
                  <span className="text-base font-black text-stone-900 font-display">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Address Snippet */}
          {shipping && (
            <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-left text-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-stone-900 block truncate">
                  Shipping to: {shipping.name} {shipping.phone ? `(${shipping.phone})` : ''}
                </span>
                <p className="text-stone-500 font-medium text-[11px] truncate mt-0.5">
                  {[shipping.house, shipping.street, shipping.city, shipping.state, shipping.pincode].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <ClickSpark sparkColor="#E86A2C" className="w-full sm:w-auto sm:flex-1">
              <Link
                to={`/account/orders/${displayOrderId}`}
                className="w-full py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-card hover:shadow-float active:scale-99 text-center cursor-pointer inline-flex items-center justify-center gap-2 hover:scale-101"
              >
                <ShinyText speed={2}>Track Order</ShinyText>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </Link>
            </ClickSpark>

            <Link
              to="/accessories"
              className="w-full sm:w-auto sm:flex-1 py-3.5 px-6 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold border border-stone-200 transition-all text-center cursor-pointer inline-flex items-center justify-center hover:scale-101 active:scale-99"
            >
              Continue Shopping
            </Link>
          </div>

          {/* WhatsApp Direct Help */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-2 text-xs font-bold text-emerald-700">
            <MessageSquare className="w-3.5 h-3.5" />
            <a
              href={`https://wa.me/${whatsappRaw}?text=Hi,%20I%20have%20a%20question%20regarding%20my%20Order%20${encodeURIComponent(displayOrderId)}.`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Need help with this order? Chat on WhatsApp
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
