import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice.js';
import cartReducer from './slices/cart.slice.js';
import petReducer from './slices/pet.slice.js';
import productReducer from './slices/product.slice.js';
import orderReducer from './slices/order.slice.js';
import adminReducer from './slices/admin.slice.js';
import settingReducer from './slices/setting.slice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    pets: petReducer,
    products: productReducer,
    orders: orderReducer,
    admin: adminReducer,
    settings: settingReducer,
  },
});

export default store;
