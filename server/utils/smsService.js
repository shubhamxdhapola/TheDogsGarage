import  twilioClient  from '../config/twilio.js';

/**
 * Standardize phone number to international E.164 format (+91XXXXXXXXXX)
 */
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.toString().replace(/\D/g, '');

  if (phone.toString().startsWith('+')) {
    return phone.toString();
  }

  // 10-digit Indian mobile number
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  // 12-digit Indian number with 91 prefix
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }

  return `+${cleaned}`;
};

/**
 * Send OTP using Twilio (Verify Service or Programmable SMS) with graceful local fallback
 */
export const sendSMS = async (phone, message, otp) => {
  const formattedPhone = formatPhoneNumber(phone);

  // 1. Try Twilio Verify API (if TWILIO_VERIFY_SERVICE_SID is configured)
  if (twilioClient && process.env.TWILIO_VERIFY_SERVICE_SID) {
    try {
      const verification = await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({
          to: formattedPhone,
          channel: 'sms',
        });

      console.log(`[SMS] Twilio Verify OTP sent to ${formattedPhone} (Status: ${verification.status})`);
      return { success: true, service: 'twilio_verify', sid: verification.sid, formattedPhone };
    } catch (err) {
      console.error(`[SMS Error] Twilio Verify error: ${err.message}`);
    }
  }

  // 2. Try Twilio Programmable SMS (if TWILIO_PHONE_NUMBER is configured)
  if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const msg = await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone,
      });

      console.log(`[SMS] Twilio SMS dispatched to ${formattedPhone} (SID: ${msg.sid})`);
      return { success: true, service: 'twilio_sms', sid: msg.sid, formattedPhone };
    } catch (err) {
      console.error(`[SMS Error] Twilio SMS error: ${err.message}`);
    }
  }

  // 3. Fallback to simulated dispatch in console
  console.log(`[SMS Simulation] OTP for ${formattedPhone}: ${otp}`);
  return { success: true, service: 'simulated', phone: formattedPhone };
};

/**
 * Verify OTP with Twilio Verify service if active
 */
export const verifyTwilioCode = async (phone, enteredOtp) => {
  if (!twilioClient || !process.env.TWILIO_VERIFY_SERVICE_SID) {
    return { isTwilioVerify: false };
  }

  const formattedPhone = formatPhoneNumber(phone);

  try {
    const check = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: formattedPhone,
        code: enteredOtp,
      });

    return {
      isTwilioVerify: true,
      success: check.status === 'approved',
      status: check.status,
    };
  } catch (err) {
    console.error(`[SMS Error] Twilio Verify check error: ${err.message}`);
    return { isTwilioVerify: true, success: false, error: err.message };
  }
};
