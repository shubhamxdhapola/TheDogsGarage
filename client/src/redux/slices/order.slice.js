import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { clearLocalCart } from './cart.slice.js';

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API_PATHS.ORDERS.CREATE, orderData);
      if (orderData.paymentMethod === 'COD') {
        dispatch(clearLocalCart());
      }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to place order');
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'orders/verifyPayment',
  async (paymentData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API_PATHS.ORDERS.VERIFY_PAYMENT, paymentData);
      dispatch(clearLocalCart());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Payment verification failed');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.ORDERS.MY_ORDERS, { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.ORDERS.GET_ONE(id));
      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API_PATHS.ORDERS.CANCEL(id));
      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to cancel order');
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  latestPlacedOrder: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  },
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearLatestPlacedOrder: (state) => {
      state.latestPlacedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.latestPlacedOrder = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.latestPlacedOrder = action.payload.order;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single order
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.orders = state.orders.map((o) =>
          o._id === action.payload._id ? action.payload : o
        );
      });
  },
});

export const { clearCurrentOrder, clearLatestPlacedOrder } = orderSlice.actions;
export default orderSlice.reducer;
