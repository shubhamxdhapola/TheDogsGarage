import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  CreditCard,
  AlertCircle,
  RefreshCw,
  Ban,
  Package,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchOrderById, cancelOrder, verifyPayment } from '../../redux/slices/order.slice.js';
import { formatCurrency, formatDateTime } from '../../utils/helpers.js';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { Stepper } from '../../components/reactbits/Stepper.jsx';
import { SpotlightCard } from '../../components/reactbits/SpotlightCard.jsx';
import { ClickSpark } from '../../components/reactbits/ClickSpark.jsx';

// Dynamic Razorpay script loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order, loading } = useSelector((state) => state.orders);
  const [retryingPayment, setRetryingPayment] = useState(false);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await dispatch(cancelOrder(order.orderId || order._id)).unwrap();
      toast.success('Order cancelled successfully.');
      dispatch(fetchOrderById(id));
    } catch (err) {
      toast.error(err || 'Failed to cancel order');
    }
  };

  const handleRetryPayment = async () => {
    setRetryingPayment(true);
    try {
      toast.loading('Opening payment gateway...', { id: 'retry-pay' });
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        toast.dismiss('retry-pay');
        toast.error('Could not load payment gateway. Please check your internet connection.');
        setRetryingPayment(false);
        return;
      }

      const res = await axiosInstance.post(API_PATHS.ORDERS.RETRY_PAYMENT(order.orderId || order._id));
      toast.dismiss('retry-pay');

      const { razorpayOrder } = res.data;

      const rzpOptions = {
        key: razorpayOrder.key || 'rzp_live_TUWfCS6KIFn2nu',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'The Dogs Garage',
        description: `Payment for Order ${order.orderId}`,
        image: '/images/product-shampoo.jpg',
        order_id: razorpayOrder.id,
        prefill: {
          name: order.shippingAddress?.name,
          email: order.shippingAddress?.email || 'customer@thedogsgarage.com',
          contact: order.shippingAddress?.phone,
        },
        theme: {
          color: '#18181B',
        },
        handler: async function (response) {
          try {
            toast.loading('Verifying payment signature...', { id: 'verifying-pay' });
            await dispatch(
              verifyPayment({
                orderId: order.orderId,
                razorpayOrderId: response.razorpay_order_id || razorpayOrder.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              })
            ).unwrap();
            toast.dismiss('verifying-pay');
            toast.success('Payment verified! Order updated.');
            dispatch(fetchOrderById(id));
          } catch (err) {
            toast.dismiss('verifying-pay');
            toast.error(err || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: function () {
            toast.error('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.on('payment.failed', function (response) {
        toast.error(response.error?.description || 'Payment failed');
      });
      rzp.open();
    } catch (err) {
      toast.dismiss('retry-pay');
      toast.error(err.response?.data?.message || 'Failed to initiate payment retry');
    } finally {
      setRetryingPayment(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="pt-20 pb-28 bg-[#FAFAFA] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900 mx-auto" />
      </div>
    );
  }

  const trackingSteps = [
    { title: 'Placed' },
    { title: 'Processing' },
    { title: 'Shipped' },
    { title: 'Out for Delivery' },
    { title: 'Delivered' },
  ];
  const stepsKeys = ['PLACED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentStepIndex = Math.max(0, stepsKeys.indexOf(order.orderStatus));

  const getOrderStatusBadge = (st) => {
    switch (st) {
      case 'DELIVERED':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[10px] font-black uppercase tracking-wider">Delivered</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200/60 text-purple-800 text-[10px] font-black uppercase tracking-wider">Out for Delivery</span>;
      case 'SHIPPED':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-800 text-[10px] font-black uppercase tracking-wider">Shipped</span>;
      case 'PROCESSING':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-800 text-[10px] font-black uppercase tracking-wider">Processing</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200/60 text-rose-800 text-[10px] font-black uppercase tracking-wider">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-stone-800 text-[10px] font-black uppercase tracking-wider">Placed</span>;
    }
  };

  const isCancelled = order.orderStatus === 'CANCELLED';
  const isCOD = order.paymentMethod === 'COD';
  const isPaid = order.paymentStatus === 'COMPLETED';
  const isPendingOnline = !isCOD && order.paymentStatus === 'PENDING';

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 relative z-10">
        
        {/* Back Link */}
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to My Orders</span>
        </Link>

        {/* Order Card Container */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200/80 shadow-card space-y-6 sm:space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-display">{order.orderId}</h1>
                {getOrderStatusBadge(order.orderStatus)}
              </div>
              <p className="text-xs text-stone-400 font-medium">Placed on {formatDateTime(order.createdAt)}</p>
            </div>
            <div className="sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 flex sm:block justify-between items-center">
              <span className="text-[11px] text-stone-400 font-bold block sm:mb-0.5">
                {isCancelled ? 'Order Total' : isPaid ? 'Total Paid' : isCOD ? 'To Pay on Delivery' : 'Total Amount'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-stone-900 font-display">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>

          {/* CANCELLED ORDER BANNER */}
          {isCancelled ? (
            <div className="p-4 sm:p-5 bg-rose-50/80 rounded-2xl border border-rose-200 flex items-start gap-3 sm:gap-4">
              <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Ban className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-xs sm:text-sm text-rose-900">
                  Order Cancelled
                </h3>
                <p className="text-[11px] sm:text-xs text-rose-700 leading-relaxed">
                  This order was cancelled. {order.paymentStatus === 'REFUNDED' ? 'Any amount paid has been refunded to your source payment method.' : 'No items will be dispatched.'}
                </p>
              </div>
            </div>
          ) : (
            /* ACTIVE ORDER TRACKING PROGRESSION WITH REACTBITS STEPPER */
            <SpotlightCard
              spotlightColor="rgba(232, 106, 44, 0.06)"
              className="p-4 sm:p-6 bg-stone-50 rounded-2xl border border-stone-200/70"
            >
              <span className="text-[11px] sm:text-xs font-black text-stone-900 uppercase tracking-wider block font-display mb-3 sm:mb-2">
                ORDER TRACKING STATUS
              </span>

              {/* Responsive Stepper */}
              <div className="sm:hidden pt-2 pb-1">
                <Stepper
                  steps={trackingSteps}
                  currentStep={currentStepIndex}
                  orientation="vertical"
                />
              </div>

              <div className="hidden sm:block pt-2 pb-2">
                <Stepper
                  steps={trackingSteps}
                  currentStep={currentStepIndex}
                  orientation="horizontal"
                />
              </div>
            </SpotlightCard>
          )}

          {/* Pending Payment Action for Unpaid Active Orders */}
          {!isCancelled && isPendingOnline && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-xs text-amber-900">Payment Pending</h4>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    This order was initiated with Online payment. You can complete it securely below.
                  </p>
                </div>
              </div>
              <ClickSpark sparkColor="#E86A2C">
                <button
                  type="button"
                  onClick={handleRetryPayment}
                  disabled={retryingPayment}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95 hover:scale-105"
                >
                  {retryingPayment ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pay Now ({formatCurrency(order.total)})</span>
                    </>
                  )}
                </button>
              </ClickSpark>
            </div>
          )}

          {/* Order Items Table */}
          <div className="space-y-3">
            <span className="text-[11px] sm:text-xs font-black text-stone-400 uppercase tracking-wider block font-display">
              ITEMS IN THIS SHIPMENT ({order.items?.length || 0})
            </span>
            <div className="space-y-2.5">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-stone-50 border border-stone-200/60"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={item.image || '/images/product-shampoo.jpg'}
                      alt={item.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover bg-stone-900 border border-stone-200 shrink-0"
                    />
                    <div className="text-xs space-y-0.5 min-w-0 flex-1">
                      <h4 className="font-bold text-stone-900 truncate">{item.name}</h4>
                      <p className="text-stone-400 text-[11px] font-medium">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-xs sm:text-sm text-stone-900 font-display shrink-0">
                    {formatCurrency(item.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2 Column Address & Payment Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs pt-4 border-t border-stone-100">
            <SpotlightCard spotlightColor="rgba(232, 106, 44, 0.06)" className="space-y-1.5 p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <span className="font-black text-stone-400 uppercase tracking-wider block text-[10px] font-display">
                SHIPPING ADDRESS
              </span>
              <p className="font-bold text-stone-900">{order.shippingAddress?.name}</p>
              <p className="text-stone-600 font-medium">{order.shippingAddress?.house}, {order.shippingAddress?.street}</p>
              <p className="text-stone-600 font-medium">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
              <p className="text-stone-500 font-medium pt-0.5">Phone: {order.shippingAddress?.phone}</p>
            </SpotlightCard>

            <SpotlightCard spotlightColor="rgba(83, 107, 79, 0.06)" className="space-y-2 p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <span className="font-black text-stone-400 uppercase tracking-wider block text-[10px] font-display">
                PAYMENT SUMMARY
              </span>

              <div className="space-y-1.5 font-medium">
                <div className="flex justify-between text-stone-600">
                  <span>Payment Method</span>
                  <span className="font-bold text-stone-900">
                    {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online (UPI / Card)'}
                  </span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Payment Status</span>
                  <span
                    className={`font-bold ${
                      isCancelled
                        ? 'text-rose-600'
                        : isPaid
                        ? 'text-emerald-700'
                        : isCOD
                        ? 'text-stone-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {isCancelled
                      ? order.paymentStatus === 'REFUNDED'
                        ? 'Refunded'
                        : 'Cancelled'
                      : isPaid
                      ? 'Paid'
                      : isCOD
                      ? 'Pay on Delivery'
                      : 'Pending'}
                  </span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">{formatCurrency(order.subtotal)}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-amber-700 font-bold">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-stone-900">
                    {order.deliveryCharge === 0 ? <strong className="text-emerald-700">FREE</strong> : formatCurrency(order.deliveryCharge)}
                  </span>
                </div>

                <div className="flex justify-between text-stone-900 font-black pt-2 border-t border-stone-200 text-xs sm:text-sm">
                  <span>
                    {isCancelled
                      ? 'Total (Cancelled)'
                      : isPaid
                      ? 'Total Paid'
                      : isCOD
                      ? 'Amount to Pay on Delivery'
                      : 'Total Amount'}
                  </span>
                  <span className="font-display text-base font-black">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Cancellation Option if PLACED */}
          {order.orderStatus === 'PLACED' && (
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <span className="text-[11px] text-stone-400 font-medium">
                You can cancel this order before it begins processing.
              </span>
              <button
                type="button"
                onClick={handleCancelOrder}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Cancel Order
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
