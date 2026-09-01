import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChevronRight, Package, ShoppingBag } from 'lucide-react';
import { fetchMyOrders } from '../../redux/slices/order.slice.js';
import { formatCurrency, formatDate } from '../../utils/helpers.js';
import { BlurText } from '../../components/reactbits/BlurText.jsx';
import { SpotlightCard } from '../../components/reactbits/SpotlightCard.jsx';
import { ClickSpark } from '../../components/reactbits/ClickSpark.jsx';
import { ShinyText } from '../../components/reactbits/ShinyText.jsx';

export const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    switch (status) {
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Header without dividing border & without continue shopping button */}
        <div className="pb-2">
          <BlurText
            text="Your Orders"
            delay={60}
            className="text-2xl sm:text-3xl font-black text-stone-900 font-display tracking-tight"
          />
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
            View your active shipments and verified purchase history.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-card animate-pulse h-32" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-12 text-center border border-stone-200/80 shadow-card space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-stone-900 font-display">No orders yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed font-medium">
                When you purchase pet products from our garage store, you can track their live status here.
              </p>
            </div>
            <div className="pt-2">
              <ClickSpark sparkColor="#E86A2C">
                <Link
                  to="/accessories"
                  className="inline-block px-6 py-3 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-all shadow-card hover:scale-101 active:scale-99"
                >
                  <ShinyText speed={2}>Shop Essentials</ShinyText>
                </Link>
              </ClickSpark>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <SpotlightCard
                key={order._id}
                spotlightColor="rgba(232, 106, 44, 0.06)"
                className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-card hover:shadow-subtle transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="font-black text-stone-900 text-sm font-display">{order.orderId}</span>
                    <span className="text-stone-300">•</span>
                    <span className="text-stone-500 font-medium">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                    {getStatusBadge(order.orderStatus)}
                    <span className="font-black text-stone-900 text-sm sm:text-base font-display">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-x-auto py-1">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <img
                          src={item.image || '/images/product-shampoo.jpg'}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover bg-stone-900 border border-stone-200 shrink-0"
                        />
                        <div className="text-xs">
                          <p className="font-bold text-stone-900 line-clamp-1 max-w-[180px]">{item.name}</p>
                          <p className="text-stone-400 text-[11px] font-medium">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <ClickSpark sparkColor="#E86A2C">
                    <Link
                      to={`/account/orders/${order.orderId || order._id}`}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-800 text-xs font-bold transition-all shadow-2xs shrink-0 hover:scale-101 active:scale-99 group cursor-pointer"
                    >
                      <span>View Order Details</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </ClickSpark>
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
