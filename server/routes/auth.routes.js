import express from 'express';
import {
  signup,
  verifySignup,
  login,
  forgotPassword,
  resetPassword,
  sendOtp,
  verifyOtp,
  getMe,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  logout,
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.js';
import { otpLimiter, authLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Password + Phone Auth Endpoints
router.post('/signup', authLimiter, signup);
router.post('/verify-signup', authLimiter, verifySignup);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

// Legacy OTP Endpoints (kept for backward compatibility)
router.post('/send-otp', otpLimiter, sendOtp);
router.post('/verify-otp', authLimiter, verifyOtp);

// Session & Profile
router.post('/logout', logout);
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);

// Address Management (support both singular /address and plural /addresses)
router.post('/address', verifyToken, addAddress);
router.post('/addresses', verifyToken, addAddress);
router.put('/address/:addressId', verifyToken, updateAddress);
router.put('/addresses/:addressId', verifyToken, updateAddress);
router.delete('/address/:addressId', verifyToken, deleteAddress);
router.delete('/addresses/:addressId', verifyToken, deleteAddress);

export default router;
