// Script to populate price history with realistic data for the last 7 days
// Run this ONCE to add historical price data to all your products

const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://amritjoshi16947_db_user:Amrit123@cluster0.jdhkwai.mongodb.net/insureinfo?retryWrites=true&w=majority&appName=Cluster0&tls=true&tlsAllowInvalidCertificates=true';

// Product Schema
const productSchema = new mongoose.Schema({
  url: String,
  platform: String,
  title: String,
  currentPrice: Number,
  priceHistory: [{
    price: Number,
    date: Date
  }]
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function populatePriceHistory() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products`);

    if (products.length === 0) {
      console.log('❌ No products found! Track some products first.');
      process.exit(0);
    }

    for (const product of products) {
      console.log(`\n📦 Processing: ${product.title}`);
      console.log(`   Current price: ₹${product.currentPrice}`);

      // Generate 7 days of price history with realistic variations
      const newPriceHistory = [];
      const basePrice = product.currentPrice;

      // Create price points for last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        // Add realistic price variation (±2-5%)
        const variation = (Math.random() * 0.07 - 0.035); // -3.5% to +3.5%
        const price = Math.round(basePrice * (1 + variation));

        newPriceHistory.push({
          price: price,
          date: date
        });

        console.log(`   ${date.toISOString().split('T')[0]}: ₹${price}`);
      }

      // Calculate stats
      const prices = newPriceHistory.map(p => p.price);
      const lowestPrice = Math.min(...prices);
      const highestPrice = Math.max(...prices);
      const averagePrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

      // Update product
      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            priceHistory: newPriceHistory,
            lowestPrice: lowestPrice,
            highestPrice: highestPrice,
            averagePrice: averagePrice
          }
        }
      );

      console.log(`   ✅ Updated with ${newPriceHistory.length} price points`);
      console.log(`   📊 Lowest: ₹${lowestPrice}, Highest: ₹${highestPrice}, Average: ₹${averagePrice}`);
    }

    console.log('\n🎉 ALL PRODUCTS UPDATED WITH 7 DAYS OF PRICE HISTORY!');
    console.log('📈 Refresh your product pages to see real graphs!');
    
    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

populatePriceHistory();
