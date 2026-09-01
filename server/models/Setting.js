import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'store_config',
    },
    storeName: {
      type: String,
      default: "The Dog's Garage",
    },
    tagline: {
      type: String,
      default: 'Your Trusted Companion Haven & Accessories Store',
    },
    contactEmail: {
      type: String,
      default: 'thedogsgarage@gmail.com',
    },
    contactPhone: {
      type: String,
      default: '+91 62643 69991',
    },
    whatsappNumber: {
      type: String,
      default: '+91 62643 69991',
    },
    instagramUrl: {
      type: String,
      default: 'https://www.instagram.com/the_dogsgarage/',
    },
    address: {
      type: String,
      default: '100 Feet Road, Indiranagar, Bangalore, Karnataka - 560038',
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 999,
    },
    standardDeliveryFee: {
      type: Number,
      default: 99,
    },
    upiId: {
      type: String,
      default: 'thedogsgarage@okhdfcbank',
    },
    enableCOD: {
      type: Boolean,
      default: true,
    },
    enableUPI: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Setting = mongoose.model('Setting', settingSchema);
