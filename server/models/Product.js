import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative'],
  },
  discount: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    required: [true, 'Stock count is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 24,
  },
  images: [{
    type: String,
    required: true,
  }],
  features: [{
    type: String,
  }],
  ingredients: [{
    type: String,
  }],
  benefits: [{
    type: String,
  }],
  usage: {
    type: String,
    default: '',
  },
  packageSize: {
    type: String,
    default: '1 unit',
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
}, {
  timestamps: true,
});

productSchema.index({ name: 'text', description: 'text', category: 'text' });

export const Product = mongoose.model('Product', productSchema);
