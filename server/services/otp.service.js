import bcrypt from 'bcryptjs';
import twilio from 'twilio';
import { OTP } from '../models/OTP.js';

let twilioClient = null;
if (
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_PHONE_NUMBER
) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

export const generateAndSendOtp = async (phone, type = 'SIGNUP') => {
  // Generate random 6-digit OTP
  const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP before storage
  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(rawOtp, salt);

  // Expiry in 5 minutes
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Check recent OTPs sent to this phone in the last hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = await OTP.countDocuments({ phone, createdAt: { $gte: oneHourAgo } });

  if (recentCount >= 6) {
    throw new Error('Too many OTP requests for this number. Please try again after 1 hour.');
  }

  // Remove any existing active OTP for this phone & type
  await OTP.deleteMany({ phone, type });

  // Save new OTP
  await OTP.create({
    phone,
    otp: hashedOtp,
    type,
    expiresAt,
    attempts: 0,
    resendCount: recentCount + 1,
  });

  // Try to send via Twilio if configured
  let sentViaSms = false;
  if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
    try {
      await twilioClient.messages.create({
        body: `Your The Dogs Garage verification code is: ${rawOtp}. Valid for 5 minutes. Do not share this OTP.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone.startsWith('+') ? phone : `+91${phone}`,
      });
      sentViaSms = true;
      console.log(`[SMS] Twilio sent OTP to ${phone}`);
    } catch (smsError) {
      console.warn(`[SMS Warning] Failed to send SMS via Twilio: ${smsError.message}`);
    }
  }

  console.log(`[Auth OTP] Recipient: ${phone} | Type: ${type} | Code: ${rawOtp} | Expiry: ${expiresAt.toLocaleTimeString()}`);

  return {
    success: true,
    message: sentViaSms
      ? 'OTP sent successfully to your phone.'
      : 'OTP sent! (Development mode: Check console or use displayed OTP)',
    devOtp: process.env.NODE_ENV !== 'production' ? rawOtp : undefined,
    expiresAt,
  };
};

export const verifyOtpCode = async (phone, rawOtp, type = 'SIGNUP') => {
  const otpRecord = await OTP.findOne({ phone, type });

  if (!otpRecord) {
    throw new Error('OTP has expired or does not exist. Please request a new one.');
  }

  if (otpRecord.expiresAt < new Date()) {
    await OTP.deleteOne({ _id: otpRecord._id });
    throw new Error('OTP has expired. Please request a new OTP.');
  }

  if (otpRecord.attempts >= 4) {
    await OTP.deleteOne({ _id: otpRecord._id });
    throw new Error('Maximum verification attempts exceeded. Please request a new OTP.');
  }

  const isMatch = await otpRecord.compareOtp(rawOtp);
  if (!isMatch) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new Error(`Invalid OTP code. ${4 - otpRecord.attempts} attempts remaining.`);
  }

  // Delete verified OTP record
  await OTP.deleteOne({ _id: otpRecord._id });
  return true;
};
