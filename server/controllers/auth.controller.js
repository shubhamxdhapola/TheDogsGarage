import * as authService from '../services/auth.service.js';
import { User } from '../models/User.js';

// ── Cookie helper ──
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// ═══════════════════════════════════════════════════
//  NEW PASSWORD-BASED ENDPOINTS
// ═══════════════════════════════════════════════════

/** POST /api/auth/signup — Register with name, email, phone, password */
export const signup = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const result = await authService.signupUser(name, email, phone, password);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/** POST /api/auth/verify-signup — Verify phone OTP after signup */
export const verifySignup = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    const { user, token } = await authService.verifySignupOtp(phone, otp);
    setTokenCookie(res, token);
    return res.status(200).json({
      message: 'Phone verified & account created successfully',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/** POST /api/auth/login — Login with phone + password */
export const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    const { user, token } = await authService.loginWithPassword(phone, password);
    setTokenCookie(res, token);
    return res.status(200).json({
      message: 'Login successful',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/** POST /api/auth/forgot-password — Send OTP for password reset */
export const forgotPassword = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const result = await authService.initiatePasswordReset(phone);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/** POST /api/auth/reset-password — Verify OTP + set new password */
export const resetPassword = async (req, res, next) => {
  try {
    const { phone, otp, newPassword } = req.body;
    const { user, token } = await authService.resetPassword(phone, otp, newPassword);
    setTokenCookie(res, token);
    return res.status(200).json({
      message: 'Password reset successfully',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════════════
//  LEGACY OTP-BASED ENDPOINTS (kept for compat)
// ═══════════════════════════════════════════════════

export const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const result = await authService.generateAndSendOtp(phone);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    const { user, token } = await authService.verifyLoginOtp(phone, otp);
    setTokenCookie(res, token);
    return res.status(200).json({
      message: 'OTP verified successfully',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { phone, otp, name, email } = req.body;
    const { user, token } = await authService.completeRegistration(phone, otp, name, email);
    setTokenCookie(res, token);
    return res.status(201).json({
      message: 'Registration completed successfully',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════════════
//  COMMON USER ACTIONS
// ═══════════════════════════════════════════════════

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name.trim();
    if (email !== undefined) user.email = email.trim();

    await user.save();
    return res.status(200).json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const addressData = req.body;
    const user = await User.findById(req.user._id);

    if (!user.addresses) user.addresses = [];

    // If this is user's first address, mark default
    if (user.addresses.length === 0) {
      addressData.isDefault = true;
    }

    user.addresses.push(addressData);
    await user.save();

    return res.status(201).json({
      message: 'Address added successfully',
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const addressData = req.body;
    const user = await User.findById(req.user._id);

    const addrIndex = user.addresses.findIndex((a) => a._id.toString() === id);
    if (addrIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    user.addresses[addrIndex] = {
      ...user.addresses[addrIndex].toObject(),
      ...addressData,
      _id: user.addresses[addrIndex]._id,
    };

    if (addressData.isDefault) {
      user.addresses.forEach((a, i) => {
        if (i !== addrIndex) a.isDefault = false;
      });
    }

    await user.save();

    return res.status(200).json({
      message: 'Address updated successfully',
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    user.addresses = user.addresses.filter((a) => a._id.toString() !== id);
    await user.save();

    return res.status(200).json({
      message: 'Address deleted successfully',
      addresses: user.addresses,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
};
