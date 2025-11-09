import Searchbar from "@/components/Searchbar"
import AnalyticsDashboard from "@/components/AnalyticsDashboard"
import Image from "next/image"
import { getAllProducts } from "@/lib/actions"
import ProductCard from "@/components/ProductCard"
import VisitorCounter from "@/components/VisitorCounter"

// Force dynamic rendering since we use cookies for user sessions
export const dynamic = 'force-dynamic'

const Home = async () => {
  const allProducts = await getAllProducts();

  // Calculate analytics stats
  const totalProducts = allProducts?.length || 0;
  const totalSavings = allProducts?.reduce((acc: number, product: any) => {
    const discount = product.originalPrice - product.currentPrice;
    return acc + discount;
  }, 0) || 0;
  const averageDiscount = allProducts?.length > 0
    ? Math.round(allProducts.reduce((acc: number, product: any) => {
        const discount = ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100;
        return acc + discount;
      }, 0) / allProducts.length)
    : 15; // Default value for demo

  // Platform statistics
  const platformStats = allProducts?.reduce((acc: any, product: any) => {
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
      <VisitorCounter />
      <section className="px-6 md:px-20 py-24 dark:bg-gray-900 transition-colors duration-300">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text dark:text-gray-300">
              Smart Shopping Starts Here:
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={16}
                height={16}
                className="dark:invert"
              />
            </p>

            <h1 className="head-text dark:text-white">
              Unleash the Power of
              <span className="text-primary"> TrueWorth</span>
            </h1>

            <p className="mt-6 text-lg font-bold text-gray-800 dark:text-gray-200">
              Track prices across Amazon, Flipkart, Snapdeal & Myntra. Search by name or paste any product link!
            </p>

            <div className="mt-6 p-6 bg-yellow-100 dark:bg-yellow-900 border-4 border-black dark:border-yellow-600 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(234,179,8,0.5)]">
              <p className="text-lg font-black text-black dark:text-yellow-100 mb-3">🎯 SUPPORTED PLATFORMS:</p>
              <ul className="text-base font-bold text-gray-800 dark:text-gray-200 space-y-2">
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

          {/* Hero Image - Comic style with dark mode */}
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-gradient-to-br from-purple-100 to-yellow-100 dark:from-purple-900 dark:to-yellow-900 border-4 border-black dark:border-purple-500 p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(168,85,247,0.5)] max-w-md transition-all duration-300">
              <div className="text-center space-y-6">
                <div className="text-8xl animate-bounce">🛒</div>
                <h3 className="text-3xl font-black dark:text-white" style={{ textShadow: '3px 3px 0px #FFD700' }}>
                  SMART PRICE TRACKING!
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-green-500 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(34,197,94,0.5)] transition-all duration-300 hover:scale-105">
                    <p className="font-black text-2xl text-green-600 dark:text-green-400">20+ Products</p>
                    <p className="font-bold text-sm dark:text-gray-300">Per Search</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-blue-500 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-105">
                    <p className="font-black text-2xl text-blue-600 dark:text-blue-400">4 Platforms</p>
                    <p className="font-bold text-sm dark:text-gray-300">Simultaneously</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-purple-500 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-105">
                    <p className="font-black text-2xl text-purple-600 dark:text-purple-400">24/7</p>
                    <p className="font-bold text-sm dark:text-gray-300">Price Monitoring</p>
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

      <section className="trending-section dark:bg-gray-900 transition-colors duration-300">
        <div className="bg-yellow-100 dark:bg-yellow-900 border-4 border-black dark:border-yellow-600 p-6 mb-8 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(234,179,8,0.5)]">
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-black dark:bg-yellow-600"></div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-black dark:bg-yellow-600"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-black dark:bg-yellow-600"></div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-black dark:bg-yellow-600"></div>

          <h2 className="text-4xl font-black text-black dark:text-yellow-100 mb-2" style={{ textShadow: '3px 3px 0px #FFD700' }}>
            📜 YOUR SEARCH HISTORY
          </h2>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-200">Products you searched & tracked!</p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts && allProducts.length > 0 ? (
            allProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="w-full bg-cyan-100 dark:bg-cyan-900 border-4 border-black dark:border-cyan-600 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(34,211,238,0.5)]">
              <div className="flex items-center gap-4">
                <span className="text-6xl">🔍</span>
                <div>
                  <h3 className="text-2xl font-black text-black dark:text-cyan-100 mb-2">NO HISTORY YET!</h3>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
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