import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, UserCheck, ShieldAlert, Phone, Mail, RotateCcw, Users, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAdminCustomers } from '../../redux/slices/admin.slice.js';
import { formatDate, formatCurrency } from '../../utils/helpers.js';

export const CustomersPage = () => {
  const dispatch = useDispatch();
  const { customers, customersPagination, loading } = useSelector((state) => state.admin);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = { page, limit: 10 };
    if (search) params.search = search;
    dispatch(fetchAdminCustomers(params));
  }, [dispatch, search, page]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight font-display">
          Customer Directory
        </h1>
        <p className="text-xs text-zinc-500 font-medium mt-0.5">
          Registered customer accounts, orders history, addresses and contact details
        </p>
      </div>

      {/* Filter / Search Bar matching BarbaeQ */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm font-medium text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-900 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap">
            <thead className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-4 px-6 whitespace-nowrap">Customer</th>
                <th className="py-4 px-6 whitespace-nowrap">Phone Number</th>
                <th className="py-4 px-6 whitespace-nowrap">Email</th>
                <th className="py-4 px-6 whitespace-nowrap">Registered Date</th>
                <th className="py-4 px-6 whitespace-nowrap">Total Orders</th>
                <th className="py-4 px-6 whitespace-nowrap">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zinc-900 mx-auto"></div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400 font-bold">
                    No customers found matching search.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-900 font-bold text-xs flex items-center justify-center border border-zinc-200/80 shrink-0 shadow-2xs">
                          {c.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <p className="font-bold text-zinc-900">{c.name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-zinc-800 whitespace-nowrap">{c.phone}</td>
                    <td className="py-4 px-6 text-zinc-600 whitespace-nowrap">{c.email || '—'}</td>
                    <td className="py-4 px-6 text-zinc-500 font-medium whitespace-nowrap">{formatDate(c.createdAt)}</td>
                    <td className="py-4 px-6 font-bold text-zinc-900 whitespace-nowrap">{c.ordersCount || 0}</td>
                    <td className="py-4 px-6 font-black text-zinc-900 text-sm whitespace-nowrap">
                      {formatCurrency(c.totalSpent || 0)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
