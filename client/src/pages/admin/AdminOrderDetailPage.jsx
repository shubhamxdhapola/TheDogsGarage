import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Printer, ChevronDown, CheckCircle2, Truck, Clock, ShieldCheck, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchOrderById } from '../../redux/slices/order.slice.js';
import { updateOrderStatus } from '../../redux/slices/admin.slice.js';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/helpers.js';

export const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentOrder: order, loading } = useSelector((state) => state.orders);

  const [statusValue, setStatusValue] = useState('');

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (order) {
      setStatusValue(order.orderStatus);
    }
  }, [order]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await dispatch(
        updateOrderStatus({ id: order._id, orderStatus: newStatus })
      ).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
      dispatch(fetchOrderById(id));
    } catch (err) {
      toast.error(err || 'Failed to update order status');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !order) {
    return (
      <div className="p-12 text-center text-zinc-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 mx-auto"></div>
      </div>
    );
  }

  return (
    <>
      {/* 1. INTERACTIVE SCREEN VIEW (Hidden during print) */}
      <div className="print:hidden space-y-6 max-w-5xl">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight font-display">
              Order #{order.orderId}
            </h1>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">
              Placed on {formatDateTime(order.createdAt)} • Status: <strong className="text-zinc-900 font-bold">{order.orderStatus}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Dropdown with custom spacing */}
            <div className="relative">
              <select
                value={statusValue}
                onChange={(e) => {
                  setStatusValue(e.target.value);
                  handleUpdateStatus(e.target.value);
                }}
                className="appearance-none pl-3.5 pr-9 py-2 rounded-xl bg-zinc-50 text-zinc-900 border border-zinc-200 text-xs font-bold outline-none cursor-pointer hover:border-zinc-300 focus:border-zinc-900 transition-colors"
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

            {/* Print Invoice Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50 shadow-2xs transition-colors cursor-pointer active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-500" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* 3 Information Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Order Information */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200 shadow-card space-y-3 text-xs">
            <h3 className="font-bold text-zinc-400 uppercase tracking-wider text-[10px] pb-2 border-b border-zinc-100">
              Order Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Order ID</span>
                <span className="font-bold text-zinc-900">{order.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Order Date</span>
                <span className="font-semibold text-zinc-700">{formatDateTime(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Payment Method</span>
                <span className="font-bold text-zinc-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Payment Status</span>
                <span className={`font-bold ${order.paymentStatus === 'COMPLETED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Order Status</span>
                <span className="font-black text-zinc-900">{order.orderStatus}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Customer Information */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200 shadow-card space-y-3 text-xs">
            <h3 className="font-bold text-zinc-400 uppercase tracking-wider text-[10px] pb-2 border-b border-zinc-100">
              Customer Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Name</span>
                <span className="font-bold text-zinc-900">{order.shippingAddress?.name || order.user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Phone</span>
                <span className="font-semibold text-zinc-700">{order.shippingAddress?.phone || order.user?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Email</span>
                <span className="font-semibold text-zinc-700 truncate max-w-[140px]">{order.shippingAddress?.email || order.user?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Shipping Address */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200 shadow-card space-y-3 text-xs">
            <h3 className="font-bold text-zinc-400 uppercase tracking-wider text-[10px] pb-2 border-b border-zinc-100">
              Shipping Address
            </h3>
            <div className="space-y-1 text-zinc-700 font-medium">
              <p className="font-bold text-zinc-900">{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.house}, {order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
              {order.shippingAddress?.landmark && (
                <p className="text-zinc-400 text-[11px]">Landmark: {order.shippingAddress.landmark}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Items Table & Price Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Order Items Table */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-zinc-200 shadow-card overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-900">
                Order Items ({order.items?.length || 0})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
                <thead className="bg-zinc-50/70 text-zinc-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-5 whitespace-nowrap">Item</th>
                    <th className="py-3 px-5 whitespace-nowrap">Price</th>
                    <th className="py-3 px-5 whitespace-nowrap">Qty</th>
                    <th className="py-3 px-5 text-right whitespace-nowrap">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
                  {order.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={it.image || '/images/product-shampoo.jpg'}
                            alt={it.name}
                            className="w-10 h-10 rounded-xl object-contain bg-zinc-50 p-1 border border-zinc-200/80"
                          />
                          <div>
                            <p className="font-bold text-zinc-900">{it.name}</p>
                            <p className="text-[10px] text-zinc-400 font-mono">SKU: {it.sku || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-bold whitespace-nowrap">{formatCurrency(it.price)}</td>
                      <td className="py-4 px-5 whitespace-nowrap">{it.quantity}</td>
                      <td className="py-4 px-5 text-right font-black text-zinc-900 whitespace-nowrap">
                        {formatCurrency(it.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Price Summary Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-zinc-200 shadow-card space-y-4 text-xs">
            <h3 className="font-bold text-zinc-400 uppercase tracking-wider text-[10px] pb-3 border-b border-zinc-100">
              Payment Summary
            </h3>

            <div className="space-y-2.5">
              <div className="flex justify-between text-zinc-600">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold text-zinc-900">{formatCurrency(order.subtotal)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-600">
                <span className="font-medium">Delivery Charges</span>
                <span className="font-bold">{order.deliveryCharge === 0 ? 'FREE' : formatCurrency(order.deliveryCharge)}</span>
              </div>

              <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline text-sm">
                <span className="font-bold text-zinc-900">Total Amount</span>
                <span className="text-xl font-black text-zinc-900 font-display">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED PRINT-ONLY SINGLE PAGE INVOICE */}
      <div className="hidden print:block w-full max-w-[210mm] mx-auto bg-white text-zinc-900 font-sans p-6 text-xs leading-relaxed">
        {/* Invoice Header */}
        <div className="flex items-start justify-between border-b-2 border-zinc-900 pb-5 mb-5">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 font-display">
              THE DOG'S GARAGE
            </h1>
            <p className="text-[11px] text-zinc-600 font-semibold mt-0.5">
              Your Trusted Companion Haven & Accessories Store
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">
              100 Feet Road, Indiranagar, Bangalore, Karnataka - 560038
            </p>
            <p className="text-[11px] text-zinc-500">
              thedogsgarage@gmail.com • +91 62643 69991
            </p>
          </div>

          <div className="text-right space-y-1">
            <h2 className="text-xl font-black text-zinc-900 tracking-wider">
              TAX INVOICE
            </h2>
            <p className="font-bold text-zinc-800">
              Invoice #{order.orderId}
            </p>
            <p className="text-[11px] text-zinc-600">
              Date: <strong>{formatDate(order.createdAt)}</strong>
            </p>
            <p className="text-[11px] text-zinc-600">
              Payment: <strong>{order.paymentMethod} ({order.paymentStatus || 'COMPLETED'})</strong>
            </p>
          </div>
        </div>

        {/* Billing & Shipping Grid */}
        <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-zinc-50 border border-zinc-200 mb-6 text-xs">
          <div>
            <h3 className="font-bold text-zinc-500 uppercase text-[10px] tracking-wider mb-1.5">
              Billed & Shipped To:
            </h3>
            <p className="font-bold text-zinc-900 text-sm">{order.shippingAddress?.name || order.user?.name}</p>
            <p className="text-zinc-700 mt-0.5">{order.shippingAddress?.house}, {order.shippingAddress?.street}</p>
            <p className="text-zinc-700">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            {order.shippingAddress?.landmark && (
              <p className="text-zinc-500 text-[11px]">Landmark: {order.shippingAddress.landmark}</p>
            )}
          </div>

          <div className="space-y-1 border-l border-zinc-200 pl-6">
            <h3 className="font-bold text-zinc-500 uppercase text-[10px] tracking-wider mb-1.5">
              Customer Contact:
            </h3>
            <p className="text-zinc-700">Phone: <strong className="text-zinc-900">{order.shippingAddress?.phone || order.user?.phone}</strong></p>
            <p className="text-zinc-700">Email: <strong className="text-zinc-900">{order.shippingAddress?.email || order.user?.email || 'N/A'}</strong></p>
            <p className="text-zinc-700">Order Status: <strong className="text-zinc-900 uppercase">{order.orderStatus}</strong></p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-zinc-300 rounded-lg overflow-hidden mb-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-100 border-b border-zinc-300 font-bold uppercase text-[10px] text-zinc-700">
              <tr>
                <th className="py-2.5 px-3 w-10 text-center border-r border-zinc-300">#</th>
                <th className="py-2.5 px-3 border-r border-zinc-300">Item Description</th>
                <th className="py-2.5 px-3 w-28 border-r border-zinc-300">SKU</th>
                <th className="py-2.5 px-3 w-24 text-right border-r border-zinc-300">Price</th>
                <th className="py-2.5 px-3 w-16 text-center border-r border-zinc-300">Qty</th>
                <th className="py-2.5 px-3 w-28 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {order.items?.map((it, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 px-3 text-center border-r border-zinc-200 font-bold text-zinc-500">{idx + 1}</td>
                  <td className="py-2.5 px-3 border-r border-zinc-200 font-bold text-zinc-900">{it.name}</td>
                  <td className="py-2.5 px-3 border-r border-zinc-200 font-mono text-[10px] text-zinc-600">{it.sku || 'TDG-PROD'}</td>
                  <td className="py-2.5 px-3 text-right border-r border-zinc-200 font-semibold">{formatCurrency(it.price)}</td>
                  <td className="py-2.5 px-3 text-center border-r border-zinc-200 font-bold">{it.quantity}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-zinc-900">{formatCurrency(it.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Financial Breakdown & Terms */}
        <div className="grid grid-cols-2 gap-6 items-start">
          {/* Left: Terms & Conditions */}
          <div className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50 space-y-1.5 text-[10px] text-zinc-600">
            <p className="font-bold uppercase text-zinc-800 tracking-wider">Terms & Conditions:</p>
            <p>1. All products sold are 100% genuine and quality checked.</p>
            <p>2. For any order discrepancy or return inquiries, contact support within 7 days of delivery.</p>
            <p>3. This is a computer generated invoice and requires no physical signature.</p>
          </div>

          {/* Right: Price Breakdown Box */}
          <div className="border border-zinc-300 rounded-lg p-3.5 space-y-2 text-xs bg-zinc-50">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span className="font-bold text-zinc-900">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-600">
              <span>Delivery Charges</span>
              <span className="font-bold">{order.deliveryCharge === 0 ? 'FREE' : formatCurrency(order.deliveryCharge)}</span>
            </div>
            <div className="pt-2 border-t-2 border-zinc-900 flex justify-between items-baseline font-black text-sm text-zinc-900">
              <span>Total Invoice Amount</span>
              <span className="text-base">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-8 text-center border-t border-zinc-200 mt-8 text-[11px] text-zinc-500 font-medium">
          Thank you for choosing <strong className="text-zinc-900 font-bold">The Dog's Garage</strong>! For customer care, visit <span className="text-zinc-800 font-semibold">thedogsgarage.com</span>
        </div>
      </div>
    </>
  );
};
