import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index auto-deletes expired records
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.methods.compareOtp = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.otpHash);
};

// Check if model is already registered to avoid overwrite errors during reload
export const Otp = mongoose.models.Otp || mongoose.model('Otp', otpSchema);

