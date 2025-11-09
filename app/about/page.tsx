export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-6 md:px-20 py-24 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 border-4 border-black dark:border-purple-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(168,85,247,0.5)] p-8 mb-12 text-center">
        <h1 className="text-5xl font-black text-white mb-4">
          📖 ABOUT TRUEWORTH
        </h1>
        <p className="text-xl font-bold text-white/90">
          Your Ultimate Price Tracking Companion
        </p>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-yellow-100 dark:bg-yellow-900 border-4 border-black dark:border-yellow-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(234,179,8,0.5)] p-8">
          <h2 className="text-3xl font-black text-black dark:text-yellow-100 mb-4">
            🎯 OUR MISSION
          </h2>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-200 leading-relaxed">
            TrueWorth empowers smart shoppers to make informed purchasing decisions by tracking prices across multiple e-commerce platforms in real-time. We believe everyone deserves to get the best deals without spending hours comparing prices manually.
          </p>
        </div>

        {/* Features */}
        <div className="bg-cyan-100 dark:bg-cyan-900 border-4 border-black dark:border-cyan-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(34,211,238,0.5)] p-8">
          <h2 className="text-3xl font-black text-black dark:text-cyan-100 mb-6">
            ✨ WHAT WE OFFER
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-cyan-500 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(34,211,238,0.5)]">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-xl font-black text-black dark:text-white mb-2">Multi-Platform Search</h3>
              <p className="font-bold text-gray-700 dark:text-gray-300">
                Search across Amazon, Flipkart, Snapdeal & Myntra simultaneously
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-cyan-500 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(34,211,238,0.5)]">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-black text-black dark:text-white mb-2">Price History</h3>
              <p className="font-bold text-gray-700 dark:text-gray-300">
                Track price trends with interactive charts and analytics
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-cyan-500 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(34,211,238,0.5)]">
              <div className="text-4xl mb-3">📧</div>
              <h3 className="text-xl font-black text-black dark:text-white mb-2">Email Alerts</h3>
              <p className="font-bold text-gray-700 dark:text-gray-300">
                Get notified instantly when prices drop below your threshold
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 border-4 border-black dark:border-cyan-500 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(34,211,238,0.5)]">
              <div className="text-4xl mb-3">🔐</div>
              <h3 className="text-xl font-black text-black dark:text-white mb-2">Personal Dashboard</h3>
              <p className="font-bold text-gray-700 dark:text-gray-300">
                Track your products privately with secure authentication
              </p>
            </div>
          </div>
        </div>

        {/* Technology */}
        <div className="bg-purple-100 dark:bg-purple-900 border-4 border-black dark:border-purple-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(168,85,247,0.5)] p-8">
          <h2 className="text-3xl font-black text-black dark:text-purple-100 mb-4">
            ⚡ POWERED BY
          </h2>
          <div className="flex flex-wrap gap-4">
            {['Next.js', 'TypeScript', 'MongoDB', 'TailwindCSS', 'Cheerio', 'Nodemailer'].map((tech) => (
              <span
                key={tech}
                className="bg-white dark:bg-gray-800 border-3 border-black dark:border-purple-500 px-6 py-3 font-black text-black dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(168,85,247,0.5)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-600 dark:to-blue-700 border-4 border-black dark:border-green-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(34,197,94,0.5)] p-8 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            🚀 START SAVING TODAY!
          </h2>
          <p className="text-lg font-bold text-white/90 mb-6">
            Join thousands of smart shoppers who never overpay again
          </p>
          <a
            href="/"
            className="inline-block bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] px-8 py-4 font-black text-black text-lg transition-all"
          >
            🛒 START TRACKING
          </a>
        </div>
      </div>
    </div>
  );
}
