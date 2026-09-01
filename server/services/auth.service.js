import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Otp } from '../models/Otp.js';
import { UserRoles } from '../utils/constants.js';
import { sendSMS, verifyTwilioCode, formatPhoneNumber } from '../utils/smsService.js';

// ═══════════════════════════════════════════════════
//  PHONE NORMALIZATION & LOOKUP HELPERS
// ═══════════════════════════════════════════════════

export const getPhoneVariants = (rawPhone) => {
  if (!rawPhone) return [];
  const rawStr = rawPhone.toString().trim();
  const digitsOnly = rawStr.replace(/\D/g, '');
  const last10 = digitsOnly.slice(-10);
  const e164 = `+91${last10}`;

  return Array.from(
    new Set([
      rawStr,
      digitsOnly,
      last10,
      e164,
      `91${last10}`,
      `0${last10}`,
      `+${digitsOnly}`,
    ])
  ).filter(Boolean);
};

export const findUserByPhone = async (phone, selectPassword = false) => {
  const variants = getPhoneVariants(phone);
  if (variants.length === 0) return null;
  const digitsOnly = phone.toString().replace(/\D/g, '');
  const last10 = digitsOnly.slice(-10);

  let query = User.findOne({
    $or: [
      { phone: { $in: variants } },
      ...(last10 && last10.length === 10 ? [{ phone: new RegExp(`${last10}$`) }] : []),
    ],
  });

  if (selectPassword) {
    query = query.select('+password');
  }

  return await query;
};

// ═══════════════════════════════════════════════════
//  OTP helpers (shared by signup, forgot-password)
// ═══════════════════════════════════════════════════

export const generateAndSendOtp = async (phone) => {
  const formattedPhone = formatPhoneNumber(phone);
  const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = await bcrypt.genSalt(10);
  const otpHash = await bcrypt.hash(rawOtp, salt);

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const variants = getPhoneVariants(phone);
  await Otp.deleteMany({ phone: { $in: variants } });
  await Otp.create({ phone: formattedPhone, otpHash, expiresAt, attempts: 0 });

  const message = `Your verification code for The Dogs Garage is ${rawOtp}. Valid for 5 minutes. Do not share this with anyone.`;
  const smsResult = await sendSMS(formattedPhone, message, rawOtp);

  return {
    success: true,
    message: 'OTP sent successfully',
    phone: formattedPhone,
    provider: smsResult.service,
  };
};

/**
 * Verify OTP via Twilio Verify or fallback DB lookup. Returns true or throws.
 */
export const verifyOtpInternal = async (phone, enteredOtp) => {
  const formattedPhone = formatPhoneNumber(phone);
  const variants = getPhoneVariants(phone);

  // 1. Twilio Verify check
  const twilioResult = await verifyTwilioCode(formattedPhone, enteredOtp);
  if (twilioResult.isTwilioVerify && twilioResult.success) {
    await Otp.deleteMany({ phone: { $in: variants } });
    return true;
  }

  // 2. Database OTP fallback across variants
  const otpRecord = await Otp.findOne({ phone: { $in: variants } });
  if (!otpRecord) {
    throw new Error('OTP has expired or was never requested. Please request a new OTP.');
  }

  if (otpRecord.attempts >= 5) {
    await Otp.deleteOne({ _id: otpRecord._id });
    throw new Error('Too many invalid attempts. Please request a new OTP.');
  }

  const isMatch = await otpRecord.compareOtp(enteredOtp);
  if (!isMatch) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new Error(`Invalid OTP. ${5 - otpRecord.attempts} attempt(s) remaining.`);
  }

  await Otp.deleteMany({ phone: { $in: variants } });
  return true;
};

// ═══════════════════════════════════════════════════
//  PASSWORD-BASED AUTH
// ═══════════════════════════════════════════════════

/**
 * SIGNUP — Step 1: Create unverified user + send OTP
 */
