require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

// Product Schema (matching the model)
const productSchema = new mongoose.Schema({
  url: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  platform: { type: String, default: 'Amazon' },
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

productSchema.index({ url: 1, userId: 1 }, { unique: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function cleanupProducts() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Count existing products
    const count = await Product.countDocuments();
    console.log(`📊 Found ${count} existing products in database`);

    if (count === 0) {
      console.log('✅ Database is already clean!');
      process.exit(0);
    }

    // Ask for confirmation
    console.log('\n⚠️  WARNING: This will DELETE ALL existing products!');
    console.log('   Users will need to re-track their products.');
    console.log('   This is necessary because the old products were shared globally.');
    console.log('\n   Press Ctrl+C to cancel or wait 5 seconds to continue...\n');

    await new Promise(resolve => setTimeout(resolve, 5000));

    // Delete all products
    console.log('🗑️  Deleting all products...');
    const result = await Product.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} products`);

    // Drop the old unique index on url field (if exists)
    try {
      await Product.collection.dropIndex('url_1');
      console.log('✅ Dropped old url index');
    } catch (error) {
      console.log('ℹ️  No old url index to drop (already removed)');
    }

    // Verify new compound index exists
    const indexes = await Product.collection.getIndexes();
    console.log('\n📑 Current indexes:', Object.keys(indexes));

    console.log('\n✅ Database cleanup completed successfully!');
    console.log('👉 Users can now track products and each will get their own copy.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    process.exit(1);
  }
}

cleanupProducts();
