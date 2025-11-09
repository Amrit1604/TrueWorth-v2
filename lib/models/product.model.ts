import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  url: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // User who tracked this product
  platform: { type: String, default: 'Amazon' }, // Amazon, Flipkart, Snapdeal, etc.
  currency: { type: String, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  priceHistory: [
    {
      price: { type: Number, required: true },
      date: { type: Date, default: Date.now }
    },
  ],
  lowestPrice: { type: Number },
  highestPrice: { type: Number },
  averagePrice: { type: Number },
  discountRate: { type: Number },
  description: { type: String },
  category: { type: String },
  reviewsCount: { type: Number },
  stars: { type: Number },
  isOutOfStock: { type: Boolean, default: false },
  users: {
    type: [{
      email: { type: String, required: true }
    }],
    default: []
  },
}, { timestamps: true });

// Compound index: same URL can exist multiple times for different users
productSchema.index({ url: 1, userId: 1 }, { unique: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;