# 🚀 INSUREINFO - NEXT STEPS ROADMAP

**Current Status:** ✅ Multi-platform price tracking (Amazon + Snapdeal working!)
**Created:** November 9, 2025
**Author:** Amrit

---

## 📊 PHASE 1: PRICE HISTORY GRAPH (PRIORITY 1)

### Goal
Add interactive price history charts showing how product prices changed over time.

### Tasks
1. **Install Recharts**
   ```bash
   npm install recharts
   ```

2. **Create PriceChart Component**
   - File: `components/PriceChart.tsx`
   - Display line graph of price over time
   - Show lowest/highest/average prices with markers
   - Color-coded: Green = lowest, Red = highest
   - Comic book style with thick borders

3. **Add Data Processing**
   - File: `lib/utils.ts`
   - Function: `processPriceHistory(priceHistory)`
   - Format dates for X-axis
   - Calculate price volatility score

4. **Update Product Detail Page**
   - File: `app/products/[id]/page.tsx`
   - Add PriceChart component above description
   - Show "Price Volatility Score" badge
   - Time filters: 7 days, 30 days, 90 days, All

5. **Add Comic Styling**
   - Border: 4px black
   - Shadow: [8px_8px_0px_0px_rgba(0,0,0,1)]
   - Title: "📊 PRICE HISTORY TRACKER"
   - Legend with bold fonts

### Example Component Structure
```tsx
<PriceChart
  priceHistory={product.priceHistory}
  currency={product.currency}
  title={product.title}
/>
```

**Estimated Time:** 2-3 hours

---

## 🔔 PHASE 2: REAL-TIME PRICE DROP ALERTS (PRIORITY 2)

### Goal
Instant browser notifications when prices drop (no page refresh needed).

### Tasks
1. **Install Socket.io**
   ```bash
   npm install socket.io socket.io-client
   ```

2. **Create Custom Server**
   - File: `server.js`
   - Initialize Socket.io with Next.js
   - Handle client connections
   - Emit price drop events

3. **Update Cron Job**
   - File: `app/api/cron/route.ts`
   - When price drops, emit socket event:
     ```ts
     io.emit('price-drop', {
       productId,
       oldPrice,
       newPrice,
       title,
       image
     })
     ```

4. **Create Socket Hook**
   - File: `hooks/useSocket.ts`
   - Connect to socket on mount
   - Listen for price-drop events
   - Store in state

5. **Add Toast Notifications**
   ```bash
   npm install react-hot-toast
   ```
   - Show toast with product image
   - "💰 Price Drop! {title} - ₹{newPrice} (was ₹{oldPrice})"
   - Click to go to product page

6. **Update Dashboard**
   - File: `app/dashboard/page.tsx` (new)
   - Show live connected users count
   - Display recent price drops
   - "🔴 LIVE" badge when connected

### Example Usage
```tsx
const { priceDrops } = useSocket();

useEffect(() => {
  if (priceDrops.length > 0) {
    toast.success(`Price dropped on ${priceDrops[0].title}!`);
  }
}, [priceDrops]);
```

**Estimated Time:** 4-5 hours

---

## 🔐 PHASE 3: USER AUTHENTICATION (PRIORITY 3)

### Goal
Users can create accounts, login, and manage their tracked products.

### Tasks
1. **Install NextAuth.js**
   ```bash
   npm install next-auth
   ```

2. **Setup Auth Providers**
   - File: `app/api/auth/[...nextauth]/route.ts`
   - Google OAuth
   - GitHub OAuth
   - Email/Password with credentials

3. **Update User Model**
   - File: `lib/models/user.model.ts` (new)
   ```ts
   {
     email: String,
     name: String,
     image: String,
     trackedProducts: [ObjectId],
     preferences: {
       emailAlerts: Boolean,
       dropThreshold: Number,
       currency: String
     },
     createdAt: Date
   }
   ```

4. **Protect Routes**
   - Add middleware: `middleware.ts`
   - Protect `/dashboard`, `/products/[id]` for tracking
   - Redirect to login if not authenticated

5. **Create My Dashboard Page**
   - File: `app/dashboard/page.tsx`
   - Show user's tracked products
   - Settings panel:
     - Email alerts ON/OFF
     - Price drop threshold (%)
     - Preferred currency
   - Comic style with user avatar

6. **Update Product Tracking**
   - File: `lib/actions/index.ts`
   - `scrapeAndStoreProduct()` now requires userId
   - Link products to user accounts
   - Show "Tracked by X users" on product page

### Example Protected Page
```tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await getServerSession();
  if (!session) redirect('/api/auth/signin');

  return <DashboardContent user={session.user} />;
}
```

