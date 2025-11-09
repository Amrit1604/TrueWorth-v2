# 🎨 ICONS & IMAGES USAGE GUIDE

## ✅ **NOW USING THESE ICONS:**

### **LoginRequiredModal.tsx**
- ✅ `red-heart.svg` - Pulse animation in header
- ✅ `arrow-left.svg` - "Not so fast, buddy!" arrow
- ✅ `price-tag.svg` - Login warning title
- ✅ `chart.svg` - "Why Login?" section header + list item
- ✅ `mail.svg` - Email alerts benefit
- ✅ `lock.svg` - Privacy benefit
- ✅ `arrow-up.svg` - Access from any device benefit
- ✅ `user.svg` - Login button icon
- ✅ `x-close.svg` - Later button icon
- ✅ `search.svg` - Footer hint icon

### **Navbar.tsx**
- ✅ `square.svg` - About link icon
- ✅ `mail.svg` - Contact link icon
- ✅ `user.svg` - User menu button & dropdown
- ✅ `chevron-down.svg` - Dropdown arrow (rotates 180° when open)
- ✅ `mail.svg` - Email display in user menu
- ✅ `x-close.svg` - Logout button icon

---

## 📦 **AVAILABLE ICONS (NOT YET USED):**

### **Could Be Used:**
- `arrow-down.svg` - Could use for "scroll down" hints
- `arrow-right.svg` - Could use for "next" buttons or links
- `bag.svg` - **PERFECT for "Track Product" buttons!**
- `black-heart.svg` - Could use for "favorite" feature
- `bookmark.svg` - **GREAT for "saved items" page!**
- `comment.svg` - Could use for feedback section
- `frame.svg` - Could use for featured products
- `hand-drawn-arrow.svg` - Could use for tutorials/guides
- `star.svg` - **PERFECT for ratings display!**
- `share.svg` - Could use for "share deal" feature

### **Already Using Elsewhere:**
- `logo.svg` - Navbar logo
- `check.svg` - Success states

---

## 🖼️ **AVAILABLE IMAGES:**

### **Hero Images (5 SVGs)**
- `hero-1.svg` to `hero-5.svg`
- **SUGGESTION:** Use in Hero Carousel component
- Could also use on About page for visual sections

### **Other Images:**
- `logo.png` - ✅ Already used in Navbar
- `details.svg` - Could use for "product details" sections
- `trending.svg` - **GREAT for "Trending Products" section!**

---

## 💡 **QUICK WINS - IMPLEMENT THESE:**

### **1. Track Product Button Enhancement**
```tsx
// In SearchResults.tsx, replace track button:
<button className="...">
  <Image src="/assets/icons/bag.svg" alt="track" width={20} height={20} />
  Track Price
</button>
```

### **2. Star Ratings Display**
```tsx
// When showing product ratings:
{product.rating && (
  <div className="flex items-center gap-1">
    <Image src="/assets/icons/star.svg" alt="rating" width={16} height={16} />
    <span>{product.rating}</span>
  </div>
)}
```

### **3. Hero Carousel Images**
```tsx
// Use hero-1.svg through hero-5.svg in HeroCarousel
// They're designed for the homepage hero section
```

### **4. Trending Products Section**
```tsx
// Create a "Trending Now" section using trending.svg
<div className="...">
  <Image src="/assets/images/trending.svg" alt="trending" width={40} height={40} />
  <h2>Trending Products</h2>
</div>
```

---

## ⚠️ **IMPORTANT NOTES:**

1. **All icons are SVG** - Perfect for dark mode (use `dark:invert` class)
2. **Consistent sizing** - Use 16-20px for inline icons, 24-32px for section headers
3. **Always add alt text** - For accessibility
4. **Use `className="dark:invert"` for dark mode** - Makes icons visible on dark backgrounds

---

## 🚀 **WANT ME TO IMPLEMENT THESE NOW?**

I can add:
1. 🛍️ Bag icon to all "Track Product" buttons
2. ⭐ Star icon for product ratings display
3. 🔖 Bookmark icon for "Saved Items" page
4. 📈 Trending icon for popular products section
5. 🖼️ Hero images in carousel

Just say which ones you want! 🎨
