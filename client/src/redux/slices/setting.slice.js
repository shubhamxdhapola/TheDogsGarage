import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { BUSINESS_CONFIG } from '../../utils/constants.js';

const initialSettings = {
  storeName: BUSINESS_CONFIG.NAME,
  tagline: BUSINESS_CONFIG.TAGLINE,
  contactEmail: BUSINESS_CONFIG.EMAIL,
  contactPhone: BUSINESS_CONFIG.PHONE,
  whatsappNumber: BUSINESS_CONFIG.WHATSAPP,
  address: BUSINESS_CONFIG.LOCATION,
  freeDeliveryThreshold: 999,
  standardDeliveryFee: 99,
  upiId: 'thedogsgarage@okhdfcbank',
  enableCOD: true,
  enableUPI: true,
};

export const fetchStoreSettings = createAsyncThunk(
  'settings/fetchStoreSettings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.SETTINGS);
      return res.data?.settings || {};
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch settings');
    }
  }
);

const settingSlice = createSlice({
  name: 'settings',
  initialState: {
    settings: initialSettings,
    loading: false,
    error: null,
  },
  reducers: {
    setSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStoreSettings.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.settings = { ...state.settings, ...action.payload };
        }
      })
      .addCase(fetchStoreSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSettings } = settingSlice.actions;
export default settingSlice.reducer;