**Estimated Time:** 6-8 hours

---

## 📈 PHASE 4: ANALYTICS DASHBOARD (PRIORITY 4)

### Goal
Advanced analytics showing price trends, savings, and smart insights.

### Tasks
1. **Create Analytics Page**
   - File: `app/analytics/page.tsx`
   - Requires authentication
   - Comic book theme with data cards

2. **Build Analytics Components**

   **A. Total Savings Card**
   - Calculate money saved: `originalPrice - currentPrice`
   - Show total across all tracked products
   - Big number with green highlight

   **B. Price Volatility Score**
   - Calculate standard deviation of prices
   - Score: Low (Stable), Medium, High (Volatile)
   - Visual indicator with colors

   **C. Best Deals Section**
   - Show products with biggest % discount
   - Sort by savings amount
   - "🏆 TOP DEALS" badge

   **D. Platform Comparison**
   - Pie chart showing products by platform
   - Bar chart comparing average prices
   - "Cheapest Platform" badge

3. **Add Filtering**
   - Time range: 7, 30, 90 days, All time
   - Platform filter: Amazon, Flipkart, etc.
   - Category filter
   - Price range slider

4. **Create Charts with Recharts**
   - Line chart: Price trends over time
   - Bar chart: Savings per product
   - Pie chart: Platform distribution
   - Area chart: Total spend vs savings

5. **Smart Insights AI**
   - "Best time to buy" suggestions
   - "Price likely to drop" predictions
   - "Similar products cheaper" recommendations
   - Based on historical data patterns

### Example Analytics
```tsx
<AnalyticsDashboard>
  <SavingsCard totalSaved={5420} />
  <VolatilityScore score="Medium" products={12} />
  <BestDealsGrid deals={topDeals} />
  <PlatformComparison data={platformData} />
  <PriceTrendChart data={historicalData} />
</AnalyticsDashboard>
```

**Estimated Time:** 8-10 hours

---

## 📱 PHASE 5: WHATSAPP ALERTS (PRIORITY 5)

### Goal
Send WhatsApp messages when prices drop using Twilio.

### Tasks
1. **Setup Twilio Account**
   - Sign up: https://www.twilio.com/
   - Get WhatsApp-enabled phone number
   - Get Account SID & Auth Token

2. **Install Twilio SDK**
   ```bash
   npm install twilio
   ```

3. **Add to .env**
   ```
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   ```

4. **Create WhatsApp Service**
   - File: `lib/whatsapp/index.ts`
   - Function: `sendWhatsAppAlert(to, product, oldPrice, newPrice)`
   - Message template with emoji
   - Product link included

5. **Update User Preferences**
   - Add `whatsappNumber` to User model
   - Add `whatsappAlerts: Boolean` toggle
   - Validate phone number format

6. **Update Cron Job**
   - File: `app/api/cron/route.ts`
   - Check if user has WhatsApp enabled
   - Send both email AND WhatsApp
   - Rate limit: Max 5 messages/day per user

### Example Message
```
💰 *PRICE DROP ALERT!*

📦 *iPhone 15 Pro Max*
Was: ₹1,29,999
Now: ₹1,19,999
💰 Save: ₹10,000 (7.7%)

🛒 Buy Now: [link]

- InsureInfo
```

**Estimated Time:** 3-4 hours

---

## 🔌 PHASE 6: BROWSER EXTENSION (PRIORITY 6)

### Goal
Chrome/Firefox extension to track prices with one click while browsing.

### Tasks
1. **Create Extension Folder**
   - Directory: `browser-extension/`
   - Structure:
     ```
     /manifest.json
     /popup/
       - index.html
       - popup.js
       - styles.css
     /content/
       - content.js
     /background/
       - background.js
     /icons/
       - icon16.png
       - icon48.png
       - icon128.png
     ```

2. **Setup Manifest.json**
   ```json
   {
     "manifest_version": 3,
     "name": "InsureInfo Price Tracker",
     "version": "1.0",
     "permissions": ["activeTab", "storage"],
     "action": {
       "default_popup": "popup/index.html"
     },
     "content_scripts": [{
       "matches": ["*://*.amazon.in/*", "*://*.flipkart.com/*"],
       "js": ["content/content.js"]
     }]
   }
   ```

3. **Build Content Script**
   - Detect product page
   - Extract: title, price, image, URL
   - Show "Track with InsureInfo" button
   - Inject into page DOM

4. **Build Popup UI**
   - Comic book style
   - Show current product details
   - "TRACK PRICE" button
   - Login status
   - List of tracked products (5 recent)

