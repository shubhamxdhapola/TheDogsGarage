import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { fetchStoreSettings, setSettings } from './setting.slice.js';

const loadGuestCart = () => {
  try {
    const saved = localStorage.getItem('tdg_guest_cart');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const saveGuestCart = (items) => {
  localStorage.setItem('tdg_guest_cart', JSON.stringify(items));
};

export const fetchServerCart = createAsyncThunk('cart/fetchServerCart', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(API_PATHS.CART.GET);
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
  }
});

export const syncGuestCart = createAsyncThunk('cart/syncGuestCart', async (guestItems, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(API_PATHS.CART.SYNC, { guestItems });
    localStorage.removeItem('tdg_guest_cart');
    return res.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to sync cart');
  }
});

export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async ({ product, quantity = 1 }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (auth.isAuthenticated) {
      try {
        const res = await axiosInstance.post(API_PATHS.CART.ADD_ITEM, {
          productId: product._id,
          quantity,
        });
        return res.data.cart;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to add item');
      }
    }
    // Guest cart fallback handled synchronously in extraReducers
    return { product, quantity, isGuest: true };
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (auth.isAuthenticated) {
      try {
        const res = await axiosInstance.patch(API_PATHS.CART.UPDATE_QTY(productId), { quantity });
        return res.data.cart;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update quantity');
      }
    }
    return { productId, quantity, isGuest: true };
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (auth.isAuthenticated) {
      try {
        const res = await axiosInstance.delete(API_PATHS.CART.REMOVE_ITEM(productId));
        return res.data.cart;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to remove item');
      }
    }
    return { productId, isGuest: true };
  }
);

export const calculateTotals = (items = [], threshold = 999, fee = 99) => {
  let subtotal = 0;
  let discount = 0;
  let totalItemsCount = 0;

  (items || []).forEach((item) => {
    const p = item.product || item || {};
    const price = item.price || p.price || 0;
    const originalPrice = item.originalPrice || p.originalPrice || price;
    const qty = item.quantity || 1;

    subtotal += price * qty;
    if (originalPrice > price) {
      discount += (originalPrice - price) * qty;
    }
    totalItemsCount += qty;
  });

  const isFree = subtotal >= threshold || subtotal === 0;
  const deliveryCharge = isFree ? 0 : fee;
  const total = subtotal + deliveryCharge;

  return {
    subtotal,
    discount,
    deliveryCharge,
    total,
    totalAmount: subtotal, // Backward compatibility alias
    totalItemsCount,
  };
};

const initialGuestItems = loadGuestCart();
const initialTotals = calculateTotals(initialGuestItems);

