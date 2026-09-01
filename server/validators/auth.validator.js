import { z } from 'zod';

export const sendOtpSchema = z.object({
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  type: z.enum(['SIGNUP', 'LOGIN', 'FORGOT_PASSWORD']).default('SIGNUP'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

export const loginSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
  password: z.string().min(1, 'Password is required'),
});

export const verifyOtpSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  type: z.enum(['SIGNUP', 'LOGIN', 'FORGOT_PASSWORD']).default('SIGNUP'),
});

export const forgotPasswordSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});
