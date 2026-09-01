import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.PRODUCTS.GET_ALL, { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.PRODUCTS.GET_CATEGORIES);
      return res.data.categories;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.PRODUCTS.GET_ONE(id));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch product details');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API_PATHS.PRODUCTS.CREATE, data);
      return res.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(API_PATHS.PRODUCTS.UPDATE(id), data);
      return res.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(API_PATHS.PRODUCTS.DELETE(id));
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete product');
    }
  }
);

const initialState = {
  products: [],
  categories: [],
  selectedProduct: null,
  reviews: [],
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
    limit: 12,
  },
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload.product;
        state.reviews = action.payload.reviews || [];
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
