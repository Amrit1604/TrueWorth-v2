import Searchbar from "@/components/Searchbar"
import AnalyticsDashboard from "@/components/AnalyticsDashboard"
import Image from "next/image"
import { getAllProducts } from "@/lib/actions"
import ProductCard from "@/components/ProductCard"

const Home = async () => {
  const allProducts = await getAllProducts();

  // Calculate analytics stats
  const totalProducts = allProducts?.length || 0;
  const totalSavings = allProducts?.reduce((acc, product) => {
    const discount = product.originalPrice - product.currentPrice;
    return acc + discount;
  }, 0) || 0;
  const averageDiscount = allProducts?.length > 0
    ? Math.round(allProducts.reduce((acc, product) => {
        const discount = ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100;
        return acc + discount;
      }, 0) / allProducts.length)
    : 15; // Default value for demo

  // Platform statistics
  const platformStats = allProducts?.reduce((acc: any, product) => {
    const platform = product.platform || 'Amazon';
    if (!acc[platform]) {
      acc[platform] = { platform, count: 0, totalPrice: 0 };
    }
    acc[platform].count += 1;
    acc[platform].totalPrice += product.currentPrice;
    return acc;
  }, {});

  const platformStatsArray = Object.values(platformStats || {}).map((stat: any) => ({
    platform: stat.platform,
    count: stat.count,
    avgPrice: Math.round(stat.totalPrice / stat.count)
  }));

  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              Smart Shopping Starts Here:
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={16}
                height={16}
              />
            </p>

            <h1 className="head-text">
              Unleash the Power of
              <span className="text-primary"> InsureInfo</span>
            </h1>

            <p className="mt-6 text-lg font-bold text-gray-800">
              Track prices across Amazon, Flipkart, Snapdeal & Myntra. Search by name or paste any product link!
            </p>

            <div className="mt-6 p-6 bg-yellow-100 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-lg font-black text-black mb-3">🎯 SUPPORTED PLATFORMS:</p>
              <ul className="text-base font-bold text-gray-800 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="bg-orange-500 text-white px-2 py-1 border-2 border-black text-xs font-black">AMAZON</span>
                  Paste full product URL (Best!)
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-blue-500 text-white px-2 py-1 border-2 border-black text-xs font-black">FLIPKART</span>
                  Paste product URL
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-red-500 text-white px-2 py-1 border-2 border-black text-xs font-black">SNAPDEAL</span>
                  Paste product URL
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-pink-500 text-white px-2 py-1 border-2 border-black text-xs font-black">MYNTRA</span>
                  Paste product URL
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-purple-500 text-white px-2 py-1 border-2 border-black text-xs font-black">SEARCH</span>
                  Type product name!
                </li>
              </ul>
            </div>

            <Searchbar />
          </div>

          {/* Hero Image - Replaced 3D carousel for better performance */}
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-gradient-to-br from-purple-100 to-yellow-100 border-4 border-black p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-md">
              <div className="text-center space-y-6">
                <div className="text-8xl">🛒</div>
                <h3 className="text-3xl font-black" style={{ textShadow: '3px 3px 0px #FFD700' }}>
                  SMART PRICE TRACKING!
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="font-black text-2xl text-green-600">20+ Products</p>
                    <p className="font-bold text-sm">Per Search</p>
                  </div>
                  <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="font-black text-2xl text-blue-600">4 Platforms</p>
                    <p className="font-bold text-sm">Simultaneously</p>
                  </div>
                  <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="font-black text-2xl text-purple-600">24/7</p>
                    <p className="font-bold text-sm">Price Monitoring</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Dashboard - Shows if there are tracked products */}
      {totalProducts > 0 && (
        <AnalyticsDashboard
          totalProducts={totalProducts}
          totalSavings={totalSavings}
          averageDiscount={averageDiscount}
          platformStats={platformStatsArray}
        />
      )}

      <section className="trending-section">
        <div className="bg-yellow-100 border-4 border-black p-6 mb-8 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-black"></div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-black"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-black"></div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-black"></div>

          <h2 className="text-4xl font-black text-black mb-2" style={{ textShadow: '3px 3px 0px #FFD700' }}>
            📜 YOUR SEARCH HISTORY
          </h2>
          <p className="text-lg font-bold text-gray-800">Products you searched & tracked!</p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts && allProducts.length > 0 ? (
            allProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="w-full bg-cyan-100 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-4">
                <span className="text-6xl">🔍</span>
                <div>
                  <h3 className="text-2xl font-black text-black mb-2">NO HISTORY YET!</h3>
                  <p className="text-lg font-bold text-gray-800">
                    Start searching for products above! Once you track them, they'll appear here. 🎯
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Home