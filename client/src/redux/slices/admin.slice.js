import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';

export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.ADMIN.DASHBOARD);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchAnalytics = createAsyncThunk(
  'admin/fetchAnalytics',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.ADMIN.ANALYTICS, { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  'admin/fetchAdminOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.ADMIN.ORDERS, { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch admin orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ id, orderStatus, note }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(API_PATHS.ADMIN.UPDATE_ORDER_STATUS(id), {
        orderStatus,
        note,
      });
      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update order status');
    }
  }
);

export const fetchAdminCustomers = createAsyncThunk(
  'admin/fetchAdminCustomers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.ADMIN.CUSTOMERS, { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch customers');
    }
  }
);

const initialState = {
  dashboard: null,
  analytics: null,
  orders: [],
  ordersPagination: { total: 0, page: 1, pages: 1, limit: 10 },
  customers: [],
  customersPagination: { total: 0, page: 1, pages: 1, limit: 10 },
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Analytics
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      })
      // Orders
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.ordersPagination = action.payload.pagination;
      })
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.orders = state.orders.map((o) =>
          o._id === action.payload._id || o.orderId === action.payload.orderId
            ? action.payload
            : o
        );
      })
      // Customers
      .addCase(fetchAdminCustomers.fulfilled, (state, action) => {
        state.customers = action.payload.customers;
        state.customersPagination = action.payload.pagination;
      });
  },
});

export default adminSlice.reducer;