5. **API Integration**
   - Call `/api/track-product` endpoint
   - Send product data from extension
   - Store auth token in extension storage
   - Show success toast

6. **Background Service**
   - Check for price updates every hour
   - Show browser notification on drop
   - Badge with number of price drops

7. **Build & Package**
   ```bash
   npm run build:extension
   ```
   - Create .zip for Chrome Web Store
   - Create .xpi for Firefox Add-ons

### Example Usage
1. User visits Amazon product page
2. Clicks extension icon
3. Popup shows product details
4. Click "TRACK THIS!" button
5. Product saved to InsureInfo account

**Estimated Time:** 10-12 hours

---

## 🤖 PHASE 7: BEST TIME TO BUY AI (BONUS)

### Goal
ML-powered predictions for optimal purchase timing.

### Tasks
1. **Collect Training Data**
   - Store 90+ days of price history
   - Track: day of week, time of year, events
   - Note: sales patterns, festival discounts

2. **Build Prediction Model**
   - Use TensorFlow.js or Python Flask API
   - Input: Historical prices, current date, category
   - Output: Probability of price drop in next X days

3. **Create Prediction Service**
   - File: `lib/ai/predict.ts`
   - Function: `predictPriceDrop(productId)`
   - Returns: {
       probability: 0.75,
       confidence: 'High',
       suggestedAction: 'Wait 7 days',
       reasoning: 'Sale coming soon'
     }

4. **Display Predictions**
   - Product page: "🤖 AI Suggestion"
   - Show probability meter (0-100%)
   - Color coded: Red (Buy now), Yellow (Wait), Green (Hold)

5. **Track Accuracy**
   - Log predictions vs actual outcomes
   - Show accuracy score on dashboard
   - Improve model over time

**Estimated Time:** 15-20 hours (Advanced)

---

## 📝 IMMEDIATE FIXES NEEDED

### 1. ✅ Product Description (DONE)
- Remove HTML junk
- Show clean structured info
- Comic style card

### 2. ⚠️ MongoDB IP Whitelist (URGENT)
- Go to: https://cloud.mongodb.com/
- Network Access → Add IP
- "Allow Access From Anywhere"
- Test connection

### 3. 🔄 Flipkart/Myntra Scrapers (OPTIONAL)
- Current status: Blocked by anti-bot
- Options:
  - Accept Amazon + Snapdeal only
  - Add Puppeteer (headless browser)
  - Use mock data for demo

---

## 🎯 RECOMMENDED ORDER

### For Teacher Demo (This Week)
1. ✅ Fix Product Description
2. ✅ Fix MongoDB connection
3. 📊 Add Price History Graph (looks impressive!)
4. 🎨 Polish comic book theme

### After Demo (Next 2 Weeks)
1. 🔔 Real-time alerts
2. 🔐 User authentication
3. 📈 Analytics dashboard

### Future Enhancements (1 Month+)
1. 📱 WhatsApp alerts
2. 🔌 Browser extension
3. 🤖 AI predictions

---

## 💻 DEVELOPMENT TIPS

1. **Always test locally first**
   ```bash
   npm run dev
   ```

2. **Use Git branches for features**
   ```bash
   git checkout -b feature/price-graph
   ```

3. **Keep comic theme consistent**
   - Border: `border-4 border-black`
   - Shadow: `shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`
   - Bold fonts everywhere

4. **Test with real products**
   - Amazon URLs work best
   - Snapdeal also reliable

5. **Monitor MongoDB performance**
   - Use indexes on frequently queried fields
   - Limit price history to 90 days max

---

## 📚 USEFUL RESOURCES

- **Recharts Docs:** https://recharts.org/
- **Socket.io Guide:** https://socket.io/docs/v4/
- **NextAuth.js:** https://next-auth.js.org/
- **Twilio WhatsApp:** https://www.twilio.com/whatsapp
- **Chrome Extension:** https://developer.chrome.com/docs/extensions/

---

## 🎉 FINAL NOTES

Your **InsureInfo** project is already impressive! 💪

Current achievements:
- ✅ Multi-platform search (Amazon + Snapdeal)
- ✅ Comic book theme (unique & bold!)
- ✅ Price tracking & email alerts
- ✅ Search history functionality
- ✅ Responsive design

The next phases will make it **production-ready** and **portfolio-worthy**! 🚀

Keep coding, bro! 🔥

---

**Created by:** Amrit
**Project:** InsureInfo Price Tracker
**Tech Stack:** Next.js 16, MongoDB, TailwindCSS, Bright Data
**Date:** November 9, 2025
