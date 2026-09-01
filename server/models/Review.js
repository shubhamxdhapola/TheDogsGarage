import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userAvatar: {
    type: String,
    default: '',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export const Review = mongoose.model('Review', reviewSchema);
