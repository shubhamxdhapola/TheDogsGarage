import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  house: { type: String, required: true },
  street: { type: String, required: true },
  area: { type: String },
  landmark: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  type: { type: String, enum: ['HOME', 'WORK', 'OTHER'], default: 'HOME' }
}, { _id: true, timestamps: true });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['CUSTOMER', 'ADMIN'],
    default: 'CUSTOMER',
    index: true,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  addresses: [addressSchema],
  avatar: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  // Synchronize verification flags
  if (this.isPhoneVerified) {
    this.isVerified = true;
  } else if (this.isVerified) {
    this.isPhoneVerified = true;
  }

  // Hash password if modified
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
export default User;
