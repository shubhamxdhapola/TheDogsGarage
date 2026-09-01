import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TrendingUp,
  Download,
  IndianRupee,
  ShoppingBag,
  CreditCard,
  Percent,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchAnalytics } from '../../redux/slices/admin.slice.js';
import { formatCurrency } from '../../utils/helpers.js';

export const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector((state) => state.admin);
  const [range, setRange] = useState('30d');

  useEffect(() => {
    dispatch(fetchAnalytics({ range }));
  }, [dispatch, range]);

  const totalRevenue = analytics?.totalRevenue || 0;
  const totalOrders = analytics?.totalOrders || 0;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const timeline = analytics?.timeline || [];
  const salesByCategory = analytics?.categories || [];
  const orderStatusDistribution = analytics?.statuses || [];

  const catColors = ['#E86A2C', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
  const statusColorMap = {
    DELIVERED: '#10B981',
    PROCESSING: '#F97316',
    SHIPPED: '#3B82F6',
    PLACED: '#F59E0B',
    OUT_FOR_DELIVERY: '#8B5CF6',
    CANCELLED: '#EF4444',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="text-xs text-stone-400 font-semibold mb-1">
            <span>Dashboard</span> &gt; <span className="text-tdg-brown font-bold">Analytics</span>
          </nav>
          <h1 className="text-2xl font-black text-tdg-brown font-display">Analytics & Reports</h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-4 py-2 rounded-full bg-white border border-stone-200 text-xs font-bold text-tdg-brown outline-none cursor-pointer shadow-2xs"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 3 Months</option>
            <option value="1y">Past 1 Year</option>
            <option value="all">All Time</option>
          </select>

          <button
            onClick={() => dispatch(fetchAnalytics({ range }))}
            className="p-2 rounded-full bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 shadow-2xs transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3 Summary Stat Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-stone-400">Total Revenue</span>
          <h3 className="text-2xl font-black text-tdg-brown font-display">
            {formatCurrency(totalRevenue)}
          </h3>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-stone-400">Total Orders</span>
          <h3 className="text-2xl font-black text-tdg-brown font-display">
            {totalOrders.toLocaleString()}
          </h3>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-stone-400">Average Order Value</span>
          <h3 className="text-2xl font-black text-tdg-brown font-display">
            {formatCurrency(averageOrderValue)}
          </h3>
        </div>
      </div>

      {/* Row 1: Revenue Over Time & Orders Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Over Time Area Chart */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="font-extrabold text-sm text-tdg-brown">Revenue Over Time</h3>
            <span className="text-xs text-stone-400 font-bold">Selected Period</span>
          </div>

          <div className="h-64 w-full">
            {timeline.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                No revenue recorded in this period
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeline}>
                  <defs>
                    <linearGradient id="colorRevAnalytics" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E86A2C" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#E86A2C" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EAE1" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8C827A' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#8C827A' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), 'Revenue']}
                    contentStyle={{ borderRadius: '14px', background: '#2B2118', color: '#fff', border: 'none', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#E86A2C" strokeWidth={3} fillOpacity={1} fill="url(#colorRevAnalytics)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Orders Over Time Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="font-extrabold text-sm text-tdg-brown">Orders Over Time</h3>
            <span className="text-xs text-stone-400 font-bold">Selected Period</span>
          </div>

          <div className="h-64 w-full">
            {timeline.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                No orders placed in this period
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EAE1" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8C827A' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#8C827A' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '14px', background: '#2B2118', color: '#fff', border: 'none', fontSize: '12px' }}
                  />
                  <Bar dataKey="orders" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Category Breakdown & Order Statuses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category Pie */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="font-extrabold text-sm text-tdg-brown">Sales by Category</h3>
            <span className="text-xs text-stone-400 font-bold">Revenue</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {salesByCategory.length === 0 ? (
              <div className="text-xs text-stone-400">No category sales data for this period</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    dataKey="revenue"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {salesByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={catColors[index % catColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), 'Revenue']}
                    contentStyle={{ borderRadius: '14px', background: '#2B2118', color: '#fff', border: 'none', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="font-extrabold text-sm text-tdg-brown">Order Status Distribution</h3>
            <span className="text-xs text-stone-400 font-bold">Volume</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {orderStatusDistribution.length === 0 ? (
              <div className="text-xs text-stone-400">No order status data for this period</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusDistribution}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {orderStatusDistribution.map((entry, index) => (
                      <Cell
                        key={`status-${index}`}
                        fill={statusColorMap[entry.status] || catColors[index % catColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '14px', background: '#2B2118', color: '#fff', border: 'none', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
