import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Eye,
  Edit3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAdminOrders, updateOrderStatus } from '../../redux/slices/admin.slice.js';
import { formatCurrency, formatDate } from '../../utils/helpers.js';

export const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, ordersPagination, loading } = useSelector((state) => state.admin);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState('All');
  const [page, setPage] = useState(1);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const params = { page, limit: 10 };
    if (search) params.search = search;
    if (status !== 'All') params.status = status;
    if (paymentMethod !== 'All') params.paymentMethod = paymentMethod;

    dispatch(fetchAdminOrders(params));
  }, [dispatch, search, status, paymentMethod, page]);

  const handleUpdateStatus = async () => {
    if (!newStatus || !editingOrder) return;
    try {
      await dispatch(
        updateOrderStatus({ id: editingOrder._id, orderStatus: newStatus })
      ).unwrap();
      toast.success(`Order ${editingOrder.orderId} updated to ${newStatus}`);
      setEditingOrder(null);
    } catch (err) {
      toast.error(err || 'Failed to update order status');
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-bold">Delivered</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60 text-[11px] font-bold">Out for Delivery</span>;
      case 'PROCESSING':
        return <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200/60 text-[11px] font-bold">Processing</span>;
      case 'SHIPPED':
        return <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 text-[11px] font-bold">Shipped</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 text-[11px] font-bold">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 text-[11px] font-bold">Placed</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight font-display">
          Customer Orders
        </h1>
        <p className="text-xs text-zinc-500 font-medium mt-0.5">
          Manage fulfillment, real-time statuses and customer delivery records
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order ID, customer name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm font-medium text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-900 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Status Dropdown with Custom Spaced Chevron */}
          <div className="relative">
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="appearance-none pl-3.5 pr-9 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-700 outline-none cursor-pointer hover:border-zinc-300 focus:border-zinc-900 transition-colors"
            >
              <option value="All">All Statuses</option>
              <option value="PLACED">Placed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Payment Method Dropdown with Custom Spaced Chevron */}
          <div className="relative">
            <select
              value={paymentMethod}
              onChange={(e) => { setPaymentMethod(e.target.value); setPage(1); }}
              className="appearance-none pl-3.5 pr-9 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-700 outline-none cursor-pointer hover:border-zinc-300 focus:border-zinc-900 transition-colors"
            >
              <option value="All">All Payment Methods</option>
              <option value="UPI">UPI / Online</option>
              <option value="COD">Cash on Delivery</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
            <thead className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6 whitespace-nowrap">Order ID</th>
                <th className="py-4 px-6 whitespace-nowrap">Customer</th>
                <th className="py-4 px-6 whitespace-nowrap">Date</th>
                <th className="py-4 px-6 whitespace-nowrap">Amount</th>
                <th className="py-4 px-6 whitespace-nowrap">Payment</th>
                <th className="py-4 px-6 whitespace-nowrap">Status</th>
                <th className="py-4 px-6 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zinc-900 mx-auto"></div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400 font-bold">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-zinc-900 whitespace-nowrap">
                      <Link to={`/admin/orders/${ord.orderId || ord._id}`} className="hover:text-indigo-600">
                        {ord.orderId}
                      </Link>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div>
                        <p className="font-bold text-zinc-900">{ord.shippingAddress?.name || ord.user?.name || 'Customer'}</p>
                        <p className="text-[11px] text-zinc-400 font-medium">{ord.shippingAddress?.phone || ord.user?.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-500 font-medium whitespace-nowrap">{formatDate(ord.createdAt)}</td>
                    <td className="py-4 px-6 font-black text-zinc-900 text-sm whitespace-nowrap">
                      {formatCurrency(ord.total)}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <span className="font-bold text-zinc-900 block">{ord.paymentMethod}</span>
                        <span className="text-[11px] text-zinc-400 font-medium capitalize">
                          {(ord.paymentStatus || 'Pending').toLowerCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">{getStatusBadge(ord.orderStatus)}</td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/orders/${ord.orderId || ord._id}`}
                          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/60 transition-all"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setEditingOrder(ord);
                            setNewStatus(ord.orderStatus);
                          }}
                          className="p-2 rounded-xl text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 border border-zinc-200/60 transition-all cursor-pointer"
                          title="Update Order Status"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {ordersPagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 text-xs">
            <span className="text-zinc-500 font-medium">
              Showing page {ordersPagination.page} of {ordersPagination.pages} ({ordersPagination.total} total orders)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(ordersPagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-xl font-bold text-xs cursor-pointer ${
                    page === i + 1 ? 'bg-zinc-900 text-white shadow-sm' : 'hover:bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(ordersPagination.pages, p + 1))}
                disabled={page >= ordersPagination.pages}
                className="p-2 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Status Modal */}
      {editingOrder && createPortal(
        <div
          className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setEditingOrder(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', zIndex: 99999 }}
        >
          <div
            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl border border-zinc-200 space-y-4 animate-in fade-in zoom-in-95 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="font-bold text-base text-zinc-900">
                Update Order {editingOrder.orderId}
              </h3>
              <button onClick={() => setEditingOrder(null)} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              <label className="text-zinc-600">Order Status</label>
              <div className="relative">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full appearance-none pl-3.5 pr-9 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold outline-none cursor-pointer focus:border-zinc-900 focus:bg-white"
                >
                  <option value="PLACED">Placed</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-600 font-bold text-xs hover:bg-zinc-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                className="px-5 py-2 rounded-xl bg-zinc-900 text-white font-bold text-xs shadow-sm hover:bg-zinc-800 cursor-pointer active:scale-95 transition-all"
              >
                Save Status
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