const initialState = {
  items: initialGuestItems,
  subtotal: initialTotals.subtotal,
  discount: initialTotals.discount,
  deliveryCharge: initialTotals.deliveryCharge,
  total: initialTotals.total,
  totalAmount: initialTotals.subtotal,
  totalItemsCount: initialTotals.totalItemsCount,
  isCartDrawerOpen: false,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    openCartDrawer: (state) => {
      state.isCartDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isCartDrawerOpen = false;
    },
    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
    clearLocalCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.discount = 0;
      state.deliveryCharge = 0;
      state.total = 0;
      state.totalAmount = 0;
      state.totalItemsCount = 0;
      localStorage.removeItem('tdg_guest_cart');
    },
  },
  extraReducers: (builder) => {
    builder
      // Setting updates
      .addCase(fetchStoreSettings.fulfilled, (state, action) => {
        if (action.payload) {
          const threshold = action.payload.freeDeliveryThreshold ?? 999;
          const fee = action.payload.standardDeliveryFee ?? 99;
          const isFree = state.subtotal >= threshold || state.subtotal === 0;
          state.deliveryCharge = isFree ? 0 : fee;
          state.total = state.subtotal + state.deliveryCharge;
        }
      })
      .addCase(setSettings, (state, action) => {
        if (action.payload) {
          const threshold = action.payload.freeDeliveryThreshold ?? 999;
          const fee = action.payload.standardDeliveryFee ?? 99;
          const isFree = state.subtotal >= threshold || state.subtotal === 0;
          state.deliveryCharge = isFree ? 0 : fee;
          state.total = state.subtotal + state.deliveryCharge;
        }
      })
      // Fetch server cart
      .addCase(fetchServerCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServerCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items = action.payload.items || [];
          state.subtotal = action.payload.subtotal || 0;
          state.discount = action.payload.discount || 0;
          state.deliveryCharge = action.payload.deliveryCharge ?? 0;
          state.total = action.payload.total || 0;
          state.totalAmount = action.payload.subtotal || 0;
          state.totalItemsCount = action.payload.totalItemsCount || 0;
        }
      })
      .addCase(fetchServerCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sync guest cart
      .addCase(syncGuestCart.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload.items || [];
          state.subtotal = action.payload.subtotal || 0;
          state.discount = action.payload.discount || 0;
          state.deliveryCharge = action.payload.deliveryCharge ?? 0;
          state.total = action.payload.total || 0;
          state.totalAmount = action.payload.subtotal || 0;
          state.totalItemsCount = action.payload.totalItemsCount || 0;
        }
      })
      // Add item
      .addCase(addItemToCart.fulfilled, (state, action) => {
        if (action.payload.isGuest) {
          const { product, quantity } = action.payload;
          const existingItem = state.items.find(
            (i) => (i.product?._id || i.product) === (product._id || product.id)
          );
          if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.lineTotal = (product.price || 0) * existingItem.quantity;
          } else {
            state.items.push({
              product: {
                _id: product._id || product.id,
                name: product.name,
                slug: product.slug,
                sku: product.sku,
                price: product.price,
                originalPrice: product.originalPrice,
                discount: product.discount,
                stock: product.stock,
                image: product.images?.[0] || '',
              },
              quantity,
              price: product.price,
              lineTotal: product.price * quantity,
            });
          }
          const totals = calculateTotals(state.items);
          Object.assign(state, totals);
          saveGuestCart(state.items);
        } else {
          state.items = action.payload.items;
          state.subtotal = action.payload.subtotal;
          state.discount = action.payload.discount;
          state.deliveryCharge = action.payload.deliveryCharge;
          state.total = action.payload.total;
          state.totalAmount = action.payload.subtotal;
          state.totalItemsCount = action.payload.totalItemsCount;
        }
      })
      // Update quantity
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        if (action.payload.isGuest) {
          const { productId, quantity } = action.payload;
          const item = state.items.find((i) => (i.product?._id || i.product) === productId);
          if (item) {
            item.quantity = quantity;
            item.lineTotal = (item.price || item.product?.price || 0) * quantity;
          }
          const totals = calculateTotals(state.items);
          Object.assign(state, totals);
          saveGuestCart(state.items);
        } else {
          state.items = action.payload.items;
          state.subtotal = action.payload.subtotal;
          state.discount = action.payload.discount;
          state.deliveryCharge = action.payload.deliveryCharge;
          state.total = action.payload.total;
          state.totalAmount = action.payload.subtotal;
          state.totalItemsCount = action.payload.totalItemsCount;
        }
      })
      // Remove item
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (action.payload.isGuest) {
          const { productId } = action.payload;
          state.items = state.items.filter((i) => (i.product?._id || i.product) !== productId);
          const totals = calculateTotals(state.items);
          Object.assign(state, totals);
          saveGuestCart(state.items);
        } else {
          state.items = action.payload.items;
          state.subtotal = action.payload.subtotal;
          state.discount = action.payload.discount;
          state.deliveryCharge = action.payload.deliveryCharge;
          state.total = action.payload.total;
          state.totalAmount = action.payload.subtotal;
          state.totalItemsCount = action.payload.totalItemsCount;
        }
      });
  },
});

export const { openCartDrawer, closeCartDrawer, toggleCartDrawer, clearLocalCart } =
  cartSlice.actions;
export default cartSlice.reducer;