export const signupUser = async (name, email, phone, password) => {
  const standardizedPhone = formatPhoneNumber(phone);
  const existing = await findUserByPhone(phone);

  if (existing && existing.isPhoneVerified) {
    throw new Error('An account with this phone number already exists. Please login instead.');
  }

  if (existing && !existing.isPhoneVerified) {
    // Re-attempt: update fields and resend OTP
    existing.name = name;
    existing.email = email || existing.email;
    existing.phone = standardizedPhone;
    existing.password = password; // will be hashed by pre-save hook
    await existing.save();
    await generateAndSendOtp(standardizedPhone);
    return {
      success: true,
      message: 'Verification code resent to your phone',
      phone: standardizedPhone,
    };
  }

  // Create new user (unverified)
  const adminPhone = process.env.ADMIN_PHONE || '+919999999999';
  const isAdminPhone = standardizedPhone === formatPhoneNumber(adminPhone);
  await User.create({
    name,
    email: email || '',
    phone: standardizedPhone,
    password, // hashed by pre-save hook
    isPhoneVerified: false,
    isVerified: false,
    role: isAdminPhone ? UserRoles.ADMIN : UserRoles.CUSTOMER,
  });

  await generateAndSendOtp(standardizedPhone);
  return {
    success: true,
    message: 'Verification code sent to your phone',
    phone: standardizedPhone,
  };
};

/**
 * SIGNUP — Step 2: Verify OTP → mark verified → return JWT
 */
export const verifySignupOtp = async (phone, otp) => {
  await verifyOtpInternal(phone, otp);

  const user = await findUserByPhone(phone);
  if (!user) throw new Error('User not found. Please signup again.');

  user.isPhoneVerified = true;
  user.isVerified = true;
  await user.save();

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
};

/**
 * LOGIN — Phone + Password (flexible format matching)
 */
export const loginWithPassword = async (phone, password) => {
  const user = await findUserByPhone(phone, true);

  if (!user) {
    throw new Error('No account found with this phone number. Please sign up first.');
  }

  if (!user.password) {
    throw new Error(
      'Your account was created before passwords were required. Please use "Forgot Password" to set a password.'
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Incorrect password. Please try again or use "Forgot Password".');
  }

  // If correct password provided, verify account status
  if (!user.isPhoneVerified || !user.isVerified) {
    user.isPhoneVerified = true;
    user.isVerified = true;
    await user.save();
  }

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
};

/**
 * FORGOT PASSWORD — Send OTP
 */
export const initiatePasswordReset = async (phone) => {
  const user = await findUserByPhone(phone);
  if (!user) {
    throw new Error('No account found with this phone number.');
  }

  await generateAndSendOtp(user.phone || phone);
  return {
    success: true,
    message: 'Password reset code sent to your phone',
    phone: user.phone || phone,
  };
};

/**
 * RESET PASSWORD — Verify OTP + set new password → return JWT
 */
export const resetPassword = async (phone, otp, newPassword) => {
  await verifyOtpInternal(phone, otp);

  const user = await findUserByPhone(phone);
  if (!user) throw new Error('User not found.');

  user.password = newPassword; // hashed by pre-save hook
  user.isPhoneVerified = true;
  user.isVerified = true;
  await user.save();

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
};

// ═══════════════════════════════════════════════════
//  LEGACY OTP-ONLY LOGIN
// ═══════════════════════════════════════════════════

export const verifyOtpAndLogin = async (phone, enteredOtp, name = '') => {
  await verifyOtpInternal(phone, enteredOtp);

  let user = await findUserByPhone(phone);
  let isNewUser = false;
  const formattedPhone = formatPhoneNumber(phone);

  if (!user) {
    isNewUser = true;
    const adminPhone = process.env.ADMIN_PHONE || '+919999999999';
    const isAdminPhone = formattedPhone === formatPhoneNumber(adminPhone);
    user = await User.create({
      phone: formattedPhone,
      name: name || (isAdminPhone ? 'Admin' : 'Customer'),
      role: isAdminPhone ? UserRoles.ADMIN : UserRoles.CUSTOMER,
      isPhoneVerified: true,
      isVerified: true,
    });
  } else if (!user.name && name) {
    user.name = name;
    await user.save();
  }

  const needsName = isNewUser || !user.name || user.name.trim() === '';
  const token = generateToken(user);

  return { user: sanitizeUser(user), token, isNewUser: needsName };
};

// ═══════════════════════════════════════════════════
//  SHARED UTILITIES
// ═══════════════════════════════════════════════════

export const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_the_dogs_garage_2024_secure_token_key_pet_store';
  return jwt.sign(
    { id: user._id, phone: user.phone, role: user.role },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE || '7d' }
  );
};

export const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.__v;
  delete userObj.password;
  if (userObj._id && !userObj.id) {
    userObj.id = userObj._id;
  }
  return userObj;
};
