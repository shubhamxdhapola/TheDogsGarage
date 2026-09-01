import mongoose from 'mongoose';

const mediaItemSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  caption: { type: String, default: '' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  breed: {
    type: String,
    required: [true, 'Breed is required'],
    trim: true,
    index: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: [true, 'Gender is required'],
    index: true,
  },
  age: {
    type: String,
    required: [true, 'Age is required'],
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  color: {
    type: String,
    default: 'Golden',
    trim: true,
  },
  size: {
    type: String,
    enum: ['Small', 'Medium', 'Large', 'Extra Large'],
    default: 'Medium',
  },
  weight: {
    type: String,
    default: '8kg',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  location: {
    type: String,
    default: 'Bangalore, Karnataka',
  },
  vaccinationStatus: {
    type: String,
    default: 'Up to date',
  },
  vaccinationRecords: [{
    vaccineName: String,
    dateAdministered: Date,
    nextDueDate: Date,
    vetName: String,
  }],
  healthStatus: {
    type: String,
    default: 'Excellent',
  },
  kciCertified: {
    type: Boolean,
    default: true,
  },
  microchipNumber: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  images: {
    type: [mediaItemSchema],
    validate: [
      (val) => val.length <= 30,
      '{PATH} exceeds the limit of 30 photos'
    ],
    default: [],
  },
  videos: {
    type: [mediaItemSchema],
    validate: [
      (val) => val.length <= 30,
      '{PATH} exceeds the limit of 30 videos'
    ],
    default: [],
  },
  isAvailable: {
    type: Boolean,
    default: true,
    index: true,
  },
  isAdopted: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true,
  },
}, {
  timestamps: true,
});

petSchema.index({ name: 'text', breed: 'text', description: 'text' });

export const Pet = mongoose.model('Pet', petSchema);
