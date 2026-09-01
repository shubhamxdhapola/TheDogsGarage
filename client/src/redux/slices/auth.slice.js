import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';

// Load initial user state from localStorage
const storedUser = localStorage.getItem('tdg_user');
const storedToken = localStorage.getItem('tdg_auth_token');

export const sendOtp = createAsyncThunk('auth/sendOtp', async ({ phone }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(API_PATHS.AUTH.SEND_OTP, { phone });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
  }
});

// Step 1: Signup User (stores registration & dispatches OTP)
export const signup = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Signup failed');
  }
});

// Step 2: Verify Phone OTP and log in
export const verifySignup = createAsyncThunk('auth/verifySignup', async ({ phone, otp }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(API_PATHS.AUTH.VERIFY_SIGNUP, { phone, otp });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'OTP Verification failed');
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async ({ phone }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { phone });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to initiate password reset');
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ phone, otp, newPassword }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, { phone, otp, newPassword });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Password reset failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(API_PATHS.AUTH.GET_ME);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load user profile');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
  } catch (e) {
    // Ignore error
  }
  localStorage.removeItem('tdg_auth_token');
  localStorage.removeItem('tdg_user');
  return null;
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
  }
});

export const addAddress = createAsyncThunk('auth/addAddress', async (addressData, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(API_PATHS.AUTH.ADD_ADDRESS, addressData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add address');
  }
});

export const updateAddress = createAsyncThunk('auth/updateAddress', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.put(API_PATHS.AUTH.UPDATE_ADDRESS(id), data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update address');
  }
});

export const deleteAddress = createAsyncThunk('auth/deleteAddress', async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.delete(API_PATHS.AUTH.DELETE_ADDRESS(id));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete address');
  }
});

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
  otpStatus: null,
  isAuthModalOpen: false,
  authModalTab: 'login', // 'login' | 'signup' | 'verify' | 'forgot' | 'reset'
  authModalData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetOtpStatus: (state) => {
      state.otpStatus = null;
    },
    openAuthModal: (state, action) => {
      state.isAuthModalOpen = true;
      state.authModalTab = action.payload?.tab || 'login';
      state.authModalData = action.payload?.data || null;
      state.error = null;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
      state.authModalTab = 'login';
      state.authModalData = null;
      state.error = null;
    },
    setAuthModalTab: (state, action) => {
      state.authModalTab = typeof action.payload === 'string' ? action.payload : (action.payload?.tab || 'login');
      if (action.payload?.data) {
        state.authModalData = action.payload.data;
      }
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpStatus = action.payload;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Signup (Step 1)
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.otpStatus = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify Signup (Step 2)
      .addCase(verifySignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifySignup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('tdg_auth_token', action.payload.token);
        localStorage.setItem('tdg_user', JSON.stringify(action.payload.user));
      })
      .addCase(verifySignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('tdg_auth_token', action.payload.token);
        localStorage.setItem('tdg_user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('tdg_auth_token', action.payload.token);
        localStorage.setItem('tdg_user', JSON.stringify(action.payload.user));
      })
      // GetMe
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem('tdg_user', JSON.stringify(action.payload.user));
      })
      .addCase(getMe.rejected, (state, action) => {
        if (action.payload && (action.payload.includes('expired') || action.payload.includes('required') || action.payload.includes('Invalid'))) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem('tdg_auth_token');
          localStorage.removeItem('tdg_user');
        }
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Profile update
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem('tdg_user', JSON.stringify(action.payload.user));
      })
      // Addresses
      .addCase(addAddress.fulfilled, (state, action) => {
        if (state.user) {
          state.user.addresses = action.payload.addresses;
          localStorage.setItem('tdg_user', JSON.stringify(state.user));
        }
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        if (state.user) {
          state.user.addresses = action.payload.addresses;
          localStorage.setItem('tdg_user', JSON.stringify(state.user));
        }
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        if (state.user) {
          state.user.addresses = action.payload.addresses;
          localStorage.setItem('tdg_user', JSON.stringify(state.user));
        }
      });
  },
});

export const { clearError, resetOtpStatus, openAuthModal, closeAuthModal, setAuthModalTab } = authSlice.actions;
export default authSlice.reducer;
