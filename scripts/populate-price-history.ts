// Script to populate existing products with 7 days of price history
// Run this ONCE to add sample price data spread over 7 days

import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://amritjoshi16947_db_user:Amrit123@cluster0.jdhkwai.mongodb.net/insureinfo?retryWrites=true&w=majority&appName=Cluster0&tls=true&tlsAllowInvalidCertificates=true";

const productSchema = new mongoose.Schema({
  url: String,
  platform: String,
  currency: String,
  image: String,
  title: String,
  currentPrice: Number,
  originalPrice: Number,
  priceHistory: [{
    price: Number,
    date: Date
  }],
  lowestPrice: Number,
  highestPrice: Number,
  averagePrice: Number,
  discountRate: Number,
  description: String,
  category: String,
  reviewsCount: Number,
  isOutOfStock: Boolean,
  users: Array,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function populatePriceHistory() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!');

    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products`);

    for (const product of products) {
      // Only populate if priceHistory is empty or has 1 item
      if (product.priceHistory.length <= 1) {
        console.log(`\n💰 Populating: ${product.title}`);
        
        const basePrice = product.currentPrice;
        const newPriceHistory = [];
        
        // Generate 7 days of price history with realistic variations
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          // Random price variation: ±5% of base price
          const variation = (Math.random() - 0.5) * 0.1; // -5% to +5%
          const price = Math.round(basePrice * (1 + variation));
          
          newPriceHistory.push({
            price,
            date
          });
          
          console.log(`   📅 ${date.toISOString().split('T')[0]} → ₹${price}`);
        }
        
        // Calculate stats
        const prices = newPriceHistory.map(p => p.price);
        const lowestPrice = Math.min(...prices);
        const highestPrice = Math.max(...prices);
        const averagePrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
        
        // Update product
        await Product.findByIdAndUpdate(product._id, {
          priceHistory: newPriceHistory,
          lowestPrice,
          highestPrice,
          averagePrice
        });
        
        console.log(`   ✅ Added 7 price points!`);
        console.log(`   📊 Stats: Lowest ₹${lowestPrice} | Highest ₹${highestPrice} | Avg ₹${averagePrice}`);
      } else {
        console.log(`\n⏭️  Skipping: ${product.title} (already has ${product.priceHistory.length} points)`);
      }
    }
    
    console.log('\n🎉 ALL DONE! Refresh your product pages to see real price history graphs!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

populatePriceHistory();
