import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  icon: {
    type: String,
    default: 'ShoppingBag',
  },
  image: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  displayOrder: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

export const Category = mongoose.model('Category', categorySchema);
