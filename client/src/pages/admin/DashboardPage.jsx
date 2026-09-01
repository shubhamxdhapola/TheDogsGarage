import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  ShoppingBag,
  Clock,
  Dog,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
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
import { fetchDashboardStats } from '../../redux/slices/admin.slice.js';
import { formatCurrency } from '../../utils/helpers.js';

const CustomRevenueTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-zinc-900 text-white p-3 rounded-2xl shadow-xl text-xs font-semibold border border-zinc-800">
        <p className="text-zinc-400 font-bold mb-1">{data.fullDate || data.date || label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-emerald-400 font-bold text-sm">{formatCurrency(data.revenue || 0)}</span>
          <span className="text-zinc-400">Revenue</span>
        </div>
        <div className="flex items-center gap-2 mt-1 pt-1 border-t border-zinc-800 text-zinc-400">
          <span>Orders:</span>
          <span className="font-bold text-white">{data.orders || 0}</span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomOrdersTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-zinc-900 text-white p-3 rounded-2xl shadow-xl text-xs font-semibold border border-zinc-800 space-y-1">
        <p className="text-zinc-400 font-bold mb-1">{data.fullDate || data.date || label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-zinc-200">Revenue:</span>
          <span className="font-bold text-emerald-400">{formatCurrency(data.revenue || 0)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span className="text-zinc-200">Orders:</span>
          <span className="font-bold text-indigo-400">{data.orders || 0}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((state) => state.admin);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const metrics = dashboard?.metrics || {};
  const revenue30d = dashboard?.revenueOverview || [];
  const revenue7d = dashboard?.last7DaysData || [];
  const chartData = timeRange === '7d' ? revenue7d : revenue30d;

  const ordersOverview = dashboard?.ordersOverview || [];
  const topCategories = dashboard?.topSellingCategories || [];
  const lowStockAlert = dashboard?.lowStockAlert || [];
  const recentOrders = dashboard?.recentOrders || [];
  const petsSummary = dashboard?.petsSummary || { total: 0, available: 0, adopted: 0, notAvailable: 0 };

  const totalOrdersCount = metrics.totalOrders?.value || 0;
  const totalRevenueValue = metrics.totalRevenue?.value || 0;
  const todayRevenueValue = metrics.todayRevenue?.value || 0;
  const todayOrdersValue = metrics.todayOrders?.value || 0;

  // Calculate sum in active chart window
  const activeWindowRevenue = useMemo(() => {
    return chartData.reduce((sum, d) => sum + (d.revenue || 0), 0);
  }, [chartData]);

  const activeWindowOrders = useMemo(() => {
    return chartData.reduce((sum, d) => sum + (d.orders || 0), 0);
  }, [chartData]);

  // Clean 4 essential KPI Cards matching BarbaeQ OwnerKpiCards
  const kpiCards = [
    {
      title: "Today's Revenue",
      value: formatCurrency(todayRevenueValue),
      subtitle: 'Total all-time',
      subtitleValue: formatCurrency(totalRevenueValue),
      icon: IndianRupee,
      bg: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Total Orders',
      value: totalOrdersCount.toLocaleString(),
      subtitle: 'Today placed',
      subtitleValue: `${todayOrdersValue} orders`,
      icon: ShoppingBag,
      bg: 'bg-indigo-50 text-indigo-700',
    },
    {
      title: 'Pending Orders',
      value: (metrics.pendingOrders?.value || 0).toLocaleString(),
      subtitle: 'Fulfillment',
      subtitleValue: 'Needs dispatch',
      icon: Clock,
      bg: 'bg-orange-50 text-orange-700',
    },
    {
      title: 'Live Stock (Pets)',
      value: (petsSummary.available || 0).toLocaleString(),
      subtitle: 'Total catalog',
      subtitleValue: `${petsSummary.total || 0} pets`,
      icon: Dog,
      bg: 'bg-teal-50 text-teal-700',
    },
  ];

  const getStatusBadge = (st) => {
    switch (st) {
      case 'DELIVERED':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold">Delivered</span>;
      case 'PROCESSING':
        return <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200/60 text-[10px] font-bold">Processing</span>;
      case 'SHIPPED':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 text-[10px] font-bold">Shipped</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60 text-[10px] font-bold">Out for Delivery</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 text-[10px] font-bold">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 text-[10px] font-bold">Placed</span>;
    }
  };

  const pieColors = ['#10b981', '#6366f1', '#f59e0b', '#3b82f6', '#ec4899', '#f43f5e'];

  return (
    <div className="space-y-6">
      {/* 1. BarbaeQ Style Clean 4-Column KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-card flex flex-col justify-between hover:border-zinc-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{card.title}</span>
                <div className={`p-2 rounded-xl shrink-0 ${card.bg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-zinc-900 font-display">
                  {card.value}
                </div>
                <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                  {card.subtitle}: <strong className="text-zinc-700 font-semibold">{card.subtitleValue}</strong>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Real Revenue Overview (Area Chart) with 7D / 30D Window Selector */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-card border border-zinc-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-zinc-900 font-display">
                Revenue Overview ({timeRange === '7d' ? 'Last 7 Days' : 'Last 30 Days'})
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Real-time daily transaction earnings from customer orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 7D / 30D Toggle Pills */}
            <div className="flex items-center p-1 rounded-xl bg-zinc-100 border border-zinc-200 text-xs font-bold">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeRange === '7d' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  timeRange === '30d' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="h-72 min-w-[540px] sm:min-w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="cleanRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey={timeRange === '7d' ? 'weekday' : 'date'}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomRevenueTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#cleanRevenueGradient)"
                  activeDot={{ r: 6, fill: '#059669', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Daily Sales Bar Chart (Last 7 Days) + Order Status Breakdown Donut (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real Daily Sales Breakdown Bar Chart - Last 7 Days */}
        <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-card border border-zinc-200 flex flex-col justify-between overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-zinc-900 font-display">
                  Daily Orders Volume (Last 7 Days)
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Daily total orders count across the last 7 days
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto pb-2 scrollbar-thin">
            <div className="h-60 min-w-[480px] sm:min-w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenue7d.length > 0 ? revenue7d : chartData.slice(-7)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="weekday"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomOrdersTooltip />} />
                  <Bar dataKey="orders" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-center gap-5 pt-3 border-t border-zinc-100 flex-wrap text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="text-zinc-700 font-bold">Daily Orders Placed</span>
            </div>
          </div>
        </div>

        {/* Real Order Statuses Donut Chart with 2-Column Values List */}
        <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-card border border-zinc-200 flex flex-col justify-between overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-9 h-9 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <PieIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-zinc-900 font-display">
                  Order Statuses Breakdown
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Delivered, processing, shipped & pending distribution
                </p>
              </div>
            </div>

            <span className="hidden sm:block px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-black shrink-0">
              {totalOrdersCount} Total Orders
            </span>
          </div>

          {ordersOverview.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
              <div className="h-52 w-52 relative flex items-center justify-center shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersOverview}
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {ordersOverview.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '16px',
                        background: '#18181b',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        border: 'none',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-zinc-900 font-display leading-none">
                    {totalOrdersCount}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Orders</span>
                </div>
              </div>

              {/* 2 Columns Data Values Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs flex-1 w-full">
                {ordersOverview.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 hover:bg-zinc-100/70 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color || pieColors[i % pieColors.length] }} />
                      <span className="font-semibold text-zinc-700 truncate">{item.name}</span>
                    </div>
                    <span className="font-black text-zinc-900 ml-1.5 shrink-0">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-zinc-400 font-medium">No order statistics recorded yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

